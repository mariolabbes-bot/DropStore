
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
        const results = await provider.searchProducts('smartwatch');
        console.log(`Found ${results.length} products`);
        if (results.length > 0) {
            console.log('First Result:', results[0].title, 'Price:', results[0].price);
        }
    } catch (e) {
        console.error('Search failed:', e);
    }
}

test();
