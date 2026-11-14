// @ts-expect-error bun:test só existe ao rodar com bun
import { expect, test } from "bun:test";
import { stripEmoji } from "./stripEmoji";

test("remove emojis do meio e do fim", () => {
  expect(stripEmoji("Criação 🌍 do Mundo ✨")).toBe("Criação do Mundo");
});
test("texto sem emoji não muda", () => {
  expect(stripEmoji("A Arca de Noé")).toBe("A Arca de Noé");
});
test("remove emoji composto e com seletor", () => {
  expect(stripEmoji("⚠️ Família 👨‍👩‍👧 feliz!")).toBe("Família feliz!");
});
