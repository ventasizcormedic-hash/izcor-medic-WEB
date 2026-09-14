export type ViewMode = 'grid' | 'list';
export type SortOption = 'newest' | 'recent' | 'name-asc' | 'name-desc' | 'popular';

export interface ComparisonProduct {
  id: number;
  name: string;
  slug: string;
  brandName?: string;
  manufacturer?: string;
  model?: string;
  catalogNumber?: string;
  categoryName?: string;
  procedencia?: string;
  application?: string;
  presentation?: string;
  verificationStatus?: string;
  imageUrl?: string;
  specifications?: Record<string, string>;
  technicalSpecs?: any;
}
