import { describe, it, expect } from "vitest";
import { mysteryForDay } from "./data";
import { SEQUENCE } from "./sequence";

describe("terço", () => {
  it("mistérios por dia", () => {
    expect([0,1,2,3,4,5,6].map(mysteryForDay)).toEqual(["gloriosos","gozosos","dolorosos","gloriosos","luminosos","dolorosos","gozosos"]);
  });
  it("53 Ave-Marias e 6 Pai-Nossos", () => {
    const all = SEQUENCE.flatMap((s) => s.prayers);
    expect(all.filter((p) => p === "aveMaria").length).toBe(53);
    expect(all.filter((p) => p === "paiNosso").length).toBe(6);
    expect(SEQUENCE.filter((s) => s.announce).length).toBe(5);
  });
});
