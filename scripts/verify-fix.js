
require('dotenv').config({ path: '.env.local' });
// We need to import the class, but it's typescript. 
// For quick testing in node, we can just copy the logic or use ts-node if available.
// Let's assume ts-node is available or just replicate the logic to be 100% sure the math works.

// Actually, let's create a small TS script and run it with ts-node if possible, 
// or just modify the existing JS script to simulate the logic change.

const axios = require('axios');

class AliExpressMock {
    convertCurrency(priceStr, currency) {
        let price = parseFloat(priceStr);
        if (isNaN(price)) return 0;

        if (currency === 'CNY') {
            price = price * 0.14; // Approx exchange rate
        } else if (currency === 'EUR') {
            price = price * 1.08;
        } else if (currency === 'GBP') {
            price = price * 1.27;
        }

        // Return in cents
        return Math.round(price * 100);
    }
}

async function debugAliExpress() {
    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST || 'aliexpress-true-api.p.rapidapi.com';
    const query = "Ajazz AK820/AK820Pro Gaming Mechanical Keyboard Bluetooth 5.1/Wireless/C";

    console.log(`Searching for: ${query}`);

    try {
        const searchUrl = `https://${apiHost}/api/v3/products`;

        const response = await axios.get(searchUrl, {
            params: {
                keywords: query,
                country: 'US',
                currency: 'USD',
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
            const provider = new AliExpressMock();
            const convertedPrice = provider.convertCurrency(p.sale_price, p.sale_price_currency || 'USD');

            console.log('--- Product 1 Verification ---');
            console.log('Title:', p.product_title);
            console.log('Raw API Price:', p.sale_price, p.sale_price_currency);
            console.log('Converted Price (Cents):', convertedPrice);
            console.log('Converted Price (USD):', convertedPrice / 100);

            if (p.sale_price_currency === 'CNY' && convertedPrice < parseFloat(p.sale_price) * 100) {
                console.log('SUCCESS: Currency conversion applied correctly.');
            } else if (p.sale_price_currency === 'USD') {
                console.log('INFO: Currency matches USD, no conversion needed.');
            } else {
                console.log('WARNING: Check logic.');
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

debugAliExpress();
