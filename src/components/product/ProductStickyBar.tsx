import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShoppingBag } from 'lucide-react';
import { useQuote } from '../../context/QuoteContext';

interface ProductStickyBarProps {
  product?: any;
  mainImage?: string;
}

export function ProductStickyBar({ product, mainImage }: ProductStickyBarProps) {
  const { addItem, isInTray } = useQuote();

  if (!product) return null;

  const inTray = isInTray(product.id);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      brandName: product.brandName,
      model: product.model,
      imageUrl: mainImage || product.images?.[0]?.url,
      slug: product.slug,
      categoryName: product.categoryName,
    });
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-xl px-4 py-3 sm:hidden">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5 min-w-0">
          {(mainImage || product.images?.[0]?.url) && (
            <img
              src={mainImage || product.images?.[0]?.url}
              alt=""
              className="w-10 h-10 object-contain rounded-lg border border-slate-200 p-0.5 bg-white shrink-0"
            />
          )}
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
            <span className="text-[10px] text-slate-500 block truncate">{product.brandName || product.model}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAdd}
            className={`px-3 py-2 rounded-lg text-xs font-bold border ${
              inTray ? 'bg-cyan-50 border-cyan-300 text-cyan-900' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
          <Link
            to={`/cotizar?product=${product.id}`}
            className="px-3.5 py-2 bg-brand-navy text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Cotizar</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
