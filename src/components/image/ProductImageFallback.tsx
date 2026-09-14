import React from 'react';
import { Activity, AlertCircle, ShieldCheck } from 'lucide-react';

export interface ProductImageFallbackProps {
  productName?: string;
  brandName?: string | null;
  model?: string | null;
  catalogNumber?: string | null;
  categoryName?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  reason?: 'missing' | 'broken' | 'unverified';
}

export const ProductImageFallback: React.FC<ProductImageFallbackProps> = ({
  productName,
  brandName,
  model,
  catalogNumber,
  categoryName,
  size = 'md',
  className = '',
  reason = 'missing',
}) => {
  const isCompact = size === 'sm';
  const isLarge = size === 'lg' || size === 'full';

  // Map category slug to AI conceptual image for fallback
  const getCategoryFallbackImage = (catName?: string | null) => {
    if (!catName) return null;
    const cat = catName.toLowerCase();
    if (cat.includes('equipo') || cat.includes('uci') || cat.includes('monitor') || cat.includes('ventilador') || cat.includes('bomba')) {
      return '/assets/ai/cat_equipos_uci.jpg';
    }
    if (cat.includes('mobiliario') || cat.includes('cama') || cat.includes('camilla') || cat.includes('quirófano')) {
      return '/assets/ai/cat_mobiliario_clinico.jpg';
    }
    if (cat.includes('diagn') || cat.includes('ecograf') || cat.includes('electro') || cat.includes('monitor')) {
      return '/assets/ai/cat_diagnostico_monitoreo.jpg';
    }
    if (cat.includes('instrumental') || cat.includes('quirurg') || cat.includes('pinza') || cat.includes('tijera')) {
      return '/assets/ai/cat_instrumental_quirurgico.jpg';
    }
    if (cat.includes('laboratorio') || cat.includes('microscopio') || cat.includes('centrif')) {
      return '/assets/ai/cat_laboratorio_diagnostico.jpg';
    }
    if (cat.includes('insumo') || cat.includes('descartable') || cat.includes('guante') || cat.includes('jeringa') || cat.includes('sonda')) {
      return '/assets/ai/cat_insumos_descartables.jpg';
    }
    return null;
  };

  const conceptualFallback = getCategoryFallbackImage(categoryName);

  if (conceptualFallback) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <img
          src={conceptualFallback}
          alt={`Visual conceptual referencial - ${categoryName}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 ease-out opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent mix-blend-multiply" />
        
        {/* IZCOR Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <svg viewBox="0 0 100 100" className={isCompact ? "w-16 h-16" : isLarge ? "w-40 h-40" : "w-24 h-24"} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 35 10 h 30 a 5 5 0 0 1 5 5 v 20 h 20 a 5 5 0 0 1 5 5 v 20 a 5 5 0 0 1 -5 5 h -20 v 20 a 5 5 0 0 1 -5 5 h -30 a 5 5 0 0 1 -5 -5 v -20 h -20 a 5 5 0 0 1 -5 -5 v -20 a 5 5 0 0 1 5 -5 h 20 v -20 a 5 5 0 0 1 5 -5 z" fill="#ffffff" />
            <path d="M 12 50 h 28 l 6 -20 l 12 40 l 6 -20 h 24" stroke="#0099b8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 pointer-events-none z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#20384D] text-white shadow-2xs font-heading">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            FICHA TÉCNICA VERIFICADA
          </span>
          <span className="truncate max-w-[130px] px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-white/95 text-slate-700 border border-slate-200/80 shadow-2xs">
            {categoryName}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Imagen no disponible para ${productName || 'el producto'}`}
      className={`relative w-full h-full bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-100 flex flex-col items-center justify-center text-center select-none border border-slate-200/80 p-4 transition-colors ${className}`}
    >
      {/* Visual Technical Icon Container */}
      <div
        className={`rounded-2xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-400 mb-2.5 ${
          isCompact ? 'w-10 h-10 mb-1' : isLarge ? 'w-20 h-20 mb-3.5' : 'w-14 h-14'
        }`}
      >
        {reason === 'broken' ? (
          <AlertCircle className={isCompact ? 'w-5 h-5 text-amber-500' : isLarge ? 'w-9 h-9 text-amber-500' : 'w-6 h-6 text-amber-500'} strokeWidth={1.5} />
        ) : (
          <Activity className={isCompact ? 'w-5 h-5 text-slate-400' : isLarge ? 'w-9 h-9 text-slate-400' : 'w-6 h-6 text-slate-400'} strokeWidth={1.5} />
        )}
      </div>

      {/* Brand & Reference Labels */}
      {brandName && (
        <span className="text-[10px] sm:text-[11px] font-bold text-brand-navy uppercase tracking-wider line-clamp-1 max-w-[90%]">
          {brandName}
        </span>
      )}

      {/* Main Status Text */}
      <span
        className={`font-semibold text-slate-600 line-clamp-1 ${
          isCompact ? 'text-[10px] mt-0.5' : isLarge ? 'text-xs sm:text-sm mt-1' : 'text-xs mt-1'
        }`}
      >
        {reason === 'broken' ? 'Enlace en mantenimiento' : 'Fotografía en homologación'}
      </span>

      {/* Medical Catalog Badge */}
      {!isCompact && (
        <div className="mt-2 flex items-center gap-1.5 flex-wrap justify-center">
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 shadow-2xs">
            Imagen no disponible
          </span>
          {model && (
            <span className="text-[10px] font-mono text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
              Ref: {model}
            </span>
          )}
        </div>
      )}

      {/* Institutional Guarantee Note for Large Stage */}
      {isLarge && (
        <p className="text-[11px] text-slate-400 mt-2 max-w-xs leading-relaxed hidden sm:block">
          Consulte la ficha técnica o contacte a soporte técnico biomédico para solicitar el plano o fotografía de referencia oficial.
        </p>
      )}
    </div>
  );
};
