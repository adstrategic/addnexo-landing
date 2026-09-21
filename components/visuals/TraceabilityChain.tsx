import { cn } from "@/lib/utils"

type TraceabilityChainProps = {
  items: string[]
  className?: string
  variant?: "light" | "dark"
}

export function TraceabilityChain({
  items,
  className,
  variant = "light",
}: TraceabilityChainProps) {
  const isDark = variant === "dark"

  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-2",
        className
      )}
    >
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-lg px-3 py-1.5 text-[0.8rem] font-semibold",
              isDark
                ? "bg-brand-cyan/20 text-brand-cyan"
                : "bg-primary/10 text-primary"
            )}
          >
            {item}
          </span>
          {i < items.length - 1 ? (
            <span
              className={cn(
                "text-xs",
                isDark ? "text-white/40" : "text-muted-foreground"
              )}
              aria-hidden
            >
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
