import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero, meta } from "@/components/site";

export const Route = createFileRoute("/privacy")({
  head: () => meta("سياسة الخصوصية", "كيف نجمع بياناتك ونستخدمها ونحميها."),
  component: () => (
    <>
      <PageHero title="سياسة الخصوصية" />
      <Container className="max-w-3xl space-y-6 py-14 leading-loose text-muted-foreground">
        <p>نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.</p>
        <h2 className="text-xl font-extrabold text-primary-deep">البيانات التي نجمعها</h2>
        <p>الاسم ورقم الهاتف والعنوان والبريد الإلكتروني والصور التي ترسلها لغرض تقديم الخدمة أو الاستشارة.</p>
        <h2 className="text-xl font-extrabold text-primary-deep">كيف نستخدمها</h2>
        <p>للتواصل معك وتنفيذ الخدمات والطلبات وتحسين تجربتك فقط، ولا نشاركها مع أي طرف ثالث دون موافقتك.</p>
        <h2 className="text-xl font-extrabold text-primary-deep">التواصل</h2>
        <p>لأي استفسار حول الخصوصية يرجى التواصل معنا عبر صفحة تواصل معنا.</p>
      </Container>
    </>
  ),
});
