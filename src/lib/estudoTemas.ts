import parabolas from "@/assets/estudo/parabolas.png";
import sacramentos from "@/assets/estudo/sacramentos.png";
import maria from "@/assets/estudo/maria.png";
import apostolos from "@/assets/estudo/apostolos.png";
import criacao from "@/assets/estudo/criacao.png";
import milagres from "@/assets/estudo/milagres.png";
import mandamentos from "@/assets/estudo/mandamentos.png";
import santos from "@/assets/estudo/santos.png";

export type Audience = "kids" | "parents";

export const ESTUDO_TEMAS = [
  { id: "parabolas", title: "Parábolas de Jesus", image: parabolas },
  { id: "sacramentos", title: "Os Sacramentos", image: sacramentos },
  { id: "maria", title: "Nossa Senhora", image: maria },
  { id: "apostolos", title: "Os Apóstolos", image: apostolos },
  { id: "criacao", title: "A Criação", image: criacao },
  { id: "milagres", title: "Milagres de Jesus", image: milagres },
  { id: "mandamentos", title: "Os 10 Mandamentos", image: mandamentos },
  { id: "santos", title: "Os Santos", image: santos },
];

export const AUDIENCE_LABEL: Record<Audience, string> = { kids: "Crianças", parents: "Pais e catequistas" };

export function firstPrompt(type: "theme" | "passage" | "free", ref: string) {
  if (type === "theme") return `Vamos começar um estudo sobre "${ref}". Me explique o essencial e me mostre um trecho da Bíblia sobre isso.`;
  if (type === "passage") return `Vamos estudar ${ref}. Me conte o que acontece nesse trecho e o que ele nos ensina.`;
  return ref;
}
