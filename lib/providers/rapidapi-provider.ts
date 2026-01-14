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

            if (response.data && response.data.docs) {
                return response.data.docs.map((item: any) => ({
                    externalId: item.app_sale_price ? item.product_id : item.item_id,
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
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('[RapidAPI] Search Error:', message);
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
                    timeout: 60000
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
                const message = error instanceof Error ? error.message : 'Unknown error';
                console.error('[RapidAPI] Details Error:', message);
                throw error;
            }
        }
        throw new Error('RapidAPI timed out after retries');
    }

    async placeOrder(orderDetails: any): Promise<string> {
        console.log('[RapidAPI] Place Order NOT SUPPORTED via this API. Returning Mock ID.');
        return `API-MOCK-${Date.now()}`;
    }

    private parsePrice(price: number | string | undefined): number {
        if (typeof price === 'number') return price * 100;
        if (typeof price === 'string') {
            return parseFloat(price.replace(/[^0-9.]/g, '')) * 100;
        }
        return 0;
    }
}
