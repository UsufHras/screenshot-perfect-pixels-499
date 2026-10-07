import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { fmt, DELIVERY_FEE } from "@/lib/data";
import { Container, meta } from "@/components/site";

export const Route = createFileRoute("/cart")({
  head: () => meta("سلة المشتريات", "راجع منتجاتك قبل إتمام الطلب."),
  component: Cart,
});

function Cart() {
  const { lines, subtotal, setQty, remove } = useCart();
  if (!lines.length) return (
    <Container className="py-24 text-center">
      <ShoppingCart className="mx-auto size-14 text-muted-foreground" />
      <h1 className="mt-4 text-2xl font-extrabold">سلتك فارغة</h1>
      <Link to="/store" className="btn btn-primary mt-6">تسوق المنتجات</Link>
    </Container>
  );
  return (
    <Container className="py-12">
      <h1 className="mb-8 text-3xl font-extrabold text-primary-deep">سلة المشتريات</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {lines.map(({ product: p, qty }) => (
            <div key={p.slug} className="card-soft flex items-center gap-4 p-4">
              <img src={p.image} alt={p.name} className="size-20 rounded-xl object-cover" />
              <div className="flex-1">
                <Link to="/store/$slug" params={{ slug: p.slug }} className="font-bold text-primary-deep">{p.name}</Link>
                <p className="text-sm text-muted-foreground">{fmt(p.price)}</p>
              </div>
              <div className="flex items-center rounded-xl border">
                <button onClick={() => setQty(p.slug, qty + 1)} className="p-2"><Plus className="size-4" /></button>
                <span className="w-8 text-center font-bold">{qty}</span>
                <button onClick={() => setQty(p.slug, qty - 1)} className="p-2"><Minus className="size-4" /></button>
              </div>
              <button onClick={() => remove(p.slug)} className="p-2 text-destructive" aria-label="حذف"><Trash2 className="size-5" /></button>
            </div>
          ))}
        </div>
        <Summary subtotal={subtotal}><Link to="/checkout" className="btn btn-primary mt-6 w-full">إتمام الطلب</Link></Summary>
      </div>
    </Container>
  );
}

export function Summary({ subtotal, children }: { subtotal: number; children?: React.ReactNode }) {
  return (
    <aside className="card-soft h-fit p-6">
      <h2 className="text-lg font-extrabold">ملخص الطلب</h2>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between"><span>المجموع الفرعي</span><span>{fmt(subtotal)}</span></div>
        <div className="flex justify-between"><span>رسوم التوصيل</span><span>{fmt(DELIVERY_FEE)}</span></div>
        <div className="flex justify-between border-t pt-3 text-base font-extrabold"><span>الإجمالي</span><span>{fmt(subtotal + DELIVERY_FEE)}</span></div>
      </div>
      {children}
    </aside>
  );
}
