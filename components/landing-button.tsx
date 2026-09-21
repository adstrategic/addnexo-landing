import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const landingButtonVariants = cva(
  "inline-flex max-w-full items-center justify-center gap-2 rounded-full text-center text-[0.9rem] font-semibold tracking-[-0.01em] text-balance transition-[transform,box-shadow,background,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 sm:text-[0.95rem] sm:whitespace-nowrap",
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
          "rounded-full bg-brand-cyan px-4 py-2 text-[0.82rem] font-bold text-brand-dark hover:-translate-y-px hover:bg-brand-cyan sm:px-5 sm:py-2.5 sm:text-[0.88rem]",
      },
      size: {
        default: "px-5 py-3 sm:px-7 sm:py-3.5",
        lg: "px-5 py-3 text-[0.95rem] sm:px-9 sm:py-4 sm:text-[1.05rem]",
        full: "w-full px-5 py-3.5 text-[0.95rem] sm:px-7 sm:py-4 sm:text-[1.05rem]",
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
