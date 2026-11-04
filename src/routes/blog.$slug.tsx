import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SITE } from "@/lib/data";
import { articlesQuery, toArticle } from "@/lib/use-articles";
import { Container, meta } from "@/components/site";
import { PostCard } from "@/components/cards";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params, context }) => {
    const rows = await context.queryClient.ensureQueryData(articlesQuery);
    const p = rows.map(toArticle).find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => loaderData ? { ...meta(loaderData.title, loaderData.excerpt), meta: [...meta(loaderData.title, loaderData.excerpt).meta.filter((m) => !("property" in m && m.property === "og:type")), { property: "og:type", content: "article" }] } : { meta: [{ title: "غير موجود" }, { name: "robots", content: "noindex" }] },
  component: Article,
});

function Article() {
  const p = Route.useLoaderData();
  const { data: posts } = useSuspenseQuery(articlesOptions);
  const related = posts.filter((x) => x.slug !== p.slug).slice(0, 3);
  return (
    <article>
      <Container className="max-w-3xl py-14">
        <span className="eyebrow">{p.category}</span>
        <h1 className="mt-4 text-3xl font-extrabold leading-snug text-primary-deep md:text-4xl">{p.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{SITE.name} · {new Date(p.date).toLocaleDateString("ar-EG", { dateStyle: "long" })} · {p.minutes} دقائق قراءة</p>
        <img src={p.image} alt={p.title} className="mt-8 aspect-video w-full rounded-3xl object-cover" />
        <div className="mt-8 space-y-5 text-lg leading-loose">{p.body.map((b, i) => <p key={i}>{b}</p>)}</div>
        <div className="card-soft mt-10 flex flex-wrap items-center justify-between gap-4 bg-secondary p-6">
          <p className="font-bold text-primary-deep">هل تواجه هذه المشكلة؟</p>
          <div className="flex gap-2"><Link to="/consultation" className="btn btn-primary">استشر الدكتور</Link><Link to="/booking" className="btn btn-outline">اطلب معاينة</Link></div>
        </div>
      </Container>
      <Container className="pb-8">
        <h2 className="mb-6 text-2xl font-extrabold text-primary-deep">مقالات ذات صلة</h2>
        <div className="grid gap-6 md:grid-cols-3">{related.map((r) => <PostCard key={r.slug} post={r} />)}</div>
      </Container>
    </article>
  );
}
