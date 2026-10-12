import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listSubmissions, updateSubmissionStatus, getAttachmentUrls } from "@/lib/admin.functions";
import { ChevronDown, Paperclip, Search, MessageCircle, Phone } from "lucide-react";

export type Submission = {
  id: string;
  kind: string;
  name: string | null;
  phone: string | null;
  data: Record<string, unknown>;
  status: string;
  created_at: string;
};

export const kindLabel: Record<string, string> = {
  booking: "حجز / معاينة",
  consultation: "استشارة",
  quote: "عرض سعر",
  contact: "رسالة",
  order: "طلب متجر",
};

export const statuses = [
  { key: "new", label: "جديد" },
  { key: "in_progress", label: "قيد المتابعة" },
  { key: "done", label: "مكتمل" },
  { key: "cancelled", label: "ملغي" },
] as const;

export function useSubmissions() {
  return useQuery<Submission[]>({
    queryKey: ["admin-submissions"],
    queryFn: () => listSubmissions() as Promise<Submission[]>,
  });
}

export function orderTotal(s: Submission) {
  const t = Number((s.data as Record<string, unknown>)?.["total"]);
  return Number.isFinite(t) ? t : 0;
}

export function SubmissionsPage({ title, subtitle, kinds }: { title: string; subtitle: string; kinds: string[] }) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useSubmissions();
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const mine = (data ?? []).filter((s) => kinds.includes(s.kind));
  const filtered = mine.filter((s) =>
    (status === "all" || s.status === status) &&
    (!q || `${s.name ?? ""} ${s.phone ?? ""} ${JSON.stringify(s.data)}`.toLowerCase().includes(q.toLowerCase())),
  );
  const count = (k: string) => mine.filter((s) => s.status === k).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-primary-deep">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {[{ key: "all", label: "الكل" }, ...statuses].map((st) => (
          <button key={st.key} onClick={() => setStatus(st.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${status === st.key ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"}`}>
            {st.label} ({st.key === "all" ? mine.length : count(st.key)})
          </button>
        ))}
        <div className="relative mr-auto w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث بالاسم أو الهاتف..." className="field pr-9" />
        </div>
      </div>

      {isLoading && <p className="py-16 text-center text-muted-foreground">جارٍ التحميل...</p>}
      {error && <NoAccess />}
      {!isLoading && !error && filtered.length === 0 && (
        <p className="card-soft py-16 text-center text-muted-foreground">لا توجد عناصر هنا بعد.</p>
      )}
      <div className="space-y-3">
        {filtered.map((s) => (
          <SubmissionCard key={s.id} s={s} open={openId === s.id}
            onToggle={() => setOpenId(openId === s.id ? null : s.id)}
            onStatus={async (st) => {
              await updateSubmissionStatus({ data: { id: s.id, status: st } });
              queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
            }} />
        ))}
      </div>
    </div>
  );
}

export function NoAccess() {
  return (
    <div className="card-soft mx-auto max-w-lg p-8 text-center">
      <p className="font-bold text-destructive">لا تملك صلاحية الوصول لهذه اللوحة.</p>
      <p className="mt-2 text-sm text-muted-foreground">هذا الحساب ليس حساب إدارة.</p>
    </div>
  );
}

function SubmissionCard({ s, open, onToggle, onStatus }: {
  s: Submission; open: boolean; onToggle: () => void; onStatus: (status: string) => void;
}) {
  const [urls, setUrls] = useState<Record<string, string> | null>(null);
  const attachments = Array.isArray(s.data?.["attachments"]) ? (s.data["attachments"] as string[]) : [];
  const entries = Object.entries(s.data ?? {}).filter(([k]) => k !== "attachments");
  const st = statuses.find((x) => x.key === s.status) ?? statuses[0];
  const wa = s.phone ? `https://wa.me/${s.phone.replace(/\D/g, "").replace(/^0/, "20")}` : null;

  const toggle = async () => {
    onToggle();
    if (!open && attachments.length && !urls) setUrls(await getAttachmentUrls({ data: { paths: attachments } }));
  };

  return (
    <div className="card-soft overflow-hidden">
      <button onClick={toggle} className="flex w-full flex-wrap items-center gap-3 p-4 text-right">
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary-deep">{kindLabel[s.kind] ?? s.kind}</span>
        <span className="font-bold">{s.name ?? "بدون اسم"}</span>
        {s.phone && <span className="text-sm text-muted-foreground" dir="ltr">{s.phone}</span>}
        <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString("ar-EG")}</span>
        <span className={`mr-auto rounded-full px-3 py-1 text-xs font-bold ${s.status === "new" ? "bg-warning-soft text-warning" : s.status === "done" ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}>{st.label}</span>
        <ChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t p-4">
          {s.phone && (
            <div className="mb-4 flex flex-wrap gap-2">
              <a href={`tel:${s.phone}`} className="btn btn-outline text-xs"><Phone className="size-4" />اتصال</a>
              {wa && <a href={wa} target="_blank" rel="noreferrer" className="btn btn-whatsapp text-xs"><MessageCircle className="size-4" />واتساب</a>}
            </div>
          )}
          <dl className="grid gap-3 md:grid-cols-2">
            {entries.map(([k, v]) => (
              <div key={k} className="rounded-xl bg-muted/60 p-3">
                <dt className="text-xs font-bold text-muted-foreground">{k}</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm font-semibold">{typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)}</dd>
              </div>
            ))}
          </dl>
          {attachments.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 flex items-center gap-1 text-sm font-bold"><Paperclip className="size-4" />المرفقات ({attachments.length})</p>
              <div className="flex flex-wrap gap-2">
                {attachments.map((p) => (
                  <a key={p} href={urls?.[p] ?? "#"} target="_blank" rel="noreferrer"
                    className={`btn btn-outline text-xs ${urls?.[p] ? "" : "pointer-events-none opacity-50"}`}>{p.split("/").pop()}</a>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold">تغيير الحالة:</span>
            {statuses.map((x) => (
              <button key={x.key} onClick={() => onStatus(x.key)} disabled={x.key === s.status}
                className={`rounded-full border px-3 py-1 text-xs font-bold transition ${x.key === s.status ? "border-primary bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{x.label}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
