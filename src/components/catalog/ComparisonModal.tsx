import React from 'react';
import { X, Scale } from 'lucide-react';
import { ComparisonProduct } from './types';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ComparisonProduct[];
  onRemoveProduct?: (id: number) => void;
  onClearAll?: () => void;
}

export function ComparisonModal({ isOpen, onClose, products }: ComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 z-10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" /> Comparativa de Equipos Médicos
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col">
              <h4 className="font-bold text-slate-900 text-sm mb-2">{p.name}</h4>
              <span className="text-xs font-bold text-indigo-600 mb-4">{p.brandName || 'General'}</span>
              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-4 mt-auto">
                <div><strong>Modelo:</strong> {p.model || 'N/A'}</div>
                <div><strong>REF:</strong> {p.catalogNumber || 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
