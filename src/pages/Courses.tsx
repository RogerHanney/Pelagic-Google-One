import React from 'react';
import { COURSES } from '../constants';
import { ExternalLink } from 'lucide-react';

export const Courses: React.FC = () => {
  return (
    <div className="p-4 md:p-8 text-slate-200">
      <div className="flex justify-end mb-4">
        <a 
          href="https://www.pelagicdiversfuvahmulah.com/fuvahmulah-dive-courses/" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-bold text-ocean-300 hover:text-white transition-colors border border-ocean-300/30 hover:bg-ocean-500/10 px-4 py-2 rounded-lg"
        >
          View Full Course Details Online <ExternalLink size={14} />
        </a>
      </div>

      <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-black/20">
            <tr>
              <th className="p-4 text-slate-400 font-medium text-sm uppercase tracking-wider">Course Name</th>
              <th className="p-4 text-slate-400 font-medium text-sm uppercase tracking-wider text-right">Price (USD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {COURSES.map((course, index) => (
              <tr key={index} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <span className="block text-white font-medium">{course.name}</span>
                  {course.details && <span className="text-xs text-ocean-300 mt-1 block">{course.details}</span>}
                </td>
                <td className="p-4 text-right">
                  <span className="text-white font-mono font-bold">${course.price}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-slate-500 text-xs mt-4 text-center">
        * Course materials and certification fees included.
      </p>
    </div>
  );
};