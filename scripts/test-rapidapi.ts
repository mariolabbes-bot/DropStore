
require('ts-node/register');
const { AliExpressRapidAPIProvider } = require('../lib/providers/rapidapi-provider');

async function test() {
    console.log('Testing Rapid API Wrapper...');
    if (!process.env.RAPIDAPI_KEY) {
        console.error('ERROR: RAPIDAPI_KEY not found in env');
        process.exit(1);
    }

    const provider = new AliExpressRapidAPIProvider();
    try {
        const results = await provider.searchProducts('watch');
        console.log(`Found ${results.length} products`);
        if (results.length > 0) {
            console.log('Sample:', results[0]);
        }
    } catch (e) {
        console.error('Search failed:', e);
    }
}

test();
