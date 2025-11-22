import React, { useState } from 'react';
import { PackageType } from '../types';
import { FREEDIVING_PRICES, SCUBA_PRICES } from '../constants';
import { Check, ExternalLink } from 'lucide-react';

export const Packages: React.FC = () => {
  const [type, setType] = useState<PackageType>(PackageType.SCUBA);
  
  const getData = () => type === PackageType.FREEDIVING ? FREEDIVING_PRICES : SCUBA_PRICES;

  const tiers = ['Basic', 'Deluxe', 'Premier'];
  if (type === PackageType.SCUBA) tiers[2] = 'Premium';

  const renderPrice = (price: any, tierKey: string) => {
     // @ts-ignore
    const val = price[tierKey.toLowerCase().replace('premier', 'premier').replace('premium', 'premium')];
    if (!val) return <span className="text-slate-500 text-sm">N/A</span>;
    return <>${val.toLocaleString()}</>;
  };

  return (
    <div className="p-4 md:p-8 text-slate-200">
      <div className="text-center mb-8">
        <p className="text-slate-400 max-w-2xl mx-auto text-sm">
          All packages include return domestic flights (MLE ↔ FVM), airport transfers, and accommodation. 
          Prices are per person in USD.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="bg-black/40 p-1 rounded-xl inline-flex border border-white/10">
          <button
            onClick={() => setType(PackageType.SCUBA)}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              type === PackageType.SCUBA 
                ? 'bg-ocean-500 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SCUBA
          </button>
          <button
            onClick={() => setType(PackageType.FREEDIVING)}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              type === PackageType.FREEDIVING 
                ? 'bg-ocean-500 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Freediving
          </button>
        </div>
        
        <a 
          href="https://www.pelagicdiversfuvahmulah.com/packages/" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-bold text-ocean-300 hover:text-white transition-colors border border-ocean-300/30 hover:bg-ocean-500/10 px-4 py-2 rounded-lg"
        >
          View Full Packages Online <ExternalLink size={14} />
        </a>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier, index) => (
          <div 
            key={tier} 
            className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${
              index === 1 
                ? 'bg-white/10 border-2 border-ocean-400' 
                : 'bg-white/5 border border-white/10'
            }`}
          >
            {index === 1 && (
              <div className="absolute top-0 inset-x-0 bg-ocean-500 text-white text-[10px] font-bold uppercase tracking-widest py-1 text-center">
                Most Popular
              </div>
            )}
            
            <div className="p-6 flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{tier}</h3>
              <p className="text-slate-400 text-xs mb-4">
                {type === PackageType.SCUBA ? (
                   tier === 'Premium' ? 'Full Board + Extras' : 'Bed & Breakfast'
                ) : 'Hotel / Guesthouse'}
              </p>

              <div className="space-y-3 mb-6">
                {getData().map((priceItem, idx) => {
                   const val = renderPrice(priceItem, tier);
                   // @ts-ignore
                   if (val?.props?.children === "N/A") return null;

                   return (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                      <span className="text-slate-300 text-xs">
                        {priceItem.nights} Nights 
                        {/* @ts-ignore */}
                        {priceItem.sessions ? ` (${priceItem.sessions} sess)` : ''}
                      </span>
                      <span className="text-white font-bold font-mono text-base">
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-ocean-400 flex-shrink-0" />
                  <span>Domestic Flights Included</span>
                </li>
                 {tier === 'Premium' && (
                   <li className="flex gap-2">
                    <Check className="w-4 h-4 text-ocean-400 flex-shrink-0" />
                    <span>Addu Day Trip Included</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};