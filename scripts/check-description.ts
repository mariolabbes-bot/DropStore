
import { PrismaClient } from '@prisma/client';

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
    console.log('Checking recent product descriptions...');
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: 1
    });

    if (products.length === 0) {
        console.log('❌ No products found.');
    } else {
        products.forEach(p => {
            console.log(`\n📦 Product: ${p.title} (ID: ${p.id})`);
            console.log('--- DESCRIPTION START ---');
            console.log(p.description?.substring(0, 500) + '...'); // Print first 500 chars
            console.log('--- DESCRIPTION END ---');
        });
    }
    await prisma.$disconnect();
}

main();
