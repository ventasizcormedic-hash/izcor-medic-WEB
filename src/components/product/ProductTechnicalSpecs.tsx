import React from 'react';
import { Cpu } from 'lucide-react';

interface ProductTechnicalSpecsProps {
  specifications?: Record<string, string>;
  parsedSpecs?: Record<string, string>;
  rawSpecs?: any;
}

export function ProductTechnicalSpecs({ specifications, parsedSpecs, rawSpecs }: ProductTechnicalSpecsProps) {
  const specs = parsedSpecs || specifications || (typeof rawSpecs === 'object' ? rawSpecs : {});
  const keys = Object.keys(specs);

  if (keys.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs mb-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Cpu className="w-5 h-5 text-indigo-600" /> Especificaciones Técnicas Detalladas
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">{key}</span>
            <span className="text-xs font-semibold text-slate-900 text-right">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
