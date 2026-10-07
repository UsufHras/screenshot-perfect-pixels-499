import { Link } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, Clock } from "lucide-react";
import { type Service, type Product, type Post, fmt } from "@/lib/data";
import { useCart } from "@/lib/cart";

export function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="card-soft card-lift flex flex-col overflow-hidden">
      <img src={s.image} alt={s.title} loading="lazy" className="h-48 w-full object-cover" />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-extrabold text-primary-deep">{s.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {s.problems.slice(0, 5).map((p) => <span key={p} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">{p}</span>)}
        </div>
        <div className="mt-auto flex gap-2 pt-6">
          <Link to="/services/$slug" params={{ slug: s.slug }} className="btn btn-outline flex-1 !px-3 text-sm">اعرف المزيد</Link>
          <Link to="/booking" className="btn btn-primary flex-1 !px-3 text-sm">احجز الخدمة</Link>
        </div>
      </div>
    </article>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  return (
    <article className="card-soft card-lift flex flex-col overflow-hidden">
      <Link to="/store/$slug" params={{ slug: p.slug }} className="relative block">
        <img src={p.image} alt={p.name} loading="lazy" className="aspect-square w-full object-cover" />
        {p.regulated && <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-bold text-warning"><AlertTriangle className="size-3.5" />للاستخدام المهني</span>}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold text-primary">{p.category}</span>
        <Link to="/store/$slug" params={{ slug: p.slug }} className="mt-1 font-extrabold text-primary-deep hover:text-primary">{p.name}</Link>
        <p className="mt-1 text-sm text-muted-foreground">{p.short}</p>
        <p className="mt-2 text-xs text-muted-foreground">الاستخدام: {p.use} · الآفات: {p.pests.join("، ")}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-extrabold text-primary-deep">{fmt(p.price)}</span>
          <span className={`text-xs font-bold ${p.available ? "text-primary" : "text-destructive"}`}>{p.available ? "متوفر" : "غير متوفر"}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <button disabled={!p.available} onClick={() => add(p.slug)} className="btn btn-primary flex-1 !px-3 text-sm">أضف للسلة</button>
          <Link to="/store/$slug" params={{ slug: p.slug }} className="btn btn-outline !px-3 text-sm">التفاصيل</Link>
        </div>
      </div>
    </article>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }} className="card-soft card-lift group block overflow-hidden">
      <img src={post.image} alt={post.title} loading="lazy" className="h-48 w-full object-cover" />
      <div className="p-6">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-bold text-primary">{post.category}</span>
          <span className="flex items-center gap-1"><Clock className="size-3.5" />{post.minutes} دقائق</span>
        </div>
        <h3 className="mt-2 font-extrabold leading-snug text-primary-deep group-hover:text-primary">{post.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">اقرأ المقال <ArrowLeft className="size-4" /></span>
      </div>
    </Link>
  );
}
