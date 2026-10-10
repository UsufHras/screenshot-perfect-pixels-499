import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, ShoppingCart, Phone, Mail, MapPin, CheckCircle2, MessageCircle, Bug, LayoutDashboard, LogIn } from "lucide-react";
import { SITE, waLink } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "عن الدكتور" },
  { to: "/services", label: "الخدمات" },
  { to: "/consultation", label: "استشر الدكتور" },
  { to: "/store", label: "المتجر" },
  { to: "/blog", label: "المعرفة والوقاية" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-deep grid size-10 place-items-center rounded-xl"><Bug className="size-5" /></span>
          <span className="leading-tight">
            <span className="block font-extrabold text-primary-deep">{SITE.name}</span>
            <span className="block text-xs text-muted-foreground">{SITE.brand}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:text-primary-deep"
              activeProps={{ className: "text-primary bg-secondary" }}>{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative rounded-lg p-2 hover:bg-secondary" aria-label="السلة">
            <ShoppingCart className="size-5 text-primary-deep" />
            {count > 0 && <span className="absolute -top-1 -left-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{count}</span>}
          </Link>
          <Link to="/booking" className="btn btn-primary hidden sm:inline-flex">احجز خدمة</Link>
          <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="القائمة">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && (
        <nav className="border-t bg-background px-4 py-3 lg:hidden">
          {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-semibold hover:bg-secondary">{n.label}</Link>)}
          <Link to="/booking" onClick={() => setOpen(false)} className="btn btn-primary mt-2 w-full">احجز خدمة</Link>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-deep mt-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold">{SITE.name}</p>
          <p className="mt-3 text-sm opacity-80">حلول علمية وآمنة لمكافحة الآفات للمنازل والمنشآت، مع استشارات متخصصة ومنتجات موثوقة.</p>
        </div>
        <FooterCol title="روابط" links={[["/services", "الخدمات"], ["/store", "المتجر"], ["/blog", "المعرفة والوقاية"], ["/faq", "الأسئلة الشائعة"]]} />
        <FooterCol title="اطلب الآن" links={[["/booking", "احجز خدمة"], ["/booking", "اطلب معاينة"], ["/quote", "اطلب عرض سعر"], ["/consultation", "استشر الدكتور"]]} />
        <div className="space-y-2 text-sm opacity-90">
          <p className="mb-3 font-bold">تواصل</p>
          <p className="flex items-center gap-2"><Phone className="size-4" /><span dir="ltr">{SITE.phone}</span></p>
          <p className="flex items-center gap-2"><Mail className="size-4" />{SITE.email}</p>
          <p className="flex items-center gap-2"><MapPin className="size-4" />{SITE.address}</p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-4 py-5 text-xs opacity-75">
          <span>© {new Date().getFullYear()} جميع الحقوق محفوظة</span>
          <span className="flex gap-4"><Link to="/privacy">سياسة الخصوصية</Link><Link to="/terms">الشروط والأحكام</Link></span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="text-sm">
      <p className="mb-3 font-bold">{title}</p>
      <ul className="space-y-2 opacity-85">{links.map(([to, l]) => <li key={l}><Link to={to as "/"} className="hover:opacity-100">{l}</Link></li>)}</ul>
    </div>
  );
}

export function WhatsAppFloat() {
  return (
    <a href={waLink()} target="_blank" rel="noreferrer" aria-label="واتساب"
      className="btn-whatsapp fixed bottom-5 left-5 z-50 grid size-14 place-items-center rounded-full shadow-lg transition hover:scale-105">
      <MessageCircle className="size-7" />
    </a>
  );
}

export function PageHero({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="border-b bg-secondary/60">
      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20 fade-up">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-primary-deep md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
        {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="mt-3 text-2xl font-extrabold text-primary-deep md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function Field({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}

export function Success({ title, text }: { title: string; text: string }) {
  return (
    <div className="card-soft mx-auto max-w-xl p-10 text-center fade-up">
      <CheckCircle2 className="mx-auto size-16 text-primary" />
      <h2 className="mt-4 text-2xl font-extrabold text-primary-deep">{title}</h2>
      <p className="mt-3 text-muted-foreground">{text}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp"><MessageCircle className="size-5" />تواصل عبر واتساب</a>
        <Link to="/" className="btn btn-outline">العودة للرئيسية</Link>
      </div>
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 ${className}`}>{children}</div>;
}

export function meta(title: string, description: string) {
  const t = `${title} | ${SITE.brand}`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
