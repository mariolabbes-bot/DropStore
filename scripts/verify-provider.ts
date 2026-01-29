import { ProductService } from '../services/product.service';
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    // Get provider from args or default to 'aliexpress'
    const providerName = process.argv[2] || 'aliexpress';
    console.log(`Using Provider: ${providerName}`);

    const service = new ProductService();

    console.log(`--- Probando Búsqueda (${providerName}) ---`);
    let results: any[] = [];
    try {
        results = await service.search('watch', providerName);
    } catch (e) {
        console.error('Search failed:', e);
    }
    console.log('Resultados encontrados:', results.length);
    if (results.length > 0) {
        console.log('Primer resultado:', {
            externalId: results[0].externalId,
            title: results[0].title
        });
    }

    await sleep(2000);

    // Skip the hardcoded ID test for CJ since we have real results now
    if (providerName !== 'cj') {
        console.log('\n--- Probando Importación Directa ---');
        try {
            const imported = await service.importProduct('1005005167379524', providerName);
            console.log('Producto importado:', imported);
        } catch (e) {
            console.log('Error importando:', e);
        }
        await sleep(2000);
    }

    if (process.argv[3]) {
        console.log(`\n--- Probando Importación Directa ID: ${process.argv[3]} ---`);
        try {
            const imported = await service.importProduct(process.argv[3], providerName);
            console.log('Producto importado a DB:', imported);
        } catch (e) {
            console.error('Import explicit ID failed:', e);
        }
    } else if (results.length > 0) {
        // Fallback to first search result
        console.log('\n--- Probando Importación (desde búsqueda) ---');
        try {
            const imported = await service.importProduct(results[0].externalId, providerName);
            console.log('Producto importado a DB:', imported);
        } catch (e) {
            console.error('Import failed:', e);
        }
    }
}

main().catch(console.error);
