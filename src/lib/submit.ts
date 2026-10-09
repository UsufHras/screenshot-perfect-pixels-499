import { supabase } from "@/integrations/supabase/client";

export type Kind = "booking" | "consultation" | "quote" | "contact" | "order";

/** Reads every field in the form, keyed by its visible label, and saves it. */
export function readForm(form: HTMLFormElement) {
  const data: Record<string, string> = {};
  form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea").forEach((el) => {
    if (el.type === "file" || el.type === "radio") return;
    const label = el.closest("label")?.querySelector("span")?.textContent?.trim() || el.closest("label")?.textContent?.trim() || el.name;
    if (!label) return;
    data[label] = el.type === "checkbox" ? ((el as HTMLInputElement).checked ? "نعم" : "لا") : el.value;
  });
  return data;
}

export async function saveSubmission(kind: Kind, data: Record<string, unknown>) {
  const name = (data["الاسم"] ?? data["الشخص المسؤول"] ?? null) as string | null;
  const phone = (data["رقم الهاتف"] ?? data["الهاتف"] ?? null) as string | null;
  const { error } = await supabase.from("submissions").insert({ kind, name, phone, data: data as never });
  if (error) throw error;
}
