import React from 'react';
import { X } from 'lucide-react';
import { FilterSidebar, FilterSidebarProps } from './FilterSidebar';

export interface FilterDrawerProps extends FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  totalResults?: number;
}

export function FilterDrawer({
  isOpen,
  onClose,
  ...props
}: FilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <h3 className="font-extrabold text-slate-900">Filtros</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <FilterSidebar {...props} />
      </div>
    </div>
  );
}
