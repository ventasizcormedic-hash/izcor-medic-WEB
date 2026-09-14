import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page?: number;
  currentPage?: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (newPage: number) => void;
  onItemsPerPageChange?: (newLimit: number) => void;
}

export function Pagination({ page, currentPage, totalPages, onPageChange }: PaginationProps) {
  const p = page || currentPage || 1;
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(p - 1)}
        disabled={p <= 1}
        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-bold text-slate-700 px-4">
        Página {p} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(p + 1)}
        disabled={p >= totalPages}
        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
