import type { PrayerKey } from "./data";

export type BeadKind = "cross" | "big" | "small" | "medal";
export interface Step {
  bead: number;          // índice da conta 3D (0..58)
  kind: BeadKind;
  prayers: PrayerKey[];
  decade: number | null; // 0..4
  ave: number | null;    // 1..10 dentro da dezena
  announce: boolean;     // anuncia mistério antes
}

/** 59 contas: cruz, 1 grande, 3 pequenas, 1 grande(Glória), medalha, 5x(grande? -> ver abaixo). */
export function buildSequence(): Step[] {
  const s: Step[] = [];
  let b = 0;
  s.push({ bead: b++, kind: "cross", prayers: ["sinal", "creio"], decade: null, ave: null, announce: false });
  s.push({ bead: b++, kind: "big", prayers: ["paiNosso"], decade: null, ave: null, announce: false });
  for (let i = 1; i <= 3; i++) s.push({ bead: b++, kind: "small", prayers: ["aveMaria"], decade: null, ave: i, announce: false });
  s.push({ bead: b++, kind: "big", prayers: ["gloria"], decade: null, ave: null, announce: false });
  for (let d = 0; d < 5; d++) {
    // Medalha (1ª dezena) ou conta grande: anúncio + Pai-Nosso
    s.push({ bead: b++, kind: d === 0 ? "medal" : "big", prayers: ["paiNosso"], decade: d, ave: null, announce: true });
    for (let a = 1; a <= 10; a++) {
      s.push({ bead: b++, kind: "small", prayers: a === 10 ? ["aveMaria", "gloria", "fatima"] : ["aveMaria"], decade: d, ave: a, announce: false });
    }
  }
  // Final volta à medalha
  s.push({ bead: 6, kind: "medal", prayers: ["salve", "sinal"], decade: null, ave: null, announce: false });
  return s;
}

export const SEQUENCE = buildSequence();
export const BEAD_COUNT = 6 + 5 * 11; // 61 posições 3D (6 no pingente+medalha, 55 no anel)
