import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, ArrowRight } from 'lucide-react';

export function ConsultingSection() {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden my-16">
      <div className="relative z-10 max-w-3xl">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-500/30">
          <ShieldCheck className="w-3.5 h-3.5" /> Asesoría Hospitalaria Especializada
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 tracking-tight">
          ¿Requiere equipamiento biomédico homologado para licitaciones o proyectos clínicos?
        </h3>
        <p className="text-slate-300 mb-8 text-base sm:text-lg">
          Nuestro equipo de ingeniería clínica y comercio exterior asiste directamente en especificaciones técnicas, expedientes DIGEMID y homologación OSCE.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/contacto"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-4 rounded-xl font-extrabold transition-all shadow-lg flex items-center gap-2"
          >
            <PhoneCall className="w-5 h-5" />
            Solicitar Asesoría Técnica
          </Link>
          <Link
            to="/cotizar"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-4 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            <span>Ver Bandeja de Cotización</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
