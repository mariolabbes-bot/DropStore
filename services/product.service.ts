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

        // Verificar si ya existe (opcional, por ahora creamos uno nuevo o actualizamos)
        // Aquí podríamos buscar por un campo 'externalId' si decidiéramos agregarlo al modelo Product

        // Por ahora, lo mapeamos al modelo Product existente
        // Usamos upsert para evitar duplicados
        const product = await prisma.product.upsert({
            where: { externalId: data.externalId },
            update: {
                title: data.title,
                description: data.description,
                price: data.price,
                image: data.images[0] || '',
                vendor: data.vendor,
            },
            create: {
                title: data.title,
                description: data.description,
                price: data.price,
                image: data.images[0] || '',
                vendor: data.vendor,
                externalId: data.externalId,
                provider: providerName,
            },
        });

        return product;
    }
}
