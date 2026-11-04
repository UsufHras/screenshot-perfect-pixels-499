import { createFileRoute } from "@tanstack/react-router";
import { ArticlesAdmin } from "@/components/admin/articles";

export const Route = createFileRoute("/_authenticated/admin/articles")({
  head: () => ({ meta: [{ title: "المقالات — لوحة التحكم" }] }),
  component: () => <ArticlesAdmin />,
});
