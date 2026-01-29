
import { CJDropshippingProvider } from '../lib/providers/cjdropshipping-provider';
import { AliExpressRapidAPIProvider } from '../lib/providers/rapidapi-provider';
import { AliExpressProvider } from '../lib/providers/aliexpress-provider';
import * as dotenv from 'dotenv';
dotenv.config();

async function testCJ(query: string) {
    console.log(`\n--- Testing CJ with query: "${query}" ---`);
    const cj = new CJDropshippingProvider();
    const results = await cj.searchProducts(query);
    console.log(`Found ${results.length} results.`);
    if (results.length > 0) {
        console.log('SearchResult Sample:', JSON.stringify(results[0], null, 2));

        if (results[0].externalId) {
            console.log(`\n--- Getting Full Details for ID: ${results[0].externalId} ---`);
            await new Promise(pkg => setTimeout(pkg, 2500)); // Wait 2.5s for rate limit
            // @ts-ignore
            // Accessing private method via type casting or just assuming public API in debug
            // Actually getProductDetails is public in the interface
            try {
                // We need to see the RAW response from axios if possible, 
                // but getProductDetails returns processed ProductData.
                // However, I suspect the 'variants' might be hiding in there if I didn't map them.
                // Let's print what we get.
                const details = await cj.getProductDetails(results[0].externalId);
                console.log('ProductDetails:', JSON.stringify(details, null, 2));
            } catch (e) {
                console.error(e);
            }
        }
    }
}

async function testAli(query: string) {
    console.log(`\n--- Testing AliExpress with query: "${query}" ---`);
    const ali = new AliExpressProvider();
    const results = await ali.searchProducts(query);
    console.log(`Found ${results.length} results.`);
    if (results.length > 0) {
        console.log('First result:', JSON.stringify(results[0], null, 2));
    }
}

async function main() {
    const mode = process.argv[2];
    const query = process.argv[3];

    if (!mode || !query) {
        console.log('Usage: ts-node scripts/debug-providers.ts <cj|ali|rapid> <query>');
        return;
    }

    if (mode === 'cj') {
        await testCJ(query);
    } else if (mode === 'ali') {
        await testAli(query);
    } else if (mode === 'rapid') {
        const { AliExpressRapidAPIProvider } = require('../lib/providers/rapidapi-provider');
        const provider = new AliExpressRapidAPIProvider();
        const results = await provider.searchProducts(query);
        console.log(`Found ${results.length} results.`);
        if (results.length > 0) {
            console.log('First result:', JSON.stringify(results[0], null, 2));
        }
    } else {
        console.log('Unknown mode. Use "cj", "ali", or "rapid".');
    }
}

main().catch(console.error);
