import { useState } from 'react';
import { useRouter } from 'next/router';
import BookingLayout from '../../../components/BookingLayout';
import CalendarWidget from '../../../components/CalendarWidget';
import TestimonialSlider from '../../../components/TestimonialSlider';

export default function FreeBayDatePage() {
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
      router.push(`/book/free-bay/contact?date=${dateStr}&time=${encodeURIComponent(selectedTime)}`);
    }
  };

  return (
    <BookingLayout title="Book Your Free Bay Session">
      <section className="max-w-7xl mx-auto px-8 py-16 flex flex-col items-center">
        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl leading-tight uppercase tracking-tight">
            YOUR FREE SESSION <br />
            <span className="text-primary-container">STARTS HERE</span>
          </h1>
        </div>

        {/* Calendar Widget */}
        <CalendarWidget onDateTimeSelect={handleDateTimeSelect} maxHeight={600} />

        {/* Continue Button */}
        {selectedTime && (
          <button
            onClick={handleContinue}
            className="mt-8 w-full max-w-4xl py-5 px-8 bg-primary-container text-on-primary-container font-black text-lg rounded-full shadow-xl hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-tight"
          >
            Continue →
          </button>
        )}
      </section>

      {/* The Tour Quality Experience */}
      <section className="bg-surface-container-lowest py-20 px-8 border-y border-outline-variant/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl uppercase tracking-tight text-white" style={{ fontFamily: "'Bayon', sans-serif" }}>
                The Tour Quality Experience
              </h2>
              <p className="text-xl text-on-surface-variant leading-relaxed">
                30 minutes on TrackMan. No cost. No commitment. Show up with your clubs — we handle everything else.
              </p>
            </div>
            <div className="space-y-4">
              {['PGA-Certified Coaching', 'TrackMan on Every Swing', 'No Strings Attached'].map(item => (
                <div key={item} className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="font-bold uppercase tracking-wider text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <img
              alt="Friendly PGA-certified golf instructor in a modern indoor golf simulator facility"
              className="w-full aspect-video lg:aspect-square object-cover rounded-xl shadow-2xl border border-outline-variant/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL2L89YrpG1YTKz1wZixBFXtP945e4VB4btHrRHjas1ghv43WGgehAQmngvyK2os8FekRTUOOsyy7VrNerO3-jT6xQrdtPNMRrnkgRVd2qebfEIjdtraAJVp_JkVcTyExmEalqEWIugEpl5muJHxZQDeXGcnJkV-Az7lgp97ySXI2NyoMnn0ViLHZtUHQ-7g8SNW8dB_jk0NaE8WCjCsu2VKI9gNvMbrlhQe2zciK7BVslIBaaYzaNDdFjApkIlYHfvkjO9CNwaHo"
            />
          </div>
        </div>
      </section>

      {/* Real Golfers. Real Numbers. Testimonial Slider */}
      <TestimonialSlider />
    </BookingLayout>
  );
}
