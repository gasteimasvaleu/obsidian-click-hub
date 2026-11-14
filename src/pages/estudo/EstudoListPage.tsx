import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Loader2, Send } from "lucide-react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { BubbleSection, SPLIT_BAR } from "@/components/ui/bubble-section";
import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { ArrowNavButton } from "@/components/plataforma/BackArrowButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAIConsent } from "@/hooks/useAIConsent";
import { AIConsentDialog } from "@/components/AIConsentDialog";
import { toast } from "sonner";
import topo from "@/assets/estudo/topo.png";
import { ESTUDO_TEMAS, AUDIENCE_LABEL, firstPrompt, type Audience } from "@/lib/estudoTemas";

type Study = { id: string; title: string; audience: string; updated_at: string };
type Book = { id: string; name: string; chapters_count: number; book_order: number };

const db = supabase as any;

export default function EstudoListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [audience, setAudience] = useState<Audience>(() => (localStorage.getItem("estudo_audience") as Audience) || "kids");
  const [studies, setStudies] = useState<Study[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [bookId, setBookId] = useState("");
  const [chapter, setChapter] = useState("");
  const [question, setQuestion] = useState("");
  const [creating, setCreating] = useState(false);
  const { showConsent, setShowConsent, acceptConsent, requireConsent } = useAIConsent();
  const [pending, setPending] = useState<null | (() => void)>(null);

  useEffect(() => { localStorage.setItem("estudo_audience", audience); }, [audience]);

  useEffect(() => {
    if (!user) return;
    db.from("bible_studies").select("id,title,audience,updated_at").order("updated_at", { ascending: false })
      .then(({ data }: any) => setStudies(data ?? []));
    supabase.from("bible_books").select("id,name,chapters_count,book_order").order("book_order")
      .then(({ data }) => setBooks((data as Book[]) ?? []));
  }, [user]);

  const start = (type: "theme" | "passage" | "free", ref: string, title: string) => {
    const run = async () => {
      if (!user || creating) return;
      setCreating(true);
      const { data, error } = await db.from("bible_studies")
        .insert({ user_id: user.id, title: title.slice(0, 80), audience, source_type: type, source_ref: ref })
        .select("id").single();
      setCreating(false);
      if (error || !data) { toast.error("Não consegui criar o estudo. Tente de novo."); return; }
      navigate(`/estudo/${data.id}`, { state: { firstMessage: firstPrompt(type, ref) } });
    };
    setPending(() => run);
    requireConsent(run);
  };

  const remove = async (id: string) => {
    const { error } = await db.from("bible_studies").delete().eq("id", id);
    if (error) { toast.error("Não consegui apagar."); return; }
    setStudies((s) => s.filter((x) => x.id !== id));
  };

  const book = books.find((b) => b.id === bookId);

  return (
    <div className="min-h-screen bg-background pb-28">
      <FuturisticNavbar />
      <main className="container mx-auto max-w-[58rem] px-4 pt-20">
        <BubbleSection title="Estudo Bíblico" as="h1">
          <div className="flex items-center gap-4">
            <img src={topo} alt="" width={256} height={256} className="h-24 w-24 shrink-0 object-contain" />
            <p className="text-sm text-muted-foreground">
              Converse com o Frei Gilsinho sobre a Bíblia e a fé católica. Escolha um tema, um trecho ou faça sua pergunta.
            </p>
          </div>
          <p className="mb-2 mt-4 text-xs font-semibold text-foreground">Linguagem do estudo</p>
          <div className={SPLIT_BAR}>
            {(["kids", "parents"] as Audience[]).map((a) => (
              <button key={a} type="button" onClick={() => setAudience(a)}
                className={`h-11 flex-1 text-sm transition-colors ${audience === a ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-muted/50"}`}>
                {AUDIENCE_LABEL[a]}
              </button>
            ))}
          </div>
        </BubbleSection>

        <SectionHeader title="Temas prontos" description="Toque em um tema para começar" />
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ESTUDO_TEMAS.map((t) => (
            <button key={t.id} type="button" disabled={creating} onClick={() => start("theme", t.title, t.title)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center transition-transform active:scale-95 disabled:opacity-60">
              <img src={t.image} alt="" loading="lazy" width={256} height={256} className="h-20 w-20 object-contain" />
              <span className="text-sm font-semibold text-foreground">{t.title}</span>
            </button>
          ))}
        </div>

        <BubbleSection title="Estudar um trecho">
          <div className="grid grid-cols-[1fr_7rem] gap-2">
            <Select value={bookId} onValueChange={(v) => { setBookId(v); setChapter(""); }}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Livro" /></SelectTrigger>
              <SelectContent className="max-h-72">{books.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={chapter} onValueChange={setChapter} disabled={!book}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Cap." /></SelectTrigger>
              <SelectContent className="max-h-72">
                {book && Array.from({ length: book.chapters_count }, (_, i) => <SelectItem key={i} value={String(i + 1)}>{i + 1}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <ArrowNavButton direction="right" label="Começar estudo" className="mt-3"
            disabled={!book || !chapter || creating}
            onClick={() => book && start("passage", `${book.name} ${chapter}`, `${book.name} ${chapter}`)} />
        </BubbleSection>

        <BubbleSection title="Pergunta livre">
          <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={500}
            placeholder="Ex.: Por que Jesus chamou Deus de Pai?" className="min-h-[88px] text-base" />
          <button type="button" disabled={!question.trim() || creating}
            onClick={() => start("free", question.trim(), question.trim())}
            className={`${SPLIT_BAR} mt-3 h-11 items-center justify-center gap-2 text-sm font-semibold text-primary disabled:opacity-50`}>
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Perguntar
          </button>
        </BubbleSection>

        <BubbleSection title="Meus estudos">
          {studies.length === 0 ? (
            <p className="text-sm text-muted-foreground">Seus estudos aparecem aqui para você continuar depois.</p>
          ) : (
            <ul className="divide-y divide-border">
              {studies.map((s) => (
                <li key={s.id} className="flex items-center gap-2 py-2">
                  <button type="button" onClick={() => navigate(`/estudo/${s.id}`)} className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-semibold text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {AUDIENCE_LABEL[(s.audience as Audience)] ?? ""} · {new Date(s.updated_at).toLocaleDateString("pt-BR")}
                    </p>
                  </button>
                  <button type="button" aria-label="Apagar estudo" onClick={() => remove(s.id)}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </BubbleSection>
      </main>
      <AIConsentDialog open={showConsent} onAccept={() => { acceptConsent(); pending?.(); }} onCancel={() => setShowConsent(false)} />
    </div>
  );
}
