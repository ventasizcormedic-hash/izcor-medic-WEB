import React from 'react';
import { ProductImageItem } from '../../lib/images/types';

interface ProductThumbnailListProps {
  images?: ProductImageItem[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
  productName?: string;
  orientation?: 'horizontal' | 'vertical' | string;
}

export function ProductThumbnailList({
  images = [],
  activeIndex = 0,
  onSelect,
  productName = '',
}: ProductThumbnailListProps) {
  if (!images || images.length <= 1) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {images.map((img, idx) => (
        <button
          key={img.id || idx}
          type="button"
          onClick={() => onSelect && onSelect(idx)}
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all ${
            activeIndex === idx
              ? 'border-indigo-600 shadow-sm ring-2 ring-indigo-600/20'
              : 'border-slate-200 opacity-60 hover:opacity-100'
          }`}
          aria-label={`Ver imagen ${idx + 1} de ${images.length} de ${productName}`}
        >
          <img
            src={img.url}
            alt={img.altText || `Vista ${idx + 1}`}
            className="w-full h-full object-contain p-1.5"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  );
}
