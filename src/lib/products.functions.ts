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

export type ProductInput = {
  name: string;
  category: string;
  short: string;
  usePlace: string;
  pests: string[];
  price: number;
  available: boolean;
  regulated: boolean;
  imageUrl: string;
  usage: string;
  safety: string[];
  storageNote: string;
};

function toRow(input: ProductInput) {
  return {
    name: input.name,
    category: input.category || "متنوع",
    short: input.short,
    use_place: input.usePlace,
    pests: input.pests,
    price: input.price,
    available: input.available,
    regulated: input.regulated,
    image_url: input.imageUrl,
    usage: input.usage,
    safety: input.safety,
    storage_note: input.storageNote,
  };
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
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
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
});

export const createProduct = createServerFn({ method: "POST" })
  .inputValidator((input: ProductInput & { slug?: string }) => input)
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data: input }) => {
    await assertAdmin(context.supabase, context.userId);
    const slug = input.slug?.trim() || `p-${Date.now().toString(36)}`;
    const { data, error } = await context.supabase
      .from("products")
      .insert({ slug, ...toRow(input) })
      .select()
      .single();
    if (error) throw error;
    return data;
  });

export const updateProduct = createServerFn({ method: "POST" })
  .inputValidator((input: ProductInput & { id: string }) => input)
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data: input }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("products")
      .update({ ...toRow(input), updated_at: new Date().toISOString() })
      .eq("id", input.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string }) => input)
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data: input }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("products").delete().eq("id", input.id);
    if (error) throw error;
    return { ok: true };
  });
