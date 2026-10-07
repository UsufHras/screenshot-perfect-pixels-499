import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, AlertCircle, HelpCircle, ShieldCheck } from "lucide-react";
import { services, process } from "@/lib/data";
import { Container, meta } from "@/components/site";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const s = services.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    return s;
  },
  head: ({ loaderData }) => loaderData ? meta(loaderData.title, loaderData.short) : { meta: [{ title: "غير موجود" }, { name: "robots", content: "noindex" }] },
  component: ServiceDetail,
});

function List({ title, items, icon: I }: { title: string; items: string[]; icon: typeof CheckCircle2 }) {
  return (
    <div className="card-soft p-6">
      <h2 className="text-xl font-extrabold text-primary-deep">{title}</h2>
      <ul className="mt-4 space-y-2">{items.map((x) => <li key={x} className="flex gap-2"><I className="mt-0.5 size-5 shrink-0 text-primary" />{x}</li>)}</ul>
    </div>
  );
}

function ServiceDetail() {
  const s = Route.useLoaderData();
  return (
    <>
      <section className="relative">
        <img src={s.image} alt={s.title} className="h-[420px] w-full object-cover" />
        <div className="bg-deep absolute inset-0 opacity-80" />
        <Container className="absolute inset-0 flex flex-col justify-end pb-12 text-primary-foreground">
          <h1 className="text-4xl font-extrabold md:text-5xl">{s.title}</h1>
          <p className="mt-3 max-w-2xl text-lg opacity-90">{s.short}</p>
          <div className="mt-6 flex gap-3"><Link to="/booking" className="btn btn-light">احجز الخدمة</Link><Link to="/consultation" className="btn btn-whatsapp">استشر الدكتور</Link></div>
        </Container>
      </section>
      <Container className="space-y-8 py-16">
        <div className="max-w-3xl"><h2 className="text-2xl font-extrabold text-primary-deep">وصف المشكلة</h2><p className="mt-3 text-muted-foreground">{s.description}</p></div>
        <div className="grid gap-6 md:grid-cols-2">
          <List title="علامات الإصابة" items={s.signs} icon={AlertCircle} />
          <List title="لماذا تحدث المشكلة؟" items={s.causes} icon={HelpCircle} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-primary-deep">خطوات المعالجة</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {process.map((p, i) => <li key={p} className="card-soft flex items-center gap-4 p-5"><span className="bg-deep grid size-10 shrink-0 place-items-center rounded-full font-extrabold">{i + 1}</span><span className="font-bold">{p}</span></li>)}
          </ol>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <List title="احتياطات السلامة" items={s.safety} icon={ShieldCheck} />
          <List title="النتائج المتوقعة والمتابعة" items={s.results} icon={CheckCircle2} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-primary-deep">أسئلة شائعة</h2>
          <div className="mt-4 space-y-3">{s.faq.map((f) => <details key={f.q} className="card-soft p-5"><summary className="cursor-pointer font-bold">{f.q}</summary><p className="mt-2 text-muted-foreground">{f.a}</p></details>)}</div>
        </div>
        <div className="bg-deep flex flex-wrap items-center justify-between gap-4 rounded-3xl p-10">
          <h2 className="text-2xl font-extrabold">جاهز للتخلص من المشكلة؟</h2>
          <Link to="/booking" className="btn btn-light">احجز الخدمة الآن</Link>
        </div>
      </Container>
    </>
  );
}
