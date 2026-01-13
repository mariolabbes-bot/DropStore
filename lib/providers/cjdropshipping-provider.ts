import { DropshippingProvider, ProductData } from './types';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export class CJDropshippingProvider implements DropshippingProvider {
    name = 'CJDropshipping';
    private apiKey: string;
    private accessToken: string | null = null;
    private baseUrl = 'https://developers.cjdropshipping.com/api2.0/v1';
    private cachePath = path.join(process.cwd(), '.cj-token-cache.json');

    constructor() {
        this.apiKey = process.env.CJD_API_KEY || '';
        if (!this.apiKey) {
            console.warn('CJD_API_KEY is not set.');
        }
        this.loadTokenFromCache();
    }

    private loadTokenFromCache() {
        try {
            if (fs.existsSync(this.cachePath)) {
                const data = JSON.parse(fs.readFileSync(this.cachePath, 'utf8'));
                // Check if token is potentially expired (CJ tokens usually last 30 days)
                // We'll trust the cache for now as current issue is 429 on auth
                this.accessToken = data.accessToken;
            }
        } catch (e) {
            console.error('[CJ] Failed to load token from cache:', e);
        }
    }

    private saveTokenToCache(token: string) {
        try {
            fs.writeFileSync(this.cachePath, JSON.stringify({ accessToken: token, updatedAt: new Date().toISOString() }));
        } catch (e) {
            console.error('[CJ] Failed to save token to cache:', e);
        }
    }

    private async getHeaders() {
        if (!this.accessToken) {
            await this.authenticate();
        }
        return {
            'CJ-Access-Token': this.accessToken!
        };
    }

    private async authenticate() {
        try {
            console.log('[CJ] Attempting Authentication (getAccessToken)...');
            const response = await axios.post(`${this.baseUrl}/authentication/getAccessToken`, {
                apiKey: this.apiKey
            });

            if (response.data && response.data.data && response.data.data.accessToken) {
                this.accessToken = response.data.data.accessToken;
                this.saveTokenToCache(this.accessToken!);
            } else {
                const msg = response.data.message || 'Unknown error';
                if (response.data.code === 1600200) {
                    throw new Error(`CJ-RATE-LIMIT: ${msg}`);
                }
                throw new Error('Failed to get CJ Access Token: ' + JSON.stringify(response.data));
            }
        } catch (error: any) {
            if (error.response?.status === 429) {
                console.error('[CJ] CRITICAL RATE LIMIT (429): Need to wait 5 minutes before next auth attempt.');
            }
            console.error('[CJ] Auth Error:', error.message);
            throw error;
        }
    }

    async searchProducts(query: string): Promise<ProductData[]> {
        console.log(`[CJ] Searching for: ${query}`);
        try {
            const headers = await this.getHeaders();
            const response = await axios.get(`${this.baseUrl}/product/list`, {
                params: { productName: query, pageSize: 10 },
                headers
            });

            if (response.data && response.data.data && response.data.data.list) {
                return response.data.data.list.map((item: any) => ({
                    externalId: item.pid,
                    title: item.productNameEn,
                    price: item.sellPrice ? parseFloat(item.sellPrice) * 100 : 0, // CJ sellPrice is usually in USD
                    description: '',
                    images: [item.productImage],
                    vendor: 'CJDropshipping',
                    url: `https://cjdropshipping.com/product-detail.html?id=${item.pid}`
                }));
            }
            return [];
        } catch (error) {
            console.error('[CJ] Search Error:', error instanceof Error ? error.message : error);
            return [];
        }
    }

    async getProductDetails(externalId: string): Promise<ProductData> {
        console.log(`[CJ] Getting details for ID: ${externalId}`);
        try {
            const headers = await this.getHeaders();
            const response = await axios.get(`${this.baseUrl}/product/query`, {
                params: { pid: externalId },
                headers
            });

            if (!response.data || !response.data.data) {
                throw new Error('Product not found or API error');
            }

            const data = response.data.data;

            // Handle variations in image set format
            let imageSet = [];
            if (Array.isArray(data.productImageSet)) {
                imageSet = data.productImageSet;
            } else if (typeof data.productImageSet === 'string' && data.productImageSet.startsWith('[')) {
                try {
                    imageSet = JSON.parse(data.productImageSet);
                } catch (e) {
                    imageSet = [data.productImageSet];
                }
            } else if (data.productImageSet) {
                imageSet = [data.productImageSet];
            }

            return {
                externalId: data.pid,
                title: data.productNameEn,
                price: data.sellPrice * 100,
                description: data.description || '',
                images: [data.productImage, ...imageSet].filter(Boolean),
                vendor: 'CJDropshipping',
                url: `https://cjdropshipping.com/product-detail.html?id=${data.pid}`
            };
        } catch (error) {
            console.error('[CJ] Details Error:', error instanceof Error ? error.message : error);
            throw error;
        }
    }

    async placeOrder(orderDetails: any): Promise<string> {
        return 'CJ-ORDER-MOCK';
    }
}
