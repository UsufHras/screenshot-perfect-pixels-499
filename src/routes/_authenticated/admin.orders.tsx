import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsPage } from "@/components/admin/submissions";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({ meta: [{ title: "الطلبات — لوحة التحكم" }] }),
  component: () => <SubmissionsPage title="طلبات المتجر" subtitle="طلبات المنتجات من المتجر الإلكتروني." kinds={["order"]} />,
});
