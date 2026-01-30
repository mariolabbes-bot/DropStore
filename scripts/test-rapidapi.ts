
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { AliExpressRapidAPIProvider } from '../lib/providers/rapidapi-provider';

async function test() {
    console.log('Testing Rapid API Wrapper...');
    if (!process.env.RAPIDAPI_KEY) {
        console.error('ERROR: RAPIDAPI_KEY not found in env');
        process.exit(1);
    }

    const provider = new AliExpressRapidAPIProvider();
    try {
        const testId = '1005010179828716';
        console.log(`Testing getProductDetails for ID: ${testId}`);
        const product = await provider.getProductDetails(testId);
        console.log('Product Found:', product.title);

        console.log('\nTesting search for "watch"...');
        const results = await provider.searchProducts('watch');
        console.log(`Found ${results.length} products`);
    } catch (e: any) {
        console.error('Test failed:', e.message);
        if (e.response) {
            console.log('Error Status:', e.response.status);
            console.log('Error Data:', JSON.stringify(e.response.data));
        }
    }
}

test();
