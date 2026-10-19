import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Lock, Pause, Volume2 } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { Character } from "@/components/Characters";
import { PremiumModal } from "@/components/PremiumModal";
import { Button, buttonClass } from "@/components/Button";
import { personalize, type Story } from "@/services/stories";
import { useChild } from "@/hooks/use-session";
import { ageInfo } from "@/lib/ages";
import { track } from "@/services/analytics";
import { cn } from "@/lib/utils";

/** Lee en voz alta con la voz del celular o computador (sin grabaciones ni reproducción automática). */
function useReadAloud() {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const [speaking, setSpeaking] = useState(false);
  function stop() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }
  function speak(text: string) {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-CO";
    u.rate = 0.9;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("es"));
    if (voice) u.voice = voice;
    u.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }
  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [supported]);
  return { supported, speaking, speak, stop };
}

export function StoryPage({ story }: { story: Story }) {
  const child = useChild();
  const [page, setPage] = useState(0);
  const [modal, setModal] = useState(story.locked);
  const voice = useReadAloud();
  const info = ageInfo(story.characterAge);
  const total = story.pages.length;
  const atEnd = page >= total;

  useEffect(() => { track("story_started", { slug: story.slug }); }, [story.slug]);
  useEffect(() => { voice.stop(); /* al cambiar de página se detiene la voz */ }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  if (story.locked) {
    return (
      <AppLayout>
        <Link to="/cuentos" className="inline-flex items-center gap-1 font-semibold underline underline-offset-4"><ArrowLeft className="h-4 w-4" /> Cuentos</Link>
        <div className={cn("mt-6 flex flex-col items-center rounded-[32px] p-8 text-center", info.soft)}>
          <Character age={story.characterAge} className="w-32" title="" />
          <h1 className="mt-4 text-[32px] md:text-[42px]">{story.title}</h1>
          <p className="mt-3 max-w-[44ch] text-lg">{personalize(story.summary, child?.name)}</p>
          <p className="mt-6 inline-flex items-center gap-2 font-semibold"><Lock className="h-5 w-5" /> Este cuento es parte de Planecitos completo.</p>
          <Button className="mt-5" size="lg" onClick={() => setModal(true)}>Desbloquear los cuentos</Button>
        </div>
        <PremiumModal open={modal} onOpenChange={setModal} />
      </AppLayout>
    );
  }

  const text = atEnd ? "" : personalize(story.pages[page]!, child?.name);

  return (
    <AppLayout>
      <Link to="/cuentos" className="inline-flex items-center gap-1 font-semibold underline underline-offset-4"><ArrowLeft className="h-4 w-4" /> Cuentos</Link>
      <article className={cn("mt-5 flex min-h-[460px] flex-col rounded-[32px] p-6 md:p-10", info.soft)}>
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold">{story.title}</p>
          <p className="text-[15px] font-semibold text-ink/70">{atEnd ? "Fin" : `${page + 1} de ${total}`}</p>
        </div>
        {!atEnd ? (
          <>
            <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8 text-center">
              {page === 0 && <Character age={story.characterAge} className="w-28" title="" />}
              <p className="max-w-[30ch] font-display text-[26px] font-bold leading-snug md:text-[32px]">{text}</p>
            </div>
            {voice.supported && (
              <div className="flex justify-center">
                <button type="button" onClick={() => (voice.speaking ? voice.stop() : voice.speak(text))}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 font-bold">
                  {voice.speaking ? <><Pause className="h-5 w-5" /> Pausar</> : <><Volume2 className="h-5 w-5" /> Escuchar esta página</>}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-col justify-center gap-6 py-6">
            <div className="flex justify-center"><Character age={story.characterAge} className="w-28" title="" /></div>
            <div className="rounded-3xl bg-white p-6">
              <h2 className="text-[22px]">Para conversar</h2>
              <p className="mt-2 text-lg">{personalize(story.question, child?.name)}</p>
            </div>
            <div className="rounded-3xl bg-white p-6">
              <h2 className="text-[22px]">Después del cuento, a jugar</h2>
              <p className="mt-2 text-lg">{personalize(story.game, child?.name)}</p>
              {story.activitySlug && (
                <Link to="/planecito/$slug" params={{ slug: story.activitySlug }} className={buttonClass({ className: "mt-4" })}>Ver el planecito</Link>
              )}
            </div>
          </div>
        )}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-ink bg-white px-5 font-bold disabled:opacity-40">
            <ArrowLeft className="h-5 w-5" /> Atrás
          </button>
          {atEnd ? (
            <button type="button" onClick={() => setPage(0)} className="inline-flex min-h-12 items-center rounded-full bg-ink px-5 font-bold text-white">Leer otra vez</button>
          ) : (
            <button type="button" onClick={() => { setPage((p) => p + 1); if (page + 1 === total) track("story_completed", { slug: story.slug }); }}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 font-bold text-white">
              Siguiente <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </article>
      {!child && <p className="mt-4 text-[15px] text-ink/70">Consejo: cuando registres el apodo de tu hijo, el cuento usará su nombre.</p>}
    </AppLayout>
  );
}
