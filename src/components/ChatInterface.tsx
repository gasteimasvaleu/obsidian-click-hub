import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAIConsent } from "@/hooks/useAIConsent";
import { AIConsentDialog } from "@/components/AIConsentDialog";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showConsent, setShowConsent, acceptConsent, requireConsent } = useAIConsent();
  const pendingMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const doSendMessage = async (message: string) => {
    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-28">
      <FuturisticNavbar />

      {/* Sub-header com botão voltar */}
      <div className="fixed top-14 left-0 right-0 z-40 backdrop-blur-lg bg-background/50 border-b border-primary/20">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/amigodivino")}
            className="text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-primary/30">
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                <Sparkles className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-sm font-bold text-primary">Amigo Divino</h1>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <ScrollArea className="flex-1 px-2">
        <div className="max-w-3xl mx-auto">
          <GlassCard className="min-h-[50vh] p-3">
            {messages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Sparkles className="h-10 w-10 mx-auto mb-4 text-primary/60" />
                <p className="text-base">Olá! Como posso ajudá-lo em sua jornada espiritual hoje?</p>
              </div>
            )}

            <div className="space-y-4">
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
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      message.role === "user"
                        ? "bg-primary/20 border border-primary/40 text-foreground"
                        : "bg-muted/50 border border-border text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 justify-start animate-fade-in">
                  <Avatar className="h-7 w-7 mt-1 shrink-0 border border-primary/30">
                    <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                      <Sparkles className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted/50 border border-border p-3 rounded-2xl">
                    <p className="text-muted-foreground italic text-sm">Digitando...</p>
                  </div>
                </div>
              )}
            </div>

            <div ref={scrollRef} />
          </GlassCard>
        </div>
      </ScrollArea>

      {/* Input fixo no bottom com pb-36 para não ficar atrás do tubelight */}
      <div className="sticky bottom-0 backdrop-blur-lg bg-background/80 border-t border-primary/20 pb-36">
        <div className="max-w-3xl mx-auto px-2 pt-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1 bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus:border-primary/40"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/80 transition-all duration-300 active:scale-95 disabled:opacity-50"
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

      <AIConsentDialog
        open={showConsent}
        onAccept={handleConsentAccepted}
        onCancel={handleConsentCancelled}
      />
    </div>
  );
};
