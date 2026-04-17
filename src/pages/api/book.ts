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

    // Send Slack notification (fire-and-forget)
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      const emoji = type === 'free-bay' ? '🏌️' : '💰';
      const label = type === 'free-bay' ? 'Free Bay Session' : 'Performance Evaluation ($75)';
      fetch(slackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `${emoji} *New Booking: ${label}*\n\n👤 ${firstName} ${lastName}\n📧 ${email}\n📱 ${phone}\n📅 ${date} at ${time}\n🏠 ${result.bayName}${result.instructorName ? `\n🎓 Coach: ${result.instructorName}` : ''}${notes ? `\n📝 ${notes}` : ''}`,
        }),
      }).catch(() => { /* silently fail */ });
    }

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
