import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import BookingLayout from '../../../components/BookingLayout';
import TestimonialSlider from '../../../components/TestimonialSlider';

export default function FreeBayContactPage() {
  const router = useRouter();
  const { date, time } = router.query;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T12:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};

    if (!form.get('first_name')) newErrors.first_name = 'First name is required.';
    if (!form.get('last_name')) newErrors.last_name = 'Last name is required.';
    if (!form.get('email')) newErrors.email = 'Email is required.';
    if (!form.get('phone')) newErrors.phone = 'Phone number is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    router.push(`/book/free-bay/thank-you?date=${date}&time=${time}&name=${encodeURIComponent(form.get('first_name') as string)}`);
  };

  return (
    <BookingLayout title="Your Details">
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
                  <input className={`w-full bg-[#0A0A0A] ${errors.phone ? 'border-[#FF4444]' : 'border-outline-variant/30'} text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all`} id="phone" name="phone" placeholder="(555) 000-0000" type="tel" />
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
              <div className="flex flex-col items-center gap-6 pt-4">
                <button className="w-full py-5 px-8 bg-primary-container text-on-primary-container font-black text-lg rounded-full shadow-xl hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-tight" type="submit">
                  Confirm My Free Session
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
