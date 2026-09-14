import React from 'react';
import { Layers, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductVariantsAndModelsProps {
  currentModel?: string;
  currentName?: string;
  siblingModels?: any[];
  brandName?: string;
}

export function ProductVariantsAndModels({
  currentModel,
  siblingModels = [],
  brandName,
}: ProductVariantsAndModelsProps) {
  if (!siblingModels || siblingModels.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs mb-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-indigo-600" /> Modelos de la Línea {brandName ? `(${brandName})` : ''}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {siblingModels.map((item, idx) => {
          const isCurrent = item.model === currentModel || item.slug === currentModel;
          return (
            <Link
              key={idx}
              to={`/producto/${item.slug || item.id}`}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                isCurrent
                  ? 'bg-indigo-50/70 border-indigo-300 text-indigo-900 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div>
                <span className="text-xs text-slate-400 block uppercase font-mono">Modelo</span>
                <span className="text-sm">{item.model || item.name}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
