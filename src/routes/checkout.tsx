import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { paymentMethods } from "@/lib/payments";
import { Container, Field, Success, meta } from "@/components/site";
import { Summary } from "./cart";

export const Route = createFileRoute("/checkout")({
  head: () => meta("إتمام الطلب", "أدخل بيانات التوصيل واختر طريقة الدفع."),
  component: Checkout,
});

function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const [done, setDone] = useState(false);
  const [pay, setPay] = useState("cod");
  if (done) return <Container className="py-16"><Success title="تم استلام طلبك بنجاح" text="سنتواصل معك لتأكيد الطلب وموعد التوصيل." /></Container>;
  if (!lines.length) return <Container className="py-24 text-center"><h1 className="text-2xl font-extrabold">لا توجد منتجات في السلة</h1><Link to="/store" className="btn btn-primary mt-6">تسوق المنتجات</Link></Container>;
  return (
    <Container className="py-12">
      <h1 className="mb-8 text-3xl font-extrabold text-primary-deep">إتمام الطلب</h1>
      <form onSubmit={(e) => { e.preventDefault(); clear(); setDone(true); }} className="grid gap-8 lg:grid-cols-3">
        <div className="card-soft space-y-8 p-6 lg:col-span-2">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="الاسم"><input required className="field" /></Field>
            <Field label="الهاتف"><input required type="tel" className="field" /></Field>
            <Field label="WhatsApp"><input type="tel" className="field" /></Field>
            <Field label="المحافظة"><input required className="field" /></Field>
            <Field label="المدينة"><input required className="field" /></Field>
            <Field label="العنوان"><input required className="field" /></Field>
            <Field label="ملاحظات" full><textarea rows={3} className="field" /></Field>
          </div>
          <div>
            <p className="mb-3 font-bold">طريقة الدفع</p>
            <div className="grid gap-3 md:grid-cols-2">
              {paymentMethods.map((m) => (
                <label key={m.id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${pay === m.id ? "border-primary bg-secondary" : ""} ${!m.enabled ? "opacity-50" : ""}`}>
                  <input type="radio" name="pay" disabled={!m.enabled} checked={pay === m.id} onChange={() => setPay(m.id)} className="accent-current" />
                  <span><span className="block font-bold">{m.label}</span><span className="text-sm text-muted-foreground">{m.description}</span></span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <Summary subtotal={subtotal}><button className="btn btn-primary mt-6 w-full">تأكيد الطلب</button></Summary>
      </form>
    </Container>
  );
}
