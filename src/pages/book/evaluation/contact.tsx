import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import BookingLayout from '../../../components/BookingLayout';
import TestimonialSlider from '../../../components/TestimonialSlider';

export default function EvaluationContactPage() {
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

    // Navigate to payment step instead of thank-you
    router.push(`/book/evaluation/payment?date=${date}&time=${time}&name=${encodeURIComponent(form.get('first_name') as string)}&last_name=${encodeURIComponent(form.get('last_name') as string)}&email=${encodeURIComponent(form.get('email') as string)}&phone=${encodeURIComponent(form.get('phone') as string)}`);
  };

  return (
    <BookingLayout title="Your Details — Performance Evaluation">
      {/* Section 1: Hero & Booking */}
      <section className="max-w-7xl mx-auto px-8 py-16 flex flex-col items-center">
        {/* Centered Headline */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl leading-tight uppercase tracking-tight" style={{ fontFamily: "'Bayon', sans-serif" }}>
            YOUR GAME. <br />
            <span className="text-primary-container">DIAGNOSED.</span>
          </h1>
        </div>

        {/* Contact Form Wrapper */}
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="w-full bg-surface-container-low p-8 md:p-10 rounded-xl border border-outline-variant/10 shadow-2xl">
            {/* Booking Summary */}
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
                onClick={() => router.push('/book/evaluation')}
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
                    <input className={`w-full bg-[#0A0A0A] ${errors.first_name ? 'border-[#FF4444]' : 'border-outline-variant/30'} text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all`} id="first_name" name="first_name" placeholder="John" type="text" />
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
                  <textarea className="w-full bg-[#0A0A0A] border-outline-variant/30 text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all resize-none" id="notes" name="notes" placeholder="e.g. Focus areas, handicap level, etc." rows={3} />
                </div>
                <p className="text-xs text-on-surface-variant text-center opacity-60">Your information is never shared or sold.</p>
                <div className="flex flex-col items-center gap-6 pt-4">
                  <button className="w-full py-5 px-8 bg-primary-container hover:bg-[#b7753a] text-on-primary-container font-black text-lg rounded-full shadow-xl hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-tight" type="submit">
                    Continue to Payment →
                  </button>
                  <button type="button" onClick={() => router.push('/book/evaluation')} className="flex items-center gap-2 text-on-surface-variant text-sm font-semibold hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Change date or time
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Testimonial Slider */}
      <TestimonialSlider />

      {/* Section 3: Experience Section */}
      <section className="bg-surface-container-lowest py-24 px-8 border-y border-outline-variant/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl uppercase tracking-tight text-white" style={{ fontFamily: "'Bayon', sans-serif" }}>HERE&apos;S WHAT HAPPENS DURING YOUR DIAGNOSTIC.</h2>
              <p className="text-xl text-on-surface-variant leading-relaxed">Most golfers have never seen their actual swing data. In 60 minutes, that changes.</p>
            </div>
            {/* Trust Signals */}
            <div className="space-y-0">
              <div className="flex items-start gap-6 border-b border-outline-variant/20 pb-8 mb-8">
                <span className="text-3xl text-primary-container shrink-0" style={{ fontFamily: "'Bayon', sans-serif" }}>01</span>
                <div>
                  <h3 className="text-lg font-bold uppercase text-white mb-2" style={{ fontFamily: "'Open Sans', sans-serif" }}>WE CAPTURE YOUR NUMBERS.</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Ball speed, launch angle, spin rate, club path, and face angle — tracked on every single swing.</p>
                </div>
              </div>
              <div className="flex items-start gap-6 border-b border-outline-variant/20 pb-8 mb-8">
                <span className="text-3xl text-secondary shrink-0" style={{ fontFamily: "'Bayon', sans-serif" }}>02</span>
                <div>
                  <h3 className="text-lg font-bold uppercase text-white mb-2" style={{ fontFamily: "'Open Sans', sans-serif" }}>YOUR COACH EXPLAINS WHAT THEY MEAN.</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Not just what the data says — but why it&apos;s causing your specific miss.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <span className="text-3xl text-tertiary shrink-0" style={{ fontFamily: "'Bayon', sans-serif" }}>03</span>
                <div>
                  <h3 className="text-lg font-bold uppercase text-white mb-2" style={{ fontFamily: "'Open Sans', sans-serif" }}>YOU LEAVE WITH A CLEAR PLAN.</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">One or two things to work on. Not a list of tips. A direction you can actually use.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <img alt="A professional, high-fidelity photo of a PGA-certified golf instructor standing beside a large TrackMan monitor mounted on a stand. The monitor displays colorful swing data (launch angle, ball speed, spin rate). The instructor is pointing at the screen, explaining the data to a golfer who stands nearby in a hitting bay holding an iron. The environment is a dark, modern indoor golf simulator facility with dark gray walls and professional, focused lighting." className="w-full aspect-video lg:aspect-square object-cover rounded-xl shadow-2xl border border-outline-variant/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-lpdd5rNQfbrRoz9OOSHXHa9V-Wn8Oqh62ebszAfFGBbUOcYw6jVDh8pXPcYA0Y-i8hSQNHuLycCvZ_tbMkCOmZz_KlrP9n-PmqpBY6oH2ejKJfWCo2BLxlKB4U56QU_14JpPq57QfcS7mTMy25v8AIn6ib9smVrVFkgM4Cl_AoHBbx4UX8IjyrJkT6WDIvnnOWyz6g8IK28a0VVvmQ6jhwXoOG4g1_Pbqu8HDhI0H-1G1aw-N98pnUHxRIMc9JJ4P85hd3o_SDk" />
          </div>
        </div>
      </section>

      {/* New Final CTA Section */}
      <section className="bg-background py-24 px-8" style={{ backgroundColor: 'rgba(27, 34, 27, 0.8)' }}>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl text-white uppercase tracking-tight" style={{ fontFamily: "'Bayon', sans-serif" }}>STILL GUESSING WHAT&apos;S WRONG?</h2>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto" style={{ fontFamily: "'Open Sans', sans-serif" }}>Most golfers leave the range with the same problems they arrived with. Book the diagnostic and find out what&apos;s actually going on — in 60 minutes or less.</p>
          <div className="pt-4">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-[#D38743] hover:bg-[#b7753a] text-on-primary-container font-bold py-4 px-10 rounded-full transition-transform active:scale-95 uppercase tracking-widest text-sm"
            >
              BOOK YOUR EVALUATION
            </button>
          </div>
        </div>
      </section>
    </BookingLayout>
  );
}
