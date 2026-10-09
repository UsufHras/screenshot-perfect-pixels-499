import { useState, type FormEvent } from "react";
import { readForm, saveSubmission, type Kind } from "./submit";

export function useSubmit(kind: Kind, extra?: () => Record<string, unknown>) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await saveSubmission(kind, { ...readForm(e.currentTarget), ...(extra?.() ?? {}) });
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("تعذر إرسال الطلب، يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.");
    } finally { setLoading(false); }
  };
  return { done, loading, error, onSubmit };
}
