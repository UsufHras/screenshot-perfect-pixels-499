import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useSubmissions, kindLabel, orderTotal, NoAccess, type Submission } from "@/components/admin/submissions";
import { products, posts, fmt } from "@/lib/data";
import { ShoppingBag, Sparkles, Stethoscope, CalendarCheck, Package, AlertTriangle, Users, FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  head: () => ({ meta: [{ title: "الرئيسية — لوحة التحكم" }] }),
  component: Dashboard,
});

function series(list: Submission[], days: number, value: (s: Submission) => number) {
  const out: { day: string; v: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
    const next = new Date(d); next.setDate(d.getDate() + 1);
    const v = list.filter((s) => { const t = new Date(s.created_at); return t >= d && t < next; }).reduce((a, s) => a + value(s), 0);
    out.push({ day: d.toLocaleDateString("ar-EG", { day: "numeric", month: "short" }), v });
  }
  return out;
}

function Dashboard() {
  const { data, isLoading, error } = useSubmissions();
  const [days, setDays] = useState(7);
  if (error) return <NoAccess />;
  const all = data ?? [];
  const orders = all.filter((s) => s.kind === "order");
  const consults = all.filter((s) => s.kind === "consultation");
  const services = all.filter((s) => s.kind === "booking" || s.kind === "quote");
  const customers = new Set(all.map((s) => s.phone).filter(Boolean)).size;
  const p = products as unknown as { inStock?: boolean }[];

  const stats = [
    { label: "إجمالي الطلبات", v: orders.length, icon: ShoppingBag },
    { label: "طلبات جديدة", v: orders.filter((s) => s.status === "new").length, icon: Sparkles },
    { label: "الاستشارات الجديدة", v: consults.filter((s) => s.status === "new").length, icon: Stethoscope },
    { label: "طلبات الخدمات الجديدة", v: services.filter((s) => s.status === "new").length, icon: CalendarCheck },
    { label: "إجمالي المنتجات", v: products.length, icon: Package },
    { label: "منتجات غير متوفرة", v: p.filter((x) => x.inStock === false).length, icon: AlertTriangle },
    { label: "عدد العملاء", v: customers, icon: Users },
    { label: "المقالات المنشورة", v: posts.length, icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-soft p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary"><s.icon className="size-4" /></span>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-primary-deep">{isLoading ? "…" : s.v}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {[7, 30].map((d) => (
          <button key={d} onClick={() => setDays(d)} className={`rounded-full border px-4 py-1.5 text-sm font-bold ${days === d ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>آخر {d} يوم</button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Chart title="الطلبات" data={series(orders, days, () => 1)} />
        <Chart title="المبيعات (ج.م)" data={series(orders, days, orderTotal)} line />
        <Chart title="طلبات الاستشارة" data={series(consults, days, () => 1)} />
        <div className="card-soft p-5">
          <h3 className="mb-4 font-extrabold">آخر النشاطات</h3>
          <ul className="space-y-3">
            {all.slice(0, 8).map((s) => (
              <li key={s.id} className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-primary-deep">{kindLabel[s.kind]}</span>
                <span className="font-semibold">{s.name ?? "بدون اسم"}</span>
                {s.kind === "order" && <span className="text-muted-foreground">{fmt(orderTotal(s))}</span>}
                <span className="mr-auto text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString("ar-EG")}</span>
              </li>
            ))}
            {!all.length && <li className="text-sm text-muted-foreground">لا يوجد نشاط بعد.</li>}
          </ul>
          <Link to="/admin/consultations" className="mt-4 inline-block text-sm font-bold text-primary">عرض الاستشارات ←</Link>
        </div>
      </div>
    </div>
  );
}

function Chart({ title, data, line }: { title: string; data: { day: string; v: number }[]; line?: boolean }) {
  return (
    <div className="card-soft p-5">
      <h3 className="mb-4 font-extrabold">{title}</h3>
      <div className="h-56" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          {line ? (
            <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="day" fontSize={11} /><YAxis fontSize={11} allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="v" name={title} stroke="var(--primary)" strokeWidth={2} /></LineChart>
          ) : (
            <BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="day" fontSize={11} /><YAxis fontSize={11} allowDecimals={false} /><Tooltip /><Bar dataKey="v" name={title} fill="var(--primary)" radius={[6, 6, 0, 0]} /></BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
