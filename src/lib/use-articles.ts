import { queryOptions, useQuery } from "@tanstack/react-query";
import { listArticles } from "./articles.functions";
import { posts, type Post } from "./data";
import type { Database } from "@/integrations/supabase/types";

export type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

// Sample-article images are bundled assets, not storage objects; keep them as
// a fallback so seeded rows without an uploaded photo still show their image.
const fallbackImageBySlug = new Map(posts.map((p) => [p.slug, p.image]));

export function toArticle(row: ArticleRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    minutes: row.minutes,
    date: row.published_on,
    image: row.image_url ? `/api/public/product-image?path=${encodeURIComponent(row.image_url)}` : (fallbackImageBySlug.get(row.slug) ?? posts[0].image),
    body: row.body ?? [],
  };
}

export const articlesQuery = queryOptions({
  queryKey: ["articles"],
  queryFn: () => listArticles() as Promise<ArticleRow[]>,
});

export const articlesOptions = queryOptions({
  ...articlesQuery,
  select: (rows: ArticleRow[]) => rows.map(toArticle),
});

export function useArticleRows() {
  return useQuery(articlesQuery);
}

export function useArticles() {
  return useQuery(articlesOptions);
}
