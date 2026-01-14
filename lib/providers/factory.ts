import { DropshippingProvider } from './types';
import { AliExpressProvider } from './aliexpress-provider';
import { AliExpressRapidAPIProvider } from './rapidapi-provider';
import { EproloProvider } from './eprolo-provider';
import { CJDropshippingProvider } from './cjdropshipping-provider';

export class ProviderFactory {
    static getProvider(name: string = 'aliexpress'): DropshippingProvider {
        const lowerName = name.toLowerCase();

        // 1. CJDropshipping
        if (lowerName === 'cj' || lowerName === 'cjdropshipping') {
            return new CJDropshippingProvider();
        }

        // 2. AliExpress (RapidAPI vs Scraper)
        // If user asks for 'aliexpress' or 'rapidapi', we prioritize the robust RapidAPI 
        // if the key is configured.
        if (lowerName === 'aliexpress' || lowerName === 'rapidapi') {
            if (process.env.RAPIDAPI_KEY) {
                return new AliExpressRapidAPIProvider();
            }
            console.warn('[ProviderFactory] RAPIDAPI_KEY missing, falling back to Puppeteer Scraper for AliExpress.');
            return new AliExpressProvider(); // Fallback
            // return new AliExpressRapidAPIProvider(); // Or force it to fail if we want to avoid scraping
        }

        // 3. Others
        if (lowerName === 'eprolo') {
            return new EproloProvider();
        }

        throw new Error(`Proveedor no soportado: ${name}`);
    }
}
