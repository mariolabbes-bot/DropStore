import prisma from '../lib/prisma';
import { ProviderFactory } from '../lib/providers/factory';

export class ProductService {
    /**
     * Busca productos utilizando el proveedor configurado
     */
    async search(query: string, providerName: string = 'aliexpress') {
        const provider = ProviderFactory.getProvider(providerName);
        return provider.searchProducts(query);
    }

    /**
     * Importa un producto externo a nuestra base de datos
     */
    async importProduct(externalId: string, providerName: string = 'aliexpress') {
        const provider = ProviderFactory.getProvider(providerName);
        const data = await provider.getProductDetails(externalId);
        console.log(`[ImportService] Data received for ${externalId}:`, JSON.stringify({
            price: data.price,
            shippingCost: data.shippingCost,
            costPrice: data.price
        }));

        // Verificar si ya existe (opcional, por ahora creamos uno nuevo o actualizamos)
        // Aquí podríamos buscar por un campo 'externalId' si decidiéramos agregarlo al modelo Product

        // Por ahora, lo mapeamos al modelo Product existente
        // Usamos upsert para evitar duplicados
        // Base Cost = Product Price + Shipping + Others (Buffer)
        const costPrice = data.price;
        const shippingCost = data.shippingCost || 0;
        const otherCosts = 0; // Buffer for payment fees etc.
        const totalCost = costPrice + shippingCost + otherCosts;

        // Margin calculation: (Cost + Shipping) * 1.5 + buffer? 
        // User requested: "margin applied to total purchase value (buy price + shipping + others)"
        const sellingPrice = Math.round(totalCost * 1.5);

        // Usamos upsert para evitar duplicados
        const product = await prisma.product.upsert({
            where: { externalId: data.externalId },
            update: {
                title: data.title,
                description: data.description,
                price: sellingPrice,
                costPrice: costPrice, // Save original product cost
                shippingCost: shippingCost,
                otherCosts: otherCosts,
                image: this.cleanImageUrl(data.images[0]),
                images: data.images, // Save the full array
                vendor: data.vendor,
            },
            create: {
                title: data.title,
                description: data.description,
                price: sellingPrice,
                costPrice: costPrice,
                shippingCost: shippingCost,
                otherCosts: otherCosts,
                image: this.cleanImageUrl(data.images[0]),
                images: data.images, // Save the full array
                vendor: data.vendor,
                externalId: data.externalId,
            },
        });

        return product;
    }

    private cleanImageUrl(url: string | undefined): string {
        if (!url) return '';
        // If it accidentally contains a JSON array string ["http..."], parse it and take first
        if (url.startsWith('["')) {
            try {
                const parsed = JSON.parse(url);
                return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '';
            } catch (e) {
                return '';
            }
        }
        return url;
    }
}
