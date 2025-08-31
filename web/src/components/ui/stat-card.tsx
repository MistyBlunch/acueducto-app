import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

const statCardVariants = cva(
  "transition-all duration-300",
  {
    variants: {
      variant: {
        default: "hover:shadow-lg",
        lovable: "hover:shadow-lovable-lg hover:-translate-y-1",
        minimal: "border-0 shadow-none bg-transparent",
        gradient: "bg-gradient-to-br from-lovable-purple-50 to-lovable-pink-50 border-lovable-purple-100 hover:shadow-lovable",
        glass: "backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20",
      },
      size: {
        sm: "p-4",
        md: "p-6", 
        lg: "p-8",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const statValueVariants = cva(
  "font-bold",
  {
    variants: {
      size: {
        sm: "text-2xl",
        md: "text-3xl lg:text-4xl",
        lg: "text-4xl lg:text-5xl",
      },
      variant: {
        default: "text-foreground",
        gradient: "bg-gradient-to-r from-lovable-purple-600 to-lovable-pink-600 bg-clip-text text-transparent",
        primary: "text-primary",
        success: "text-green-600",
        warning: "text-yellow-600",
        error: "text-red-600",
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

const statLabelVariants = cva(
  "text-muted-foreground",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      }
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  value: string | number
  label: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label?: string
  }
  valueVariant?: VariantProps<typeof statValueVariants>['variant']
  valueSize?: VariantProps<typeof statValueVariants>['size']
  labelSize?: VariantProps<typeof statLabelVariants>['size']
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ 
    className, 
    variant, 
    size,
    value, 
    label, 
    icon, 
    trend,
    valueVariant,
    valueSize,
    labelSize,
    ...props 
  }, ref) => {
    return (
      <Card
        className={cn(statCardVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        <CardContent className={cn("flex flex-col space-y-2", size === "sm" ? "p-4" : size === "lg" ? "p-8" : "p-6")}>
          {/* Header with icon */}
          <div className="flex items-center justify-between">
            {icon && (
              <div className="flex-shrink-0">
                {React.isValidElement(icon) ? (
                  React.cloneElement(icon as React.ReactElement, {
                    className: cn(
                      "text-muted-foreground",
                      size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5",
                      (icon as React.ReactElement).props?.className
                    )
                  })
                ) : icon}
              </div>
            )}
            {trend && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1",
                trend.value > 0 
                  ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30" 
                  : trend.value < 0 
                    ? "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30"
                    : "text-muted-foreground bg-muted"
              )}>
                {trend.value > 0 && "↗"}
                {trend.value < 0 && "↘"}
                {trend.value === 0 && "→"}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>

          {/* Main value */}
          <div className={cn(statValueVariants({ size: valueSize, variant: valueVariant }))}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>

          {/* Label and trend description */}
          <div className="flex flex-col space-y-1">
            <div className={cn(statLabelVariants({ size: labelSize }))}>
              {label}
            </div>
            {trend?.label && (
              <div className="text-xs text-muted-foreground">
                {trend.label}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

export { StatCard, statCardVariants, statValueVariants, statLabelVariants }