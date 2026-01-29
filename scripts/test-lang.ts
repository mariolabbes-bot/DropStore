
import { AliExpressRapidAPIProvider } from '../lib/providers/rapidapi-provider';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    try {
        const provider = new AliExpressRapidAPIProvider();
        console.log('Searching "reloj" (watch) in Spanish...');
        const results = await provider.searchProducts('reloj');

        if (results.length > 0) {
            console.log('First result title:', results[0].title);
            console.log('First result ID:', results[0].externalId);

            console.log('\nFetching details for first item...');
            const details = await provider.getProductDetails(results[0].externalId);
            console.log('Detail Title:', details.title);
            console.log('Detail Description Snippet:', details.description.substring(0, 100));
        } else {
            console.log('No results found.');
        }
    } catch (error: any) {
        console.error('Test failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

test();
