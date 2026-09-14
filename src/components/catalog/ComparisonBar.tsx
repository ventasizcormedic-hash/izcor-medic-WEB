import React from 'react';
import { Scale, X } from 'lucide-react';
import { ComparisonProduct } from './types';

interface ComparisonBarProps {
  products: ComparisonProduct[];
  onRemove?: (id: number) => void;
  onRemoveProduct?: (id: number) => void;
  onClear?: () => void;
  onClearAll?: () => void;
  onCompare?: () => void;
  onOpenModal?: () => void;
}

export function ComparisonBar({ products, onRemove, onRemoveProduct, onClear, onClearAll, onCompare, onOpenModal }: ComparisonBarProps) {
  if (products.length === 0) return null;
  const handleRemove = onRemove || onRemoveProduct || (() => {});
  const handleClear = onClear || onClearAll || (() => {});
  const handleAction = onCompare || onOpenModal || (() => {});

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400">
            <Scale className="w-4 h-4" /> Comparación ({products.length}/4)
          </span>
          <div className="flex items-center gap-2">
            {products.map(p => (
              <div key={p.id} className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
                <span className="truncate max-w-[120px] font-medium">{p.name}</span>
                <button onClick={() => handleRemove(p.id)} className="text-slate-400 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={handleClear} className="text-xs text-slate-400 hover:text-white font-medium">
            Limpiar
          </button>
          <button
            onClick={handleAction}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md"
          >
            Comparar Equipos
          </button>
        </div>
      </div>
    </div>
  );
}
