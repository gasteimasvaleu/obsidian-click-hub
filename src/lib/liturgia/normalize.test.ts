import { describe, it, expect } from "vitest";
import { normalizeReadings, colorSwatch, shiftDate } from "./normalize";

describe("liturgia", () => {
  it("omite a 2ª leitura quando não há", () => {
    const r = normalizeReadings({ primeiraLeitura: [{ referencia: "Ez 1", texto: "a" }], salmo: [{ refrao: "R", texto: "b" }], segundaLeitura: "", evangelho: [{ referencia: "Mt 1", texto: "c" }] });
    expect(r.map((x) => x.tab)).toEqual(["1ª Leitura", "Salmo", "Evangelho"]);
    expect(r[1].refrao).toBe("R");
  });
  it("mapeia cor desconhecida para verde e troca de mês", () => {
    expect(colorSwatch("xyz")).toBe(colorSwatch("Verde"));
    expect(shiftDate("2026-11-30", 1)).toBe("2026-12-01");
  });
});
