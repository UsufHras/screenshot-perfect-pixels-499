import { queryOptions, useQuery } from "@tanstack/react-query";
import { listProducts } from "./products.functions";
import { images, type Product } from "./data";
import type { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export const productImageUrl = (path: string) =>
  `/api/public/product-image?path=${encodeURIComponent(path)}`;

export function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    short: row.short,
    use: row.use_place,
    pests: row.pests ?? [],
    price: Number(row.price) || 0,
    available: row.available,
    regulated: row.regulated,
    image: row.image_url ? productImageUrl(row.image_url) : images.products,
    usage: row.usage,
    safety: row.safety ?? [],
    storage: row.storage_note,
  };
}

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts() as Promise<ProductRow[]>,
});

export const productsOptions = queryOptions({
  ...productsQuery,
  select: (rows: ProductRow[]) => rows.map(toProduct),
});

export function useProductRows() {
  return useQuery(productsQuery);
}

export function useProducts() {
  return useQuery(productsOptions);
}
