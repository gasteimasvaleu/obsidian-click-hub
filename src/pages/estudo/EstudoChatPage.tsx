import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Loader2, Send, ListChecks } from "lucide-react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { BackArrowButton, ArrowNavButton } from "@/components/plataforma/BackArrowButton";
import { BubbleSection, SPLIT_BAR } from "@/components/ui/bubble-section";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { toast } from "sonner";
import topo from "@/assets/estudo/topo.png";
import { AUDIENCE_LABEL, type Audience } from "@/lib/estudoTemas";

type Msg = { role: "user" | "assistant"; content: string };
type Study = { id: string; title: string; audience: Audience };
type Q = { pergunta: string; alternativas: string[]; correta: number; explicacao: string };
type Book = { id: string; name: string };

const db = supabase as any;
const SUGESTOES = ["Explique mais simples", "Me dê um exemplo", "Como aplicar no dia a dia?"];

async function callStudy(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("bible-study-chat", { body });
  if (error) {
    let msg = "Não consegui responder agora. Tente novamente.";
    try { const j = await (error as any).context?.json(); if (j?.error) msg = j.error; } catch { /* noop */ }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);
  return data;
}

function linkifyVerses(text: string, books: Book[]) {
  if (!books.length) return text;
  const names = [...books].sort((a, b) => b.name.length - a.name.length).map((b) => b.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(?<![\\[\\w])(${names.join("|")}) (\\d{1,3})(?:[,:](\\d{1,3}(?:[-–]\\d{1,3})?))?`, "g");
  return text.replace(re, (m, name, cap) => {
    const b = books.find((x) => x.name === name);
    return b ? `[${m}](/biblia/${b.id}/${cap})` : m;
  });
}

export default function EstudoChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addActivity } = useUserProgress();
  const [study, setStudy] = useState<Study | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [quiz, setQuiz] = useState<Q[] | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const firstSent = useRef(false);

  const send = useCallback(async (text: string) => {
    const t = text.trim();
    if (!t || !id || sending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: t }]);
    setSending(true);
    try {
      const data = await callStudy({ study_id: id, message: t });
      setMessages((m) => [...m, { role: "assistant", content: data.response }]);
    } catch (e) {
      setMessages((m) => m.slice(0, -1));
      setInput(t);
      toast.error((e as Error).message);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }, [id, sending]);

  useEffect(() => {
    if (!user || !id) return;
    (async () => {
      const [{ data: s }, { data: msgs }, { data: bk }] = await Promise.all([
        db.from("bible_studies").select("id,title,audience").eq("id", id).maybeSingle(),
        db.from("bible_study_messages").select("role,content").eq("study_id", id).order("created_at"),
        supabase.from("bible_books").select("id,name"),
      ]);
      if (!s) { toast.error("Estudo não encontrado."); navigate("/estudo", { replace: true }); return; }
      setStudy(s); setMessages(msgs ?? []); setBooks((bk as Book[]) ?? []);
      const first = (location.state as any)?.firstMessage as string | undefined;
      if (first && !(msgs ?? []).length && !firstSent.current) {
        firstSent.current = true;
        navigate(location.pathname, { replace: true, state: null });
        send(first);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, sending, quiz, qi]);

  const setAudience = async (a: Audience) => {
    if (!study || study.audience === a) return;
    setStudy({ ...study, audience: a });
    await db.from("bible_studies").update({ audience: a }).eq("id", study.id);
  };

  const startQuiz = async () => {
    if (!id) return;
    setQuizLoading(true);
    try {
      const data = await callStudy({ study_id: id, mode: "quiz" });
      if (!data?.perguntas?.length) throw new Error("Não consegui montar as perguntas. Tente de novo.");
      setQuiz(data.perguntas); setQi(0); setPicked(null); setScore(0);
    } catch (e) { toast.error((e as Error).message); }
    finally { setQuizLoading(false); }
  };

  const pick = (i: number) => {
    if (picked !== null || !quiz) return;
    setPicked(i);
    if (i === quiz[qi].correta) setScore((s) => s + 1);
  };

  const nextQ = () => {
    if (!quiz) return;
    if (qi + 1 < quiz.length) { setQi(qi + 1); setPicked(null); return; }
    setQi(quiz.length);
    if (study) addActivity("bible_study_quiz", study.id, `Revisão: ${study.title}`, score * 5 + 5);
  };

  const rendered = useMemo(() => messages.map((m) => (m.role === "assistant" ? { ...m, content: linkifyVerses(m.content, books) } : m)), [messages, books]);
  const hasAssistant = messages.some((m) => m.role === "assistant");

  return (
    <div className="min-h-screen bg-background pb-40">
      <FuturisticNavbar />
      <main className="container mx-auto max-w-[58rem] px-4 pt-20">
        <BackArrowButton to="/estudo" label="Voltar para Estudo Bíblico" className="mb-4" />
        <BubbleSection title={study?.title ?? "Estudo"} as="h1">
          <div className={SPLIT_BAR}>
            {(["kids", "parents"] as Audience[]).map((a) => (
              <button key={a} type="button" onClick={() => setAudience(a)}
                className={`h-11 flex-1 text-sm transition-colors ${study?.audience === a ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-muted/50"}`}>
                {AUDIENCE_LABEL[a]}
              </button>
            ))}
          </div>
        </BubbleSection>

        <div className="space-y-4">
          {rendered.map((m, i) => m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-primary-foreground">{m.content}</div>
            </div>
          ) : (
            <div key={i} className="flex gap-3">
              <img src={topo} alt="" width={256} height={256} className="h-9 w-9 shrink-0 rounded-full border border-border bg-card object-contain" />
              <div className="prose prose-sm min-w-0 max-w-none text-foreground prose-a:font-semibold prose-a:text-primary prose-strong:text-foreground">
                <ReactMarkdown components={{ a: ({ href, children }) => href?.startsWith("/") ? <Link to={href}>{children}</Link> : <a href={href} target="_blank" rel="noreferrer">{children}</a> }}>
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <img src={topo} alt="" width={256} height={256} className="h-9 w-9 rounded-full border border-border bg-card object-contain" />
              <Loader2 className="h-4 w-4 animate-spin" /> Preparando a resposta...
            </div>
          )}
        </div>

        {hasAssistant && !sending && !quiz && (
          <div className="mt-6 space-y-3">
            <div className="flex flex-wrap gap-2">
              {SUGESTOES.map((s) => (
                <button key={s} type="button" onClick={() => send(s)}
                  className="rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10">{s}</button>
              ))}
            </div>
            <button type="button" onClick={startQuiz} disabled={quizLoading}
              className={`${SPLIT_BAR} h-11 items-center justify-center gap-2 text-sm font-semibold text-primary disabled:opacity-50`}>
              {quizLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListChecks className="h-4 w-4" />} Revisar com perguntinhas
            </button>
          </div>
        )}

        {quiz && (
          <div className="mt-6">
            {qi < quiz.length ? (
              <BubbleSection title={`Pergunta ${qi + 1} de ${quiz.length}`}>
                <Progress value={((qi + (picked !== null ? 1 : 0)) / quiz.length) * 100} className="mb-4 h-3 bg-primary/15" />
                <p className="mb-4 font-semibold text-foreground">{quiz[qi].pergunta}</p>
                <div className="space-y-2">
                  {quiz[qi].alternativas.map((alt, i) => {
                    const ok = picked !== null && i === quiz[qi].correta;
                    const bad = picked === i && i !== quiz[qi].correta;
                    return (
                      <button key={i} type="button" onClick={() => pick(i)} disabled={picked !== null}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${ok ? "border-success bg-success/10" : bad ? "border-destructive bg-destructive/10" : "border-border bg-card hover:bg-primary/5"}`}>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{String.fromCharCode(65 + i)}</span>
                        {alt}
                      </button>
                    );
                  })}
                </div>
                {picked !== null && (
                  <>
                    <p className={`mt-4 rounded-2xl px-4 py-3 text-sm ${picked === quiz[qi].correta ? "bg-success/10" : "bg-destructive/10"}`}>
                      <strong>{picked === quiz[qi].correta ? "Muito bem! " : "Quase! "}</strong>{quiz[qi].explicacao}
                    </p>
                    <ArrowNavButton direction="right" label={qi + 1 < quiz.length ? "Próxima" : "Ver resultado"} className="mt-4" onClick={nextQ} />
                  </>
                )}
              </BubbleSection>
            ) : (
              <BubbleSection title="Revisão concluída">
                <p className="text-center text-3xl font-black text-primary">{score}/{quiz.length}</p>
                <p className="mb-4 text-center text-sm text-muted-foreground">acertos · +{score * 5 + 5} pontos</p>
                <ArrowNavButton direction="right" label="Continuar estudando" onClick={() => setQuiz(null)} />
              </BubbleSection>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      {!quiz && (
        <form onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="fixed inset-x-0 bottom-20 z-30 px-4 pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto flex max-w-[58rem] items-end gap-2 rounded-3xl border border-border bg-card p-2 shadow-lg">
            <Textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} maxLength={2000} rows={1}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Faça sua pergunta..." className="max-h-32 min-h-[44px] resize-none border-0 bg-transparent text-base shadow-none focus-visible:ring-0" />
            <button type="submit" disabled={!input.trim() || sending} aria-label="Enviar"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
