"use client"

import { cn } from "@/lib/utils"

type CostWaterfallProps = {
  components: string[]
  className?: string
}

export function CostWaterfall({ components, className }: CostWaterfallProps) {
  const steps = components.slice(0, -1)
  const final = components[components.length - 1]

  return (
    <div className={cn("w-full", className)}>
      <ol className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-3 rounded-xl border border-brand-dark/8 bg-background px-4 py-3"
            style={{ marginLeft: `${Math.min(i * 12, 72)}px` }}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-dark/5 text-[0.75rem] font-bold text-brand-dark">
              {i === 0 ? "=" : "+"}
            </span>
            <span className="text-[0.92rem] font-medium text-foreground">{step}</span>
          </li>
        ))}
        <li className="mt-2 flex items-center gap-3 rounded-xl border border-brand-cyan/40 bg-brand-cyan/15 px-4 py-4">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-cyan text-[0.75rem] font-bold text-brand-dark">
            =
          </span>
          <span className="text-[1rem] font-bold text-brand-dark">{final}</span>
        </li>
      </ol>
    </div>
  )
}
