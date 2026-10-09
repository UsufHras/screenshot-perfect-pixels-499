import { createFileRoute } from "@tanstack/react-router";
import { useSubmit } from "@/lib/use-submit";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { SITE, waLink } from "@/lib/data";
import { Container, PageHero, Field, Success, meta } from "@/components/site";

export const Route = createFileRoute("/contact")({
  head: () => meta("تواصل معنا", "تواصل معنا عبر الهاتف أو واتساب أو البريد الإلكتروني."),
  component: Contact,
});

function Contact() {
  const { done, loading, error, onSubmit } = useSubmit("contact");
  return (
    <>
      <PageHero eyebrow="تواصل" title="تواصل معنا" subtitle="نسعد بالرد على استفساراتك في أسرع وقت." />
      <Container className="grid gap-8 py-14 lg:grid-cols-3">
        <div className="space-y-4">
          {[{ i: Phone, l: "الهاتف", v: SITE.phone }, { i: Mail, l: "البريد", v: SITE.email }, { i: MapPin, l: "العنوان", v: SITE.address }].map(({ i: I, l, v }) => (
            <div key={l} className="card-soft flex items-center gap-4 p-5"><I className="size-6 text-primary" /><div><p className="text-sm text-muted-foreground">{l}</p><p className="font-bold" dir="auto">{v}</p></div></div>
          ))}
          <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp w-full"><MessageCircle className="size-5" />راسلنا على واتساب</a>
        </div>
        <div className="lg:col-span-2">
          {done ? <Success title="تم إرسال رسالتك" text="سنتواصل معك قريبًا." /> : (
            <form onSubmit={onSubmit} className="card-soft grid gap-5 p-6 md:grid-cols-2">
              <Field label="الاسم"><input required className="field" /></Field>
              <Field label="الهاتف"><input required type="tel" className="field" /></Field>
              <Field label="البريد الإلكتروني" full><input type="email" className="field" /></Field>
              <Field label="الرسالة" full><textarea required rows={5} className="field" /></Field>
              {error && <p className="text-sm font-semibold text-destructive md:col-span-2">{error}</p>}<button disabled={loading} className="btn btn-primary md:col-span-2">{loading ? "جارٍ الإرسال..." : "إرسال"}</button>
            </form>
          )}
        </div>
      </Container>
    </>
  );
}
