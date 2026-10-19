import { useEffect, useState } from "react";
import { Download, Lock } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { PremiumModal } from "@/components/PremiumModal";
import { listPrintables, getDownloadUrl, type Printable } from "@/services/printables";
import { useUser } from "@/hooks/use-session";
import { track } from "@/services/analytics";

const KIND_LABEL: Record<string, string> = { colorear: "Para colorear", laberinto: "Laberinto", "une-los-puntos": "Une los puntos", recortables: "Para recortar" };

export function PrintablesPage() {
  const user = useUser();
  const [items, setItems] = useState<Printable[] | null>(null);
  const [modal, setModal] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { void listPrintables().then(setItems); }, []);

  async function download(p: Printable) {
    if (p.premium && !user?.premium) return setModal(true);
    setBusy(p.slug);
    setError(null);
    const res = await getDownloadUrl(p.filePath);
    setBusy(null);
    if (res.error || !res.url) return setError(res.error);
    track("printable_downloaded", { slug: p.slug });
    window.location.href = res.url;
  }

  return (
    <AppLayout>
      <h1 className="text-[34px] md:text-[46px]">Pequeños artistas</h1>
      <p className="mt-2 max-w-[48ch] text-lg text-ink/75">Imprime y juega lejos de la pantalla: para colorear, laberintos, une los puntos y recortables. En blanco y negro, para ahorrar tinta.</p>
      {error && <p role="alert" className="mt-4 text-destructive">{error}</p>}
      {!items && <p className="mt-8 text-ink/70">Cargando imprimibles…</p>}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(items ?? []).map((p) => {
          const locked = p.premium && !user?.premium;
          return (
            <article key={p.id} className="flex flex-col overflow-hidden rounded-[24px] border border-border bg-white">
              <div className="relative bg-light p-4">
                <img src={`/images/imprimibles/${p.slug}.webp`} alt={`Vista previa: ${p.title}`} width={420} height={594} loading="lazy" className="mx-auto h-56 w-auto rounded-lg border border-border bg-white object-contain" />
                {!p.premium && <span className="absolute right-3 top-3 rounded-full bg-age-4 px-3 py-1 text-[13px] font-bold">Gratis</span>}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[14px] font-semibold text-ink/70">{KIND_LABEL[p.kind] ?? p.kind} · {p.minAge === p.maxAge ? `${p.minAge} años` : `${p.minAge} a ${p.maxAge} años`}</p>
                <h2 className="mt-1 text-[21px] leading-tight">{p.title}</h2>
                <p className="mt-2 flex-1 text-[15px] text-ink/75">{p.description}</p>
                <button type="button" onClick={() => download(p)} disabled={busy === p.slug}
                  className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 font-bold text-white disabled:opacity-60">
                  {locked ? <><Lock className="h-4 w-4" /> Desbloquear</> : <><Download className="h-4 w-4" /> {busy === p.slug ? "Preparando…" : "Descargar PDF"}</>}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <PremiumModal open={modal} onOpenChange={setModal} />
    </AppLayout>
  );
}
