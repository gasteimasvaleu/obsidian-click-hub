const EMOJI_RE = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|\u200D|\uFE0F|\u20E3)+/gu;

/** Remove emojis de um texto e limpa os espaços que sobrarem. */
export function stripEmoji(text: string): string;
export function stripEmoji(text: string | null | undefined): string | null | undefined;
export function stripEmoji(text: string | null | undefined) {
  if (text == null) return text;
  return text
    .replace(EMOJI_RE, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+([!?.,:])/g, "$1")
    .split("\n").map((l) => l.trim()).join("\n")
    .trim();
}
