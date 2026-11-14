import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export type ExpandMenuItemType = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
};

export type ExpandMenuProps = {
  items: ExpandMenuItemType[];
  showLabels?: boolean;
  className?: string;
};

/** Round trigger that expands downward (anchored top-right) into a labelled list. */
export function ExpandMenu({ items, showLabels = true, className }: ExpandMenuProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", handler);
      document.addEventListener("touchstart", handler);
    }
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative z-50", className)} style={{ width: 36, height: 36 }}>
      <motion.div
        layout
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          flexDirection: "column",
          borderRadius: open ? 20 : 9999,
          padding: open ? 6 : 0,
          gap: open ? 4 : 0,
          display: "inline-flex",
          alignItems: "flex-end",
        }}
        className="overflow-hidden border border-border bg-popover text-popover-foreground shadow-md"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        <motion.button
          layout
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          style={{ borderRadius: 9999, flexShrink: 0 }}
          className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:bg-accent active:bg-accent"
        >
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="flex items-center justify-center"
          >
            <MoreVertical size={18} />
          </motion.span>
        </motion.button>
        <AnimatePresence>
          {open &&
            items.map((item, i) => (
              <motion.button
                layout
                type="button"
                key={item.label}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 28 }}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                title={!showLabels ? item.label : undefined}
                style={{ borderRadius: 14, flexShrink: 0 }}
                className={cn(
                  "flex w-full items-center gap-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-accent",
                  showLabels ? "justify-start px-3 py-2" : "h-9 w-9 justify-center",
                  item.className,
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {showLabels && <span className="whitespace-nowrap text-left text-sm font-medium">{item.label}</span>}
              </motion.button>
            ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default ExpandMenu;
