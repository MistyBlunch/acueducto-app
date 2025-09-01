# Acueducto Web - Claude Code Guide

## Project Overview
Acueducto Web is a modern Next.js 14 application providing an intelligent product search interface with palindrome-based automatic discounts. The application features responsive design, debounced search (300ms), and connects to an API backend on port 3001.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Acueducto theme
- **State Management**: TanStack Query for API state
- **UI Components**: Custom components with Radix UI primitives
- **Animation**: Framer Motion
- **Testing**: Vitest (unit), Playwright (e2e)
- **Package Manager**: Yarn

## Common Development Commands

### Development
```bash
yarn dev                    # Start development server (port 3000)
yarn build                  # Production build
yarn start                  # Start production server
yarn analyze                # Bundle analyzer
```

### Testing
```bash
yarn test                   # Run unit tests
yarn test:unit:watch        # Watch mode for unit tests
yarn test:unit:ui           # Vitest UI
yarn test:e2e               # Run e2e tests
yarn test:e2e:ui            # Playwright UI
yarn test:e2e:headed        # Run e2e tests with browser visible
```

### Code Quality
```bash
yarn lint                   # ESLint check
yarn lint:fix               # ESLint auto-fix
yarn typecheck              # TypeScript type checking
yarn format                 # Prettier formatting
```

### Docker
```bash
yarn docker:build          # Build Docker image
yarn docker:run            # Run Docker container
```

## Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── __tests__/         # Component tests
│   ├── search-states/     # Search state components
│   ├── ui/                # Reusable UI components
│   ├── product-card.tsx   # Product display
│   ├── product-search.tsx # Main search interface
│   ├── results-grid.tsx   # Search results
│   └── search-bar.tsx     # Search input
├── hooks/                 # Custom React hooks
│   ├── use-product-search.ts    # Main search hook
│   └── use-search-products.ts   # API integration
├── lib/                   # Utilities
│   ├── api.ts             # API client
│   ├── query-client.ts    # TanStack Query setup
│   └── utils.ts           # General utilities
├── providers/             # React context providers
│   └── query-provider.tsx # Query client provider
├── test/                  # Test configuration
│   ├── setup.ts           # Test setup
│   └── utils.tsx          # Test utilities
└── types/                 # TypeScript definitions
    └── api.ts             # API response types
```

## Key Features

### Palindrome Detection & Discounts
- Products with palindromic brand names receive automatic 50% discounts
- Discount detection happens server-side via API

### Search Functionality
- Debounced search with 300ms delay
- Real-time results with loading states
- Empty, error, and success states handled

### UI/UX
- Responsive design with mobile-first approach
- Custom Acueducto blue theme (#1a4ce0)
- Smooth animations with Framer Motion
- Dark mode support via next-themes

## Environment Configuration
Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Dependencies Overview

### Core Dependencies
- `@tanstack/react-query`: API state management
- `next-themes`: Dark mode support
- `framer-motion`: Animations
- `lucide-react`: Icon library
- `zod`: Runtime type validation

### UI Components
- `@radix-ui/*`: Accessible UI primitives
- `class-variance-authority`: Component variants
- `tailwind-merge`: Tailwind class merging
- `clsx`: Conditional classes

### Development
- `vitest`: Unit testing
- `@playwright/test`: E2E testing
- `msw`: API mocking
- `prettier`: Code formatting
- `eslint`: Code linting

## Testing Strategy
- **Unit Tests**: Components and hooks with Vitest + Testing Library
- **E2E Tests**: User flows with Playwright
- **Mocking**: MSW for API responses during tests
- **Test Setup**: Custom render functions with providers

## API Integration
- Base API URL: `http://localhost:3001`
- Main endpoint: `/products/search?q=term`
- Response includes products with palindrome discount detection
- Uses TanStack Query for caching and state management

## Development Tips
1. Always run `yarn typecheck` before committing
2. Use `yarn lint:fix` to auto-fix ESLint issues
3. Test both unit and e2e before production builds
4. API backend must be running on port 3001
5. Use existing UI components from `src/components/ui/`
6. Follow the established Tailwind theme colors
7. Maintain responsive design patterns

## Common Issues
- Ensure API backend is running on port 3001
- Check environment variables are set correctly
- Run `yarn playwright:install` for e2e tests
- TypeScript errors should be resolved before building