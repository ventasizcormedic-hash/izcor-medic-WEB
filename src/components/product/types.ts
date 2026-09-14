export interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

export interface ProductDetailType {
  id: number;
  name: string;
  slug: string;
  description?: string;
  catalogNumber?: string;
  model?: string;
  brandName?: string;
  brandManufacturer?: string;
  brandLogo?: string;
  manufacturer?: string;
  categoryName?: string;
  categorySlug?: string;
  subcategory?: string | { name: string; slug?: string };
  subcategorySlug?: string;
  prevProduct?: any;
  nextProduct?: any;
  verificationStatus?: string;
  images?: ProductImage[];
  specifications?: Record<string, string>;
  technicalSpecs?: any;
  application?: string;
  applications?: string[];
  presentation?: string;
  siblingModels?: any[];
  documents?: any[];
  sourceUrl?: string;
  relatedProducts?: any[];
}

export type ProductDetailData = ProductDetailType;

export interface ProductDocument {
  id: number;
  title: string;
  url: string;
  type?: string;
}

export function parseTechnicalSpecs(specs: any): Record<string, string> {
  if (!specs) return {};
  if (typeof specs === 'object') return specs;
  try {
    return JSON.parse(specs);
  } catch {
    return {};
  }
}
