// A single image associated with a product
export interface ProductImage {
  id: number;
  image: string;
  display_order: number;
  alt_text: string; // must be a string
  is_main: boolean; // must be a boolean
}

// Category object
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

// Main Product type
export interface Product {
  id: number;
  name: string;
  description: string;
  category: { id: string; name: string };
  price: number;
  short_description?: string;
  sale_price?: number;
  stock_quantity?: number;
  status?: string[];
  meta_description?: string;
  meta_title?: string;
  is_active?: boolean;
  is_bestseller?: boolean;
  is_featured?: boolean;
  images: ProductImage[];
  updated_at: string;
  sku: string;
  ref_number?: string;
  is_on_sale?: boolean;
}

// Attributes (if your API supports filtering by size/color/etc.)
export interface ProductAttribute {
  name: string;
  value: string;
}
