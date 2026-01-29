
import { AliExpressRapidAPIProvider } from '../lib/providers/rapidapi-provider';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    try {
        const provider = new AliExpressRapidAPIProvider();
        const id = '1005005167379524';
        console.log(`Fetching details for ${id} in Spanish...`);

        const details = await provider.getProductDetails(id);
        console.log('Success!');
        console.log('Title:', details.title);
        console.log('Desc Start:', details.description.substring(0, 50));

    } catch (error: any) {
        console.error('Test failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

test();
