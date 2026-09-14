import React from 'react';
import { ShoppingBag, X, ArrowRight } from 'lucide-react';
import { useQuote } from '../../context/QuoteContext';
import { Link } from 'react-router-dom';

interface MiniCartTrayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MiniCartTray({ isOpen, onClose }: MiniCartTrayProps) {
  const { items, removeItem, itemCount } = useQuote();
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-brand-cyan" /> Bandeja de Cotización ({itemCount})
        </span>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
        {items.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">Tu bandeja de cotización está vacía</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-xl">
              <span className="text-xs font-medium text-slate-800 truncate">{item.name}</span>
              <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
      <Link
        to="/cotizar"
        onClick={onClose}
        className="w-full bg-brand-cyan hover:bg-[#0284C7] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
      >
        <span>Ver Solicitud Completa</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
