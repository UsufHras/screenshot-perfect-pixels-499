import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createProduct, updateProduct, deleteProduct, type ProductInput } from "@/lib/products.functions";
import { productsQueryOptions, productImageUrl } from "@/lib/use-products";
import { supabase } from "@/integrations/supabase/client";
import { fmt, type Product } from "@/lib/data";
import { Plus, Pencil, Trash2, X, Package } from "lucide-react";
import { NoAccess } from "./submissions";

type FormState = {
  name: string; slug: string; category: string; short: string; usePlace: string;
  pests: string; price: string; usage: string; safety: string; storage: string;
  available: boolean; regulated: boolean;
};

const emptyForm: FormState = {
  name: "", slug: "", category: "", short: "", usePlace: "", pests: "", price: "",
  usage: "", safety: "", storage: "", available: true, regulated: false,
};

function toForm(p: Product): FormState {
  return {
    name: p.name, slug: p.slug, category: p.category, short: p.short, usePlace: p.use,
    pests: p.pests.join("، "), price: String(p.price), usage: p.usage,
    safety: p.safety.join("\n"), storage: p.storage, available: p.available, regulated: !!p.regulated,
  };
}

function payload(f: FormState, imageUrl: string): ProductInput {
  return {
    name: f.name.trim(),
    category: f.category.trim(),
    short: f.short.trim(),
    usePlace: f.usePlace.trim(),
    pests: f.pests.split(/[,،]/).map((s) => s.trim()).filter(Boolean),
    price: Number(f.price) || 0,
    available: f.available,
    regulated: f.regulated,
    imageUrl,
    usage: f.usage.trim(),
    safety: f.safety.split("\n").map((s) => s.trim()).filter(Boolean),
    storageNote: f.storage.trim(),
  };
}

export function ProductsAdmin() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<{ id?: string; image: string; form: FormState } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, error: accessError } = useProductsSafe();
  const products = data ?? [];
  const categoryOptions = [...new Set(products.map((p) => p.category))];

  const startAdd = () => { setFile(null); setEditing({ image: "", form: { ...emptyForm } }); };
  const startEdit = (p: Product) => {
    setFile(null);
    setEditing({ id: p.slug, image: p.image.startsWith("/api/") ? "" : p.image, form: toForm(p) });
  };

  const refresh = () => queryClient.invalidateQueries({ queryKey: productsQueryOptions.queryKey });

  const save = async () => {
    if (!editing) return;
    const f = editing.form;
    if (!f.name.trim() || !f.price) { setError("الاسم والسعر مطلوبان."); return; }
    setBusy(true); setError(null);
    try {
      let imageUrl = "";
      if (file) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("products").upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        imageUrl = path;
      } else if (editing.id && editing.image.startsWith("blob:")) {
        // image removed / replaced but no new file chosen: keep the old stored path
        imageUrl = storedPath(editing.form.slug);
      } else {
        imageUrl = editing.image;
      }
      if (editing.id) await updateProduct({ data: { id: editing.id, ...payload(f, imageUrl) } });
      else await createProduct({ data: { slug: f.slug.trim() || undefined, ...payload(f, imageUrl) } });
      setEditing(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر الحفظ.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: Product) => {
    if (!confirm(`حذف المنتج "${p.name}"؟`)) return;
    setBusy(true);
    try {
      await deleteProduct({ data: { id: p.slug } });
      await refresh();
    } finally { setBusy(false); }
  };

  if (accessError) return <NoAccess />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-deep">المنتجات</h1>
          <p className="mt-1 text-sm text-muted-foreground">أضف منتجات المتجر وعدّل أسعارها وتوفرها، وستظهر فورًا في الموقع.</p>
        </div>
        <button onClick={startAdd} className="btn btn-primary"><Plus className="size-4" />منتج جديد</button>
      </div>

      {isLoading && <p className="py-16 text-center text-muted-foreground">جارٍ التحميل...</p>}
      {!isLoading && products.length === 0 && (
        <p className="card-soft py-16 text-center text-muted-foreground">لا توجد منتجات بعد. أضف أول منتج.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p.slug} className="card-soft flex gap-4 p-4">
            <img src={p.image} alt={p.name} className="size-20 shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-extrabold text-primary-deep">{p.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{p.category}</p>
              <p className="mt-1 text-sm font-bold">{fmt(p.price)}</p>
              <p className={`text-xs font-bold ${p.available ? "text-primary" : "text-destructive"}`}>{p.available ? "متوفر" : "غير متوفر"}</p>
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
              <h2 className="text-lg font-extrabold text-primary-deep">{editing.id ? "تعديل منتج" : "منتج جديد"}</h2>
              <button onClick={() => setEditing(null)} className="p-1" aria-label="إغلاق"><X className="size-5" /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">الاسم *</span>
                <input className="field" value={editing.form.name} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, name: e.target.value } })} /></label>
              <label><span className="mb-1 block text-sm font-bold">القسم</span>
                <input className="field" list="product-cats" value={editing.form.category} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, category: e.target.value } })} />
                <datalist id="product-cats">{categoryOptions.map((c) => <option key={c} value={c} />)}</datalist></label>
              <label><span className="mb-1 block text-sm font-bold">السعر (ج.م) *</span>
                <input className="field" type="number" min="0" value={editing.form.price} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, price: e.target.value } })} /></label>
              <label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">وصف قصير</span>
                <input className="field" value={editing.form.short} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, short: e.target.value } })} /></label>
              <label><span className="mb-1 block text-sm font-bold">الاستخدامات المناسبة</span>
                <input className="field" value={editing.form.usePlace} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, usePlace: e.target.value } })} /></label>
              <label><span className="mb-1 block text-sm font-bold">الآفات المستهدفة (مفصولة بفاصلة)</span>
                <input className="field" value={editing.form.pests} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, pests: e.target.value } })} /></label>
              <label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">طريقة الاستخدام</span>
                <textarea className="field" rows={2} value={editing.form.usage} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, usage: e.target.value } })} /></label>
              <label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">احتياطات السلامة (سطر لكل احتياط)</span>
                <textarea className="field" rows={3} value={editing.form.safety} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, safety: e.target.value } })} /></label>
              <label><span className="mb-1 block text-sm font-bold">التخزين</span>
                <input className="field" value={editing.form.storage} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, storage: e.target.value } })} /></label>
              <label><span className="mb-1 block text-sm font-bold">صورة المنتج</span>
                <input type="file" accept="image/*" className="field" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
              <div className="flex items-center gap-6 sm:col-span-2">
                <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={editing.form.available} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, available: e.target.checked } })} />متوفر</label>
                <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={editing.form.regulated} onChange={(e) => setEditing({ ...editing, form: { ...editing.form, regulated: e.target.checked } })} />للاستخدام المهني</label>
              </div>
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

// Product.slug doubles as the products.id lookup because the admin list maps
// rows through toProduct(), which drops the uuid. Keep lookups keyed by slug.
function storedPath(_slug: string) { return ""; }

function useProductsSafe() {
  return useProductsHook();
}

import { useProducts as useProductsHook } from "@/lib/use-products";
