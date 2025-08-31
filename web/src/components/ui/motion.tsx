'use client'

import { lazy, Suspense, forwardRef } from 'react'
import type { 
  HTMLMotionProps,
  MotionProps,
  Variants 
} from 'framer-motion'

// Lazy load framer-motion to prevent blocking FCP
const MotionDiv = lazy(() => 
  import('framer-motion').then(mod => ({ default: mod.motion.div }))
)

const MotionSpan = lazy(() =>
  import('framer-motion').then(mod => ({ default: mod.motion.span }))
)

const MotionSection = lazy(() =>
  import('framer-motion').then(mod => ({ default: mod.motion.section }))
)

// Common animation variants
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
    },
  },
}

export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

export const staggerChildren: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const bounceIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.3,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
      duration: 0.6,
    },
  },
}

export const hoverLift: MotionProps = {
  whileHover: {
    y: -2,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  whileTap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
}

export const hoverGlow: MotionProps = {
  whileHover: {
    boxShadow: '0 10px 40px -4px rgba(139, 92, 246, 0.25)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

// Fallback component for SSR and while loading
const Fallback = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
)

// Wrapped motion components with fallbacks
interface MotionDivProps extends HTMLMotionProps<'div'> {
  fallback?: React.ComponentType<any>
}

export const Motion = {
  div: forwardRef<HTMLDivElement, MotionDivProps>(
    ({ fallback: FallbackComponent = Fallback, ...props }, ref) => (
      <Suspense fallback={<FallbackComponent {...props} ref={ref} />}>
        <MotionDiv ref={ref} {...props} />
      </Suspense>
    )
  ),

  span: forwardRef<HTMLSpanElement, HTMLMotionProps<'span'>>(
    ({ ...props }, ref) => (
      <Suspense fallback={<span ref={ref} {...props} />}>
        <MotionSpan ref={ref} {...props} />
      </Suspense>
    )
  ),

  section: forwardRef<HTMLElement, HTMLMotionProps<'section'>>(
    ({ ...props }, ref) => (
      <Suspense fallback={<section ref={ref} {...props} />}>
        <MotionSection ref={ref} {...props} />
      </Suspense>
    )
  ),
}


// Hook for checking if motion should be reduced
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Higher-order component to conditionally apply animations
export function withMotion<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  motionProps: MotionProps = {}
) {
  return forwardRef<any, P>((props, ref) => {
    const shouldReduceMotion = useReducedMotion()
    
    if (shouldReduceMotion) {
      return <WrappedComponent ref={ref} {...props} />
    }

    return (
      <Motion.div ref={ref} {...motionProps}>
        <WrappedComponent {...props} />
      </Motion.div>
    )
  })
}