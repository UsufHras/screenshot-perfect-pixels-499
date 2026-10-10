import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { listSubmissions, updateSubmissionStatus, getAttachmentUrls } from "@/lib/admin.functions";
import { Container, meta } from "@/components/site";
import { ChevronDown, LogOut, Paperclip } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => meta("لوحة الطلبات", "عرض وإدارة الطلبات والحجوزات والرسائل الواردة."),
  component: AdminPage,
});

const kinds = [
  { key: "all", label: "الكل" },
  { key: "booking", label: "حجوزات" },
  { key: "consultation", label: "استشارات" },
  { key: "quote", label: "عروض أسعار" },
  { key: "contact", label: "رسائل" },
  { key: "order", label: "طلبات المتجر" },
] as const;

const kindLabel: Record<string, string> = Object.fromEntries(kinds.map((k) => [k.key, k.label]));

const statuses = [
  { key: "new", label: "جديد" },
  { key: "in_progress", label: "قيد المتابعة" },
  { key: "done", label: "مكتمل" },
  { key: "cancelled", label: "ملغي" },
] as const;

type Submission = {
  id: string;
  kind: string;
  name: string | null;
  phone: string | null;
  data: Record<string, unknown>;
  status: string;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const { data: submissions, isLoading, error } = useQuery<Submission[]>({
    queryKey: ["admin-submissions"],
    queryFn: () => listSubmissions() as Promise<Submission[]>,
  });

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const filtered = (submissions ?? []).filter((s) => filter === "all" || s.kind === filter);
  const counts = (submissions ?? []).reduce<Record<string, number>>((acc, s) => {
    acc[s.kind] = (acc[s.kind] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <Container className="py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-deep">لوحة الطلبات</h1>
          <p className="mt-1 text-sm text-muted-foreground">كل الحجوزات والاستشارات والرسائل والطلبات الواردة.</p>
        </div>
        <button onClick={signOut} className="btn btn-outline"><LogOut className="size-4" />تسجيل الخروج</button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {kinds.map((k) => (
          <button key={k.key} onClick={() => setFilter(k.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${filter === k.key ? "border-primary bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
            {k.label}{k.key !== "all" && counts[k.key] ? ` (${counts[k.key]})` : ""}
          </button>
        ))}
      </div>

      {isLoading && <p className="py-16 text-center text-muted-foreground">جارٍ تحميل الطلبات...</p>}
      {error && (
        <div className="card-soft mx-auto max-w-lg p-8 text-center">
          <p className="font-bold text-destructive">لا تملك صلاحية الوصول لهذه اللوحة بعد.</p>
          <p className="mt-2 text-sm text-muted-foreground">هذا الحساب ليس حساب إدارة. تواصل مع مطوّر الموقع لمنحك صلاحية الإدارة.</p>
        </div>
      )}
      {!isLoading && !error && filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">لا توجد طلبات في هذا القسم بعد.</p>
      )}

      <div className="space-y-3">
        {filtered.map((s) => (
          <SubmissionCard key={s.id} s={s} open={openId === s.id}
            onToggle={() => setOpenId(openId === s.id ? null : s.id)}
            onStatus={async (status) => {
              await updateSubmissionStatus({ data: { id: s.id, status } });
              queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
            }} />
        ))}
      </div>
    </Container>
  );
}

function SubmissionCard({ s, open, onToggle, onStatus }: {
  s: Submission; open: boolean; onToggle: () => void; onStatus: (status: string) => void;
}) {
  const [urls, setUrls] = useState<Record<string, string> | null>(null);
  const attachments = Array.isArray(s.data?.["attachments"]) ? (s.data["attachments"] as string[]) : [];
  const entries = Object.entries(s.data ?? {}).filter(([k]) => k !== "attachments");

  const toggle = async () => {
    onToggle();
    if (!open && attachments.length && !urls) {
      setUrls(await getAttachmentUrls({ data: { paths: attachments } }));
    }
  };

  const status = statuses.find((st) => st.key === s.status) ?? statuses[0];

  return (
    <div className="card-soft overflow-hidden">
      <button onClick={toggle} className="flex w-full flex-wrap items-center gap-3 p-4 text-right">
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary-deep">{kindLabel[s.kind] ?? s.kind}</span>
        <span className="font-bold">{s.name ?? "بدون اسم"}</span>
        {s.phone && <span className="text-sm text-muted-foreground" dir="ltr">{s.phone}</span>}
        <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString("ar-EG")}</span>
        <span className={`mr-auto rounded-full px-3 py-1 text-xs font-bold ${s.status === "new" ? "bg-warning-soft text-warning" : s.status === "done" ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}>{status.label}</span>
        <ChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t p-4">
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
                    className={`btn btn-outline text-xs ${urls?.[p] ? "" : "pointer-events-none opacity-50"}`}>
                    {p.split("/").pop()}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold">تغيير الحالة:</span>
            {statuses.map((st) => (
              <button key={st.key} onClick={() => onStatus(st.key)} disabled={st.key === s.status}
                className={`rounded-full border px-3 py-1 text-xs font-bold transition ${st.key === s.status ? "border-primary bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                {st.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
