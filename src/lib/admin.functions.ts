import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type RpcFn = (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;

async function assertAdmin(supabase: { rpc: unknown }, userId: string) {
  const rpc = supabase.rpc as RpcFn;
  const { data, error } = await rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || data !== true) throw new Error("Forbidden: admin access required");
}

export const listSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return data;
  });

export const updateSubmissionStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; status: string }) => input)
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data: input }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("submissions")
      .update({ status: input.status })
      .eq("id", input.id);
    if (error) throw error;
    return { ok: true };
  });

export const getAttachmentUrls = createServerFn({ method: "GET" })
  .inputValidator((input: { paths: string[] }) => input)
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data: input }) => {
    await assertAdmin(context.supabase, context.userId);
    const urls: Record<string, string> = {};
    for (const path of input.paths.slice(0, 20)) {
      const { data } = await context.supabase.storage.from("attachments").createSignedUrl(path, 3600);
      if (data?.signedUrl) urls[path] = data.signedUrl;
    }
    return urls;
  });
