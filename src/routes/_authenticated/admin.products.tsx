import { createFileRoute } from "@tanstack/react-router";
import { ProductsAdmin } from "@/components/admin/products";

export const Route = createFileRoute("/_authenticated/admin/products")({
  head: () => ({ meta: [{ title: "المنتجات — لوحة التحكم" }] }),
  component: () => <ProductsAdmin />,
});
