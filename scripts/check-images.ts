
import { PrismaClient } from '@prisma/client';

// Use protocol patch logic inline since we are running via ts-node
const getFixedDatabaseUrl = () => {
    let url = process.env.DATABASE_URL;
    if (!url) return undefined;
    if (url.startsWith('neondb://')) return url.replace('neondb://', 'postgresql://');
    return url;
};
const fixedUrl = getFixedDatabaseUrl();
const prisma = new PrismaClient({
    datasources: fixedUrl ? { db: { url: fixedUrl } } : undefined
});

async function main() {
    console.log('Checking recent products and their images...');
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    if (products.length === 0) {
        console.log('❌ No products found.');
    } else {
        products.forEach(p => {
            console.log(`\n📦 Product: ${p.title} (ID: ${p.id})`);
            console.log(`   Vendor: ${p.vendor}`);
            console.log(`   Main Image (p.image): ${p.image ? p.image : 'FAILED/NULL'}`);
            console.log(`   Image Array (p.images): ${JSON.stringify(p.images)}`);
        });
    }
    await prisma.$disconnect();
}

main();
