import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

async function assertAdmin(supabase: { from: (t: string) => any }, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden: admin access required");
}

export type ArticleInput = {
  title: string;
  category: string;
  excerpt: string;
  minutes: number;
  publishedOn: string;
  imageUrl: string;
  body: string[];
};

function toRow(input: ArticleInput) {
  return {
    title: input.title,
    category: input.category || "الوقاية",
    excerpt: input.excerpt,
    minutes: Math.max(1, Math.round(input.minutes) || 5),
    published_on: input.publishedOn || new Date().toISOString().slice(0, 10),
    image_url: input.imageUrl,
    body: input.body,
  };
}

export const listArticles = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const supabasePublic = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: { fetch: (input, init) => {
      const h = new Headers(init?.headers);
      if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
      h.set("apikey", key);
      return fetch(input, { ...init, headers: h });
    } },
  });
  const { data, error } = await supabasePublic
    .from("articles")
    .select("*")
    .order("published_on", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
});

export const createArticle = createServerFn({ method: "POST" })
  .inputValidator((input: ArticleInput & { slug?: string }) => input)
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data: input }) => {
    await assertAdmin(context.supabase, context.userId);
    const slug = input.slug?.trim() || `a-${Date.now().toString(36)}`;
    const { data, error } = await context.supabase
      .from("articles")
      .insert({ slug, ...toRow(input) })
      .select()
      .single();
    if (error) throw error;
    return data;
  });

export const updateArticle = createServerFn({ method: "POST" })
  .inputValidator((input: ArticleInput & { id: string }) => input)
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data: input }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("articles")
      .update({ ...toRow(input), updated_at: new Date().toISOString() })
      .eq("id", input.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteArticle = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string }) => input)
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data: input }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("articles").delete().eq("id", input.id);
    if (error) throw error;
    return { ok: true };
  });
