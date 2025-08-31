// Layout Components
export { Section, sectionVariants, type SectionProps } from './section'
export { Container, containerVariants, type ContainerProps } from './container'

// Typography Components
export { H1, H2, H3, Lead, h1Variants, h2Variants, h3Variants, leadVariants, type H1Props, type H2Props, type H3Props, type LeadProps } from './typography'

// Interactive Components
export { Kbd, kbdVariants, type KbdProps } from './kbd'
export { PillBadge, pillBadgeVariants, type PillBadgeProps } from './pill-badge'
export { StatCard, statCardVariants, statValueVariants, statLabelVariants, type StatCardProps } from './stat-card'

// Animation Components and Utilities
export { 
  Motion, 
  fadeInUp, 
  fadeIn, 
  slideInLeft, 
  scaleIn, 
  staggerChildren, 
  bounceIn, 
  hoverLift, 
  hoverGlow,
  useReducedMotion,
  withMotion
} from './motion'