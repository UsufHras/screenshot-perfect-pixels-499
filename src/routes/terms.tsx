import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero, meta } from "@/components/site";

export const Route = createFileRoute("/terms")({
  head: () => meta("الشروط والأحكام", "الشروط والأحكام الخاصة باستخدام الموقع والخدمات والمتجر."),
  component: () => (
    <>
      <PageHero title="الشروط والأحكام" />
      <Container className="max-w-3xl space-y-6 py-14 leading-loose text-muted-foreground">
        <h2 className="text-xl font-extrabold text-primary-deep">الخدمات</h2>
        <p>يتم تحديد نوع المعالجة وعدد الجلسات بعد المعاينة، وتختلف النتائج حسب نوع وشدة الإصابة والتزام العميل بالتعليمات.</p>
        <h2 className="text-xl font-extrabold text-primary-deep">المنتجات</h2>
        <p>يلتزم المشتري باستخدام المنتجات وفق التعليمات المدونة. بعض المنتجات مخصصة للاستخدام المهني فقط.</p>
        <h2 className="text-xl font-extrabold text-primary-deep">الاستشارات</h2>
        <p>الاستشارات عن بُعد مبنية على المعلومات والصور المقدمة، وقد تتطلب بعض الحالات معاينة ميدانية.</p>
      </Container>
    </>
  ),
});
