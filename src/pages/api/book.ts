import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { bookSlot } from '../../lib/google-calendar';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date, time, type, firstName, lastName, email, phone, notes, paymentIntentId } = req.body;

  // Validate required fields
  if (!date || !time || !type || !firstName || !lastName || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (type !== 'free-bay' && type !== 'evaluation') {
    return res.status(400).json({ error: 'Invalid type.' });
  }

  // For evaluations, verify Stripe payment succeeded
  if (type === 'evaluation') {
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID required for evaluations.' });
    }

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ error: 'Payment has not been completed.' });
      }
    } catch {
      return res.status(400).json({ error: 'Invalid payment intent.' });
    }
  }

  try {
    const result = await bookSlot({
      date, time, type, firstName, lastName, email, phone, notes,
    });

    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error && err.message === 'SLOT_TAKEN') {
      return res.status(409).json({
        error: 'slot_taken',
        message: 'This time slot was just booked. Please select another time.',
      });
    }

    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to create booking.' });
  }
}
