import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Minus, Plus, Stethoscope } from "lucide-react";
import { productsList, fmt, images } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { Container, meta } from "@/components/site";
import { ProductCard } from "@/components/cards";

export const Route = createFileRoute("/store/$slug")({
  loader: ({ params }) => {
    const p = productsList.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => loaderData ? meta(loaderData.name, loaderData.short) : { meta: [{ title: "غير موجود" }, { name: "robots", content: "noindex" }] },
  component: ProductDetail,
});

function ProductDetail() {
  const p = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const gallery = [p.image, images.products, images.hero];
  const [img, setImg] = useState(0);
  const related = productsList.filter((x) => x.slug !== p.slug).slice(0, 4);
  return (
    <Container className="py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <img src={gallery[img]} alt={p.name} className="aspect-square w-full rounded-3xl object-cover" />
          <div className="mt-3 flex gap-3">{gallery.map((g, i) => <button key={i} onClick={() => setImg(i)} className={`overflow-hidden rounded-xl border-2 ${img === i ? "border-primary" : "border-transparent"}`}><img src={g} alt="" className="size-20 object-cover" /></button>)}</div>
        </div>
        <div>
          <span className="text-sm font-bold text-primary">{p.category}</span>
          <h1 className="mt-2 text-3xl font-extrabold text-primary-deep">{p.name}</h1>
          <p className="mt-3 text-2xl font-extrabold">{fmt(p.price)}</p>
          <p className={`mt-1 text-sm font-bold ${p.available ? "text-primary" : "text-destructive"}`}>{p.available ? "متوفر" : "غير متوفر حاليًا"}</p>
          <p className="mt-4 text-muted-foreground">{p.short}</p>
          {p.regulated && <div className="mt-4 flex gap-2 rounded-xl bg-warning-soft p-4 text-sm text-warning"><AlertTriangle className="size-5 shrink-0" />منتج مخصص للاستخدام المهني. يُنصح باستشارة الدكتور أو الاستعانة بفني متخصص قبل الاستخدام.</div>}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-xl border">
              <button onClick={() => setQty(qty + 1)} className="p-3"><Plus className="size-4" /></button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3"><Minus className="size-4" /></button>
            </div>
            <button disabled={!p.available} onClick={() => add(p.slug, qty)} className="btn btn-primary flex-1">أضف للسلة</button>
          </div>
          <Link to="/consultation" className="btn btn-outline mt-3 w-full"><Stethoscope className="size-5" />استشر الدكتور قبل الاستخدام</Link>
          <dl className="mt-8 space-y-4 text-sm">
            <Row k="الآفات المستهدفة" v={p.pests.join("، ")} />
            <Row k="الاستخدامات المناسبة" v={p.use} />
            <Row k="طريقة الاستخدام" v={p.usage} />
            <Row k="احتياطات السلامة" v={<ul className="list-disc pr-4">{p.safety.map((s) => <li key={s}>{s}</li>)}</ul>} />
            <Row k="التخزين" v={p.storage} />
          </dl>
        </div>
      </div>
      <h2 className="mt-20 mb-6 text-2xl font-extrabold text-primary-deep">منتجات ذات صلة</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
    </Container>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="border-b pb-4"><dt className="font-bold text-primary-deep">{k}</dt><dd className="mt-1 text-muted-foreground">{v}</dd></div>;
}
