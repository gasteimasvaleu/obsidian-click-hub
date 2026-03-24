import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";
import { useAIConsent } from "@/hooks/useAIConsent";
import { AIConsentDialog } from "@/components/AIConsentDialog";
import { useLoading } from "@/contexts/LoadingContext";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_SUGGESTIONS = [
  "Como lidar com birras à luz da Bíblia?",
  "Meu filho está com medo, o que fazer?",
  "Uma oração em família",
  "Como ensinar perdão aos filhos?",
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { showConsent, setShowConsent, acceptConsent, requireConsent } = useAIConsent();
  const pendingMessageRef = useRef<string | null>(null);
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const autoResize = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, []);

  useEffect(() => {
    autoResize();
  }, [input, autoResize]);

  const doSendMessage = async (message: string) => {
    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    showLoading('Enviando mensagem...');

    try {
      const response = await fetch("https://hook.us2.make.com/f2v3uj2teps5wg8xirjjlcicqbqpcvy6", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error("Falha ao comunicar com o servidor");

      const responseText = await response.text();
      let assistantContent: string;
      try {
        const data = JSON.parse(responseText);
        assistantContent = data.response || responseText;
      } catch {
        assistantContent = responseText;
      }

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: assistantContent || "Desculpe, não consegui processar sua mensagem.",
      }]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro na conexão",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return;
    const message = input;
    setInput("");
    requireConsent(() => { doSendMessage(message); });
    if (!localStorage.getItem("ai_consent_accepted")) {
      pendingMessageRef.current = message;
    }
  };

  const handleConsentAccepted = () => {
    acceptConsent();
    if (pendingMessageRef.current) {
      doSendMessage(pendingMessageRef.current);
      pendingMessageRef.current = null;
    }
  };

  const handleConsentCancelled = () => {
    setShowConsent(false);
    pendingMessageRef.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput("");
    requireConsent(() => { doSendMessage(suggestion); });
    if (!localStorage.getItem("ai_consent_accepted")) {
      pendingMessageRef.current = suggestion;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}>
      <FuturisticNavbar />

      {/* Card container: header + messages + composer */}
      <div className="pt-16 px-3 pb-2">
        <div className="max-w-3xl mx-auto overflow-hidden">
          {/* Green header */}
          <div className="bg-primary rounded-t-2xl px-4">
            <div className="flex items-center gap-3 py-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/amigodivino")}
                className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-black/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-black/20">
                  <AvatarFallback className="bg-black/20 text-primary-foreground text-xs">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-sm font-bold text-primary-foreground">Amigo Divino</h1>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="border-x border-border/40 bg-card/30 backdrop-blur-sm">
          {/* Messages area */}
          <div className="px-3">
            {/* Empty state */}
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-4">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <p className="text-base text-muted-foreground text-center mb-6 max-w-xs">
                  Olá! Sou seu conselheiro espiritual. Como posso ajudar sua família hoje?
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                  {QUICK_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-2 text-xs rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/15 transition-colors duration-200 active:scale-95"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-3 py-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-7 w-7 mt-1 shrink-0 border border-primary/30">
                      <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                        <Sparkles className="h-3.5 w-3.5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 text-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary/25 to-primary/10 border border-primary/30 rounded-2xl rounded-br-md text-foreground"
                        : "bg-muted/40 backdrop-blur-sm border border-border/50 rounded-2xl rounded-bl-md text-foreground"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-strong:text-primary">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Bouncing dots */}
              {isLoading && (
                <div className="flex gap-2 justify-start animate-fade-in">
                  <Avatar className="h-7 w-7 mt-1 shrink-0 border border-primary/30">
                    <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                      <Sparkles className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted/40 backdrop-blur-sm border border-border/50 px-5 py-4 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-2 h-2 rounded-full bg-primary/60 bouncing-dot" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 bouncing-dot" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 bouncing-dot" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div ref={scrollRef} />
          </div>

          {/* Composer — inside card, in normal flow */}
          <div className="px-3 py-3 border-t border-border/30">
            <div className="flex items-end gap-2 bg-muted/20 border border-border/40 rounded-2xl px-3 py-2 focus-within:border-primary/40 transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent border-none outline-none resize-none text-base text-foreground placeholder:text-muted-foreground py-1.5 max-h-[120px] scrollbar-none"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="h-9 w-9 rounded-full bg-primary hover:bg-primary/80 transition-all duration-200 active:scale-90 disabled:opacity-30 shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AIConsentDialog
        open={showConsent}
        onAccept={handleConsentAccepted}
        onCancel={handleConsentCancelled}
      />
    </div>
  );
};
