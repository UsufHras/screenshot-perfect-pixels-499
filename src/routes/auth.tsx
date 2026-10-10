import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Container, PageHero, Field, meta } from "@/components/site";

export const Route = createFileRoute("/auth")({
  head: () => meta("تسجيل الدخول", "تسجيل دخول الإدارة للاطلاع على الطلبات والحجوزات."),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setLoading(true); setError(null); setNotice(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setNotice("تم إنشاء الحساب. إن طُلب تأكيد البريد، افتح الرابط في بريدك ثم سجّل الدخول.");
        setMode("signin");
      }
    } catch (err) {
      console.error(err);
      setError(mode === "signin" ? "بيانات الدخول غير صحيحة أو الحساب غير مؤكد بعد." : "تعذر إنشاء الحساب، جرّب بريدًا آخر أو كلمة مرور أقوى.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <PageHero eyebrow="منطقة الإدارة" title="تسجيل الدخول" subtitle="هذه الصفحة مخصصة لإدارة العيادة للاطلاع على الطلبات والحجوزات." />
      <Container className="py-16">
        <form onSubmit={onSubmit} className="card-soft mx-auto max-w-md space-y-5 p-8">
          <Field label="البريد الإلكتروني"><input name="email" required type="email" className="field" dir="ltr" /></Field>
          <Field label="كلمة المرور"><input name="password" required type="password" minLength={6} className="field" dir="ltr" /></Field>
          {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
          {notice && <p className="text-sm font-semibold text-primary">{notice}</p>}
          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? "جارٍ المعالجة..." : mode === "signin" ? "دخول" : "إنشاء حساب"}
          </button>
          <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setNotice(null); }}
            className="w-full text-center text-sm font-semibold text-primary hover:underline">
            {mode === "signin" ? "ليس لديك حساب؟ أنشئ حسابًا" : "لديك حساب بالفعل؟ سجّل الدخول"}
          </button>
        </form>
      </Container>
    </>
  );
}
