import prisma from '../lib/prisma';
import { ProviderFactory } from '../lib/providers/factory';

export class OrderService {

    /**
     * Procesa un evento de checkout completado de Stripe
     */
    async createOrderFromStripe(session: any) {
        const { id: sessionId, amount_total, metadata, customer_details } = session;

        console.log(`[OrderService] Creando orden para sesión ${sessionId}`);

        // Parse items from metadata
        let items = [];
        try {
            items = JSON.parse(metadata.items || '[]');
        } catch (error) {
            console.error('[OrderService] Error parsing items from metadata:', error);
        }

        // Create order in DB
        const order = await prisma.order.create({
            data: {
                total: amount_total,
                status: 'paid',
                paymentId: sessionId,
                customerEmail: metadata.customerEmail || customer_details?.email,
                customerName: metadata.customerName || customer_details?.name,
                shippingAddress: metadata.shippingAddress,
                userId: metadata.userId !== 'guest' ? metadata.userId : null,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        title: item.title,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        console.log(`[OrderService] Orden local creada: ${order.id}`);

        // Disparar fulfillment automáticamente
        await this.fulfillOrder(order.id);

        return order;
    }

    /**
     * Envía la orden al proveedor de dropshipping
     */
    async fulfillOrder(orderId: number) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });

        if (!order) throw new Error('Orden no encontrada');

        // Determinar el proveedor basado en el primer producto de la orden
        const firstItem = order.items[0];
        let vendor = 'aliexpress';

        if (firstItem) {
            const product = await prisma.product.findUnique({
                where: { id: firstItem.productId }
            });
            vendor = product?.vendor?.toLowerCase() || 'aliexpress';
        }

        console.log(`[OrderService] Usando proveedor: ${vendor} para orden ${orderId}`);
        const provider = ProviderFactory.getProvider(vendor);

        try {
            const externalOrderId = await provider.placeOrder({
                localOrderId: order.id,
                items: order.items,
                total: order.total
            });

            // Actualizar orden con ID externo
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    externalOrderId: externalOrderId,
                    status: 'fulfillment_pending'
                }
            });

            console.log(`[OrderService] Orden ${orderId} enviada al proveedor. Ref: ${externalOrderId}`);
        } catch (error) {
            console.error(`[OrderService] Error enviando orden al proveedor:`, error);
            // Podríamos actualizar estado a 'error'
        }
    }
}
