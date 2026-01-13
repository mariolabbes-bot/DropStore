import { DropshippingProvider, ProductData } from './types';
import axios from 'axios';

export class EproloProvider implements DropshippingProvider {
    name = 'EPROLO';
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.EPROLO_API_KEY || '';
        if (!this.apiKey) {
            console.warn('EPROLO_API_KEY is not set.');
        }
    }

    async searchProducts(query: string): Promise<ProductData[]> {
        console.log(`[EPROLO] Searching for: ${query}`);
        try {
            // Placeholder Endpoint - Check EPROLO Docs
            const response = await axios.get('https://api.eprolo.com/v1/products/search', {
                params: { keyword: query },
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });

            if (response.data && response.data.data) {
                return response.data.data.map((item: any) => ({
                    externalId: item.id,
                    title: item.title,
                    price: item.price * 100,
                    description: item.description || '',
                    images: [item.image],
                    vendor: 'EPROLO',
                    url: item.link || ''
                }));
            }
            return [];
        } catch (error) {
            console.error('[EPROLO] Search Error:', error instanceof Error ? error.message : error);
            return [];
        }
    }

    async getProductDetails(externalId: string): Promise<ProductData> {
        console.log(`[EPROLO] Getting details for ID: ${externalId}`);
        // Placeholder
        return {
            externalId,
            title: 'Eprolo Product (Mock Details)',
            price: 0,
            description: 'Requires Valid Endpoint',
            images: [],
            vendor: 'EPROLO',
            url: ''
        };
    }

    async placeOrder(orderDetails: any): Promise<string> {
        return 'EPROLO-ORDER-ID';
    }
}
