import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface ProductBreadcrumbProps {
  categoryName?: string;
  categorySlug?: string;
  subcategoryName?: string;
  subcategorySlug?: string;
  productName: string;
  prevProduct?: any;
  nextProduct?: any;
}

export function ProductBreadcrumb({
  categoryName,
  categorySlug,
  subcategoryName,
  subcategorySlug,
  productName,
  prevProduct,
  nextProduct,
}: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center justify-between text-xs text-slate-500 mb-6 flex-wrap gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-indigo-600 flex items-center gap-1">
          <Home className="w-3.5 h-3.5" /> Inicio
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link to="/productos" className="hover:text-indigo-600">Catálogo</Link>
        {categoryName && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link to={`/productos?category=${encodeURIComponent(categorySlug || categoryName)}`} className="hover:text-indigo-600">
              {categoryName}
            </Link>
          </>
        )}
        {subcategoryName && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-600">{subcategoryName}</span>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{productName}</span>
      </div>

      {(prevProduct || nextProduct) && (
        <div className="flex items-center gap-3 text-xs font-semibold">
          {prevProduct && (
            <Link to={`/producto/${prevProduct.slug || prevProduct.id}`} className="text-slate-600 hover:text-indigo-600">
              ← Anterior
            </Link>
          )}
          {nextProduct && (
            <Link to={`/producto/${nextProduct.slug || nextProduct.id}`} className="text-slate-600 hover:text-indigo-600">
              Siguiente →
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
