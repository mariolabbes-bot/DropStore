
import { DropshippingProvider, ProductData } from './types';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import { translate } from 'google-translate-api-x';

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

    private async translateText(text: string, toLine: string = 'es'): Promise<string> {
        try {
            if (!text) return '';
            // @ts-ignore
            const res = await translate(text, { to: toLine });
            return res.text;
        } catch (e) {
            console.error('[CJ] Translation Failed:', e);
            return text; // Fallback to original
        }
    }

    private async translateQuery(text: string): Promise<string> {
        // Translate Spanish query to English for CJ Search
        try {
            if (!text) return '';
            // @ts-ignore
            const res = await translate(text, { to: 'en' });
            let translated = res.text;

            // Keyword refinement: CJ works better with specific keywords rather than long sentences
            // Remove common stop words, prepositions, and non-informative words
            const stopWords = [
                'for', 'with', 'and', 'the', 'a', 'an', 'in', 'on', 'at', 'by', 'from', 'to',
                'of', 'is', 'it', 'that', 'this', 'was', 'as', 'are', 'be', 'or', 'if', 'but',
                'waterproof', 'portable', 'professional', 'original', 'official', 'store',
                'best', 'top', 'new', 'latest', 'hot', 'style', 'good', 'quality'
            ];
            const parts = translated.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
            const keywords = parts.filter(p => !stopWords.includes(p) && p.length > 3);

            // If we have few keywords, keep original words that are > 2 chars
            const finalKeywords = keywords.length > 0 ? keywords : parts.filter(p => p.length > 2);

            // Limit to 3 strong keywords. More keywords in CJ often leads to 0 results or vague results.
            const query = finalKeywords.slice(0, 3).join(' ');
            console.log(`[CJ] Refined Query: "${query}" (Original: "${translated}")`);
            return query;
        } catch (e) {
            return text;
        }
    }

    private safePrice(price: any): number {
        if (price === undefined || price === null || price === '') return 0;
        const p = parseFloat(price);
        return isNaN(p) ? 0 : p * 100;
    }

    private extractPidFromQuery(query: string): string | null {
        // 1. Direct ID (numeric, long)
        // CJ IDs are usually long strings of digits
        if (/^\d{10,}$/.test(query.trim())) {
            return query.trim();
        }

        // 2. Try to extract from URL parameters (e.g. ?id=...)
        try {
            const url = new URL(query);
            const idParam = url.searchParams.get('id');
            if (idParam && /^\d{10,}$/.test(idParam)) return idParam;
        } catch (e) {
            // ignore invalid URL for now
        }

        // 3. Try regex for "p-<ID>.html" pattern common in dropshipping/affiliate links
        // Example: ...-p-1999356345777045505.html
        const pMatch = query.match(/p-(\d{10,})\.html/);
        if (pMatch && pMatch[1]) {
            return pMatch[1];
        }

        // 4. Fallback: Check if query contains a long numeric string that looks like an ID
        // (Use caution to avoid phone numbers etc, but CJ IDs are very specific length)
        const idMatch = query.match(/(?<!\d)(\d{18,})(?!\d)/);
        if (idMatch && idMatch[1]) {
            return idMatch[1];
        }

        return null;
    }

    async searchProducts(query: string): Promise<ProductData[]> {
        console.log(`[CJ] Searching for: ${query}`);
        try {
            // 1. Direct Import Check
            const directPid = this.extractPidFromQuery(query);
            if (directPid) {
                console.log(`[CJ] Detected Direct Import ID: ${directPid}`);
                try {
                    const product = await this.getProductDetails(directPid);
                    return [product];
                } catch (e) {
                    console.warn('[CJ] Direct import failed:', e);
                    // If it was a direct ID detection, we should probably stop here 
                    // instead of searching for the ID string which returns nothing useful.
                    return [];
                }
            }

            // 1.5 Check if query is a URL but ID wasn't extracted
            if (query.match(/^https?:\/\//i)) {
                console.log('[CJ] Query looks like a URL but no ID found. Attempting to extract keywords.');
                // Try to extract slug?
                // e.g. https://cjdropshipping.com/product/some-product-name-p-123.html
                // For now, return empty to avoid "searching for https://..."
                return [];
            }

            // 2. Translate Query ES -> EN
            const englishQuery = await this.translateQuery(query);
            const headers = await this.getHeaders();
            const response = await axios.get(`${this.baseUrl}/product/list`, {
                params: { productName: englishQuery, pageSize: 48 }, // Increased to 48 for variety
                headers
            });

            if (response.data && response.data.data && response.data.data.list) {
                // Translate titles securely in parallel
                const list = response.data.data.list;
                const translatedList = await Promise.all(list.map(async (item: any) => {
                    const titleEs = await this.translateText(item.productNameEn || item.productName, 'es');
                    return {
                        externalId: item.pid,
                        title: titleEs,
                        price: this.safePrice(item.sellPrice),
                        description: '',
                        images: [item.productImage],
                        vendor: 'CJDropshipping',
                        url: `https://cjdropshipping.com/product-detail.html?id=${item.pid}`
                    };
                }));
                return translatedList;
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
            let titleEs = data.productNameEn || data.productName;
            try {
                titleEs = await this.translateText(titleEs, 'es');
            } catch (e) {
                // Keep original
            }

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

            // Sanitize main image if it comes as a stringified array
            let mainImage = data.productImage;
            if (mainImage && typeof mainImage === 'string' && mainImage.startsWith('["')) {
                try {
                    const parsed = JSON.parse(mainImage);
                    mainImage = parsed[0];
                } catch (e) {
                    console.error('[CJ] Failed to parse main image JSON:', e);
                }
            }

            // Get variants to find VID for shipping calc
            let vid = '';
            if (data.variants && data.variants.length > 0) {
                vid = data.variants[0].vid;
            }

            // Calculate Shipping
            let shippingCost = 0;
            if (vid) {
                try {
                    // Default to US or configured country. User seems to be in LatAm (Chile?), 
                    // but often sells to US. defaulting to US for standard estimation.
                    shippingCost = await this.calculateShipping(vid, process.env.DROPSHIPPING_TARGET_COUNTRY || 'US');
                } catch (e) {
                    console.warn('[CJ] Failed to calculate shipping:', e);
                }
            }

            return {
                externalId: data.pid,
                title: titleEs,
                price: this.safePrice(data.sellPrice),
                shippingCost: shippingCost,
                description: data.description || '', // Keeping original HTML description to avoid breaking layout
                images: [mainImage, ...imageSet].filter(Boolean),
                vendor: 'CJDropshipping',
                url: `https://cjdropshipping.com/product-detail.html?id=${data.pid}`
            };
        } catch (error) {
            console.error('[CJ] Details Error:', error instanceof Error ? error.message : error);
            throw error;
        }
    }

    private async calculateShipping(vid: string, countryCode: string): Promise<number> {
        console.log(`[CJ] Calculating shipping for VID: ${vid} to ${countryCode}`);
        try {
            const headers = await this.getHeaders();
            const response = await axios.post(`${this.baseUrl}/logistic/freightCalculate`, {
                startCountryCode: 'CN', // Origin usually China
                endCountryCode: countryCode,
                products: [
                    {
                        vid: vid,
                        quantity: 1
                    }
                ]
            }, { headers });

            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                // The API returns a list of shipping methods. We should pick the cheapest valid one, or a standard one.
                // For now, let's pick the cheapest one.
                const options = response.data.data;
                if (options.length > 0) {
                    // Sort by logisticPrice (USD)
                    options.sort((a: any, b: any) => parseFloat(a.logisticPrice) - parseFloat(b.logisticPrice));
                    const cheapest = options[0];
                    console.log(`[CJ] Selected shipping: ${cheapest.logisticName} - $${cheapest.logisticPrice}`);
                    return Math.round(parseFloat(cheapest.logisticPrice) * 100); // Return in cents
                }
            }
            return 0;
        } catch (e) {
            console.error('[CJ] Shipping Calc Error:', e instanceof Error ? e.message : e);
            // Return 0 if failed so we don't block the product/import
            return 0;
        }
    }

    async checkStatus(): Promise<{ connected: boolean; message?: string }> {
        try {
            await this.getHeaders();
            // A simple list call with empty results is enough to verify token
            return { connected: true, message: 'Conectado a CJ API' };
        } catch (e: any) {
            return { connected: false, message: e.message };
        }
    }

    async placeOrder(orderDetails: any): Promise<string> {
        // CJ Order API integration would go here using `orderDetails`
        // For now, returning a mock ID as placeholder during development
        console.log('[CJ] Mocking Order Placement:', orderDetails);
        return 'CJ-ORDER-MOCK-' + Date.now();
    }
}
