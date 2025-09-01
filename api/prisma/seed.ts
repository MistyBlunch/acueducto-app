import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  // Productos normales (sin descuento de palíndromo)
  {
    id: 'clp1234567890abcdef01',
    title: 'Samsung Refrigeradora French Door 28 pies',
    brand: 'Samsung',
    description: 'Refrigeradora de acero inoxidable con tecnología Twin Cooling Plus y dispensador de agua filtrada',
    priceCents: 189999, // $1,899.99
    currency: 'USD',
    stock: 8,
  },
  {
    id: 'clp1234567890abcdef02',
    title: 'LG Lavadora Carga Frontal 19 kg',
    brand: 'LG',
    description: 'Lavadora con tecnología TurboWash y sistema de vapor para eliminar alérgenos y bacterias',
    priceCents: 129999, // $1,299.99
    currency: 'USD',
    stock: 12,
  },
  {
    id: 'clp1234567890abcdef03',
    title: 'Whirlpool Secadora Eléctrica 17 kg',
    brand: 'Whirlpool',
    description: 'Secadora con sensor de humedad automático y ciclos especializados para diferentes tipos de tela',
    priceCents: 89999, // $899.99
    currency: 'USD',
    stock: 15,
  },
  {
    id: 'clp1234567890abcdef04',
    title: 'Bosch Lavavajillas Empotrable',
    brand: 'Bosch',
    description: 'Lavavajillas silencioso con tecnología PrecisionWash y tercera bandeja para cubiertos',
    priceCents: 79999, // $799.99
    currency: 'USD',
    stock: 10,
  },
  {
    id: 'clp1234567890abcdef05',
    title: 'KitchenAid Microondas Convección',
    brand: 'KitchenAid',
    description: 'Microondas con convección y grill, perfecto para cocinar, calentar y dorar alimentos',
    priceCents: 45999, // $459.99
    currency: 'USD',
    stock: 20,
  },
  {
    id: 'clp1234567890abcdef06',
    title: 'Dyson Aspiradora V15 Detect',
    brand: 'Dyson',
    description: 'Aspiradora inalámbrica con láser que detecta partículas microscópicas y filtrado HEPA',
    priceCents: 74999, // $749.99
    currency: 'USD',
    stock: 18,
  },
  {
    id: 'clp1234567890abcdef07',
    title: 'Frigidaire Congelador Vertical',
    brand: 'Frigidaire',
    description: 'Congelador vertical de 14 pies cúbicos con control digital de temperatura y alarma de puerta',
    priceCents: 64999, // $649.99
    currency: 'USD',
    stock: 7,
  },
  // Productos con nombres palíndromos (CON 50% descuento)
  {
    id: 'clp1234567890abcdef08',
    title: 'ANA Plancha de Vapor Professional',
    brand: 'ANA',
    description: 'Plancha de vapor con suela de cerámica y sistema anti-goteo para un planchado perfecto',
    priceCents: 12999, // $129.99 → $64.99 con descuento palíndromo
    currency: 'USD',
    stock: 25,
  },
  {
    id: 'clp1234567890abcdef09',
    title: 'OTTO Batidora de Pie Profesional',
    brand: 'OTTO',
    description: 'Batidora de pie de 6 litros con múltiples velocidades y accesorios intercambiables',
    priceCents: 39999, // $399.99 → $199.99 con descuento palíndromo  
    currency: 'USD',
    stock: 14,
  },
  {
    id: 'clp1234567890abcdef10',
    title: 'RADAR Horno de Convección Inteligente',
    brand: 'RADAR',
    description: 'Horno inteligente con conectividad WiFi, cámara interna y recetas pre-programadas',
    priceCents: 89999, // $899.99 → $449.99 con descuento palíndromo
    currency: 'USD',
    stock: 6,
  },
  {
    id: 'clp1234567890abcdef11',
    title: 'Electrolux Lavadora Automática 15 kg',
    brand: 'Electrolux',
    description: 'Lavadora de alta eficiencia con tecnología labba para mejor lavado y sistema de ahorro de agua',
    priceCents: 98999, // $989.99
    currency: 'USD',
    stock: 11,
  },
  {
    id: 'clp1234567890abcdef12',
    title: 'GE Profile Refrigeradora Side by Side',
    brand: 'GE',
    description: 'Refrigeradora con dispensador de agua y hielo, compartimentos especializados para conservación',
    priceCents: 156789, // $1,567.89
    currency: 'USD',
    stock: 9,
  },
  {
    id: 'clp1234567890abcdef13',
    title: 'Miele Aspiradora Robot Inteligente',
    brand: 'Miele',
    description: 'Robot aspiradora con navegación láser y sistema tabbavision para mapeo preciso del hogar',
    priceCents: 89999, // $899.99
    currency: 'USD',
    stock: 16,
  },
  {
    id: 'clp1234567890abcdef14',
    title: 'Sharp Microondas Convección 1.8 pies',
    brand: 'Sharp',
    description: 'Microondas con convección y grill, pantalla digital táctil y múltiples programas de cocción',
    priceCents: 34999, // $349.99
    currency: 'USD',
    stock: 22,
  },
  {
    id: 'clp1234567890abcdef15',
    title: 'Kenmore Elite Lavavajillas Ultra Silencioso',
    brand: 'Kenmore',
    description: 'Lavavajillas premium con tecnología labbadora para limpieza profunda y funcionamiento silencioso',
    priceCents: 72999, // $729.99
    currency: 'USD',
    stock: 13,
  },
  {
    id: 'clp1234567890abcdef16',
    title: 'Cuisinart Procesador de Alimentos 14 Tazas',
    brand: 'Cuisinart',
    description: 'Procesador de alimentos multifuncional con cuchillas de acero inoxidable y múltiples accesorios',
    priceCents: 19999, // $199.99
    currency: 'USD',
    stock: 28,
  },
  {
    id: 'clp1234567890abcdef17',
    title: 'Black+Decker Plancha Vertical de Vapor',
    brand: 'Black+Decker',
    description: 'Plancha vertical para cortinas y ropa colgada, con sistema anti-goteo y vapor continuo',
    priceCents: 7999, // $79.99
    currency: 'USD',
    stock: 35,
  },
  {
    id: 'clp1234567890abcdef18',
    title: 'Ninja Batidora Personal para Smoothies',
    brand: 'Ninja',
    description: 'Batidora compacta ideal para smoothies individuales, con vaso portátil y cuchillas premium',
    priceCents: 8999, // $89.99
    currency: 'USD',
    stock: 42,
  },
  {
    id: 'clp1234567890abcdef19',
    title: 'Hamilton Beach Cafetera Programable 12 Tazas',
    brand: 'Hamilton Beach',
    description: 'Cafetera programable con filtro permanente, placa calefactora y función de pausa para servir',
    priceCents: 4999, // $49.99
    currency: 'USD',
    stock: 31,
  },
  {
    id: 'clp1234567890abcdef20',
    title: 'Oster Tostadora 4 Rebanadas',
    brand: 'Oster',
    description: 'Tostadora de acero inoxidable con 7 niveles de tostado y función de descongelado',
    priceCents: 3499, // $34.99
    currency: 'USD',
    stock: 45,
  },
  {
    id: 'clp1234567890abcdef21',
    title: 'Vitamix Licuadora Profesional Serie 750',
    brand: 'Vitamix',
    description: 'Licuadora de alta potencia con motor de 2.2 HP, perfecta para smoothies, sopas calientes y más',
    priceCents: 52999, // $529.99
    currency: 'USD',
    stock: 8,
  },
  {
    id: 'clp1234567890abcdef22',
    title: 'Breville Horno Tostador Convección Smart',
    brand: 'Breville',
    description: 'Horno tostador inteligente con 13 funciones preestablecidas y tecnología Element IQ',
    priceCents: 29999, // $299.99
    currency: 'USD',
    stock: 17,
  },
  {
    id: 'clp1234567890abcdef23',
    title: 'De\'Longhi Cafetera Espresso Automática',
    brand: 'De\'Longhi',
    description: 'Máquina de espresso con molinillo integrado, espumador de leche automático y panel táctil',
    priceCents: 84999, // $849.99
    currency: 'USD',
    stock: 6,
  },
  {
    id: 'clp1234567890abcdef24',
    title: 'Instant Pot Olla de Presión Eléctrica 8 Qt',
    brand: 'Instant Pot',
    description: 'Olla multiusos 7-en-1: olla de presión, olla lenta, arrocera, vaporera, salteadora, yogurtera y calentador',
    priceCents: 12999, // $129.99
    currency: 'USD',
    stock: 24,
  },
  {
    id: 'clp1234567890abcdef25',
    title: 'Shark Navigator Aspiradora Vertical',
    brand: 'Shark',
    description: 'Aspiradora vertical con tecnología Anti-Wrap y sistema labbadora avanzado para alfombras',
    priceCents: 17999, // $179.99
    currency: 'USD',
    stock: 19,
  },
  {
    id: 'clp1234567890abcdef26',
    title: 'Honeywell Purificador de Aire HEPA',
    brand: 'Honeywell',
    description: 'Purificador con filtros HEPA verdaderos, captura 99.97% de partículas y alérgenos del aire',
    priceCents: 24999, // $249.99
    currency: 'USD',
    stock: 21,
  },
  {
    id: 'clp1234567890abcdef27',
    title: 'Bissell Limpiadora de Alfombras ProHeat',
    brand: 'Bissell',
    description: 'Limpiadora de alfombras con tecnología de calentamiento y cepillos DualAction para limpieza profunda',
    priceCents: 19999, // $199.99
    currency: 'USD',
    stock: 14,
  },
  {
    id: 'clp1234567890abcdef28',
    title: 'Keurig Cafetera de Cápsulas K-Elite',
    brand: 'Keurig',
    description: 'Cafetera de cápsulas con múltiples tamaños de taza, función de café helado y filtro de agua',
    priceCents: 16999, // $169.99
    currency: 'USD',
    stock: 26,
  },
  {
    id: 'clp1234567890abcdef29',
    title: 'Air Fryer Cosori Premium 5.8 Qt',
    brand: 'Cosori',
    description: 'Freidora de aire con 11 preajustes, pantalla táctil digital y recetario incluido para cocina saludable',
    priceCents: 11999, // $119.99
    currency: 'USD',
    stock: 33,
  },
  {
    id: 'clp1234567890abcdef30',
    title: 'Roomba i7+ Robot Aspiradora iRobot',
    brand: 'iRobot',
    description: 'Robot aspiradora inteligente con vaciado automático, mapeo preciso y control por app móvil con labba',
    priceCents: 79999, // $799.99
    currency: 'USD',
    stock: 5,
  },
  
  // PRODUCTOS CON MARCAS PALÍNDROMAS ADICIONALES
  {
    id: 'clp1234567890abcdef31',
    title: 'EVE Extractor de Jugos Premium',
    brand: 'EVE',
    description: 'Extractor de jugos de velocidad lenta con sistema de prensado en frío y motor silencioso',
    priceCents: 32999, // $329.99 → $164.99 con descuento palíndromo
    currency: 'USD',
    stock: 12,
  },
];

