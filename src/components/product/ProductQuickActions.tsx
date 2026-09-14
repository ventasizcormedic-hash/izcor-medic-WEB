import React, { useState } from 'react';
import { Share2, Scale, Heart, Check } from 'lucide-react';

interface ProductQuickActionsProps {
  product?: {
    id: number;
    name: string;
    slug: string;
    brandName?: string;
    model?: string;
    imageUrl?: string;
    categoryName?: string;
  };
  isCompared?: boolean;
  onToggleCompare?: (product: any) => void;
  layout?: 'inline' | 'stacked' | string;
}

export function ProductQuickActions({
  product,
  isCompared = false,
  onToggleCompare,
}: ProductQuickActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'Producto IZCOR MEDIC',
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={() => setIsFavorite(!isFavorite)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
          isFavorite
            ? 'bg-rose-50 border-rose-200 text-rose-600'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
        <span>{isFavorite ? 'Guardado' : 'Favorito'}</span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
        <span>{copied ? '¡Enlace copiado!' : 'Compartir'}</span>
      </button>

      {product && onToggleCompare && (
        <button
          type="button"
          onClick={() => onToggleCompare(product)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            isCompared
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{isCompared ? 'En comparativa' : 'Comparar'}</span>
        </button>
      )}
    </div>
  );
}
