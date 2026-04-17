import { useRouter } from 'next/router';
import { useState } from 'react';
import BookingLayout from '../../../components/BookingLayout';
import TestimonialSlider from '../../../components/TestimonialSlider';
import { openGoogleCalendar, downloadICS } from '../../../lib/calendar-links';

const FAQ_ITEMS = [
  {
    q: 'Do I need to bring anything?',
    a: "Just your clubs. We have everything else covered — TrackMan, bays, and a PGA-certified instructor who'll walk you through the session.",
  },
  {
    q: 'Is this really free?',
    a: 'Yes. No credit card needed, no hidden upsell. Your 30-minute bay session is completely free and no-obligation.',
  },
  {
    q: "Should I warm up before I arrive?",
    a: "We recommend arriving 10 minutes early. You can take a few practice swings inside the facility to get comfortable before we capture any data.",
  },
  {
    q: "What if I'm a beginner?",
    a: "This session is perfect for beginners and experienced players alike. TrackMan data is surprisingly useful at every level — you'll leave knowing exactly where to focus.",
  },
  {
    q: "Can I cancel or reschedule?",
    a: "Absolutely. Call us at (918) 221-7096 and we'll get you a new time. We just ask for 24 hours' notice when possible.",
  },
];

export default function FreeBayThankYouPage() {
  const router = useRouter();
  const { date, time, name, bayName } = router.query;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
                {bayName && (
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary">sports_golf</span>
                    <p className="font-bold uppercase tracking-wider text-sm text-white">{decodeURIComponent(bayName as string)} — TrackMan</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-4 justify-start">
              <button
                onClick={() => date && time && openGoogleCalendar('Free Bay Session — Tour Quality Golf', date as string, decodeURIComponent(time as string), 30, bayName ? `Bay: ${decodeURIComponent(bayName as string)}` : '')}
                className="px-6 py-3 rounded-full border border-primary text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-black transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">event</span> Add to Google Calendar
              </button>
              <button
                onClick={() => date && time && downloadICS('Free Bay Session — Tour Quality Golf', date as string, decodeURIComponent(time as string), 30, bayName ? `Bay: ${decodeURIComponent(bayName as string)}` : '')}
                className="px-6 py-3 rounded-full border border-primary text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-black transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">calendar_add_on</span> Add to Apple Calendar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens On The Day */}
      <section className="py-24 px-6 bg-surface-container-lowest border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl md:text-5xl uppercase tracking-tighter mb-16" style={{ fontFamily: "'Bayon', sans-serif" }}>WHAT HAPPENS ON THE DAY</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { num: '01', title: 'ARRIVE 10 MINUTES EARLY.', desc: 'Get checked in and grab a water. We want you ready to swing the moment your bay is live.' },
              { num: '02', title: 'BRING YOUR OWN CLUBS.', desc: "This is about your game. Bringing your current set ensures the data we capture is relevant to your performance." },
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

      {/* Real Golfers. Real Numbers. */}
      <TestimonialSlider />

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-surface-container-lowest border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl md:text-5xl uppercase tracking-tighter mb-4" style={{ fontFamily: "'Bayon', sans-serif" }}>BEFORE YOU COME IN</h3>
          <p className="text-on-surface-variant text-lg mb-12">Common questions, answered.</p>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-surface rounded-lg border border-outline-variant/10 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-8 py-6 text-left group"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className="font-bold text-white text-base uppercase tracking-tight pr-4">{item.q}</span>
                  <span
                    className={`material-symbols-outlined text-primary-container flex-none transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                  >
                    expand_more
                  </span>
                </button>
                {openIndex === i && (
                  <div className="px-8 pb-6">
                    <p className="text-on-surface-variant leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Questions Before You Come In */}
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
              Call us directly. Our master fitters and technicians are ready to assist. If you need to change your appointment or have specific questions, give us a call.
            </p>
          </div>
        </div>
      </section>
    </BookingLayout>
  );
}
