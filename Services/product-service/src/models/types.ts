// types.ts - Database Models

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: number;
  title: string;
  description?: string;
  category_id: number;
  brand_id?: number;
  price: number;
  discount_percentage: number;
  rating: number;
  stock: number;
  sku?: string;
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
  warranty_information?: string;
  shipping_information?: string;
  availability_status?: string;
  return_policy?: string;
  minimum_order_quantity: number;
  barcode?: string;
  qr_code?: string;
  thumbnail?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  id: number;
  product_id: number;
  rating: number;
  comment?: string;
  review_date: Date;
  reviewer_name?: string;
  reviewer_email?: string;
  created_at: Date;
}

export interface Tag {
  id: number;
  name: string;
  created_at: Date;
}

export interface ProductTag {
  product_id: number;
  tag_id: number;
  created_at: Date;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  display_order: number;
  created_at: Date;
}

// Extended types with relations
export interface ProductWithDetails extends Product {
  category_name?: string;
  brand_name?: string;
  review_count?: number;
  avg_rating?: number;
  tags?: string[];
  images?: string[];
}

export interface ProductFilter {
  category?: string | undefined;
  brand?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  minRating?: number | undefined;
  inStock?: boolean | undefined;
  search?: string | undefined;
  tags?: string[] | undefined;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: 'price' | 'rating' | 'created_at' | 'title';
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
