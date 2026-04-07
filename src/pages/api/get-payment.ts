import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { payment_intent } = req.query;

  if (!payment_intent || typeof payment_intent !== 'string') {
    return res.status(400).json({ error: 'Missing payment_intent parameter' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

    res.status(200).json({
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve payment';
    res.status(500).json({ error: message });
  }
}
