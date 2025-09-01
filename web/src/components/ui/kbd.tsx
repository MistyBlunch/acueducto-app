import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const kbdVariants = cva(
  'inline-flex items-center justify-center font-mono font-medium select-none',
  {
    variants: {
      variant: {
        default:
          'bg-muted border border-border text-muted-foreground shadow-sm',
        dark: 'bg-gray-800 border border-gray-700 text-gray-300 shadow-sm',
        outline: 'border-2 border-border text-foreground bg-transparent',
        ghost: 'bg-muted/50 text-muted-foreground border border-transparent',
      },
      size: {
        sm: 'h-5 min-w-5 text-xs px-1.5 rounded',
        md: 'h-6 min-w-6 text-sm px-2 rounded-md',
        lg: 'h-7 min-w-7 text-sm px-2.5 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {
  keys?: string[];
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, variant, size, keys, children, ...props }, ref) => {
    if (keys && keys.length > 0) {
      return (
        <span className="inline-flex items-center gap-1" ref={ref} {...props}>
          {keys.map((key, index) => (
            <React.Fragment key={key}>
              <kbd className={cn(kbdVariants({ variant, size }), className)}>
                {key}
              </kbd>
              {index < keys.length - 1 && (
                <span className="text-xs text-muted-foreground">+</span>
              )}
            </React.Fragment>
          ))}
        </span>
      );
    }

    return (
      <kbd
        className={cn(kbdVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </kbd>
    );
  },
);

export { Kbd, kbdVariants };
