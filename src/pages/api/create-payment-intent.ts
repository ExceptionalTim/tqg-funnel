import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date, time, name, last_name, email, phone } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 7500,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        product: 'Performance Evaluation',
        date: date || '',
        time: time || '',
        first_name: name || '',
        last_name: last_name || '',
        email: email || '',
        phone: phone || '',
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Payment intent creation failed';
    res.status(500).json({ error: message });
  }
}
