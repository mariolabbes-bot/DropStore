import { DropshippingProvider, ProductData } from './types';
import axios from 'axios';

export class AliExpressRapidAPIProvider implements DropshippingProvider {
    name = 'AliExpress (RapidAPI)';
    private apiKey: string;
    private apiHost: string;

    constructor() {
        this.apiKey = process.env.RAPIDAPI_KEY || '';
        this.apiHost = process.env.RAPIDAPI_HOST || 'aliexpress-true-api.p.rapidapi.com/api/v3';

        if (!this.apiKey) {
            console.warn('RAPIDAPI_KEY is not set. RapidAPI calls will fail.');
        }
    }

    async searchProducts(query: string): Promise<ProductData[]> {
        console.log(`[RapidAPI-True] Searching for: ${query}`);
        try {
            const url = `https://aliexpress-true-api.p.rapidapi.com/api/v3/products`;
            console.log(`[RapidAPI-True] Requesting: ${url}`);
            const response = await axios.get(url, {
                params: {
                    keywords: query,
                    country: 'US',
                    language: 'en', // True API usually returns better results in EN, then we translate or use their localized fields
                    page_no: 1,
                    page_size: 20
                },
                headers: {
                    'x-rapidapi-key': this.apiKey,
                    'x-rapidapi-host': 'aliexpress-true-api.p.rapidapi.com'
                }
            });

            if (response.data && response.data.result && response.data.result.products) {
                return response.data.result.products.map((item: any) => ({
                    externalId: String(item.product_id),
                    title: item.product_title,
                    price: parseFloat(item.sale_price || item.app_sale_price || '0') * 100,
                    description: '',
                    images: [item.product_main_image_url],
                    vendor: item.shop_info?.shop_name || 'AliExpress Vendor',
                    url: item.product_detail_url
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
        console.log(`[RapidAPI-True] Getting details for ID: ${externalId}`);
        let retries = 2;
        while (retries >= 0) {
            try {
                const response = await axios.get(`https://aliexpress-true-api.p.rapidapi.com/api/v3/product-info`, {
                    params: {
                        product_id: externalId,
                        language: 'en'
                    },
                    headers: {
                        'x-rapidapi-key': this.apiKey,
                        'x-rapidapi-host': 'aliexpress-true-api.p.rapidapi.com'
                    },
                    timeout: 60000
                });

                const data = response.data.result || response.data;
                if (!data) throw new Error('No data returned from True API');

                return {
                    externalId: externalId,
                    title: data.product_title || 'Unknown',
                    price: this.parsePrice(data.sale_price || data.price),
                    description: data.product_description || 'No description',
                    images: data.product_main_image_url ? [data.product_main_image_url] : [],
                    vendor: data.shop_info?.shop_name || 'AliExpress Vendor',
                    url: data.product_detail_url || `https://aliexpress.com/item/${externalId}.html`
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

    async checkStatus(): Promise<{ connected: boolean; message?: string }> {
        try {
            // A simple request to see if API is alive
            const response = await axios.get(`https://aliexpress-true-api.p.rapidapi.com/api/v3/products`, {
                params: { keywords: 'test', page_no: 1, page_size: 1 },
                headers: { 'x-rapidapi-key': this.apiKey, 'x-rapidapi-host': 'aliexpress-true-api.p.rapidapi.com' },
                timeout: 5000
            });
            return { connected: true, message: 'Conectado a AliExpress True API' };
        } catch (e: any) {
            return { connected: false, message: e.message || 'Error de conexión' };
        }
    }

    private parsePrice(price: any): number {
        if (typeof price === 'number') return price * 100;
        if (typeof price === 'string') {
            return parseFloat(price.replace(/[^0-9.]/g, '')) * 100;
        }
        return 0;
    }
}
