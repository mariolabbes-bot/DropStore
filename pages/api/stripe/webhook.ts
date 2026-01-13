import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../../lib/stripe';
import { buffer } from 'micro';
import { OrderService } from '../../../services/order.service';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const buf = await buffer(req as any);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf.toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[Webhook] Received event: ${event.type}`);

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;

    try {
      console.log('[Webhook] Processing checkout.session.completed');
      console.log('[Webhook] Session ID:', session.id);
      console.log('[Webhook] Metadata:', session.metadata);

      const orderService = new OrderService();
      const order = await orderService.createOrderFromStripe(session);

      console.log(`[Webhook] Order created successfully: ${order.id}`);

      return res.json({ received: true, orderId: order.id });
    } catch (err: any) {
      console.error('[Webhook] Error creating order:', err);
      return res.status(500).json({
        error: 'Error processing webhook',
        message: err.message
      });
    }
  }

  // Handle other event types if needed
  console.log(`[Webhook] Unhandled event type: ${event.type}`);
  return res.json({ received: true });
}
