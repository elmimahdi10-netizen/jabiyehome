// ─── Product Types ────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  stock: number;
  categoryId: string;
  category: Category;
  brandId?: string;
  brand?: Brand;
  isFeatured: boolean;
  isPublished: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  specs?: Record<string, string>;
  avgRating?: number;
  reviewCount?: number;
  metaTitle?: string;
  metaDesc?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceModifier: number;
  stock: number;
  sku?: string;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  depth: number;
  sortOrder: number;
  productCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// ─── Order Types ──────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "PAYMENT_RECEIVED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productSnapshot: { name: string; imageUrl: string };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ─── Review Types ─────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  userId: string;
  user: { name: string; avatarUrl?: string };
  rating: number;
  title?: string;
  body: string;
  isVerified: boolean;
  createdAt: string;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  categorySlug?: string;
  brandIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  tags?: string[];
  sortBy?: "price_asc" | "price_desc" | "newest" | "rating" | "popular";
  page?: number;
  perPage?: number;
  q?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
