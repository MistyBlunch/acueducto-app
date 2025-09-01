# Testing Guide

Este proyecto utiliza **Vitest** para tests unitarios y **Playwright** para tests end-to-end.

## 🧪 Configuración de Testing

### Unit Tests (Vitest + React Testing Library)

- **Framework**: Vitest con React Testing Library
- **Environment**: jsdom
- **Setup**: `src/test/setup.ts`
- **Utils**: `src/test/utils.tsx` con providers personalizados

### E2E Tests (Playwright)

- **Framework**: Playwright
- **API Mocking**: Route interception con responses mockeadas
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome/Safari
- **Config**: `playwright.config.ts`

## 📝 Scripts Disponibles

```bash
# Ejecutar todos los tests
npm run test

# Tests unitarios
npm run test:unit              # Ejecutar una vez
npm run test:unit:watch        # Modo watch
npm run test:unit:ui           # UI interactiva de Vitest

# Tests e2e
npm run test:e2e               # Ejecutar todos los e2e
npm run test:e2e:ui            # UI de Playwright
npm run test:e2e:headed        # Con navegador visible

# Setup inicial de Playwright
npm run playwright:install
```

## 🎯 Tests Unitarios

### Cobertura Actual

#### `src/lib/utils.test.ts`

- ✅ `isPalindrome()` - Detección de palíndromos con casos edge
- ✅ `formatPrice()` - Formateo de precios por moneda
- ✅ `debounce()` - Funcionalidad de debounce

#### `src/components/search-bar.test.tsx`

- ✅ Renderizado y placeholder personalizable
- ✅ Debounce de 300ms en búsquedas
- ✅ Detección de palíndromos en tiempo real
- ✅ Botón de limpiar búsqueda
- ✅ Submit del formulario
- ✅ Estado de loading/disabled
- ✅ Manejo de caracteres especiales

#### `src/components/product-card.test.tsx`

- ✅ Renderizado de información del producto
- ✅ Visualización de precios con/sin descuento
- ✅ Badges de descuento palíndromo
- ✅ Estados de stock (sin stock, pocas unidades)
- ✅ Diferentes monedas
- ✅ Casos edge de precios (0, muy altos)
- ✅ Textos largos con truncamiento

#### `src/components/price.test.tsx`

- ✅ Precio regular sin descuento
- ✅ Precio con descuento y tachado
- ✅ Mensaje de descuento palíndromo
- ✅ Diferentes monedas y precisión
- ✅ Casos edge y validaciones

#### `src/hooks/use-product-search.test.tsx`

- ✅ Estados del hook (idle, loading, success, error, empty)
- ✅ Detección de palíndromos
- ✅ Debounce y actualización de query
- ✅ Paginación y reseteo de página
- ✅ Manejo de errores de API
- ✅ Metadata de búsqueda

## 🎭 Tests E2E

### Flujos Principales (`e2e/search-flow.spec.ts`)

#### Estado Inicial

- ✅ Renderizado de header con tema de tenis
- ✅ Barra de búsqueda presente
- ✅ Estado idle con tips de búsqueda

#### Búsqueda Palíndroma

- ✅ Detección de palíndromo con hint visual
- ✅ Resultados con descuentos del 50%
- ✅ Banner de descuento palíndromo
- ✅ Precios tachados y finales
- ✅ Badges de descuento en productos

#### Búsqueda No Palíndroma

- ✅ Sin hints de palíndromo
- ✅ Precios regulares sin descuento
- ✅ Metadata de búsqueda correcta

#### Casos Edge

- ✅ Resultados vacíos con sugerencias
- ✅ Manejo de errores con retry
- ✅ Estados de carga con skeletons
- ✅ Debounce en tiempo real
- ✅ Limpiar búsqueda

#### Navegación

- ✅ Detección de palíndromos en tiempo real

#### Detalles de Productos

- ✅ Información completa del producto
- ✅ Precios con descuentos aplicados
- ✅ Stock y disponibilidad

## 🔧 Configuración Avanzada

### Mocking de API

Los tests e2e usan route interception para mockear la API:

```typescript
// Respuestas mockeadas por query
'oso' | 'ana' | 'radar' → Productos con descuento palíndromo
'raqueta' → Productos regulares sin descuento
'noexiste' → Resultados vacíos
'error' → Error 500 del servidor
```

### Providers de Testing

Los tests unitarios incluyen providers automáticos:

- `QueryClientProvider` con configuración de testing
- `ThemeProvider` para temas
- Mocks de Next.js router y navigation

### Variables de Entorno

```env
# Testing
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## 🚀 CI/CD

### GitHub Actions (ejemplo)

```yaml
- name: Install dependencies
  run: npm ci

- name: Run unit tests
  run: npm run test:unit

- name: Install Playwright browsers
  run: npm run playwright:install

- name: Run e2e tests
  run: npm run test:e2e
```

## 📊 Cobertura y Métricas

### Componentes Testeados

- ✅ SearchBar (100% funcionalidad)
- ✅ ProductCard (todos los casos)
- ✅ Price (casos edge incluidos)
- ✅ useProductSearch (hook completo)
- ✅ Utils (isPalindrome, formatPrice, debounce)

### Funcionalidades E2E

- ✅ Flujo completo de búsqueda
- ✅ Detección y aplicación de descuentos palíndromo
- ✅ Estados de la aplicación (idle, loading, success, error, empty)
- ✅ Navegación y UI interactiva
- ✅ Responsividad y accesibilidad básica

## 🛠️ Troubleshooting

### Problemas Comunes

1. **Tests unitarios fallan por providers**

   ```bash
   # Usar render personalizado
   import { render } from '@/test/utils'
   ```

2. **Playwright no encuentra elementos**

   ```bash
   # Verificar que MSW esté configurado
   # Usar locators específicos: page.getByRole(), getByText()
   ```

3. **API mocking no funciona**

   ```bash
   # Verificar routes en e2e/fixtures/base.ts
   # Comprobar URLs y query parameters
   ```

4. **Timeouts en e2e**
   ```bash
   # Aumentar timeouts en playwright.config.ts
   # Usar waitFor con timeouts específicos
   ```

## 📈 Próximos Pasos

- [ ] Tests de integración con API real
- [ ] Tests de rendimiento con Lighthouse
- [ ] Tests de accesibilidad con axe-core
- [ ] Visual regression testing
- [ ] Tests de carga con Artillery
