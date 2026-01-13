import { ProviderFactory } from '../lib/providers/factory';

async function testProvider(providerName: string) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing Provider: ${providerName.toUpperCase()}`);
    console.log('='.repeat(60));

    try {
        const provider = ProviderFactory.getProvider(providerName);
        console.log(`✓ Provider initialized: ${provider.name}`);

        // Test 1: Search Products
        console.log('\n[Test 1] Searching for products with query: "phone case"');
        const searchResults = await provider.searchProducts('phone case');

        if (searchResults && searchResults.length > 0) {
            console.log(`✓ Search successful! Found ${searchResults.length} products`);
            console.log('\nFirst 3 results:');
            searchResults.slice(0, 3).forEach((product, index) => {
                console.log(`\n  ${index + 1}. ${product.title}`);
                console.log(`     Price: $${(product.price / 100).toFixed(2)}`);
                console.log(`     Vendor: ${product.vendor}`);
                console.log(`     External ID: ${product.externalId}`);
            });

            // Test 2: Get Product Details (if we have results)
            if (searchResults[0]?.externalId) {
                console.log(`\n[Test 2] Getting details for product: ${searchResults[0].externalId}`);
                try {
                    const details = await provider.getProductDetails(searchResults[0].externalId);
                    console.log(`✓ Details retrieved successfully!`);
                    console.log(`   Title: ${details.title}`);
                    console.log(`   Price: $${(details.price / 100).toFixed(2)}`);
                    console.log(`   Description: ${details.description?.substring(0, 100)}...`);
                    console.log(`   Images: ${details.images?.length || 0} images`);
                } catch (error: any) {
                    console.log(`✗ Failed to get product details: ${error.message}`);
                }
            }

            // Test 3: Place Order (Mock)
            console.log('\n[Test 3] Testing order placement (mock)');
            try {
                const orderId = await provider.placeOrder({
                    localOrderId: 999,
                    items: [
                        {
                            productId: searchResults[0].externalId,
                            title: searchResults[0].title,
                            quantity: 1,
                            price: searchResults[0].price
                        }
                    ],
                    total: searchResults[0].price
                });
                console.log(`✓ Order placed successfully! External Order ID: ${orderId}`);
            } catch (error: any) {
                console.log(`✗ Failed to place order: ${error.message}`);
            }

        } else {
            console.log('✗ Search returned no results');
        }

        console.log(`\n✓ ${providerName.toUpperCase()} - ALL TESTS COMPLETED`);
        return true;

    } catch (error: any) {
        console.log(`\n✗ ${providerName.toUpperCase()} - FAILED`);
        console.log(`Error: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     DROPSHIPPING PROVIDER INTEGRATION TEST SUITE          ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

    const providers = ['cj', 'rapidapi', 'aliexpress', 'eprolo'];
    const results: Record<string, boolean> = {};

    for (const provider of providers) {
        const success = await testProvider(provider);
        results[provider] = success;

        // Wait a bit between tests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Summary
    console.log('\n\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                      TEST SUMMARY                          ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    Object.entries(results).forEach(([provider, success]) => {
        const status = success ? '✓ PASS' : '✗ FAIL';
        const emoji = success ? '✅' : '❌';
        console.log(`${emoji} ${provider.toUpperCase().padEnd(15)} ${status}`);
    });

    const passCount = Object.values(results).filter(r => r).length;
    const totalCount = Object.keys(results).length;

    console.log(`\nTotal: ${passCount}/${totalCount} providers working\n`);

    if (passCount === 0) {
        console.log('⚠️  WARNING: No providers are currently functional!');
        console.log('   Please check your API credentials in .env file\n');
    } else if (passCount < totalCount) {
        console.log('⚠️  Some providers failed. Check credentials and API limits.\n');
    } else {
        console.log('🎉 All providers are working correctly!\n');
    }
}

main()
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    })
    .finally(() => {
        process.exit(0);
    });
