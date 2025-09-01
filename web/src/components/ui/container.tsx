import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      sm: 'max-w-3xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
      prose: 'max-w-prose',
    },
    padding: {
      none: '',
      sm: 'px-4 sm:px-6',
      md: 'px-4 sm:px-6 lg:px-8',
      lg: 'px-6 sm:px-8 lg:px-12',
    },
    center: {
      true: 'text-center',
      false: '',
    },
  },
  defaultVariants: {
    size: 'xl',
    padding: 'md',
    center: false,
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, center, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';

    if (asChild) {
      return <React.Fragment {...props} />;
    }

    return (
      <Comp
        className={cn(containerVariants({ size, padding, center }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

export { Container, containerVariants };
