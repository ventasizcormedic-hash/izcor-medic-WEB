import React from 'react';
import { X } from 'lucide-react';

export interface ActiveFilterChipsProps {
  search?: string;
  category?: string;
  categoryName?: string;
  subcategoryName?: string;
  brand?: string;
  brandName?: string;
  manufacturer?: string;
  procedencia?: string;
  application?: string;
  verificationStatus?: string;
  onClearSearch?: () => void;
  onRemoveSearch?: () => void;
  onClearCategory?: () => void;
  onRemoveCategory?: () => void;
  onClearSubcategory?: () => void;
  onRemoveSubcategory?: () => void;
  onClearBrand?: () => void;
  onRemoveBrand?: () => void;
  onClearManufacturer?: () => void;
  onRemoveManufacturer?: () => void;
  onClearProcedencia?: () => void;
  onRemoveProcedencia?: () => void;
  onClearApplication?: () => void;
  onRemoveApplication?: () => void;
  onClearVerificationStatus?: () => void;
  onRemoveVerificationStatus?: () => void;
  onResetAll?: () => void;
  onClearAll?: () => void;
}

export function ActiveFilterChips({
  search,
  category,
  categoryName,
  subcategoryName,
  brand,
  brandName,
  manufacturer,
  procedencia,
  application,
  verificationStatus,
  onClearSearch,
  onRemoveSearch,
  onClearCategory,
  onRemoveCategory,
  onClearSubcategory,
  onRemoveSubcategory,
  onClearBrand,
  onRemoveBrand,
  onClearManufacturer,
  onRemoveManufacturer,
  onClearProcedencia,
  onRemoveProcedencia,
  onClearApplication,
  onRemoveApplication,
  onClearVerificationStatus,
  onRemoveVerificationStatus,
  onResetAll,
  onClearAll,
}: ActiveFilterChipsProps) {
  const s = search;
  const c = category || categoryName;
  const sub = subcategoryName;
  const b = brand || brandName;
  const m = manufacturer;
  const p = procedencia;
  const app = application;
  const v = verificationStatus;

  const handleClearSearch = onClearSearch || onRemoveSearch || (() => {});
  const handleClearCategory = onClearCategory || onRemoveCategory || (() => {});
  const handleClearSubcategory = onClearSubcategory || onRemoveSubcategory || (() => {});
  const handleClearBrand = onClearBrand || onRemoveBrand || (() => {});
  const handleClearManufacturer = onClearManufacturer || onRemoveManufacturer || (() => {});
  const handleClearProcedencia = onClearProcedencia || onRemoveProcedencia || (() => {});
  const handleClearApplication = onClearApplication || onRemoveApplication || (() => {});
  const handleClearVerification = onClearVerificationStatus || onRemoveVerificationStatus || (() => {});
  const handleReset = onResetAll || onClearAll || (() => {});

  if (!s && !c && !sub && !b && !m && !p && !app && !v) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs font-bold text-slate-400">Filtros activos:</span>
      {s && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100">
          Búsqueda: {s}
          <button type="button" onClick={handleClearSearch} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
        </span>
      )}
      {c && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100">
          Categoría: {c}
          <button type="button" onClick={handleClearCategory} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
        </span>
      )}
      {sub && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100">
          Subcategoría: {sub}
          <button type="button" onClick={handleClearSubcategory} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
        </span>
      )}
      {b && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100">
          Marca: {b}
          <button type="button" onClick={handleClearBrand} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
        </span>
      )}
      {m && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100">
          Fabricante: {m}
          <button type="button" onClick={handleClearManufacturer} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
        </span>
      )}
      {p && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100">
          Procedencia: {p}
          <button type="button" onClick={handleClearProcedencia} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
        </span>
      )}
      {app && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100">
          Aplicación: {app}
          <button type="button" onClick={handleClearApplication} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
        </span>
      )}
      {v && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100">
          Estado: {v}
          <button type="button" onClick={handleClearVerification} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
        </span>
      )}
      <button
        type="button"
        onClick={handleReset}
        className="text-xs font-bold text-slate-500 hover:text-slate-800 underline ml-2"
      >
        Limpiar todos
      </button>
    </div>
  );
}
