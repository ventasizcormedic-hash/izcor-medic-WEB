import React from 'react';
import { LayoutGrid, List, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { ViewMode, SortOption } from './types';

export interface CatalogHeaderProps {
  totalCount?: number;
  totalProducts?: number;
  currentPage?: number;
  itemsPerPage?: number;
  viewMode?: ViewMode;
  setViewMode?: (mode: ViewMode) => void;
  onViewModeChange?: (mode: ViewMode) => void;
  sort?: SortOption;
  setSort?: (sort: SortOption) => void;
  onSortChange?: (sort: SortOption) => void;
  onOpenMobileFilters?: () => void;
  onOpenFilterDrawer?: () => void;
  searchTerm?: string;
  onSearchChange?: (q: any) => void;
  onSearchSubmit?: () => void;
  activeCategoryName?: string;
  activeSubcategoryName?: string;
  activeBrandName?: string;
  activeFiltersCount?: number;
}

export function CatalogHeader({
  totalCount,
  totalProducts,
  viewMode = 'grid',
  setViewMode,
  onViewModeChange,
  sort = 'newest',
  setSort,
  onSortChange,
  onOpenMobileFilters,
  onOpenFilterDrawer,
}: CatalogHeaderProps) {
  const count = totalCount ?? totalProducts ?? 0;
  const handleViewMode = (mode: ViewMode) => {
    if (setViewMode) setViewMode(mode);
    if (onViewModeChange) onViewModeChange(mode);
  };
  const handleSort = (s: SortOption) => {
    if (setSort) setSort(s);
    if (onSortChange) onSortChange(s);
  };
  const handleMobile = onOpenMobileFilters || onOpenFilterDrawer || (() => {});

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <button
          type="button"
          onClick={handleMobile}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
        </button>
        <span className="text-sm font-semibold text-slate-600">
          <strong className="text-slate-900">{count}</strong> productos encontrados
        </span>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sort}
            onChange={(e) => handleSort(e.target.value as SortOption)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="newest">Más recientes</option>
            <option value="name-asc">Nombre (A - Z)</option>
            <option value="name-desc">Nombre (Z - A)</option>
            <option value="popular">Más solicitados</option>
          </select>
        </div>

        <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            title="Vista de cuadrícula"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            title="Vista de lista"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
