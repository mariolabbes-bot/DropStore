import { DropshippingProvider } from './types';
import { AliExpressProvider } from './aliexpress-provider';
import { AliExpressRapidAPIProvider } from './rapidapi-provider';
import { EproloProvider } from './eprolo-provider';
import { CJDropshippingProvider } from './cjdropshipping-provider';

export class ProviderFactory {
    static getProvider(name: string = 'aliexpress'): DropshippingProvider {
        switch (name.toLowerCase()) {
            case 'aliexpress':
                // Currently Scraper/Mock
                return new AliExpressProvider();
            case 'rapidapi':
                return new AliExpressRapidAPIProvider();
            case 'eprolo':
                return new EproloProvider();
            case 'cj':
            case 'cjdropshipping':
                return new CJDropshippingProvider();
            default:
                throw new Error(`Proveedor no soportado: ${name}`);
        }
    }
}
