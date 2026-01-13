
import { OrderService } from '../services/order.service';
import prisma from '../lib/prisma';

async function main() {
    const service = new OrderService();

    // 1. Crear usuario de prueba
    const testUser = await prisma.user.create({
        data: {
            email: `test_${Date.now()}@example.com`,
            name: 'Test Setup User',
            role: 'customer'
        }
    });
    console.log('✅ Usuario de prueba creado:', testUser.id);

    const mockStripeSession = {
        id: `cs_test_${Date.now()}`,
        amount_total: 2999, // $29.99
        metadata: {
            userId: testUser.id,
            customerName: 'Test Customer',
            customerEmail: 'customer@test.com',
            shippingAddress: '123 Test St, Test City, 12345',
            items: JSON.stringify([
                {
                    productId: 101, // Local Product ID (Int)
                    title: 'Test Product - Mobile Phone Bag',
                    price: 2999,
                    quantity: 1,
                    image: 'https://example.com/image.jpg'
                }
            ])
        },
        customer_details: {
            email: 'customer@test.com',
            name: 'Test Customer'
        }
    };

    console.log('--- Simulando Webhook de Stripe ---');
    try {
        const createdOrder = await service.createOrderFromStripe(mockStripeSession);

        // Refetch to get updated status after fulfillment
        const order = await prisma.order.findUnique({
            where: { id: createdOrder.id }
        });

        console.log('✅ Orden recuperada de DB:', order);

        if (order.externalOrderId && order.externalOrderId.startsWith('ALI-')) {
            console.log('✅ Orden enviada a AliExpress correctamente (Mock ID):', order.externalOrderId);
        } else {
            console.error('❌ La orden no tiene externalOrderId válido');
        }

    } catch (error) {
        console.error('❌ Error en simulación:', error);
    }
}

main().catch(console.error);
