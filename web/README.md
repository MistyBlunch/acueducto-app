# 🛒 acueductoShop Web

Frontend moderno para e-commerce construido con **Next.js 14**, **App Router** y **TypeScript** en modo estricto. Incluye detección automática de palíndromos para descuentos del 50%.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                   🎨 Presentation Layer                     │
│        Pages, Components, Layouts, Styling (Tailwind)      │
├─────────────────────────────────────────────────────────────┤
│                   🔄 State Management                       │
│     TanStack Query, Custom Hooks, Local State             │
├─────────────────────────────────────────────────────────────┤
│                   📡 Data Access Layer                      │
│        API Client, HTTP Requests, Response Validation      │
├─────────────────────────────────────────────────────────────┤
│                   🛠️ Infrastructure Layer                   │
│     Next.js Runtime, Build Tools, External Services        │
└─────────────────────────────────────────────────────────────┘
```

### Estructura del Proyecto
```
src/
├── 📱 app/                      # Next.js 14 App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page with search
│   ├── demo/                    # Demo page for states
│   └── globals.css              # Global styles
├── 🧩 components/
│   ├── ui/                      # shadcn/ui base components
│   ├── search-states/           # Search state components
│   ├── product-card.tsx         # Product display card
│   ├── search-bar.tsx           # Search input with debounce
│   ├── price.tsx                # Price display with discounts
│   └── theme-toggle.tsx         # Dark/light mode toggle
├── 🪝 hooks/
│   ├── use-product-search.ts    # Main search hook with states
│   └── use-search-products.ts   # Legacy TanStack Query hook
├── 📚 lib/
│   ├── api.ts                   # HTTP client and API calls
│   ├── query-client.ts          # TanStack Query configuration
│   └── utils.ts                 # Utilities (palindrome, format, etc.)
├── 🔗 providers/
│   ├── query-provider.tsx       # TanStack Query provider
│   └── theme-provider.tsx       # Theme provider (next-themes)
├── 📋 types/
│   └── api.ts                   # TypeScript types and Zod schemas
└── 🧪 test/
    ├── setup.ts                 # Vitest configuration
    └── utils.tsx                # Testing utilities
```

## 🚀 Inicio Rápido

### Requisitos
- **Node.js** >= 18.x
- **Yarn** >= 1.22.x
- **API Backend** corriendo en puerto 3001

### Variables de Entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.example .env.local
```

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Development
NEXT_PUBLIC_ENV=development
```

## 🛠️ Comandos Disponibles

### Desarrollo
```bash
# Instalar dependencias
yarn install

# Modo desarrollo con hot-reload
yarn dev

# Build de desarrollo para debugging
yarn build
yarn start

# Análisis del bundle
yarn analyze
```

### Testing
```bash
# Todos los tests
yarn test

# Tests unitarios
yarn test:unit
yarn test:unit:watch
yarn test:unit:ui

# Tests e2e con Playwright
yarn test:e2e
yarn test:e2e:ui
yarn test:e2e:headed

# Instalar navegadores de Playwright
yarn playwright:install
```

### Calidad de Código
```bash
# Linting con ESLint
yarn lint              # Auto-fix
yarn lint:check        # Solo verificar

# Type checking
yarn typecheck

# Formateo con Prettier
yarn format
```

### Docker
```bash
# Build de imagen Docker
yarn docker:build

# Ejecutar contenedor
yarn docker:run
```

## 🐳 Docker

### Con Docker
```bash
# Build y run con un comando
docker build -t acueductoshop-web .
docker run -p 3000:3000 acueductoshop-web

# Con variables de entorno
docker run -p 3000:3000 --env-file .env.local acueductoshop-web
```

### Sin Docker (Desarrollo Local)
```bash
# Instalar dependencias
yarn install

# Asegurar que la API esté corriendo en puerto 3001
curl http://localhost:3001/health

