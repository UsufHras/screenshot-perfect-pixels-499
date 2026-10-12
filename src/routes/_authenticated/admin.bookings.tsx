import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsPage } from "@/components/admin/submissions";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  head: () => ({ meta: [{ title: "طلبات الخدمات — لوحة التحكم" }] }),
  component: () => <SubmissionsPage title="طلبات الخدمات" subtitle="حجوزات الخدمة وطلبات المعاينة وعروض الأسعار." kinds={["booking", "quote"]} />,
});
