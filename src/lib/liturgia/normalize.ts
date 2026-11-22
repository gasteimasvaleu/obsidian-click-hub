export type Reading = { key: string; tab: string; referencia: string; titulo: string; refrao?: string; texto: string };

const COLORS: Record<string, string> = {
  verde: "hsl(142 60% 40%)", branco: "hsl(45 30% 92%)", vermelho: "hsl(0 70% 50%)",
  roxo: "hsl(275 55% 45%)", rosa: "hsl(330 70% 70%)",
};

export const colorSwatch = (cor: string) => COLORS[(cor || "").trim().toLowerCase()] ?? COLORS.verde;

const first = (v: unknown): any => (Array.isArray(v) ? v[0] : v && typeof v === "object" ? v : null);

export function normalizeReadings(leituras: any): Reading[] {
  const defs: [string, string][] = [["primeiraLeitura", "1ª Leitura"], ["salmo", "Salmo"], ["segundaLeitura", "2ª Leitura"], ["evangelho", "Evangelho"]];
  const out: Reading[] = [];
  for (const [key, tab] of defs) {
    const r = first(leituras?.[key]);
    if (!r || typeof r.texto !== "string" || !r.texto.trim()) continue;
    out.push({ key, tab, referencia: r.referencia ?? "", titulo: r.titulo ?? (key === "salmo" ? "Salmo Responsorial" : ""), refrao: r.refrao || undefined, texto: r.texto });
  }
  return out;
}

export const isoDate = (d: Date) => d.toLocaleDateString("sv-SE");
export const shiftDate = (iso: string, days: number) => {
  const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate() + days); return isoDate(d);
};
