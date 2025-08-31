# 🎾 TennisShop API

API REST para e-commerce de productos de tenis con descuentos automáticos por palíndromos, construida con **Clean Architecture** y **principios hexagonales**.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 HTTP Layer                            │
│  Controllers, Filters, Middlewares, DTOs, Swagger          │
├─────────────────────────────────────────────────────────────┤
│                   📋 Application Layer                      │
│     Use Cases, Command/Query Handlers, Services            │
├─────────────────────────────────────────────────────────────┤
│                    🏢 Domain Layer                          │
│    Entities, Value Objects, Domain Services, Interfaces    │
├─────────────────────────────────────────────────────────────┤
│                 🔌 Infrastructure Layer                     │
│   Database, External APIs, File System, Configuration      │
└─────────────────────────────────────────────────────────────┘
```

### Estructura del Proyecto
```
src/
├── 🌐 infrastructure/
│   ├── http/                    # Controllers, DTOs, Filters
│   ├── database/                # Prisma, migrations
│   ├── repositories/            # Data access implementations
│   └── config/                  # Environment, validation
├── 📋 application/
│   ├── use-cases/               # Business logic orchestration
│   ├── services/                # Application services
│   └── dtos/                    # Data transfer objects
├── 🏢 domain/
│   ├── entities/                # Business entities
│   ├── services/                # Pure domain logic
│   └── interfaces/              # Repository contracts
└── 🧪 test/
    ├── unit/                    # Isolated unit tests
    ├── integration/             # Database integration tests
    └── e2e/                     # End-to-end API tests
```

## 🚀 Inicio Rápido

### Requisitos
- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **Docker** >= 20.x (opcional)
- **Yarn** >= 1.22.x

### Variables de Entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.example .env
```

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/tennisshop?schema=public"
DATABASE_URL_TEST="postgresql://postgres:password@localhost:5432/tennisshop_test?schema=public"

# Application
NODE_ENV="development"
PORT=3001
API_VERSION="v1"

# Logging
LOG_LEVEL="info"
LOG_FORMAT="json"

# CORS
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🛠️ Comandos Disponibles

### Desarrollo
```bash
# Instalar dependencias
yarn install

# Levantar base de datos
yarn db:start

# Ejecutar migraciones
yarn db:migrate

# Sembrar datos de prueba
yarn db:seed

# Modo desarrollo con hot-reload
yarn dev

# Generar cliente Prisma
yarn db:generate
```

### Testing
```bash
# Todos los tests
yarn test

# Tests unitarios
yarn test:unit
yarn test:unit:watch

# Tests de integración
yarn test:integration

# Tests e2e
yarn test:e2e

# Cobertura
yarn test:coverage
```

### Producción
```bash
# Build optimizado
yarn build

# Iniciar servidor de producción
yarn start

# Verificar estado de la aplicación
yarn health-check
```

### Base de Datos
```bash
# Levantar PostgreSQL con Docker
yarn db:start

# Parar PostgreSQL
yarn db:stop

# Resetear base de datos
yarn db:reset

# Visualizar datos con Prisma Studio
yarn db:studio

# Crear nueva migración
yarn db:migrate:create

# Deploy de migraciones en producción
yarn db:migrate:deploy
```

## 🐳 Docker

### Desarrollo con Docker Compose
```bash
# Levantar todo el stack (API + PostgreSQL)
docker-compose -f ops/docker-compose.yml up

# Solo la base de datos
docker-compose -f ops/docker-compose.yml up postgres

# Con rebuild
docker-compose -f ops/docker-compose.yml up --build
```

### Sin Docker (Desarrollo Local)
```bash
# Instalar PostgreSQL localmente
brew install postgresql  # macOS
sudo apt-get install postgresql  # Ubuntu

# Crear base de datos
createdb tennisshop
createdb tennisshop_test

# Configurar .env con tu URL local
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/tennisshop"

# Ejecutar migraciones y seeds
yarn db:migrate
yarn db:seed

# Levantar aplicación
yarn dev
```

### Producción con Docker
```bash
# Build de imagen optimizada
docker build -t tennisshop-api .

# Ejecutar contenedor
docker run -p 3001:3001 --env-file .env tennisshop-api

# Con docker-compose en producción
docker-compose -f ops/docker-compose.prod.yml up
```

