
import { CJDropshippingProvider } from '../lib/providers/cjdropshipping-provider';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    console.log('Testing CJDropshipping...');
    try {
        const provider = new CJDropshippingProvider();
        console.log('Searching "watch"...');
        const results = await provider.searchProducts('watch');

        console.log(`Found ${results.length} results.`);
        if (results.length > 0) {
            console.log('First Item:', results[0].title);
            console.log('Fetching details for:', results[0].externalId);
            const details = await provider.getProductDetails(results[0].externalId);
            console.log('Details Title:', details.title);
        } else {
            console.log('No results found from CJ.');
        }
    } catch (e: any) {
        console.error('CJ Test Failed:', e.message);
        if (e.response) {
            console.error('Data:', JSON.stringify(e.response.data, null, 2));
        }
    }
}

test();
