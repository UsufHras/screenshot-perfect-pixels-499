import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Target, Search, Lightbulb, ShieldCheck } from "lucide-react";
import { doctorExperience, doctorQualifications, images, servedSectors, SITE } from "@/lib/data";
import { Container, meta } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => meta("عن الدكتور", "تعرف على خبرة ومؤهلات الدكتور المتخصص في علم الحشرات ومكافحة الآفات."),
  component: About,
});

const stats = [
  { value: doctorExperience, label: "خبرة في الإدارة المتكاملة للآفات" },
  { value: "دكتوراه", label: "علوم زراعية – قسم الحشرات" },
  { value: "منازل ومنشآت", label: "قطاعات متنوعة" },
];
const why = [
  { i: Search, t: "تحديد الآفة بدقة", d: "التعرف على النوع الصحيح هو أساس اختيار العلاج." },
  { i: Target, t: "فهم المصدر والسلوك", d: "معرفة سبب الإصابة يمنع تكرارها." },
  { i: Lightbulb, t: "اختيار الطريقة المناسبة", d: "ليس كل مشكلة تحتاج إلى مبيد كيميائي." },
  { i: ShieldCheck, t: "منع العودة", d: "خطة وقائية ومتابعة بعد الخدمة." },
];

function About() {
  return (
    <>
      <Container className="grid items-center gap-12 py-16 md:grid-cols-5">
        <img src={images.doctor} alt={SITE.name} width={960} height={1200} className="aspect-[4/5] w-full rounded-3xl object-cover md:col-span-2" />
        <div className="md:col-span-3 fade-up">
          <span className="eyebrow">عن الدكتور</span>
          <h1 className="mt-4 text-4xl font-extrabold text-primary-deep">{SITE.name}</h1>
          <p className="mt-2 text-lg font-semibold text-primary">{SITE.title}</p>
          <p className="mt-5 text-muted-foreground">متخصص في الإدارة المتكاملة للآفات، بخبرة {doctorExperience} ومؤهلات أكاديمية في علوم زراعية – قسم الحشرات. يقدم تشخيصًا وخطط مكافحة متخصصة للمنازل والمنشآت.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {doctorQualifications.map((q) => (
              <div key={q} className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-semibold"><GraduationCap className="size-5 text-primary" />{q}</div>
            ))}
          </div>
          <div className="mt-8 flex gap-3"><Link to="/consultation" className="btn btn-primary">استشر الدكتور</Link><Link to="/booking" className="btn btn-outline">احجز خدمة</Link></div>
        </div>
      </Container>

      <section className="border-y bg-card">
        <Container className="grid gap-6 py-10 sm:grid-cols-3">
          {stats.map(({ value, label }) => <div key={label} className="text-center"><p className="text-2xl font-extrabold text-primary">{value}</p><p className="mt-2 text-sm font-semibold text-muted-foreground">{label}</p></div>)}
        </Container>
      </section>

      <Container className="pt-12">
        <p className="font-bold text-primary-deep">المنشآت والقطاعات التي نخدمها</p>
        <p className="mt-2 text-muted-foreground">{servedSectors}</p>
      </Container>

      <Container className="py-20">
        <h2 className="text-3xl font-extrabold text-primary-deep">لماذا تختار الاستشارة المتخصصة؟</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">مكافحة الآفات لا تعني مجرد رش المواد الكيميائية، بل هي عملية علمية تبدأ بالتشخيص وتنتهي بالوقاية.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {why.map(({ i: I, t, d }) => (
            <div key={t} className="card-soft p-6"><I className="size-8 text-primary" /><h3 className="mt-4 font-extrabold text-primary-deep">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </Container>
    </>
  );
}
