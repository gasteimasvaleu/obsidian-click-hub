import * as React from "react";
import { BubbleTitleText } from "@/components/ui/bubble-title-text";

/** Violet bubble used as the title of every dialog. */
export function ModalBubble({ children }: { children: React.ReactNode }) {
  return (
    <span className="neon-glow-user feature-bubble bubble-user relative z-[2] block rounded-2xl px-4 py-3 pr-4 text-left text-feature-foreground">
      <span aria-hidden className="border-beam" />
      <span className="bubble-title relative block">
        {typeof children === "string" ? <BubbleTitleText text={children} /> : children}
      </span>
    </span>
  );
}

export const MODAL_CONTENT =
  "fixed left-[50%] top-[50%] z-50 flex flex-col w-[calc(100%-2rem)] max-w-lg max-h-[85vh] overflow-y-auto overscroll-contain translate-x-[-50%] translate-y-[-50%] gap-4 rounded-3xl border border-primary/40 bg-background px-5 pb-5 pt-12 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]";

export const MODAL_FOOTER =
  "flex shrink-0 flex-col-reverse gap-2 [&>*]:w-full [&>*]:h-11 [&>*]:m-0 [&>.border-input]:border-primary [&>.border-input]:text-primary";

export const MODAL_DESCRIPTION =
  "-mt-5 rounded-b-2xl border border-t-0 border-border bg-card px-4 pb-3 pt-6 text-left text-sm text-muted-foreground";
