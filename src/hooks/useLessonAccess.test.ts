// @ts-expect-error bun:test só existe ao rodar com bun
import { expect, test } from "bun:test";
import { FREE_LESSON_LIMIT } from "./useLessonAccess";
test("libera 5 aulas grátis", () => { expect(FREE_LESSON_LIMIT).toBe(5); });
