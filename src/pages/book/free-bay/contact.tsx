import { useRouter } from 'next/router';
import { useState } from 'react';
import BookingLayout from '../../../components/BookingLayout';
import TestimonialSlider from '../../../components/TestimonialSlider';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return phone.replace(/\D/g, '').length === 10;
}

export default function FreeBayContactPage() {
  const router = useRouter();
  const { date, time } = router.query;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T12:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};

    if (!form.get('first_name')) newErrors.first_name = 'First name is required.';
    if (!form.get('last_name')) newErrors.last_name = 'Last name is required.';
    const emailVal = (form.get('email') as string || '').trim();
    if (!emailVal) { newErrors.email = 'Email is required.'; }
    else if (!validateEmail(emailVal)) { newErrors.email = 'Please enter a valid email address.'; }
    const phoneVal = form.get('phone') as string || '';
    if (!phoneVal) { newErrors.phone = 'Phone number is required.'; }
    else if (!validatePhone(phoneVal)) { newErrors.phone = 'Please enter a valid 10-digit US phone number.'; }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const firstName = (form.get('first_name') as string).trim();
    const lastName = (form.get('last_name') as string).trim();

    setSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: date as string,
          time: decodeURIComponent(time as string),
          type: 'free-bay',
          firstName,
          lastName,
          email: emailVal,
          phone: phoneVal,
          notes: (form.get('notes') as string || '').trim(),
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setBookingError('This time slot was just booked. Please go back and select another time.');
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        setBookingError(data.error || 'Failed to book. Please try again.');
        setSubmitting(false);
        return;
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'form_submission',
        form_name: 'Free Bay Form Submission',
        user_data: {
          email: emailVal,
          first_name: firstName,
          last_name: lastName,
          phone: phoneVal,
        },
      });

      router.push(`/book/free-bay/thank-you?date=${date}&time=${time}&name=${encodeURIComponent(firstName)}&bayName=${encodeURIComponent(data.bayName || '')}`);
    } catch {
      setBookingError('Failed to connect to booking server. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <BookingLayout title="Your Details — Free Bay Session" description="Enter your contact details to confirm your free 30-minute indoor bay session at Tour Quality Golf Tulsa.">
      <section className="max-w-7xl mx-auto px-8 py-16 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl leading-tight uppercase tracking-tight">
            YOUR FREE SESSION <br />
            <span className="text-primary-container">STARTS HERE</span>
          </h1>
        </div>

        <div className="w-full max-w-4xl bg-surface-container-low p-10 rounded-xl border border-outline-variant/10 shadow-2xl">
          {/* Booking Summary Bar */}
          <div className="bg-secondary-container/20 rounded-lg p-4 mb-8 flex items-center justify-between border border-secondary/10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-secondary">calendar_today</span>
                <span className="font-semibold">{date ? formatDate(date as string) : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-secondary">schedule</span>
                <span className="font-semibold">{time ? decodeURIComponent(time as string) : ''}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/book/free-bay')}
              className="text-primary font-bold text-sm underline decoration-primary underline-offset-4 hover:opacity-80 transition-opacity"
            >
              Change
            </button>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xs font-bold tracking-widest text-secondary mb-6" style={{ fontFamily: "'Open Sans', sans-serif" }}>YOUR DETAILS</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="first_name">First Name</label>
                  <input
                    className={`w-full bg-[#0A0A0A] ${errors.first_name ? 'border-[#FF4444]' : 'border-outline-variant/30'} text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all`}
                    id="first_name" name="first_name" placeholder="John" type="text"
                  />
                  {errors.first_name && <p className="text-[10px] text-[#FF4444] font-bold uppercase tracking-wider">{errors.first_name}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="last_name">Last Name</label>
                  <input className={`w-full bg-[#0A0A0A] ${errors.last_name ? 'border-[#FF4444]' : 'border-outline-variant/30'} text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all`} id="last_name" name="last_name" placeholder="Doe" type="text" />
                  {errors.last_name && <p className="text-[10px] text-[#FF4444] font-bold uppercase tracking-wider">{errors.last_name}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="email">Email Address</label>
                  <input className={`w-full bg-[#0A0A0A] ${errors.email ? 'border-[#FF4444]' : 'border-outline-variant/30'} text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all`} id="email" name="email" placeholder="john@example.com" type="email" />
                  {errors.email && <p className="text-[10px] text-[#FF4444] font-bold uppercase tracking-wider">{errors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="phone">Phone Number</label>
                  <input className={`w-full bg-[#0A0A0A] ${errors.phone ? 'border-[#FF4444]' : 'border-outline-variant/30'} text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all`} id="phone" name="phone" placeholder="(555) 000-0000" type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} />
                  {errors.phone && <p className="text-[10px] text-[#FF4444] font-bold uppercase tracking-wider">{errors.phone}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="notes">
                  Anything we should know? <span className="text-[10px] opacity-50 lowercase font-normal italic">(optional)</span>
                </label>
                <textarea className="w-full bg-[#0A0A0A] border-outline-variant/30 text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all resize-none" id="notes" name="notes" placeholder="e.g. Bringing my own clubs, left-handed, etc." rows={3} />
              </div>
              <p className="text-xs text-on-surface-variant text-center opacity-60">Your information is never shared or sold. We'll only contact you about your booking.</p>
              {bookingError && (
                <div className="p-4 rounded-lg bg-error-container/20 text-error text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  {bookingError}
                </div>
              )}
              <div className="flex flex-col items-center gap-6 pt-4">
                <button
                  className={`w-full py-5 px-8 bg-primary-container text-on-primary-container font-black text-lg rounded-full shadow-xl transition-all uppercase tracking-tight ${submitting ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.98]'}`}
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Booking...
                    </span>
                  ) : (
                    'Confirm My Free Session'
                  )}
                </button>
                <button type="button" onClick={() => router.push('/book/free-bay')} className="flex items-center gap-2 text-on-surface-variant text-sm font-semibold hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  Change date or time
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Real Golfers. Real Numbers. Testimonial Slider */}
      <TestimonialSlider />
    </BookingLayout>
  );
}
