import { GoogleGenAI, Chat, LiveServerMessage, Modality, type Blob as GenAIBlob } from "@google/genai";
import { AI_SYSTEM_INSTRUCTION } from '../constants';
import { Sponsor } from '../types';

let chatSession: Chat | null = null;

const getApiKey = (): string => {
  const key = import.meta.env.VITE_API_KEY;
  if (!key) {
    console.error("VITE_API_KEY is not set. Add it to .env.local or Vercel Environment Variables.");
    throw new Error("Missing API Key");
  }
  return key;
};

export const getChatSession = async (activeSponsors?: Sponsor[]): Promise<Chat> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  let systemInstruction = AI_SYSTEM_INSTRUCTION;
  if (activeSponsors && activeSponsors.length > 0) {
    const commercialContext = activeSponsors.map(s =>
      `When discussing ${s.category}, casually mention our partner ${s.partner} (Frequency target: ${s.frequency}%).`
    ).join("\n");
    systemInstruction += `\n\n***COMMERCIAL GUIDANCE:***\n${commercialContext}`;
  }

  const model = "gemini-2.5-flash";
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    },
  });
  chatSession = chat;
  return chat;
};

export const sendMessageToGemini = async (message: string, activeSponsors: Sponsor[] = []): Promise<string> => {
  try {
    const session = await getChatSession(activeSponsors);
    const result = await session.sendMessage({ message });
    return result.text || "I'm checking the currents... please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost. Please check your internet connection or API key configuration.";
  }
};

export interface LiveSessionCallbacks {
  onOpen: () => void;
  onAudioData: (base64Audio: string) => void;
  onClose: () => void;
  onError: (error: any) => void;
}

export const connectLiveSession = async (callbacks: LiveSessionCallbacks) => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const inputAudioContext = new AudioContextClass({ sampleRate: 16000 });
  if (inputAudioContext.state === 'suspended') await inputAudioContext.resume();

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, sampleRate: 16000 }
  });

  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: {
      onopen: () => {
        callbacks.onOpen();
        const source = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
        scriptProcessor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmBlob = createBlob(inputData);
          sessionPromise.then((session) => session.sendRealtimeInput({ media: pcmBlob }));
        };
        source.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);
      },
      onmessage: async (msg: LiveServerMessage) => {
        const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (audio) callbacks.onAudioData(audio);
      },
      onclose: () => callbacks.onClose(),
      onerror: (e) => callbacks.onError(e),
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
      systemInstruction: AI_SYSTEM_INSTRUCTION,
    },
  });

  return {
    disconnect: async () => {
      const session = await sessionPromise;
      session.close();
      stream.getTracks().forEach(t => t.stop());
      inputAudioContext.close();
    }
  };
};

function createBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    const s = Math.max(-1, Math.min(1, data[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return { data: btoa(binary), mimeType: 'audio/pcm;rate=16000' };
}

export const decodeAudioData = async (base64: string, ctx: AudioContext): Promise<AudioBuffer> => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  const int16 = new Int16Array(bytes.buffer);
  const buffer = ctx.createBuffer(1, int16.length, 24000);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < int16.length; i++) channel[i] = int16[i] / 32768.0;
  return buffer;
};
