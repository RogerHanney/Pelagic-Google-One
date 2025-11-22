import React from 'react';
import { FAQS } from '../constants';

export const FAQ: React.FC = () => {
  return (
    <div className="p-4 md:p-8 space-y-4">
      {FAQS.map((faq, index) => (
        <div key={index} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-start gap-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ocean-900 bg-ocean-300 px-2 py-1 rounded mt-1">
              {faq.category}
            </span>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-1">{faq.question}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};