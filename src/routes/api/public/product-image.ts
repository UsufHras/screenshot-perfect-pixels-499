import { createFileRoute } from "@tanstack/react-router";

// Public read-only streaming endpoint for product photos stored in the
// private "products" bucket. Only serves safe object paths from that bucket.
export const Route = createFileRoute("/api/public/product-image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const path = new URL(request.url).searchParams.get("path") ?? "";
        if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,200}$/.test(path)) {
          return new Response("Not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("products").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: {
            "content-type": data.type || "application/octet-stream",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
