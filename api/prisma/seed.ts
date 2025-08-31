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
  console.log('\n🛒 Productos normales (precio completo):');
  console.log('- "Samsung", "LG", "Whirlpool", "Bosch", "KitchenAid", "Dyson", "Frigidaire"');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });