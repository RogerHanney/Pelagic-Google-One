import { FAQItem, PackagePrice, ScubaPrice, CoursePrice, Sponsor, LogEntry } from './types';

// --- MASTER KNOWLEDGE BASE: PELAGIC DIVERS FUVAHMULAH (2025 EDITION) ---
export const AI_SYSTEM_INSTRUCTION = `
***META-INSTRUCTION:***
You are the **Senior Instructor** at Pelagic Divers Fuvahmulah.
**TONE:** "Island Cool" but strictly professional. Expert, friendly, concise.
**RULES:**
1. **LINKS:** ALWAYS provide these links when discussing topics:
   - Packages: https://www.pelagicdiversfuvahmulah.com/packages/
   - Courses: https://www.pelagicdiversfuvahmulah.com/fuvahmulah-dive-courses/
2. **SSI ONLY:** We are an **SSI Center**. NEVER mention PADI.
3. **FLIGHTS:** Domestic flights (Malé-Fuvahmulah) are **INCLUDED** and **BOOKED BY US**.
4. **IMAGES:** Only use the underwater images provided in the background.

**CORE DATA:**
* **Location:** Fuvahmulah (Gnaviyani Atoll). UNESCO Biosphere.
* **Contact:** info@pelagicdiversfuvahmulah.com | +960 790-0966
* **Sharks:** Tiger Sharks (Year-round, 100% sightings), Threshers (Deep), Hammerheads (Oct-Apr), Whale Sharks (Jan-May).
* **Seasons:** High Visibility (Jan-Apr), Rough/Monsoon (Jun-Aug).
* **Safety:** 100% Safety Record. Strict protocols. No touching. Dark gear only.
* **Logistics:** 25kg luggage allowance. 30-day tourist visa. No alcohol allowed on island.
`;

// --- ASSETS ---
export const BRAND_LOGO = "/assets/PDF-White-Logo-e1658545421397-2.png";

export const BACKGROUND_IMAGES = [
  { url: "/assets/pelagic_1.jpg", alt: "Tiger Shark" },
  { url: "/assets/pelagic_2.jpg", alt: "Manta Ray" },
  { url: "/assets/pelagic_3.jpg", alt: "Deep Blue" },
  { url: "/assets/pelagic_4.jpg", alt: "Diver" },
  { url: "/assets/pelagic_5.jpg", alt: "Island" },
  { url: "/assets/pelagic_6.jpg", alt: "Reef" },
  { url: "/assets/pelagic_7.jpg", alt: "Ocean" }
];

// --- LOCALIZATION ---
export const GREETINGS = [
  { text: "Welcome", lang: "English", chat: "**Welcome!** 🦈\n\nI'm your Pelagic Divers specialist. Ask me about **Tiger Sharks**, **Manta Season**, or our **All-Inclusive Packages**! 🤙" },
  { text: "އައްސަލާމް ޢަލައިކުމް", lang: "Dhivehi", chat: "**އައްސަލާމް ޢަލައިކުމް!** 🦈\n\nމަރުޙަބާ! އަޅުގަނޑަކީ ޕެލަޖިކް ޑައިވާސްގެ ސްޕެޝަލިސްޓެއް." },
  { text: "Bienvenue", lang: "French", chat: "**Bienvenue!** 🦈\n\nJe suis votre spécialiste Pelagic Divers. Interrogez-moi sur nos rencontres avec les **requins tigres**." },
  { text: "你好", lang: "Mandarin", chat: "**你好!** 🦈\n\n我是您的 Pelagic Divers 专家。请询问关于我们的**虎鲨潜水**。" },
  { text: "こんにちは", lang: "Japanese", chat: "**こんにちは!** 🦈\n\nペラジックダイバーズのスペシャリストです。**イタチザメ**との遭遇についてお問い合わせください。" },
  { text: "Привет", lang: "Russian", chat: "**Привет!** 🦈\n\nЯ ваш специалист Pelagic Divers. Спросите меня о наших встречах с **тигровыми акулами**." },
  { text: "Hola", lang: "Spanish", chat: "**¡Hola!** 🦈\n\nSoy su especialista en Pelagic Divers. Pregúnteme sobre nuestros encuentros con **tiburones tigre**." },
  { text: "Γεια σας", lang: "Greek", chat: "**Γεια σας!** 🦈\n\nΕίμαι ο ειδικός σας στην Pelagic Divers. Ρωτήστε με για τις καταδύσεις μας." },
  { text: "สวัสดี", lang: "Thai", chat: "**สวัสดีครับ/ค่ะ!** 🦈\n\nฉันคือผู้เชี่ยวชาญจาก Pelagic Divers สอบถามเกี่ยวกับ**ฉลามเสือ**ได้เลย" },
  { text: "안녕하세요", lang: "Korean", chat: "**안녕하세요!** 🦈\n\n저는 Pelagic Divers 전문가입니다. **타이거 상어** 다이빙에 대해 물어보세요." },
  { text: "السلام عليكم", lang: "Arabic", chat: "**السلام عليكم!** 🦈\n\nأنا أخصائي Pelagic Divers. اسألني عن أسماك **القرش النمر**." }
];

// --- PRICING ---
export const FREEDIVING_PRICES: PackagePrice[] = [
  { nights: 3, sessions: 4, basic: 935, deluxe: 1085, premier: 1485 },
  { nights: 4, sessions: 5, basic: 1230, deluxe: 1380, premier: 1780 },
  { nights: 5, sessions: 6, basic: 1520, deluxe: 1670, premier: 2070 },
];

export const SCUBA_PRICES: ScubaPrice[] = [
  { nights: 3, basic: 1100, deluxe: 1250, premium: 0 },
  { nights: 4, basic: 1445, deluxe: 1595, premium: 0 },
  { nights: 5, basic: 1785, deluxe: 1935, premium: 0 },
  { nights: 6, basic: 2100, deluxe: 2250, premium: 0 },
  { nights: 7, basic: 2320, deluxe: 2470, premium: 4500 },
  { nights: 9, basic: 2970, deluxe: 3120, premium: 0 },
];

export const COURSES: CoursePrice[] = [
  { name: "Discover Scuba Diver (1st session)", price: 120 },
  { name: "Discover Scuba Diver (Subsequent)", price: 80 },
  { name: "Scuba Diver Upgrade", price: 255, details: "Upgrade to 18m" },
  { name: "Open Water", price: 610 },
  { name: "Advanced Open Water", price: 405 },
  { name: "Tiger Shark Safety Diver", price: 270, details: "Booked with dive package" },
  { name: "Tiger Shark Safety Diver", price: 370, details: "Booked WITHOUT package" },
  { name: "Emergency First Responder", price: 120 },
  { name: "Rescue Diver", price: 645 },
  { name: "Scuba Refresher", price: 120, details: "1 boat dive, skills & theory" }
];

export const FAQS: FAQItem[] = [
  { category: "Travel", question: "Do I need to book my own domestic flights?", answer: "No. Domestic flights (Malé ↔ Fuvahmulah) are included in all our packages and booked by us." },
  { category: "Travel", question: "Do I need a PCR test?", answer: "No. Just the IMUGA Traveler Declaration 96 hours prior." },
  { category: "Diving", question: "Is Tiger Shark diving safe?", answer: "Yes. 100% safety record. Strict protocols. Expert guides." },
  { category: "Diving", question: "What if I don't see a Tiger Shark?", answer: "Highly unlikely. We have a 100% sighting record year-round." },
  { category: "Diving", question: "Certification needed?", answer: "Advanced Open Water recommended. We can teach you here." },
  { category: "Diving", question: "One-day freediving?", answer: "Yes, ad-hoc sessions available based on boat schedule." },
  { category: "General", question: "Solo traveler surcharge?", answer: "Yes, approx $20/night single supplement." },
  { category: "General", question: "Payment methods?", answer: "USD, Visa, Mastercard. Local shops take MVR." },
  { category: "General", question: "Dietary requirements?", answer: "Yes. All food is Halal. Veg/Special diets available on request." },
  { category: "Culture", question: "Alcohol?", answer: "Strictly prohibited on the island." }
];

// --- ANALYTICS MOCK DB ---
export const DEFAULT_SPONSORS: Sponsor[] = [
  { id: 1, category: "Cameras", partner: "GoPro", frequency: 45, startDate: "2025-02-01", endDate: "2025-02-28" },
  { id: 2, category: "Dining", partner: "Bennys", frequency: 60, startDate: "2025-02-14", endDate: "2025-02-28" },
];

export const ANALYTICS_DB: LogEntry[] = [
  { id: "L-250220-01", date: "2025-02-20", time: "14:30", user: "Guest (US)", topic: "Best camera?", tags: ["cat:Cameras", "brand:GoPro"], sentiment: "Positive" },
  { id: "L-250219-01", date: "2025-02-19", time: "09:00", user: "Guest (FR)", topic: "Sunscreen?", tags: ["cat:Sunscreen", "brand:SunBum"], sentiment: "Positive" },
  { id: "L-250115-01", date: "2025-01-15", time: "11:00", user: "Guest (UK)", topic: "Jan Visibility", tags: ["cat:Diving"], sentiment: "Positive" },
  { id: "L-250305-01", date: "2025-03-05", time: "09:00", user: "Guest (FR)", topic: "Manta sightings", tags: ["cat:Mantas"], sentiment: "Positive" },
];