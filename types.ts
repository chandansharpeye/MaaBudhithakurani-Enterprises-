export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category_id: string | null;
  brand: string | null;
  model: string | null;
  description: string | null;
  specifications: string | null;
  wholesale_price: number;
  retail_price: number | null;
  price_unit: string;
  moq: number;
  stock_qty: number;
  gst_rate: number | null;
  is_featured: boolean;
  price_verified: boolean;
  is_active: boolean;
};

export type Category = { id: string; name: string };
