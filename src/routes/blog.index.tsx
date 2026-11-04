import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { articlesOptions } from "@/lib/use-articles";
import { Container, PageHero, meta } from "@/components/site";
import { PostCard } from "@/components/cards";

export const Route = createFileRoute("/blog/")({
  head: () => meta("المعرفة والوقاية", "مقالات علمية ونصائح عملية للوقاية من الحشرات والقوارض في المنازل والمنشآت."),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesOptions),
  component: Blog,
});

function Blog() {
  const { data: posts } = useSuspenseQuery(articlesOptions);
  const cats = [...new Set(posts.map((p) => p.category))];
  const [cat, setCat] = useState<string | null>(null);
  const list = cat ? posts.filter((p) => p.category === cat) : posts;
  return (
    <>
      <PageHero eyebrow="مركز المعرفة" title="المعرفة والوقاية" subtitle="محتوى تعليمي موثوق يساعدك على فهم الآفات والوقاية منها." />
      <Container className="py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          <button onClick={() => setCat(null)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${!cat ? "border-primary bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>الكل</button>
          {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${cat === c ? "border-primary bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{c}</button>)}
        </div>
        {list.length ? <div className="grid gap-6 md:grid-cols-3">{list.map((p) => <PostCard key={p.slug} post={p} />)}</div> : <p className="py-16 text-center text-muted-foreground">لا توجد مقالات في هذا التصنيف بعد.</p>}
      </Container>
    </>
  );
}
