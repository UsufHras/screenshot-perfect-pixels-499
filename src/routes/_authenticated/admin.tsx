import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSubmissions } from "@/components/admin/submissions";
import {
  LayoutDashboard, Stethoscope, CalendarCheck, ShoppingBag, Package, Wrench, FileText,
  Users, Star, Mail, BarChart3, Settings, LogOut, Menu, X, Bell, ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "لوحة التحكم" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { to: "/admin/consultations", label: "الاستشارات", icon: Stethoscope, kinds: ["consultation"] },
  { to: "/admin/bookings", label: "طلبات الخدمات", icon: CalendarCheck, kinds: ["booking", "quote"] },
  { to: "/admin/orders", label: "الطلبات", icon: ShoppingBag, kinds: ["order"] },
  { to: "/admin/products", label: "المنتجات", icon: Package },
  { to: "/admin/messages", label: "الرسائل", icon: Mail, kinds: ["contact"] },
] as const;

const soon = [
  { label: "الخدمات", icon: Wrench },
  { label: "المقالات", icon: FileText },
  { label: "العملاء", icon: Users },
  { label: "التقييمات", icon: Star },
  { label: "التقارير", icon: BarChart3 },
  { label: "الإعدادات", icon: Settings },
];

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { data } = useSubmissions();
  const newCount = (kinds: readonly string[]) => (data ?? []).filter((s) => kinds.includes(s.kind) && s.status === "new").length;
  const totalNew = (data ?? []).filter((s) => s.status === "new").length;

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? "")); }, []);
  useEffect(() => setOpen(false), [pathname]);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const title = nav.find((n) => pathname.startsWith(n.to))?.label ?? "لوحة التحكم";

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 p-4">
      <div className="mb-6 px-2 text-lg font-extrabold">لوحة التحكم</div>
      {nav.map((n) => {
        const active = pathname.startsWith(n.to);
        const c = "kinds" in n ? newCount(n.kinds) : 0;
        return (
          <Link key={n.to} to={n.to}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-primary text-primary-foreground" : "opacity-85 hover:bg-primary-foreground/10"}`}>
            <n.icon className="size-4" />{n.label}
            {c > 0 && <span className="mr-auto rounded-full bg-warning px-2 text-xs text-primary-foreground">{c}</span>}
          </Link>
        );
      })}
      <div className="mt-4 px-3 text-xs opacity-60">قريباً</div>
      {soon.map((n) => (
        <span key={n.label} className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2 text-sm opacity-50">
          <n.icon className="size-4" />{n.label}
        </span>
      ))}
      <a href="/" target="_blank" className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm opacity-85 hover:bg-primary-foreground/10">
        <ExternalLink className="size-4" />عرض الموقع
      </a>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="bg-deep sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="bg-deep absolute inset-y-0 right-0 w-72 overflow-y-auto">
            <button onClick={() => setOpen(false)} className="absolute left-3 top-3 p-2" aria-label="إغلاق"><X className="size-5" /></button>
            {sidebar}
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-card px-4 md:px-6">
          <button onClick={() => setOpen(true)} className="p-2 lg:hidden" aria-label="القائمة"><Menu className="size-5" /></button>
          <h2 className="text-lg font-extrabold text-primary-deep">{title}</h2>
          <div className="mr-auto flex items-center gap-2">
            <Link to="/admin/dashboard" className="relative rounded-full p-2 hover:bg-secondary" aria-label="الإشعارات">
              <Bell className="size-5" />
              {totalNew > 0 && <span className="absolute -top-0.5 -left-0.5 grid size-5 place-items-center rounded-full bg-warning text-[10px] font-bold text-primary-foreground">{totalNew}</span>}
            </Link>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{email.charAt(0).toUpperCase() || "د"}</span>
              <span className="text-sm text-muted-foreground" dir="ltr">{email}</span>
            </div>
            <button onClick={signOut} className="btn btn-outline text-xs"><LogOut className="size-4" /><span className="hidden sm:inline">خروج</span></button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
