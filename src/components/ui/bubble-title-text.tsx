/** Splits the last word of a title so it gets the light gradient highlight. */
export function BubbleTitleText({ text }: { text: string }) {
  const trimmed = text.trim();
  const i = trimmed.lastIndexOf(" ");
  if (i === -1) return <span className="text-gradient-title">{trimmed}</span>;
  return (
    <>
      {trimmed.slice(0, i)} <span className="text-gradient-title">{trimmed.slice(i + 1)}</span>
    </>
  );
}
