import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { categories, productsList } from "@/lib/data";
import { Container, PageHero, meta } from "@/components/site";
import { ProductCard } from "@/components/cards";

export const Route = createFileRoute("/store/")({
  head: () => meta("متجر مكافحة الآفات", "مبيدات ومصائد وطعوم ومعدات مكافحة آفات مع إرشادات استخدام آمنة."),
  component: Store,
});

function Store() {
  const [cat, setCat] = useState<string | null>(null);
  const list = cat ? productsList.filter((p) => p.category === cat) : productsList;
  return (
    <>
      <PageHero eyebrow="المتجر" title="متجر مكافحة الآفات" subtitle="منتجات مختارة بعناية من الدكتور، مع إرشادات استخدام وسلامة واضحة." />
      <Container className="py-12">
        <div className="mb-8 flex items-start gap-3 rounded-2xl bg-warning-soft p-4 text-sm text-warning">
          <ShieldAlert className="size-5 shrink-0" />
          <p><b>تنبيه سلامة:</b> استخدم المنتجات وفق التعليمات فقط. بعض المنتجات مخصصة للاستخدام المهني، وننصح باستشارة الدكتور قبل الاستخدام.</p>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          <button onClick={() => setCat(null)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${!cat ? "border-primary bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>الكل</button>
          {categories.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${cat === c ? "border-primary bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{c}</button>)}
        </div>
        {list.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
          : <p className="py-16 text-center text-muted-foreground">لا توجد منتجات في هذا القسم حاليًا.</p>}
      </Container>
    </>
  );
}
