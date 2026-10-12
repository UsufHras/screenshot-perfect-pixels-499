import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsPage } from "@/components/admin/submissions";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  head: () => ({ meta: [{ title: "الرسائل — لوحة التحكم" }] }),
  component: () => <SubmissionsPage title="الرسائل" subtitle="رسائل صفحة تواصل معنا." kinds={["contact"]} />,
});
