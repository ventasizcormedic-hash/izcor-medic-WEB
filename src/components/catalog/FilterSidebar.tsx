import React from 'react';
import { CatalogFacets } from '../../types';
import { Filter, X } from 'lucide-react';

export interface FilterSidebarProps {
  facets?: CatalogFacets | null;
  categories?: any[];
  brands?: any[];
  manufacturers?: any[];
  clinicalApplications?: any;
  procedencias?: any;
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedBrand?: string;
  selectedManufacturer?: string;
  selectedProcedencia?: string;
  selectedApplication?: string;
  selectedVerificationStatus?: string;
  onSelectCategory?: (cat: string) => void;
  onSelectSubcategory?: (sub: string) => void;
  onSelectBrand?: (brand: string) => void;
  onSelectManufacturer?: (mfg: string) => void;
  onSelectProcedencia?: (proc: string) => void;
  onSelectApplication?: (app: string) => void;
  onSelectVerificationStatus?: (status: string) => void;
  onResetFilters?: () => void;
  onClearAllFilters?: () => void;
  onClearAll?: () => void;
  hasActiveFilters?: boolean;
}

export function FilterSidebar({
  facets,
  categories,
  brands,
  selectedCategory = '',
  selectedBrand = '',
  selectedManufacturer = '',
  onSelectCategory,
  onSelectBrand,
  onResetFilters,
  onClearAllFilters,
}: FilterSidebarProps) {
  const cats = facets?.categories || categories || [];
  const brs = facets?.brands || brands || [];
  const handleReset = onResetFilters || onClearAllFilters || (() => {});

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-24">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" /> Filtros del Catálogo
        </h3>
        {(selectedCategory || selectedBrand || selectedManufacturer) && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Limpiar
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Categorías</h4>
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-2">
          <button
            type="button"
            onClick={() => onSelectCategory && onSelectCategory('')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${!selectedCategory ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Todas las categorías
          </button>
          {cats.map((cat: any) => (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(cat.slug || cat.id.toString())}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${selectedCategory === (cat.slug || cat.id.toString()) ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="truncate">{cat.name}</span>
              {cat.productCount !== undefined && (
                <span className="text-xs text-slate-400 font-mono ml-2">({cat.productCount})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Marcas</h4>
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-2">
          <button
            type="button"
            onClick={() => onSelectBrand && onSelectBrand('')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${!selectedBrand ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Todas las marcas
          </button>
          {brs.map((brand: any) => (
            <button
              key={brand.id || brand.name}
              type="button"
              onClick={() => onSelectBrand && onSelectBrand(brand.id ? brand.id.toString() : brand.name)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${selectedBrand === (brand.id ? brand.id.toString() : brand.name) ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="truncate">{brand.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
