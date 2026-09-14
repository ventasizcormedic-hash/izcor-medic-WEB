import React from 'react';
import { ViewMode } from './types';

interface CatalogSkeletonProps {
  viewMode?: ViewMode;
  count?: number;
}

export function CatalogSkeleton({ viewMode = 'grid', count = 6 }: CatalogSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i + 1);
  return (
    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
      {items.map(i => (
        <div key={i} className={`bg-slate-200 animate-pulse rounded-2xl ${viewMode === 'grid' ? 'h-80' : 'h-32'}`}></div>
      ))}
    </div>
  );
}
