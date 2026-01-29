import { DropshippingProvider, ProductData } from './types';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export class AliExpressProvider implements DropshippingProvider {
    name = 'AliExpress';

    async searchProducts(query: string): Promise<ProductData[]> {
        console.log(`[AliExpress] Searching for: ${query}`);
        let browser;
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();

            // Set user agent and locale
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'es-ES,es;q=0.9'
            });
            await page.setViewport({ width: 1280, height: 800 });

            // Navigate to AliExpress search page (Spanish subdomain)
            const searchUrl = `https://es.aliexpress.com/wholesale?SearchText=${encodeURIComponent(query)}`;
            console.log(`[AliExpress] Page Navigating to: ${searchUrl}`);
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

            // Wait for product list to load
            try {
                await page.waitForSelector('div[class*="product-container"], div[class*="list--gallery"], a[href*="item"]', { timeout: 10000 });
            } catch (e) {
                console.log('[AliExpress] Timeout waiting for selectors. Page might require captcha.');
            }

            // Debug: Screenshot and HTML Dump
            await page.screenshot({ path: 'debug_search.png' });
            const title = await page.title();
            const content = await page.content();
            const fs = require('fs');
            fs.writeFileSync('aliexpress_dump.html', content);
            console.log(`[AliExpress] Page Title: ${title}`);
            console.log(`[AliExpress] HTML saved to aliexpress_dump.html`);

            // Scrape results
            const products = await page.evaluate(() => {
                const results: any[] = [];
                // More generic selector strategy
                // Look for any anchor that leads to an item page
                const validCards = Array.from(document.querySelectorAll('a[href*="/item/"]'));

                // Limit to first 10 results
                const cards = validCards.slice(0, 10);

                cards.forEach((card: any) => {
                    try {
                        const url = card.href;
                        // Extract ID from URL (item/12345.html)
                        const idMatch = url.match(/\/item\/(\d+)\.html/);
                        const externalId = idMatch ? idMatch[1] : '';

                        // Find title (often an h1 or h3 or div with specific class inside the card)
                        // Heuristic: iterate children to find text content of reasonable length
                        // Because classes are obfuscated (e.g., "manhattan--titleText--...") we try to be generic
                        const titleEl = card.querySelector('h1, h3, div[class*="title"], span[class*="title"]') as HTMLElement; // Broad attempt
                        const title = titleEl ? titleEl.innerText : 'Unknown Product';

                        // Find price
                        const priceEl = card.querySelector('div[class*="price"], span[class*="price"]') as HTMLElement;
                        // Clean price string (remove currency symbol, etc)
                        const priceText = priceEl ? priceEl.innerText.replace(/[^0-9.]/g, '') : '0';
                        const price = parseFloat(priceText) * 100; // Store as cents/integer

                        // Find Image
                        const imgEl = card.querySelector('img');
                        const image = imgEl ? (imgEl.src || imgEl.dataset.src) : '';

                        if (externalId && title) {
                            results.push({
                                externalId,
                                title,
                                price: isNaN(price) ? 0 : price,
                                description: '',
                                images: [image || ''],
                                vendor: 'AliExpress Vendor', // Difficult to scrape from grid view
                                url: url.split('?')[0] // Clean URL
                            });
                        }
                    } catch (e) {
                        // Skip card on error
                    }
                });
                return results;
            });

            console.log(`[AliExpress] Found ${products.length} products`);
            return products;

        } catch (error) {
            console.error('[AliExpress] Scrape Error:', error);
            return [];
        } finally {
            if (browser) await browser.close();
        }
    }

    async getProductDetails(externalId: string): Promise<ProductData> {
        console.log(`[AliExpress] Getting details for ID: ${externalId}`);
        let browser;
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36');
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'es-ES,es;q=0.9'
            });

            const url = `https://es.aliexpress.com/item/${externalId}.html`;
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            // Wait a bit for dynamic content
            // await page.waitForTimeout(2000); // waitForTimeout is deprecated
            await new Promise(r => setTimeout(r, 2000));

            const data = await page.evaluate((exId) => {
                const titleEl = document.querySelector('h1');
                const title = titleEl ? (titleEl as HTMLElement).innerText : 'Unknown Title';

                // Price again
                const priceEl = document.querySelector('.product-price-current, div[class*="Price--currentPrice"]');
                const priceText = priceEl ? (priceEl as HTMLElement).innerText.replace(/[^0-9.]/g, '') : '0';
                const price = parseFloat(priceText) * 100;

                // Images
                const imgElements = Array.from(document.querySelectorAll('.images-view-item img, img[class*="magnifier--image"]'));
                const images = imgElements.map((img: any) => img.src).filter(src => src);

                // Vendor
                const vendorEl = document.querySelector('a[class*="store--storeLink"]');
                const vendor = vendorEl ? (vendorEl as HTMLElement).innerText : 'AliExpress Vendor';

                return {
                    externalId: exId,
                    title,
                    price: isNaN(price) ? 0 : price,
                    description: 'Full description scraping is complex (often in iframe), leaving placeholder.',
                    images: images.length > 0 ? images : [''],
                    vendor,
                    url: `https://www.aliexpress.com/item/${exId}.html`
                };
            }, externalId);

            return data;

        } catch (error) {
            console.error('[AliExpress] Details Scrape Error:', error);
            throw error;
        } finally {
            if (browser) await browser.close();
        }
    }

    async placeOrder(orderDetails: any): Promise<string> {
        console.log(`[AliExpress] Procesando orden (MOCK)...`, orderDetails);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const fakeOrderId = `ALI-REAL-MOCK-${Date.now()}`;
        console.log(`[AliExpress] Orden simulada creada: ${fakeOrderId}`);
        return fakeOrderId;
    }

    async checkStatus(): Promise<{ connected: boolean; message?: string }> {
        return { connected: true, message: 'Scraper (Puppeteer) listo' };
    }
}
