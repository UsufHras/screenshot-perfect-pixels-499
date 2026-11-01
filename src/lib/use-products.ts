import { queryOptions, useQuery } from "@tanstack/react-query";
import { listProducts } from "./products.functions";
import { images, type Product } from "./data";

export const productImageUrl = (path: string) =>
  `/api/public/product-image?path=${encodeURIComponent(path)}`;

export function toProduct(row: Record<string, unknown>): Product {
  return {
    slug: String(row.slug),
    name: String(row.name),
    category: String(row.category),
    short: String(row.short ?? ""),
    use: String(row.use_place ?? ""),
    pests: Array.isArray(row.pests) ? (row.pests as string[]) : [],
    price: Number(row.price) || 0,
    available: Boolean(row.available),
    regulated: Boolean(row.regulated),
    image: row.image_url ? productImageUrl(String(row.image_url)) : images.products,
    usage: String(row.usage ?? ""),
    safety: Array.isArray(row.safety) ? (row.safety as string[]) : [],
    storage: String(row.storage_note ?? ""),
  };
}

export const productsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: async () => {
    const rows = await listProducts();
    return rows.map(toProduct);
  },
});

export function useProducts() {
  return useQuery(productsQueryOptions);
}
