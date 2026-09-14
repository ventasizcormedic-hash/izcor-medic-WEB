import React from 'react';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductRelatedProps {
  relatedProducts?: any[];
  categoryName?: string;
}

export function ProductRelated({ relatedProducts = [], categoryName }: ProductRelatedProps) {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs mb-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-indigo-600" /> Equipos Relacionados {categoryName ? `en ${categoryName}` : ''}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((prod, idx) => (
          <Link
            key={idx}
            to={`/producto/${prod.slug || prod.id}`}
            className="group p-3 rounded-xl border border-slate-200 hover:border-indigo-500 bg-white transition-all flex flex-col justify-between"
          >
            <div className="aspect-square bg-slate-50 rounded-lg p-3 mb-2 flex items-center justify-center">
              <img
                src={prod.images?.[0]?.url || prod.imageUrl || '/placeholder.png'}
                alt={prod.name}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600">
              {prod.name}
            </span>
            <span className="text-[11px] font-mono text-slate-400 mt-1">{prod.model || prod.brandName}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
