import type { NextApiRequest, NextApiResponse } from 'next';
import { getAvailableSlots } from '../../lib/google-calendar';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date, type } = req.query;

  if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  if (type !== 'free-bay' && type !== 'evaluation') {
    return res.status(400).json({ error: 'Invalid type. Use "free-bay" or "evaluation".' });
  }

  // Reject past dates
  const today = new Date().toISOString().split('T')[0];
  if (date < today) {
    return res.status(400).json({ error: 'Cannot check availability for past dates.' });
  }

  // Reject Sundays
  const dayOfWeek = new Date(date + 'T12:00:00').getDay();
  if (dayOfWeek === 0) {
    return res.status(200).json({ slots: [] });
  }

  try {
    const slots = await getAvailableSlots(date, type);
    res.status(200).json({ slots });
  } catch (err: unknown) {
    const error = err as { message?: string; response?: { data?: unknown }; code?: string };
    console.error('Availability error:', error.message, error.response?.data || error.code || '');
    res.status(500).json({ error: 'Failed to fetch availability.' });
  }
}
