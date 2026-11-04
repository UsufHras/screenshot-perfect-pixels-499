import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createArticle, updateArticle, deleteArticle, type ArticleInput } from "@/lib/articles.functions";
import { useArticleRows, toArticle } from "@/lib/use-articles";
import { supabase } from "@/integrations/supabase/client";
import { blogCategories, type Post } from "@/lib/data";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { NoAccess } from "./submissions";

type FormState = {
  title: string; slug: string; category: string; excerpt: string;
  minutes: string; date: string; body: string;
};

const emptyForm: FormState = {
  title: "", slug: "", category: "", excerpt: "", minutes: "5",
  date: new Date().toISOString().slice(0, 10), body: "",
};

function toForm(p: Post): FormState {
  return {
    title: p.title, slug: p.slug, category: p.category, excerpt: p.excerpt,
    minutes: String(p.minutes), date: p.date, body: p.body.join("\n\n"),
  };
}

function payload(f: FormState, imageUrl: string): ArticleInput {
  return {
    title: f.title.trim(),
    category: f.category.trim(),
    excerpt: f.excerpt.trim(),
    minutes: Number(f.minutes) || 5,
    publishedOn: f.date || new Date().toISOString().slice(0, 10),
    imageUrl,
    body: f.body.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
  };
}

type Editing = { id: string | null; imagePath: string; form: FormState };

export function ArticlesAdmin() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Editing | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: rows, isLoading, error: accessError } = useArticleRows();
  const articles = (rows ?? []).map(toArticle);
  const pathBySlug = new Map((rows ?? []).map((r) => [r.slug, r.image_url]));
  const idBySlug = new Map((rows ?? []).map((r) => [r.slug, r.id]));
  const categoryOptions = [...new Set([...(rows ?? []).map((r) => r.category), ...blogCategories])];

  const startAdd = () => { setFile(null); setEditing({ id: null, imagePath: "", form: { ...emptyForm } }); };
  const startEdit = (p: Post) => {
    setFile(null);
    setEditing({ id: p.slug, imagePath: pathBySlug.get(p.slug) ?? "", form: toForm(p) });
  };

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["articles"] });

  const save = async () => {
    if (!editing) return;
    const f = editing.form;
    if (!f.title.trim()) { setError("العنوان مطلوب."); return; }
    setBusy(true); setError(null);
    try {
      let imagePath = editing.imagePath;
      if (file) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const path = `article-${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("products").upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        imagePath = path;
      }
      if (editing.id) {
        await updateArticle({ data: { id: idBySlug.get(editing.id)!, ...payload(f, imagePath) } });
      } else {
        const slug = f.slug.trim();
        await createArticle({ data: slug ? { slug, ...payload(f, imagePath) } : payload(f, imagePath) });
      }
      setEditing(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر الحفظ.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: Post) => {
    if (!confirm(`حذف المقال "${p.title}"؟`)) return;
    setBusy(true);
    try {
      await deleteArticle({ data: { id: idBySlug.get(p.slug)! } });
      await refresh();
    } finally { setBusy(false); }
  };

  if (accessError) return <NoAccess />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-deep">المقالات</h1>
          <p className="mt-1 text-sm text-muted-foreground">اكتب مقالات مركز المعرفة وانشرها، وستظهر فورًا في صفحة المعرفة والوقاية.</p>
        </div>
        <button onClick={startAdd} className="btn btn-primary"><Plus className="size-4" />مقال جديد</button>
      </div>

      {isLoading && <p className="py-16 text-center text-muted-foreground">جارٍ التحميل...</p>}
      {!isLoading && articles.length === 0 && (
        <p className="card-soft py-16 text-center text-muted-foreground">لا توجد مقالات بعد. اكتب أول مقال.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((p) => (
          <div key={p.slug} className="card-soft flex gap-4 p-4">
            <img src={p.image} alt={p.title} className="size-20 shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-extrabold text-primary-deep">{p.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{p.category}</p>
              <p className="mt-1 text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString("ar-EG", { dateStyle: "long" })}</p>
              <div className="mt-2 flex gap-1.5">
                <button onClick={() => startEdit(p)} className="btn btn-outline !p-2" aria-label="تعديل"><Pencil className="size-4" /></button>
                <button onClick={() => remove(p)} disabled={busy} className="btn btn-outline !p-2 text-destructive" aria-label="حذف"><Trash2 className="size-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-foreground/40 p-4" onClick={() => !busy && setEditing(null)}>
          <div className="card-soft mx-auto my-8 max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-primary-deep">{editing.id ? "تعديل مقال" : "مقال جديد"}</h2>
              <button onClick={() => setEditing(null)} className="p-1" aria-label="إغلاق"><X className="size-5" /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">العنوان *</span>
                <input className="field" value={editing.form.title} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, title: e.target.value } })} /></label>
              <label><span className="mb-1 block text-sm font-bold">التصنيف</span>
                <input className="field" list="article-cats" value={editing.form.category} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, category: e.target.value } })} />
                <datalist id="article-cats">{categoryOptions.map((c) => <option key={c} value={c} />)}</datalist></label>
              <label><span className="mb-1 block text-sm font-bold">الرابط اللطيف (بالإنجليزية، اختياري)</span>
                <input className="field" dir="ltr" value={editing.form.slug} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, slug: e.target.value } })} /></label>
              <label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">وصف مختصر</span>
                <textarea className="field" rows={2} value={editing.form.excerpt} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, excerpt: e.target.value } })} /></label>
              <label><span className="mb-1 block text-sm font-bold">مدة القراءة (دقائق)</span>
                <input className="field" type="number" min="1" value={editing.form.minutes} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, minutes: e.target.value } })} /></label>
              <label><span className="mb-1 block text-sm font-bold">تاريخ النشر</span>
                <input className="field" type="date" value={editing.form.date} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, date: e.target.value } })} /></label>
              <label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">نص المقال (اترك سطرًا فارغًا بين الفقرات)</span>
                <textarea className="field" rows={10} value={editing.form.body} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, body: e.target.value } })} /></label>
              <label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">صورة المقال</span>
                <input type="file" accept="image/*" className="field" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
            </div>
            {error && <p className="mt-3 text-sm font-bold text-destructive">{error}</p>}
            <div className="mt-5 flex gap-2">
              <button onClick={save} disabled={busy} className="btn btn-primary flex-1">{busy ? "جارٍ الحفظ..." : "حفظ"}</button>
              <button onClick={() => setEditing(null)} disabled={busy} className="btn btn-outline">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
