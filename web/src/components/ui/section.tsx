import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sectionVariants = cva(
  "relative w-full",
  {
    variants: {
      variant: {
        default: "py-16 sm:py-20 lg:py-24",
        hero: "py-20 sm:py-28 lg:py-32",
        compact: "py-8 sm:py-12 lg:py-16",
        tight: "py-4 sm:py-6 lg:py-8",
      },
      background: {
        default: "",
        muted: "bg-muted/30",
        gradient: "bg-gradient-to-br from-background via-muted/20 to-background",
        lovable: "bg-gradient-to-br from-lovable-purple-50 via-white to-lovable-pink-50",
        acueducto: "bg-gradient-to-br from-primary/5 via-white to-secondary/5",
        dark: "bg-card/50 backdrop-blur-sm",
      },
      overflow: {
        visible: "overflow-visible",
        hidden: "overflow-hidden",
      }
    },
    defaultVariants: {
      variant: "default",
      background: "default",
      overflow: "visible",
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  asChild?: boolean
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant, background, overflow, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "section"
    
    if (asChild) {
      return (
        <React.Fragment {...props} />
      )
    }

    return (
      <Comp
        className={cn(sectionVariants({ variant, background, overflow }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

export { Section, sectionVariants }