import { DropshippingProvider, ProductData } from './types';
import axios from 'axios';

export class AliExpressRapidAPIProvider implements DropshippingProvider {
    name = 'AliExpress (RapidAPI)';
    private apiKey: string;
    private apiHost: string;

    constructor() {
        this.apiKey = process.env.RAPIDAPI_KEY || '';
        this.apiHost = process.env.RAPIDAPI_HOST || 'aliexpress-true-api.p.rapidapi.com';

        if (!this.apiKey) {
            console.warn('RAPIDAPI_KEY is not set. RapidAPI calls will fail.');
        }
    }

    async searchProducts(query: string): Promise<ProductData[]> {
        console.log(`[RapidAPI-True] Searching for: ${query}`);
        try {
            const url = `https://${this.apiHost}/api/v3/products`;
            console.log(`[RapidAPI-True] Requesting: ${url}`);
            const response = await axios.get(url, {
                params: {
                    keywords: query,
                    country: 'US',
                    language: 'en',
                    page_no: 1,
                    page_size: 20
                },
                headers: {
                    'x-rapidapi-key': this.apiKey,
                    'x-rapidapi-host': this.apiHost,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            // Handle different structure versions
            let products: any[] = [];

            if (response.data?.products) {
                if (Array.isArray(response.data.products)) {
                    products = response.data.products;
                } else if (response.data.products.product && Array.isArray(response.data.products.product)) {
                    products = response.data.products.product;
                }
            } else if (response.data?.result?.products) {
                products = response.data.result.products;
            }

            console.log(`[RapidAPI-True] Normalizing ${products.length} products`);

            return products.map((item: any) => ({
                externalId: String(item.product_id),
                title: item.product_title,
                price: parseFloat(item.sale_price || item.app_sale_price || '0') * 100,
                description: '',
                images: [item.product_main_image_url],
                vendor: item.shop_info?.shop_name || item.shop_name || 'AliExpress Vendor',
                url: item.product_detail_url
            }));

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('[RapidAPI] Search Error:', message);
            return [];
        }
    }

    async getProductDetails(externalId: string): Promise<ProductData> {
        console.log(`[RapidAPI-True] Getting details for ID: ${externalId}`);
        try {
            const response = await axios.get(`https://${this.apiHost}/api/v3/product-info`, {
                params: {
                    product_id: externalId
                },
                headers: {
                    'x-rapidapi-key': this.apiKey,
                    'x-rapidapi-host': this.apiHost,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            let data = response.data;
            if (Array.isArray(data)) data = data[0];
            if (data?.result) data = data.result;

            if (!data || Object.keys(data).length === 0) {
                throw new Error('No data returned from True API for this ID');
            }

            return {
                externalId: externalId,
                title: data.product_title || 'AliExpress Product',
                price: parseFloat(data.sale_price || data.app_sale_price || '0') * 100,
                description: data.product_description || '',
                images: data.product_small_image_urls?.string || [data.product_main_image_url],
                vendor: data.shop_info?.shop_name || data.shop_name || 'AliExpress Vendor',
                url: data.product_detail_url || `https://aliexpress.com/item/${externalId}.html`
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('[RapidAPI] Details Error:', message);
            throw error;
        }
    }

    async placeOrder(orderDetails: any): Promise<string> {
        console.log('[RapidAPI] Place Order NOT SUPPORTED via this API. Returning Mock ID.');
        return `API-MOCK-${Date.now()}`;
    }

    async checkStatus(): Promise<{ connected: boolean; message?: string }> {
        try {
            const response = await axios.get(`https://${this.apiHost}/api/v3/products`, {
                params: { keywords: 'test', page_no: 1, page_size: 1 },
                headers: { 'x-rapidapi-key': this.apiKey, 'x-rapidapi-host': this.apiHost },
                timeout: 10000
            });
            return { connected: true, message: 'Conectado a AliExpress True API' };
        } catch (e: any) {
            return { connected: false, message: e.message || 'Error de conexión' };
        }
    }
}