async function main(): Promise<void> {
  console.log('🌱 Starting seed...');

  // Enable pg_trgm extension
  await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;
  console.log('✅ pg_trgm extension enabled');

  // Clear existing products
  await prisma.product.deleteMany({});
  console.log('🧹 Cleared existing products');

  // Insert seed products
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`🎯 Seeded ${products.length} electrodomésticos`);
  console.log('✨ Seed completed successfully!');

  // Show palindrome products for discount testing
  console.log('\n🎁 Productos con descuento de palíndromo (50% OFF):');
  console.log('- "ANA" ✅ (palíndromo → 50% descuento)');
  console.log('- "OTTO" ✅ (palíndromo → 50% descuento)'); 
  console.log('- "RADAR" ✅ (palíndromo → 50% descuento)');
  console.log('- "EVE" ✅ (palíndromo → 50% descuento)');
  console.log('\n🔍 Productos con palíndromos en descripción:');
  console.log('- Electrolux → "labba" en descripción');
  console.log('- Miele → "tabbavision" en descripción');
  console.log('- Kenmore Elite → "labbadora" en descripción');
  console.log('- Shark Navigator → "labbadora" en descripción');
  console.log('- Roomba i7+ → "labba" en descripción');
  console.log('\n🛒 Total productos: 31 (27 normales + 4 palíndromos)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });