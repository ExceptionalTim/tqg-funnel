import { useState } from 'react';
import { useRouter } from 'next/router';
import BookingLayout from '../../../components/BookingLayout';
import CalendarWidget from '../../../components/CalendarWidget';
import TestimonialSlider from '../../../components/TestimonialSlider';

export default function EvaluationDatePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      router.push(`/book/evaluation/contact?date=${dateStr}&time=${encodeURIComponent(selectedTime)}`);
    }
  };

  return (
    <BookingLayout title="Book Your Performance Evaluation">
      {/* Section 1: Hero & Booking */}
      <section className="max-w-7xl mx-auto px-8 py-16 flex flex-col items-center">
        {/* Centered Headline */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl leading-tight uppercase tracking-tight" style={{ fontFamily: "'Bayon', sans-serif" }}>
            YOUR GAME. <br />
            <span className="text-primary-container">DIAGNOSED.</span>
          </h1>
        </div>
        {/* Calendar Workspace (Using our specialized widget instead of the raw HTML container) */}
        <div className="w-full max-w-4xl flex flex-col items-center">
          <CalendarWidget onDateTimeSelect={handleDateTimeSelect} maxHeight={600} bookingType="evaluation" />
          
          {/* Continue Button */}
          {selectedTime && (
            <button
              onClick={handleContinue}
              className="mt-8 w-full bg-[#D38743] hover:bg-[#b7753a] text-on-primary-container font-bold py-4 px-10 rounded-full transition-transform active:scale-95 uppercase tracking-widest text-sm shadow-xl"
            >
              Continue →
            </button>
          )}
        </div>
      </section>

      {/* Section 2: Testimonial Slider (Restored functional React Component) */}
      <TestimonialSlider />

      {/* Section 3: Experience Section (Swapped to be below Social Proof) */}
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
