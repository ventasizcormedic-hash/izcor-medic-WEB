import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProductTraceabilityProps {
  product?: any;
}

export function ProductTraceability({ product }: ProductTraceabilityProps) {
  if (!product) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs mb-8">
      <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-emerald-600" /> Trazabilidad e Identificación Institucional
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block font-semibold mb-1">ID Único de Registro</span>
          <span className="font-mono font-bold text-slate-800 text-sm">IZCOR-CAT-{product.id}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block font-semibold mb-1">Estado de Homologación</span>
          <span className="font-bold text-emerald-700 flex items-center gap-1 text-sm">
            <CheckCircle2 className="w-4 h-4" /> {product.verificationStatus || 'Ficha Verificada'}
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block font-semibold mb-1">Actualización de Catálogo</span>
          <span className="font-semibold text-slate-700 text-sm">Catálogo Oficial 2026</span>
        </div>
      </div>
    </div>
  );
}
