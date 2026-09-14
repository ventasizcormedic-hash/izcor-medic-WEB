import React from 'react';

export function ProductImageSkeleton({ aspectRatio = 'square' }: { aspectRatio?: 'square' | '4/3' | string }) {
  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 'aspect-4/3';
  return (
    <div className={`w-full ${aspectClass} bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center`}>
      <div className="w-12 h-12 rounded-full bg-slate-200" />
    </div>
  );
}
