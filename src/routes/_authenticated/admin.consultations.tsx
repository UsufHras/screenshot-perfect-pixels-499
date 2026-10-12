import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsPage } from "@/components/admin/submissions";

export const Route = createFileRoute("/_authenticated/admin/consultations")({
  head: () => ({ meta: [{ title: "الاستشارات — لوحة التحكم" }] }),
  component: () => <SubmissionsPage title="الاستشارات" subtitle="طلبات الاستشارة الواردة مع الصور والفيديوهات المرفقة." kinds={["consultation"]} />,
});
