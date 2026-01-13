import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { OrderService } from '../../../services/order.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15', // Usar una versión válida, ajustar según package.json
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
    api: {
        bodyParser: false, // Necesario para verificar firma de Stripe
    },
};

const orderService = new OrderService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
        if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET missing');
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
        console.error(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Manejar el evento
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        try {
            await orderService.createOrderFromStripe(session);
            console.log('✅ Orden procesada exitosamente');
        } catch (error) {
            console.error('❌ Error procesando orden:', error);
            return res.status(500).json({ error: 'Error processing order' });
        }
    }

    res.status(200).json({ received: true });
}
