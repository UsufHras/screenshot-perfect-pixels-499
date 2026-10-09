import { createFileRoute } from "@tanstack/react-router";
import { useSubmit } from "@/lib/use-submit";
import { services } from "@/lib/data";
import { Container, PageHero, Field, Success, meta } from "@/components/site";

export const Route = createFileRoute("/quote")({
  head: () => meta("اطلب عرض سعر", "عروض أسعار لبرامج مكافحة الآفات للمطاعم والفنادق والمصانع والمخازن والمنشآت."),
  component: Quote,
});

const biz = ["مطعم", "فندق", "مصنع", "مخزن", "منشأة غذائية", "مكاتب", "مدرسة", "مستشفى", "مبنى تجاري"];

function Quote() {
  const { done, loading, error, onSubmit } = useSubmit("quote");
  return (
    <>
      <PageHero eyebrow="للشركات والمنشآت" title="اطلب عرض سعر" subtitle="برامج مكافحة مخصصة وموثقة تناسب طبيعة منشأتك ومتطلبات التفتيش." />
      <Container className="py-14">
        {done ? <Success title="تم استلام طلب عرض السعر" text="سيتواصل معك فريقنا لتحديد موعد المعاينة وإرسال العرض." /> : (
          <form onSubmit={onSubmit} className="card-soft mx-auto grid max-w-4xl gap-5 p-6 md:grid-cols-2 md:p-10">
            <Field label="اسم الشركة"><input required className="field" /></Field>
            <Field label="الشخص المسؤول"><input required className="field" /></Field>
            <Field label="الهاتف"><input required type="tel" className="field" /></Field>
            <Field label="البريد الإلكتروني"><input type="email" className="field" /></Field>
            <Field label="نوع النشاط"><select className="field">{biz.map((b) => <option key={b}>{b}</option>)}</select></Field>
            <Field label="الموقع"><input required className="field" /></Field>
            <Field label="المساحة التقريبية (م²)"><input type="number" className="field" /></Field>
            <Field label="الخدمة المطلوبة"><select className="field">{services.map((s) => <option key={s.slug}>{s.title}</option>)}</select></Field>
            <Field label="مشكلة الآفات الحالية" full><textarea rows={4} className="field" /></Field>
            <Field label="الوقت المفضل للتواصل"><select className="field"><option>صباحًا</option><option>ظهرًا</option><option>مساءً</option></select></Field>
            {error && <p className="text-sm font-semibold text-destructive md:col-span-2">{error}</p>}<button disabled={loading} className="btn btn-primary self-end">{loading ? "جارٍ الإرسال..." : "اطلب عرض السعر"}</button>
          </form>
        )}
      </Container>
    </>
  );
}
