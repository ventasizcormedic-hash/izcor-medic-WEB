export function getOptimizedImageUrl(url: string) {
  return url;
}

export function getPrimaryProductImage(images?: any[]) {
  if (!images || images.length === 0) return null;
  const primary = images.find((img) => img.isPrimary);
  return primary ? primary.url : images[0]?.url || null;
}

export function normalizeProductImages(images: any[], _options?: any): any[] {
  if (!images || !Array.isArray(images)) return [];
  return images.map((img, idx) => {
    if (typeof img === 'string') {
      return { id: idx, url: img, altText: '', isPrimary: idx === 0 };
    }
    return {
      id: img.id || idx,
      url: img.url || img.src || '',
      altText: img.altText || img.alt || '',
      isPrimary: Boolean(img.isPrimary),
      isIllustrative: Boolean(img.isIllustrative),
    };
  });
}
