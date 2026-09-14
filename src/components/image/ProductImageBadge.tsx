import React from 'react';

interface ProductImageBadgeProps {
  isIllustrative?: boolean;
  isVerified?: boolean;
  currentIndex?: number;
  totalImages?: number;
  position?: string;
}

export const ProductImageBadge: React.FC<ProductImageBadgeProps> = ({
  isIllustrative,
  isVerified,
  currentIndex = 0,
  totalImages = 0,
}) => {
  return (
    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 items-start">
      {isVerified ? (
        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md shadow-2xs">
          Homologado
        </span>
      ) : isIllustrative ? (
        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 rounded-md shadow-2xs">
          Imagen Referencial
        </span>
      ) : null}
      {totalImages > 1 && (
        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-900/75 text-white rounded-md">
          {currentIndex + 1} / {totalImages}
        </span>
      )}
    </div>
  );
};