## 📚 API Endpoints

### Documentación Swagger
- **Swagger UI**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- **OpenAPI JSON**: [http://localhost:3001/api/docs-json](http://localhost:3001/api/docs-json)

### Rutas Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Health check del servicio |
| `GET` | `/api/products/search` | Búsqueda de productos con paginación |
| `GET` | `/api/products/:id` | Obtener producto por ID |
| `POST` | `/api/products` | Crear nuevo producto |
| `PUT` | `/api/products/:id` | Actualizar producto existente |
| `DELETE` | `/api/products/:id` | Eliminar producto |

## 🔧 Ejemplos de Uso

### Búsqueda de Productos

```bash
# Búsqueda simple
curl "http://localhost:3001/api/products/search?query=raqueta&page=1&pageSize=10"

# Búsqueda palíndroma (con descuento automático)
curl "http://localhost:3001/api/products/search?query=oso&page=1&pageSize=10"

# Búsqueda sin query (todos los productos)
curl "http://localhost:3001/api/products/search?page=1&pageSize=10"

# Con headers completos
curl -X GET \
  "http://localhost:3001/api/products/search?query=wilson&page=1&pageSize=5" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"
```

### Respuesta de Búsqueda
```json
{
  "items": [
    {
      "id": "uuid-1",
      "title": "Raqueta Wilson Pro Staff",
      "brand": "Wilson",
      "description": "Raqueta profesional utilizada por los mejores jugadores del mundo",
      "priceCents": 25000,
      "finalPriceCents": 12500,
      "currency": "EUR",
      "stock": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "palindromeDiscountApplied": true
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  },
  "meta": {
    "query": "oso",
    "isPalindrome": true,
    "executedAt": "2024-01-01T10:30:00.000Z",
    "executionTimeMs": 45
  }
}
```

### Obtener Producto por ID

```bash
curl "http://localhost:3001/api/products/550e8400-e29b-41d4-a716-446655440000"
```

### Crear Producto

```bash
curl -X POST "http://localhost:3001/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pelota Wilson Championship",
    "brand": "Wilson",
    "description": "Pack de 3 pelotas oficiales",
    "priceCents": 800,
    "currency": "EUR",
    "stock": 50
  }'
```

### Actualizar Producto

```bash
curl -X PUT "http://localhost:3001/api/products/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pelota Wilson Championship - Edición Especial",
    "priceCents": 900,
    "stock": 25
  }'
```

### Eliminar Producto

```bash
curl -X DELETE "http://localhost:3001/api/products/550e8400-e29b-41d4-a716-446655440000"
```

## 🧪 Estrategia de Testing

### Unit Tests
- **Framework**: Jest + TypeScript
- **Cobertura**: Entities, Domain Services, Use Cases
- **Mocking**: Repositories mockeados para aislamiento
- **Ubicación**: `src/test/unit/`

### Integration Tests
- **Framework**: Jest + TestContainers
- **Cobertura**: Repositories, Database, External APIs
- **Base de Datos**: PostgreSQL en contenedor Docker
- **Ubicación**: `src/test/integration/`

### E2E Tests
- **Framework**: Jest + Supertest
- **Cobertura**: API completa, flujos de usuario
- **Base de Datos**: SQLite en memoria para velocidad
- **Ubicación**: `src/test/e2e/`

### Comandos de Testing
```bash
# Ejecutar por tipo
yarn test:unit          # Solo unit tests
yarn test:integration   # Solo integration tests
yarn test:e2e          # Solo e2e tests

# Con cobertura
yarn test:coverage

# Watch mode para desarrollo
yarn test:unit:watch

# Tests específicos
yarn test --testPathPattern="product"
yarn test --testNamePattern="palindrome"
```

## 🏛️ Decisiones Arquitectónicas

### ¿Por qué Clean Architecture?
- **Separación de responsabilidades**: Cada capa tiene un propósito específico
- **Independencia de frameworks**: La lógica de negocio no depende de NestJS o Prisma
- **Testabilidad**: Fácil mockeo de dependencias para testing aislado
- **Mantenibilidad**: Cambios en infraestructura no afectan la lógica de negocio
- **Escalabilidad**: Fácil añadir nuevas funcionalidades siguiendo patrones establecidos

### ¿Por qué Prisma?
- **Type Safety**: Generación automática de tipos TypeScript
- **Migrations**: Control de versiones de base de datos robusto
- **Performance**: Query engine optimizado con conexión pooling
- **Developer Experience**: Prisma Studio para visualización de datos
- **Ecosystem**: Excelente integración con NestJS y PostgreSQL

### ¿Por qué PostgreSQL?
- **Extensiones avanzadas**: pg_trgm para búsqueda fuzzy optimizada
- **ACID Compliance**: Transacciones robustas para e-commerce
- **Performance**: Índices avanzados y optimización de queries
- **JSON Support**: Flexibilidad para metadatos de productos
- **Escalabilidad**: Read replicas y partitioning para crecimiento

### Lógica de Palíndromos
- **Detección**: Normalización Unicode + eliminación de caracteres especiales
- **Descuento**: 50% automático aplicado en tiempo real
- **Almacenamiento**: Flag `palindromeDiscountApplied` en respuesta
- **Performance**: Cálculo en aplicación, no en base de datos
- **UX**: Feedback inmediato al usuario sobre descuentos aplicados

```typescript
// Algoritmo de detección de palíndromos
function isPalindrome(str: string): boolean {
  const normalized = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Keep only alphanumeric
  
  return normalized === normalized.split('').reverse().join('')
}
```

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos
```bash
# Verificar que PostgreSQL esté corriendo
yarn db:start

# Verificar configuración de conexión
echo $DATABASE_URL

# Regenerar cliente Prisma
yarn db:generate

# Aplicar migraciones
yarn db:migrate
```

#### 2. Puerto Ocupado
```bash
# Verificar qué proceso usa el puerto 3001
lsof -ti:3001

# Matar proceso si es necesario
kill -9 $(lsof -ti:3001)

# Cambiar puerto en .env
PORT=3002
```

#### 3. Tests Fallando
```bash
# Limpiar cache de Jest
yarn test --clearCache

# Recrear base de datos de test
yarn db:reset --env=test

# Verificar variables de entorno de test
cat .env.test
```

#### 4. Problemas de Performance
```bash
# Verificar queries lentas en logs
yarn dev | grep "slow query"

# Analizar queries con Prisma
yarn db:studio

# Verificar índices en base de datos
yarn db:migrate:status
```

#### 5. Docker Issues
```bash
# Limpiar contenedores y volúmenes
docker-compose down -v
docker system prune -f

# Reconstruir imagen
docker-compose build --no-cache

# Verificar logs
docker-compose logs -f api
```

### Logs y Debugging

#### Configuración de Logs
```env
# Nivel de detalle
LOG_LEVEL="debug"  # error, warn, info, debug, verbose

# Formato de salida
LOG_FORMAT="pretty"  # json, pretty
```

#### Debugging con VS Code
```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug API",
  "program": "${workspaceFolder}/dist/main.js",
  "env": {
    "NODE_ENV": "development"
  },
  "console": "integratedTerminal",
  "restart": true,
  "runtimeArgs": ["--nolazy"],
  "sourceMaps": true
}
```

#### Métricas y Monitoreo
```bash
# Health check endpoint
curl http://localhost:3001/health

# Métricas de aplicación (si implementadas)
curl http://localhost:3001/metrics

# Verificar conexión a BD
yarn db:status
```

### Scripts de Utilidad

#### Reset Completo del Entorno
```bash
#!/bin/bash
# reset-env.sh
yarn db:stop
docker system prune -f
yarn install
yarn db:start
sleep 5
yarn db:migrate
yarn db:seed
yarn dev
```

#### Backup de Base de Datos
```bash
#!/bin/bash
# backup-db.sh
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql
```

## 📖 Recursos Adicionales

- [Documentación de NestJS](https://nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Extensions](https://www.postgresql.org/docs/current/contrib.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

---

**Mantenido por**: Team TennisShop  
**Versión**: 1.0.0  
**Licencia**: MIT