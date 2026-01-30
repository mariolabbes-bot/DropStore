/**
 * Test script for Direct Import functionality
 * Tests the /api/admin/products/details endpoint
 */

import { AliExpressRapidAPIProvider } from '../lib/providers/rapidapi-provider';

async function testDirectImport() {
    console.log('Testing Direct Import Feature...\n');

    const provider = new AliExpressRapidAPIProvider();

    // Test URLs
    const testCases = [
        'https://www.aliexpress.com/item/1005010179828716.html',
        '1005010179828716',
        'https://es.aliexpress.com/item/1005010179828716.html?spm=a2g0o.productlist',
    ];

    for (const testCase of testCases) {
        console.log(`Testing: ${testCase}`);

        // Extract ID
        const idMatch = testCase.match(/(\d{10,20})/);
        const id = idMatch ? idMatch[1] : null;

        if (!id) {
            console.log('  ❌ Failed to extract ID\n');
            continue;
        }

        console.log(`  ✓ Extracted ID: ${id}`);

        try {
            const details = await provider.getProductDetails(id);
            console.log(`  ✓ Title: ${details.title.substring(0, 50)}...`);
            console.log(`  ✓ Price: $${(details.price / 100).toFixed(2)}`);
            console.log(`  ✓ Images: ${details.images.length} found`);
            console.log('  ✅ SUCCESS\n');
        } catch (error: any) {
            console.log(`  ❌ Error: ${error.message}\n`);
        }
    }
}

testDirectImport().catch(console.error);
