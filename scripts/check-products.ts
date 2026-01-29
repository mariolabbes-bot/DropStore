
import { PrismaClient } from '@prisma/client';

// Use the patched prisma client if available, or just standard for this script logic
// Since this script runs locally with "npx ts-node", it uses local env vars.
// But we want to check PRODUCTION DB properly.
// We should rely on the patched client logic if we can, or just force the protocol here too.

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
    console.log('Checking recent products...');
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3
    });

    if (products.length === 0) {
        console.log('❌ No products found in DB.');
    } else {
        console.log('✅ Found products:');
        products.forEach(p => {
            console.log(`- [${p.id}] ${p.title} (Vendor: ${p.vendor})`);
        });
    }
    await prisma.$disconnect();
}

main();
