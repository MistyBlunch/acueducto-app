import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// H1 Component
const h1Variants = cva('scroll-m-20 font-extrabold tracking-tight', {
  variants: {
    size: {
      sm: 'text-3xl sm:text-4xl',
      md: 'text-4xl sm:text-5xl lg:text-6xl',
      lg: 'text-5xl sm:text-6xl lg:text-7xl',
      xl: 'text-6xl sm:text-7xl lg:text-8xl',
    },
    variant: {
      default: 'text-foreground',
      gradient:
        'bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
    },
    balance: {
      true: 'text-balance',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
    balance: true,
  },
});

export interface H1Props
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof h1Variants> {
  asChild?: boolean;
}

const H1 = React.forwardRef<HTMLHeadingElement, H1Props>(
  ({ className, size, variant, balance, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'h1';

    if (asChild) {
      return <React.Fragment {...props} />;
    }

    return (
      <Comp
        className={cn(h1Variants({ size, variant, balance }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

// H2 Component
const h2Variants = cva('scroll-m-20 font-bold tracking-tight', {
  variants: {
    size: {
      sm: 'text-2xl sm:text-3xl',
      md: 'text-3xl sm:text-4xl lg:text-5xl',
      lg: 'text-4xl sm:text-5xl lg:text-6xl',
    },
    variant: {
      default: 'text-foreground',
      gradient:
        'bg-gradient-to-r from-lovable-purple-600 to-lovable-pink-600 bg-clip-text text-transparent',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
    },
    balance: {
      true: 'text-balance',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
    balance: true,
  },
});

export interface H2Props
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof h2Variants> {
  asChild?: boolean;
}

const H2 = React.forwardRef<HTMLHeadingElement, H2Props>(
  ({ className, size, variant, balance, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'h2';

    if (asChild) {
      return <React.Fragment {...props} />;
    }

    return (
      <Comp
        className={cn(h2Variants({ size, variant, balance }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

// H3 Component
const h3Variants = cva('scroll-m-20 font-semibold tracking-tight', {
  variants: {
    size: {
      sm: 'text-lg sm:text-xl',
      md: 'text-xl sm:text-2xl lg:text-3xl',
      lg: 'text-2xl sm:text-3xl lg:text-4xl',
    },
    variant: {
      default: 'text-foreground',
      gradient:
        'bg-gradient-to-r from-lovable-purple-600 to-lovable-pink-600 bg-clip-text text-transparent',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export interface H3Props
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof h3Variants> {
  asChild?: boolean;
}

const H3 = React.forwardRef<HTMLHeadingElement, H3Props>(
  ({ className, size, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'h3';

    if (asChild) {
      return <React.Fragment {...props} />;
    }

    return (
      <Comp
        className={cn(h3Variants({ size, variant }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

// Lead Component
const leadVariants = cva('text-muted-foreground', {
  variants: {
    size: {
      sm: 'text-base sm:text-lg',
      md: 'text-lg sm:text-xl',
      lg: 'text-xl sm:text-2xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    balance: {
      true: 'text-balance',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    weight: 'normal',
    balance: true,
  },
});

export interface LeadProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof leadVariants> {
  asChild?: boolean;
}

const Lead = React.forwardRef<HTMLParagraphElement, LeadProps>(
  ({ className, size, weight, balance, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'p';

    if (asChild) {
      return <React.Fragment {...props} />;
    }

    return (
      <Comp
        className={cn(leadVariants({ size, weight, balance }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

export { H1, H2, H3, Lead, h1Variants, h2Variants, h3Variants, leadVariants };
