
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function debugAliExpress() {
    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST || 'aliexpress-true-api.p.rapidapi.com';
    const query = "Ajazz AK820/AK820Pro Gaming Mechanical Keyboard Bluetooth 5.1/Wireless/C";

    console.log(`Searching for: ${query}`);

    try {
        const url = `https://${apiHost}/s/${query}`; // This specific API might have different endpoints, checking the class usage
        // The class uses /api/v3/products
        const searchUrl = `https://${apiHost}/api/v3/products`;

        const response = await axios.get(searchUrl, {
            params: {
                keywords: query,
                country: 'US',
                currency: 'USD',
                target_currency: 'USD',
                language: 'en',
                page_no: 1,
                page_size: 5
            },
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            }
        });

        const products = response.data?.products?.product || [];

        console.log(`Found ${products.length} products.`);

        if (products.length > 0) {
            const p = products[0];
            console.log('--- Product 1 Raw Data ---');
            console.log('Title:', p.product_title);
            console.log('Sale Price:', p.sale_price);
            console.log('App Sale Price:', p.app_sale_price);
            console.log('Original Price:', p.original_price);
            console.log('Currency:', p.currency || 'N/A'); // Checking if currency field exists
            console.log('Product ID:', p.product_id);
            console.log(JSON.stringify(p, null, 2));
        }

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
        }
    }
}

debugAliExpress();
