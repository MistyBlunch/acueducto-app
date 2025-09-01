# Acueducto Web

Interfaz web moderna para búsqueda de productos con detección automática de palíndromos y descuentos inteligentes.

## 📋 Descripción del Proyecto

Acueducto Web es una aplicación frontend desarrollada en **Next.js 14** que proporciona una experiencia de búsqueda intuitiva con las siguientes características:

- **Búsqueda Inteligente**: Interfaz de búsqueda con debounce y estados de carga
- **Sistema de Descuentos**: Visualización clara de descuentos del 50% en productos con marcas palíndromas

### Funcionalidades Principales

- **Búsqueda con Debounce**: Optimización de consultas con retraso de 300ms
- **Estados de Búsqueda**: idle, loading, success, empty, error con componentes dedicados
- **Precios Dinámicos**: Visualización de precios originales y con descuento
- **Responsive Design**: Optimizado para móvil y escritorio

## 🛠️ Requerimientos del Sistema

### Desarrollo Local

- **Node.js** 18 o superior
- **yarn** para gestión de dependencias
- **API Backend** ejecutándose en puerto 3001

## 🚀 Configuración y Ejecución

### Opción 1: Desarrollo Local (Recomendado)

1. **Clonar e instalar dependencias**:

```bash
cd web
yarn install
```

2. **Configurar variables de entorno**:

```bash
cp .env.example .env.local
```

Archivo `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

3. **Asegurar que la API esté ejecutándose**:

```bash
curl http://localhost:3001/products
```

4. **Ejecutar en desarrollo**:

```bash
yarn dev
```

La aplicación estará disponible en: `http://localhost:3000`

## 📱 Páginas y Funcionalidades

### Rutas Principales

- **`/`** - Página principal con búsqueda de productos y resultados dinámicos

### Funcionalidades de Búsqueda

#### 🔍 Búsqueda Inteligente

- **Debounce**: Retraso de 300ms para optimizar consultas a la API
- **Estados Completos**: Manejo de loading, success, empty y error
- **Sugerencias Visuales**: Hints para términos palíndromos con potencial descuento

#### 🎨 Interfaz de Usuario

- **Diseño Moderno**: Colores azul primario y estética limpia
- **Componentes Reutilizables**: Sistema de design con shadcn/ui

```bash
# Desarrollo
yarn dev                 # Servidor desarrollo con hot-reload
yarn build              # Build de producción
yarn start              # Servidor de producción

# Testing
yarn test               # Todos los tests (unit + e2e)
```

## 🏃‍♂️ Quick Start

```bash
# Inicio rápido
cd web && npm install && npm run dev

# Verificar que funciona
open http://localhost:3000
```
