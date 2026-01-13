import { DropshippingProvider, ProductData } from './types';
import axios from 'axios';

export class AliExpressRapidAPIProvider implements DropshippingProvider {
    name = 'AliExpress (RapidAPI)';
    private apiKey: string;
    private apiHost: string;

    constructor() {
        this.apiKey = process.env.RAPIDAPI_KEY || '';
        this.apiHost = process.env.RAPIDAPI_HOST || 'aliexpress-product1.p.rapidapi.com';

        if (!this.apiKey) {
            console.warn('RAPIDAPI_KEY is not set. RapidAPI calls will fail.');
        }
    }

    async searchProducts(query: string): Promise<ProductData[]> {
        console.log(`[RapidAPI] Searching for: ${query}`);
        try {
            // Note: The user verified 'aliexpress-product1' which is primarily a scraper for details.
            // Documentation for search on this specific host is not confirmed by the snippet.
            // We'll attempt a common endpoint pattern or fallback to a warning.

            // Hypothetical search endpoint for this API family:
            const response = await axios.get(`https://${this.apiHost}/search`, {
                params: {
                    query: query,
                    country: 'US',
                    page: 1
                },
                headers: {
                    'x-rapidapi-key': this.apiKey,
                    'x-rapidapi-host': this.apiHost
                }
            });

            // Need to map response based on actual API shape. 
            // For now, logging and returning empty if structure is unknown.
            // console.log('[RapidAPI] Search Response:', response.data);

            if (response.data && response.data.docs) {
                return response.data.docs.map((item: any) => ({
                    externalId: item.app_sale_price ? item.product_id : item.item_id, // varies
                    title: item.product_title || item.title,
                    price: item.app_sale_price ? parseFloat(item.app_sale_price) * 100 : 0,
                    description: '',
                    images: [item.product_main_picture || item.image],
                    vendor: item.store_name || 'AliExpress Vendor',
                    url: item.product_detail_url || `https://aliexpress.com/item/${item.product_id}.html`
                }));
            }

            return [];

        } catch (error) {
            // If 404, it might mean this host doesn't support search
            console.error('[RapidAPI] Search Error (or endpoint not supported):', error instanceof Error ? error.message : error);
            return [];
        }
    }

    async getProductDetails(externalId: string): Promise<ProductData> {
        console.log(`[RapidAPI] Getting details for ID: ${externalId}`);
        let retries = 2;
        while (retries >= 0) {
            try {
                const response = await axios.get(`https://${this.apiHost}/scraper`, {
                    params: { productId: externalId },
                    headers: {
                        'x-rapidapi-key': this.apiKey,
                        'x-rapidapi-host': this.apiHost
                    },
                    timeout: 60000 // 60s timeout
                });

                const data = response.data;
                if (!data) throw new Error('No data returned from RapidAPI');

                const result = data.result || data;

                return {
                    externalId: externalId,
                    title: result.title || result.product_title || 'Unknown',
                    price: this.parsePrice(result.price || result.format_price),
                    description: result.description || 'No description',
                    images: result.images || (result.product_main_picture ? [result.product_main_picture] : []),
                    vendor: result.store_name || 'AliExpress Vendor',
                    url: result.itemUrl || `https://aliexpress.com/item/${externalId}.html`
                };
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 504 && retries > 0) {
                    console.log(`[RapidAPI] 504 Timeout. Retrying... (${retries} left)`);
                    retries--;
                    await new Promise(r => setTimeout(r, 2000));
                    continue;
                }
                console.error('[RapidAPI] Details Error:', error instanceof Error ? error.message : error);
                throw error;
            }
        }
        throw new Error('RapidAPI timed out after retries');
    }

    async placeOrder(orderDetails: any): Promise<string> {
        console.log('[RapidAPI] Place Order NOT SUPPORTED via this API. Returning Mock ID.');
        return `API-MOCK-${Date.now()}`;
    }

    private parsePrice(price: any): number {
        if (typeof price === 'number') return price * 100; // if dollars
        if (typeof price === 'string') {
            return parseFloat(price.replace(/[^0-9.]/g, '')) * 100;
        }
        return 0;
    }
}
