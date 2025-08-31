import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const pillBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300",
        warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300",
        info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300",
        lovable: "border-transparent bg-gradient-to-r from-lovable-purple-500 to-lovable-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105",
        palindrome: "border-transparent bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-md hover:shadow-lg animate-glow",
        discount: "border-transparent bg-discount text-white font-bold shadow-md hover:shadow-lg hover:bg-discount-dark",
        pulse: "border-transparent bg-primary text-primary-foreground animate-pulse shadow",
        glow: "border-transparent bg-lovable-purple-500 text-white shadow-lovable animate-glow",
      },
      size: {
        sm: "text-xs px-2 py-0.5 gap-1",
        md: "text-sm px-3 py-1 gap-1.5",
        lg: "text-base px-4 py-1.5 gap-2",
      },
      interactive: {
        true: "cursor-pointer hover:scale-105 active:scale-95 transition-transform",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
    },
  }
)

export interface PillBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillBadgeVariants> {
  icon?: React.ReactNode
  onRemove?: () => void
}

const PillBadge = React.forwardRef<HTMLDivElement, PillBadgeProps>(
  ({ className, variant, size, interactive, icon, onRemove, children, ...props }, ref) => {
    return (
      <div
        className={cn(pillBadgeVariants({ variant, size, interactive }), className)}
        ref={ref}
        {...props}
      >
        {icon && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
        <span className="truncate">
          {children}
        </span>
        {onRemove && (
          <button
            type="button"
            className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

export { PillBadge, pillBadgeVariants }