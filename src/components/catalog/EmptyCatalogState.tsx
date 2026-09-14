import React from 'react';
import { Search } from 'lucide-react';

interface EmptyCatalogStateProps {
  onResetFilters?: () => void;
  onClearFilters?: () => void;
  onApplySuggestedSearch?: (term: string) => void;
}

export function EmptyCatalogState({ onResetFilters, onClearFilters }: EmptyCatalogStateProps) {
  const handleReset = onResetFilters || onClearFilters || (() => {});
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
      <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-slate-900 mb-2">No se encontraron equipos o insumos</h3>
      <p className="text-slate-500 max-w-md mx-auto mb-6 text-sm">
        Intenta modificando los filtros de búsqueda, categoría o marca para encontrar lo que necesitas.
      </p>
      <button
        onClick={handleReset}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md"
      >
        Restablecer filtros
      </button>
    </div>
  );
}
