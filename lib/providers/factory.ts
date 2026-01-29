
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

        if (lowerName === 'aliexpress' || lowerName === 'rapidapi') {
            return new AliExpressRapidAPIProvider();
        }

        // 3. Others
        if (lowerName === 'eprolo') {
            return new EproloProvider();
        }

        // Fallback or Error
        // For now, if unknown, try CJ as it's our best bet
        console.warn(`[ProviderFactory] Unknown provider '${name}', defaulting to CJDropshipping.`);
        return new CJDropshippingProvider();
    }
}
