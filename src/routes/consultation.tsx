import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Container, PageHero, Field, Success, meta } from "@/components/site";

export const Route = createFileRoute("/consultation")({
  head: () => meta("استشر الدكتور", "اطلب استشارة متخصصة في مكافحة الآفات للمنازل والمنشآت مع إمكانية رفع الصور والفيديو."),
  component: Consultation,
});

const types = ["استشارة منزلية", "استشارة للمنشآت التجارية", "استشارة للمطاعم والفنادق", "استشارة للمصانع والمخازن", "استشارة عن نوع حشرة أو آفة", "استشارة حول منتج مكافحة آفات"];

function Consultation() {
  const [done, setDone] = useState(false);
  const [type, setType] = useState(types[0]);
  return (
    <>
      <PageHero eyebrow="استشر الدكتور" title="استشارة متخصصة لمشكلتك" subtitle="صف المشكلة وأرفق صورًا أو فيديو، وسيتواصل معك الدكتور بالتشخيص والحل المناسب." />
      <Container className="py-16">
        {done ? <Success title="تم استلام طلب الاستشارة" text="سيراجع الدكتور طلبك ويتواصل معك في أقرب وقت عبر الوسيلة المفضلة." /> : (
          <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="card-soft mx-auto max-w-4xl p-6 md:p-10">
            <p className="mb-3 font-bold">نوع الاستشارة</p>
            <div className="mb-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {types.map((t) => (
                <button type="button" key={t} onClick={() => setType(t)} className={`rounded-xl border p-3 text-right text-sm font-semibold transition ${type === t ? "border-primary bg-secondary text-primary-deep" : "hover:bg-muted"}`}>{t}</button>
              ))}
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="الاسم"><input required className="field" /></Field>
              <Field label="رقم الهاتف"><input required type="tel" className="field" /></Field>
              <Field label="WhatsApp"><input type="tel" className="field" /></Field>
              <Field label="البريد الإلكتروني"><input type="email" className="field" /></Field>
              <Field label="نوع المشكلة"><input className="field" placeholder="مثال: صراصير في المطبخ" /></Field>
              <Field label="المكان"><input className="field" placeholder="المدينة / نوع المكان" /></Field>
              <Field label="وصف المشكلة" full><textarea required rows={4} className="field" /></Field>
              <Field label="رفع صور"><input type="file" accept="image/*" multiple className="field" /></Field>
              <Field label="رفع فيديو"><input type="file" accept="video/*" className="field" /></Field>
              <Field label="طريقة التواصل المفضلة"><select className="field"><option>واتساب</option><option>اتصال هاتفي</option><option>البريد الإلكتروني</option></select></Field>
              <Field label="الموعد المفضل"><input type="datetime-local" className="field" /></Field>
              <label className="flex items-center gap-2 rounded-xl bg-warning-soft p-3 font-bold text-warning md:col-span-2"><input type="checkbox" className="size-4 accent-current" />أريد استشارة عاجلة</label>
            </div>
            <button className="btn btn-primary mt-8 w-full">إرسال طلب الاستشارة</button>
          </form>
        )}
      </Container>
    </>
  );
}
