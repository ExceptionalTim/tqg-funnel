import { useRouter } from 'next/router';
import BookingLayout from '../../../components/BookingLayout';
import TestimonialSlider from '../../../components/TestimonialSlider';

const FAQ_ITEMS = [
  {
    q: 'What should I bring?',
    a: "Just your clubs and your usual golf attire. We handle everything else — TrackMan, Swing Catalyst, balls, and the coaching. Bring the clubs you normally play so the data reflects your actual game.",
  },
  {
    q: 'What exactly happens during the 60 minutes?',
    a: "We start by getting your baseline numbers on TrackMan — ball speed, launch angle, spin rate, club path, face angle. Then your PGA-certified coach walks you through what the data means, identifies the root cause of your miss, and gives you one or two specific things to work on. You leave with a clear plan, not a list of tips.",
  },
  {
    q: 'Is this just a lesson or is it a fitting too?',
    a: "It's a diagnostic. It's designed to tell you what's happening in your swing before we recommend anything — lessons, fitting, or otherwise. Think of it as getting an accurate read on your game first, so any next steps actually make sense for you specifically.",
  },
  {
    q: 'What if I need to reschedule?',
    a: 'No problem. Call us at (918) 221-7096 or reply to your confirmation email and we\'ll sort it out.',
  },
  {
    q: 'Where do I go when I arrive?',
    a: "6006 S Sheridan Rd, Suite A, Tulsa, OK 74145. Come through the main entrance and let the front desk know you're here for your Performance Evaluation. Your coach will be ready for you.",
  },
];

export default function EvaluationThankYouPage() {
  const router = useRouter();
  const { date, time, name } = router.query;
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T12:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  };

  const displayName = name ? decodeURIComponent(name as string).toUpperCase() : 'GOLFER';

  return (
    <BookingLayout title="You're Booked">
      {/* Confirmation Hero */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        <div className="z-10 text-center max-w-4xl w-full">
          <div className="mb-6 flex justify-center">
            <span className="material-symbols-outlined text-[80px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h2 className="text-6xl md:text-8xl leading-none mb-12 tracking-tighter uppercase" style={{ fontFamily: "'Bayon', sans-serif" }}>
            YOU&apos;RE BOOKED, <span className="text-primary">{displayName}</span>
          </h2>

          {/* Booking Summary Card */}
          <div className="bg-surface-container-low p-8 md:p-12 rounded-xl relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary">calendar_today</span>
                  <p className="font-bold uppercase tracking-wider text-sm text-white">{date ? formatDate(date as string) : ''}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary">schedule</span>
                  <p className="font-bold uppercase tracking-wider text-sm text-white">{time ? decodeURIComponent(time as string) : ''} — Central Time</p>
                </div>
              </div>
              <div className="space-y-4 border-l border-outline-variant/15 pl-0 md:pl-8">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  <p className="font-bold uppercase tracking-wider text-sm leading-relaxed text-white">
                    6006 S Sheridan Rd, Suite A<br />Tulsa, OK 74145
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary">person</span>
                  <p className="font-bold uppercase tracking-wider text-sm text-white">Your Coach: Ross MacDonald</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary">sports_golf</span>
                  <p className="font-bold uppercase tracking-wider text-sm text-white">Bay 2 — TrackMan</p>
                </div>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-4 justify-start">
              <button className="px-6 py-3 rounded-full border border-primary text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-black transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">event</span> Add to Google Calendar
              </button>
              <button className="px-6 py-3 rounded-full border border-primary text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-black transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">calendar_add_on</span> Add to Apple Calendar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens On The Day */}
      <section className="py-24 px-6 bg-surface-container-lowest border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <h3 className="text-4xl md:text-5xl uppercase tracking-tighter" style={{ fontFamily: "'Bayon', sans-serif" }}>WHAT HAPPENS ON THE DAY</h3>
            <p className="text-[#78716c] font-bold text-xs uppercase tracking-[0.2em]">01 — 04 / PREPARATION</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { num: '01', title: 'ARRIVE 10 MINUTES EARLY.', desc: 'Get checked in and grab a water. We want you ready to swing the moment your bay is live.' },
              { num: '02', title: 'BRING YOUR OWN CLUBS.', desc: 'This is about your game. Bringing your current set ensures the data we capture is relevant to your performance.' },
              { num: '03', title: "WE'LL SHOW YOU YOUR NUMBERS.", desc: 'Instant feedback on launch angle, ball speed, and spin rate. Raw tour-level precision data on every shot.' },
              { num: '04', title: 'NO PRESSURE. NO PITCH.', desc: 'The bay is yours. No sales pitch, just elite technology and a focus on pure golfing performance.' },
            ].map(step => (
              <div key={step.num} className="bg-surface p-10 rounded-lg border border-white/5">
                <span className="text-primary text-2xl mb-4 block" style={{ fontFamily: "'Bayon', sans-serif" }}>{step.num}</span>
                <h4 className="font-bold text-white text-xl uppercase mb-2">{step.title}</h4>
                <p className="text-on-surface-variant/80 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Slider */}
      <TestimonialSlider />

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl uppercase mb-12 tracking-tight" style={{ fontFamily: "'Bayon', sans-serif" }}>BEFORE YOU COME IN</h3>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="group bg-surface rounded-lg border border-white/5">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                  <span className="font-bold uppercase text-sm tracking-widest text-white">{item.q}</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant text-sm border-t border-outline-variant/10 pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final Reassurance CTA */}
      <section className="py-24 px-6 bg-[#1B221B] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D38743 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="max-w-4xl mx-auto text-center z-10 relative">
          <h3 className="text-5xl md:text-6xl uppercase tracking-tighter mb-8 text-on-background" style={{ fontFamily: "'Bayon', sans-serif" }}>
            QUESTIONS BEFORE YOU COME IN?
          </h3>
          <div className="flex flex-col items-center gap-6">
            <a href="tel:9182217096" className="text-primary text-3xl tracking-widest hover:opacity-80 transition-opacity" style={{ fontFamily: "'Bayon', sans-serif" }}>(918) 221-7096</a>
            <div className="w-16 h-1 bg-primary" />
            <p className="text-on-surface-variant max-w-lg mx-auto leading-relaxed">
              Call us directly. Our master fitters and technicians are ready to assist. If you need to change your appointment or have specific equipment questions, give us a call.
            </p>
          </div>
        </div>
      </section>
    </BookingLayout>
  );
}