# Levantar aplicación web
yarn dev
```

El sitio estará disponible en [http://localhost:3000](http://localhost:3000)

## 📚 Rutas y Funcionalidades

### Rutas Principales
- **`/`** - Página principal con búsqueda de productos
- **`/demo`** - Demostración interactiva de todos los estados de búsqueda

### Funcionalidades Clave

#### 🔍 Búsqueda Inteligente
- **Debounce**: 300ms para optimizar consultas a la API
- **Estados completos**: idle, loading, success, empty, error
- **Sugerencias**: Términos relacionados y palíndromos para descuentos

#### 🎯 Detección de Palíndromos
- **Tiempo real**: Hint visual mientras escribes
- **Descuento automático**: 50% off aplicado instantáneamente
- **Validación**: Unicode normalizado, mínimo 3 caracteres

#### 🎨 UI/UX
- **Tema moderno**: Colores azul primario y diseño limpio
- **Responsive**: Diseño optimizado para móvil y desktop
- **Accesibilidad**: WCAG 2.1 AA compliant

## 🧪 Estrategia de Testing

### Unit Tests (Vitest + React Testing Library)
- **Framework**: Vitest con jsdom environment
- **Cobertura**: Components, hooks, utilities
- **Mocking**: API client, Next.js router, providers
- **Ubicación**: `src/**/__tests__/`

### E2E Tests (Playwright)
- **Framework**: Playwright multi-browser
- **Cobertura**: User flows, search scenarios, UI states
- **API Mocking**: Route interception con responses mockeadas
- **Browsers**: Chrome, Firefox, Safari, Mobile

### Tests Implementados

#### Unit Tests Actuales
```bash
src/lib/__tests__/utils.test.ts              # isPalindrome, formatPrice, debounce
src/components/__tests__/search-bar.test.tsx # Debounce, palindrome hints
src/components/__tests__/product-card.test.tsx # Price rendering, discounts
src/components/__tests__/price.test.tsx      # Price formatting, states
src/hooks/__tests__/use-product-search.test.tsx # Hook states, pagination
```

#### E2E Tests Actuales
```bash
e2e/search-flow.spec.ts                      # Complete search flows
├── Palindrome search with discounts
├── Non-palindrome search
├── Empty results handling
├── Error states with retry
├── Loading states
├── Theme switching
└── Navigation flows
```

## 🔧 Configuración Técnica

### TanStack Query Setup
```typescript
// Configuración optimizada
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,        // 10 minutes
      retry: (failureCount, error) => {
        // No retry en errores 4xx
        if (error.statusCode >= 400 && error.statusCode < 500) {
          return false
        }
        return failureCount < 3
      },
    },
  },
})
```

### shadcn/ui Components
```bash
# Componentes instalados
Button, Input, Card, Badge, Skeleton, Tabs

# Tema personalizado con colores de acueducto
tailwind.config.js:
- acueducto-primary: '#1a4ce0'  (Azul principal)
- acueducto-secondary: '#4a90e2' (Azul secundario)
- discount: '#FF8F00'       (Naranja descuento)
```

### TypeScript Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 🏛️ Decisiones Arquitectónicas

### ¿Por qué Next.js 14 con App Router?
- **Performance**: RSC (React Server Components) para optimización automática
- **SEO**: Server-side rendering out of the box
- **File-based routing**: Estructura intuitiva y escalable
- **Image Optimization**: Optimización automática de imágenes
- **Bundle Analysis**: Herramientas integradas para análisis de performance

### ¿Por qué TanStack Query?
- **Cache inteligente**: Invalidación automática y background updates
- **Estado de carga**: Loading, error, success states built-in
- **Optimistic updates**: Mejor UX con actualizaciones optimistas
- **Developer tools**: DevTools integradas para debugging
- **TypeScript first**: Excelente soporte para tipos generados

### ¿Por qué Tailwind CSS?
- **Utility-first**: Desarrollo rápido sin context switching
- **Customización**: Tema personalizado con colores de tenis
- **Performance**: PurgeCSS automático, bundle size mínimo
- **Responsive**: Mobile-first approach integrado
- **Dark mode**: Soporte nativo para temas

### ¿Por qué shadcn/ui?
- **Copy-paste components**: No dependency hell, código en tu proyecto
- **Radix primitives**: Accesibilidad y UX de clase mundial
- **Customizable**: Fácil adaptación al tema de acueducto
- **TypeScript**: Componentes completamente tipados
- **Modern**: Últimas prácticas de React y CSS

### Lógica de Palíndromos en Frontend
```typescript
// Detección client-side para feedback inmediato
const isPalindrome = (str: string): boolean => {
  const normalized = str
    .normalize('NFD')                    // Descomponer caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '')    // Remover diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')          // Solo alfanuméricos
  
  return normalized === normalized.split('').reverse().join('')
}

