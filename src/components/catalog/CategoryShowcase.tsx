import React from 'react';
import { CategoryWithSubcategories } from '../../types';

interface CategoryShowcaseProps {
  categories?: CategoryWithSubcategories[];
  selectedCategory?: string;
  onSelectCategory?: (idOrSlug: string) => void;
}

export function CategoryShowcase({
  categories = [],
  selectedCategory,
  onSelectCategory,
}: CategoryShowcaseProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
        Explorar por Línea Médica
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id.toString();
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(cat.slug || cat.id.toString())}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs'
              }`}
            >
              <div className="text-sm font-bold truncate">{cat.name}</div>
              {cat.productCount !== undefined && (
                <div className={`text-xs mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {cat.productCount} productos
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
