import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items, shippingInfo, userId } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }

  if (!shippingInfo) {
    return res.status(400).json({ error: 'Shipping information required' });
  }

  try {
    // Create line items for Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: item.price, // Price in cents
      },
      quantity: item.quantity,
    }));

    // Format shipping address for Stripe
    const shippingAddress = `${shippingInfo.name}
${shippingInfo.address}
${shippingInfo.city}, ${shippingInfo.state || ''} ${shippingInfo.zipCode}
${shippingInfo.country}
${shippingInfo.phone ? 'Tel: ' + shippingInfo.phone : ''}`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout`,
      customer_email: shippingInfo.email,
      metadata: {
        userId: userId || 'guest',
        customerName: shippingInfo.name,
        customerEmail: shippingInfo.email,
        shippingAddress: shippingAddress,
        items: JSON.stringify(items.map((item: any) => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }))),
      },
    });

    return res.status(200).json({
      id: session.id,
      url: session.url
    });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({
      error: 'Error creating checkout session',
      message: err.message
    });
  }
}
