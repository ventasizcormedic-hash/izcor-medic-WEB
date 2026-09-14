import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImageItem } from '../../lib/images/types';

interface ProductImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: ProductImageItem[];
  initialIndex?: number;
  productName: string;
  brandName?: string | null;
  model?: string | null;
}

export function ProductImageViewer({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  productName,
  brandName,
  model,
}: ProductImageViewerProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex, isOpen]);

  if (!isOpen || images.length === 0) return null;

  const current = images[index] || images[0];

  const handlePrev = () => setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  const handleNext = () => setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            {brandName && (
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                {brandName}
              </span>
            )}
            <span className="text-xs text-slate-600 font-medium truncate max-w-md">
              {productName} {model ? `(${model})` : ''} - {index + 1}/{images.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative flex-1 p-8 flex items-center justify-center bg-white min-h-[350px]">
          {current?.url && (
            <img
              src={current.url}
              alt={current.altText || productName}
              className="max-h-[65vh] w-auto max-w-full object-contain select-none"
            />
          )}

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white shadow-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
