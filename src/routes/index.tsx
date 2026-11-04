import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShieldCheck, Microscope, Building2, RefreshCcw, Stethoscope, MessageCircle, ArrowLeft } from "lucide-react";
import { images, services, process, waLink } from "@/lib/data";
import { productsOptions } from "@/lib/use-products";
import { articlesOptions } from "@/lib/use-articles";
import { Container, SectionTitle, meta } from "@/components/site";
import { ServiceCard, ProductCard, PostCard } from "@/components/cards";

export const Route = createFileRoute("/")({
  head: () => meta("حلول علمية وآمنة لمكافحة الآفات", "استشارات متخصصة، مكافحة احترافية، ومنتجات فعالة لحماية منزلك ومنشأتك من الآفات."),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsOptions),
  component: Index,
});

const trust = [
  { icon: Microscope, t: "خبرة متخصصة" }, { icon: ShieldCheck, t: "حلول آمنة" },
  { icon: Building2, t: "خدمة للمنازل والشركات" }, { icon: RefreshCcw, t: "متابعة بعد الخدمة" },
  { icon: Stethoscope, t: "استشارات متخصصة" },
];

function Index() {
  const { data: products } = useSuspenseQuery(productsOptions);
  return (
    <>
      <section className="relative overflow-hidden">
        <Container className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-24">
          <div className="fade-up">
            <span className="eyebrow">خبير مكافحة الآفات</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.25] text-primary-deep md:text-6xl">حلول علمية وآمنة لمكافحة الآفات</h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">استشارات متخصصة، مكافحة احترافية، ومنتجات فعالة لحماية منزلك ومنشأتك من الآفات.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/booking" className="btn btn-primary">احجز خدمة</Link>
              <Link to="/consultation" className="btn btn-outline">استشر الدكتور</Link>
              <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp"><MessageCircle className="size-5" />واتساب</a>
            </div>
          </div>
          <div className="relative fade-up">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-accent" />
            <img src={images.hero} alt="أخصائي مكافحة آفات يفحص مطبخًا" width={1280} height={960} className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl" />
          </div>
        </Container>
      </section>

      <section className="border-y bg-card">
        <Container className="grid grid-cols-2 gap-6 py-8 md:grid-cols-5">
          {trust.map(({ icon: I, t }) => (
            <div key={t} className="flex items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><I className="size-5" /></span><span className="font-bold text-primary-deep">{t}</span></div>
          ))}
        </Container>
      </section>

      <Container className="py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="خدماتنا" title="خدمات مكافحة الآفات" subtitle="حلول مصممة حسب نوع الآفة وطبيعة المكان." />
          <Link to="/services" className="mb-10 inline-flex items-center gap-1 font-bold text-primary">كل الخدمات <ArrowLeft className="size-4" /></Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{services.map((s) => <ServiceCard key={s.slug} s={s} />)}</div>
      </Container>

      <section className="bg-deep">
        <Container className="py-20">
          <h2 className="text-3xl font-extrabold md:text-4xl">منهجنا العلمي في المكافحة</h2>
          <p className="mt-3 max-w-2xl opacity-80">المكافحة ليست مجرد رش مبيدات، بل تشخيص وفهم لسلوك الآفة ومصدرها ثم اختيار الحل المناسب ومنع العودة.</p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {process.map((p, i) => (
              <li key={p} className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6">
                <span className="text-3xl font-extrabold opacity-50">0{i + 1}</span>
                <p className="mt-2 text-lg font-bold">{p}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Container className="grid items-center gap-12 py-20 md:grid-cols-2">
        <img src={images.doctor} alt="الدكتور" loading="lazy" width={960} height={1200} className="mx-auto aspect-[4/5] w-full max-w-md rounded-3xl object-cover" />
        <div>
          <span className="eyebrow">عن الدكتور</span>
          <h2 className="mt-3 text-3xl font-extrabold text-primary-deep md:text-4xl">استشارة متخصصة قبل أي معالجة</h2>
          <p className="mt-4 text-muted-foreground">خبير في علم الحشرات ومكافحة الآفات، يقدم تشخيصًا دقيقًا وخطط مكافحة متكاملة للمنازل والمنشآت التجارية والصناعية.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/about" className="btn btn-outline">تعرف على الدكتور</Link>
            <Link to="/consultation" className="btn btn-primary">استشر الدكتور</Link>
          </div>
        </div>
      </Container>

      <section className="bg-secondary/60">
        <Container className="py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="المتجر" title="منتجات مكافحة موثوقة" subtitle="منتجات مختارة بعناية مع إرشادات استخدام آمنة." />
            <Link to="/store" className="mb-10 inline-flex items-center gap-1 font-bold text-primary">تسوق المنتجات <ArrowLeft className="size-4" /></Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        </Container>
      </section>

      <Container className="py-20">
        <SectionTitle eyebrow="المعرفة والوقاية" title="مقالات تساعدك على الوقاية" />
        <div className="grid gap-6 md:grid-cols-3">{posts.slice(0, 3).map((p) => <PostCard key={p.slug} post={p} />)}</div>
      </Container>

      <Container>
        <div className="bg-deep relative overflow-hidden rounded-3xl p-10 md:p-14">
          <h2 className="text-3xl font-extrabold">هل لديك منشأة تجارية؟</h2>
          <p className="mt-3 max-w-xl opacity-85">برامج وقائية دورية موثقة للمطاعم والفنادق والمصانع والمخازن.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/quote" className="btn btn-light">اطلب عرض سعر</Link>
            <Link to="/booking" className="btn btn-whatsapp">اطلب معاينة</Link>
          </div>
        </div>
      </Container>
    </>
  );
}