// UX: Hint visual inmediato + confirmación del backend
```

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. API No Disponible
```bash
# Verificar que la API esté corriendo
curl http://localhost:3001/health

# Verificar variables de entorno
echo $NEXT_PUBLIC_API_BASE_URL

# Logs de la aplicación
yarn dev | grep -i error
```

#### 2. Problemas de Build
```bash
# Limpiar cache de Next.js
rm -rf .next

# Limpiar node_modules
rm -rf node_modules yarn.lock
yarn install

# Verificar TypeScript
yarn typecheck
```

#### 3. Tests Fallando
```bash
# Limpiar cache de Vitest
yarn test:unit --run --reporter=verbose

# Reinstalar Playwright browsers
yarn playwright:install

# Tests específicos
yarn test:unit --run --reporter=verbose search-bar
yarn test:e2e --project=chromium --headed
```

#### 4. Problemas de Styling
```bash
# Verificar Tailwind build
npx tailwindcss -i ./src/app/globals.css -o ./debug.css

# Verificar clases customizadas
grep -r "acueducto-" src/

# Regenerar tipos de shadcn
npx shadcn-ui@latest add --overwrite button
```

#### 5. Performance Issues
```bash
# Análisis de bundle
yarn analyze

# Verificar Network tab para requests lentos
# Chrome DevTools -> Network

# Profiling de React
# React DevTools -> Profiler tab
```

### Debugging

#### React DevTools Extensions
- **React DevTools**: Inspección de componentes
- **TanStack Query DevTools**: Estado de cache y queries
- **Next.js DevTools**: RSC y routing inspection

#### VS Code Configuration
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"]
  ]
}
```

#### Environment Variables Debug
```bash
# Verificar variables en runtime
console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL)

# Verificar build-time variables
yarn build && cat .next/trace.json | grep "NEXT_PUBLIC"
```

### Performance Optimization

#### Bundle Analysis
```bash
# Generar reporte de bundle
ANALYZE=true yarn build

# Verificar código no utilizado
yarn build && npx next-bundle-analyzer
```

#### Image Optimization
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['localhost', 'api.acueductoshop.com'],
    formats: ['image/webp', 'image/avif'],
  },
}
```

#### SEO Configuration
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'acueductoShop - Productos Premium',
  description: '¡Descuentos especiales con búsquedas palíndromas!',
  openGraph: {
    title: 'acueductoShop',
    description: 'Encuentra los mejores productos',
    images: ['/og-image.jpg'],
  },
}
```

## 📊 Métricas y Monitoreo

### Core Web Vitals
```bash
# Lighthouse CI
npx lighthouse http://localhost:3000 --output=json

# Web Vitals tracking
yarn add web-vitals
```

### Error Monitoring
```typescript
// Sentry integration (ejemplo)
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### Analytics
```typescript
// Google Analytics 4 (ejemplo)
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 📖 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Playwright Testing](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] Carrito de compras persistente
- [ ] Autenticación de usuarios
- [ ] Wishlist y favoritos
- [ ] Filtros avanzados de búsqueda
- [ ] Comparación de productos
- [ ] Reviews y ratings
- [ ] Checkout y pagos
- [ ] Progressive Web App (PWA)

### Mejoras Técnicas
- [ ] Server-side rendering para SEO
- [ ] Infinite scroll en resultados
- [ ] Virtual scrolling para listas grandes
- [ ] Service Worker para cache offline
- [ ] A/B testing framework
- [ ] Real-time notifications
- [ ] Micro-animations con Framer Motion
- [ ] Internationalization (i18n)

---

**Mantenido por**: Team acueductoShop  
**Versión**: 1.0.0  
**Licencia**: MIT