import { createFileRoute, Link } from "@tanstack/react-router";
import { faqs } from "@/lib/data";
import { Container, PageHero, meta } from "@/components/site";

export const Route = createFileRoute("/faq")({
  head: () => meta("الأسئلة الشائعة", "إجابات عن أكثر الأسئلة شيوعًا حول خدمات مكافحة الآفات والسلامة."),
  component: () => (
    <>
      <PageHero eyebrow="مساعدة" title="الأسئلة الشائعة" />
      <Container className="max-w-3xl space-y-3 py-14">
        {faqs.map((f) => <details key={f.q} className="card-soft p-5"><summary className="cursor-pointer font-bold text-primary-deep">{f.q}</summary><p className="mt-3 text-muted-foreground">{f.a}</p></details>)}
        <div className="pt-6 text-center"><p className="text-muted-foreground">لم تجد إجابتك؟</p><Link to="/consultation" className="btn btn-primary mt-3">استشر الدكتور</Link></div>
      </Container>
    </>
  ),
});
