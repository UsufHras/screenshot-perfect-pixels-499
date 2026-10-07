import { createFileRoute, Link } from "@tanstack/react-router";
import { services } from "@/lib/data";
import { Container, PageHero, meta } from "@/components/site";
import { ServiceCard } from "@/components/cards";

export const Route = createFileRoute("/services/")({
  head: () => meta("خدمات مكافحة الآفات", "مكافحة الحشرات والقوارض وبق الفراش والنمل الأبيض وبرامج وقائية للمنشآت."),
  component: () => (
    <>
      <PageHero eyebrow="الخدمات" title="خدمات مكافحة الآفات" subtitle="حلول متخصصة للمنازل والمنشآت التجارية والصناعية.">
        <Link to="/booking" className="btn btn-primary">احجز خدمة</Link>
        <Link to="/quote" className="btn btn-outline">اطلب عرض سعر</Link>
      </PageHero>
      <Container className="grid gap-6 py-16 md:grid-cols-2 lg:grid-cols-3">{services.map((s) => <ServiceCard key={s.slug} s={s} />)}</Container>
    </>
  ),
});
