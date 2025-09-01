# Acueducto API

API de búsqueda de productos con filtrado inteligente y sistema de descuentos por palíndromos.

## 📋 Descripción del Proyecto

Acueducto es una API desarrollada en **NestJS** que implementa un sistema de búsqueda inteligente de productos con las siguientes características principales:

- **Búsqueda Inteligente**: Algoritmo que combina coincidencia exacta.
- **Sistema de Descuentos por Palíndromos**: Los productos con marcas palíndromas obtienen 50% de descuento automáticamente
- **Arquitectura Limpia**: Separación clara entre capas (Core/Application/Infrastructure)
- **Base de Datos Automática**: Inicialización automática con más de 30 productos de electrodomésticos

## 🛠️ Requerimientos del Sistema

### Localmente
- **Node.js** 18 o superior
- **PostgreSQL** 15 o superior
- **yarn** para gestión de dependencias

### Con Docker
- **Docker** 20.10 o superior
- **Docker Compose** v2.0 o superior

## 🚀 Configuración y Ejecución

### Opción 1: Desarrollo Local

1. **Clonar e instalar dependencias**:
```bash
cd api
yarn install
```

2. **Configurar variables de entorno**:
```bash
cp .env.example .env
# Editar .env con la configuración de tu base de datos local
```

3. **Configurar base de datos**:
```bash
# Crear base de datos PostgreSQL
createdb acueducto

# Ejecutar migraciones y seed
yarn prisma:migrate:deploy
yarn prisma:generate
yarn ts-node prisma/seed.ts
```

4. **Ejecutar en desarrollo**:
```bash
yarn start:dev
```

La API estará disponible en: `http://localhost:3001`

### Opción 2: Docker

```bash
cd api
docker-compose up -d
```

Este comando:
- Levanta PostgreSQL en puerto `5432`
- Compila y ejecuta la API en puerto `3001`
- Ejecuta migraciones automáticamente
- **Carga los más de 30 productos automáticamente** via seed

**URLs disponibles**:
- API: `http://localhost:3001`
- Documentación: `http://localhost:3001/api/docs`

## 📖 API Endpoints

### Búsqueda de Productos

```http
GET /products?query={search}&page={page}&pageSize={limit}
```

#### Parámetros de Query

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `query` | string | No | Término de búsqueda | `"Samsung"`, `"ana"` |
| `page` | number | No | Número de página (base 1) | `1` |
| `pageSize` | number | No | Productos por página (1-100) | `10` |

#### Ejemplos de Uso

**1. Búsqueda por marca normal:**
```bash
curl "http://localhost:3001/products?query=Samsung&page=1&pageSize=5"
```

**2. Búsqueda con descuento palíndromo:**
```bash
curl "http://localhost:3001/products?query=ana&page=1&pageSize=10"
```
> ✨ Los productos con marca "ANA" mostrarán precio original tachado y precio con descuento

**3. Listar todos los productos:**
```bash
curl "http://localhost:3001/products?page=1&pageSize=10"
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
yarn start:dev            # Modo desarrollo con hot-reload
yarn build               # Compilar para producción
yarn start               # Ejecutar versión compilada

# Base de datos
yarn prisma:generate     # Generar cliente Prisma
yarn prisma:migrate:deploy # Aplicar migraciones
yarn prisma:seed         # Ejecutar seed manualmente

# Docker
docker-compose up -d      # Levantar todos los servicios
docker-compose down       # Detener servicios
docker-compose logs api   # Ver logs de la API
```

## 💡 Creación de Productos

### ⚡ Generación Automática (Seed)

El seed se ejecuta automáticamente en Docker y puede ejecutarse manualmente con:
```bash
yarn ts-node prisma/seed.ts
```

### 🔧 Creación Manual via API

Si deseas crear productos adicionales via API, puedes implementar endpoints POST/PUT siguiendo la estructura existente del proyecto:

```typescript
// Estructura del modelo Product
{
  id: string;           // ID único
  title: string;        // Nombre del producto
  brand: string;        // Marca (si es palíndromo → 50% descuento)
  description: string;  // Descripción detallada
  priceCents: number;   // Precio en centavos (ej: 12999 = $129.99)
  currency: string;     // Moneda (USD)
  stock: number;        // Cantidad disponible
}
```

## 🏃‍♂️ Quick Start

```bash
# Opción más rápida - Docker
cd api && docker-compose up -d

# Verificar que funciona
curl "http://localhost:3001/products?query=ana"
