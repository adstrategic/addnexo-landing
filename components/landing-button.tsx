import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const landingButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-[0.95rem] font-semibold tracking-[-0.01em] whitespace-nowrap transition-[transform,box-shadow,background,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        lime: "bg-brand-cyan text-brand-dark shadow-none hover:bg-brand-cyan hover:shadow-[0_6px_20px_rgba(56,189,248,0.35)]",
        ghost:
          "border-[1.5px] border-white/35 bg-transparent text-white hover:border-white/60 hover:bg-white/8",
        dark: "bg-brand-dark text-white hover:bg-primary hover:shadow-[0_8px_30px_rgba(0,0,0,0.13)]",
        outlineDark:
          "border-[1.5px] border-brand-dark bg-transparent text-brand-dark hover:bg-brand-dark hover:text-white",
        navCta:
          "rounded-full bg-brand-cyan px-5 py-2.5 text-[0.88rem] font-bold text-brand-dark hover:-translate-y-px hover:bg-brand-cyan",
      },
      size: {
        default: "px-7 py-3.5",
        lg: "px-9 py-4 text-[1.05rem]",
        full: "w-full px-7 py-4 text-[1.05rem]",
      },
    },
    defaultVariants: {
      variant: "lime",
      size: "default",
    },
  }
)

function LandingButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof landingButtonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="landing-button"
      className={cn(landingButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { LandingButton, landingButtonVariants }
