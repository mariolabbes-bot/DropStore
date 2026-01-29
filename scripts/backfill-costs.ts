
import { PrismaClient } from '@prisma/client';
import { ProviderFactory } from '../lib/providers/factory'; // Ensure this path is correct
import * as dotenv from 'dotenv';
import 'ts-node/register';

// Load env vars
dotenv.config({ path: '.env.local' });
dotenv.config();

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
    console.log('🔄 Starting Cost Price Backfill...');
    const products = await prisma.product.findMany({
        where: { costPrice: 0 }
    });

    console.log(`Found ${products.length} products to update.`);

    for (const product of products) {
        if (!product.externalId) {
            console.log(`❌ Skipping ${product.title} (No External ID)`);
            continue;
        }

        try {
            // Determine provider
            let providerName = 'aliexpress';
            if (product.vendor && product.vendor.toLowerCase().includes('cj')) {
                providerName = 'cj';
            }

            console.log(`Fetching details for ${product.title} (${providerName})...`);
            const provider = ProviderFactory.getProvider(providerName);
            const details = await provider.getProductDetails(product.externalId);

            if (details && details.price > 0) {
                await prisma.product.update({
                    where: { id: product.id },
                    data: {
                        costPrice: details.price
                    }
                });
                // Also update price if margin is weird (optional)? No, let's just update cost.
                console.log(`✅ Updated cost for ${product.title}: $${(details.price / 100).toFixed(2)}`);
            } else {
                console.log(`⚠️ Could not fetch valid price for ${product.title}`);
            }
        } catch (e) {
            console.error(`❌ Error updating ${product.title}:`, e);
        }

        await new Promise(r => setTimeout(r, 1000));
    }

    console.log('🎉 Backfill Complete!');
    await prisma.$disconnect();
}

main();
