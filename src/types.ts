export interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  catalogNumber?: string;
  model?: string;
  brandId?: number;
  brandName?: string;
  manufacturer?: string;
  categoryId?: number;
  categoryName?: string;
  subcategoryId?: number;
  subcategoryName?: string;
  isFeatured?: boolean;
  images?: ProductImage[];
  imageUrl?: string;
  specifications?: Record<string, string>;
  clinicalApplications?: string[];
  verificationStatus?: string;
  technicalSpecs?: any;
  application?: string;
  presentation?: string;
}

export interface CategoryWithSubcategories {
  id: number;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
  subcategories?: {
    id: number;
    name: string;
    slug: string;
    productCount?: number;
  }[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  country?: string;
  logoUrl?: string;
  productCount?: number;
}

export interface CatalogFacets {
  categories: CategoryWithSubcategories[];
  allCategories?: CategoryWithSubcategories[];
  brands: Brand[];
  manufacturers: string[];
  totalProducts?: number;
  clinicalApplications?: any;
  procedencias?: any;
}
