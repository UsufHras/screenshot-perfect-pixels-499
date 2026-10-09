import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { readForm, saveSubmission, type Kind } from "./submit";

async function uploadFiles(kind: Kind, form: HTMLFormElement) {
  const paths: string[] = [];
  const inputs = form.querySelectorAll<HTMLInputElement>('input[type="file"]');
  for (const input of inputs) {
    for (const file of Array.from(input.files ?? [])) {
      const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
      const path = `${kind}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("attachments").upload(path, file, { contentType: file.type });
      if (error) throw error;
      paths.push(path);
    }
  }
  return paths;
}

export function useSubmit(kind: Kind, extra?: () => Record<string, unknown>) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true); setError(null);
    try {
      const attachments = await uploadFiles(kind, form);
      await saveSubmission(kind, { ...readForm(form), ...(extra?.() ?? {}), ...(attachments.length ? { attachments } : {}) });
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("تعذر إرسال الطلب، يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.");
    } finally { setLoading(false); }
  };
  return { done, loading, error, onSubmit };
}
