import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { services } from "@/lib/data";
import { Container, PageHero, Field, Success, meta } from "@/components/site";

export const Route = createFileRoute("/booking")({
  head: () => meta("احجز خدمة أو اطلب معاينة", "احجز خدمة مكافحة آفات أو اطلب معاينة لمنزلك أو منشأتك."),
  component: Booking,
});

const props = ["منزل", "شقة", "فيلا", "مكتب", "مطعم", "فندق", "مصنع", "مخزن", "مدرسة", "منشأة أخرى"];

function Booking() {
  const [done, setDone] = useState(false);
  return (
    <>
      <PageHero eyebrow="حجز" title="احجز خدمة أو اطلب معاينة" subtitle="املأ البيانات وسنتواصل معك لتأكيد الموعد." />
      <Container className="py-14">
        {done ? <Success title="تم استلام طلبك بنجاح" text="سيتواصل معك فريقنا لتأكيد الموعد." /> : (
          <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="card-soft mx-auto grid max-w-4xl gap-5 p-6 md:grid-cols-2 md:p-10">
            <Field label="الاسم"><input required className="field" /></Field>
            <Field label="الهاتف"><input required type="tel" className="field" /></Field>
            <Field label="WhatsApp"><input type="tel" className="field" /></Field>
            <Field label="نوع الخدمة"><select className="field">{services.map((s) => <option key={s.slug}>{s.title}</option>)}<option>معاينة فقط</option></select></Field>
            <Field label="نوع العقار"><select className="field">{props.map((p) => <option key={p}>{p}</option>)}</select></Field>
            <Field label="الموقع"><input required className="field" /></Field>
            <Field label="عدد الغرف / المساحة التقريبية"><input className="field" /></Field>
            <Field label="رفع صور"><input type="file" accept="image/*" multiple className="field" /></Field>
            <Field label="التاريخ المفضل"><input type="date" className="field" /></Field>
            <Field label="الوقت المفضل"><input type="time" className="field" /></Field>
            <Field label="وصف المشكلة" full><textarea required rows={4} className="field" /></Field>
            <Field label="ملاحظات إضافية" full><textarea rows={2} className="field" /></Field>
            <button className="btn btn-primary md:col-span-2">تأكيد الحجز</button>
          </form>
        )}
      </Container>
    </>
  );
}
