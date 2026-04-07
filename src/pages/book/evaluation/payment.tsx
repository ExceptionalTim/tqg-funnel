import { useRouter } from 'next/router';
import { useState } from 'react';
import BookingLayout from '../../../components/BookingLayout';

// ============================================================
// TODO: STRIPE INTEGRATION
// Replace the mock payment flow below with Stripe Elements.
//
// Required packages: @stripe/stripe-js, @stripe/react-stripe-js
// Required env vars:
//   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXX
//   STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXX
//
// Implementation steps:
// 1. Create a Next.js API route at /api/create-payment-intent
//    that calls stripe.paymentIntents.create({ amount: 7500, currency: 'usd' })
// 2. Use loadStripe() and Elements provider to wrap the checkout form
// 3. Use CardElement or PaymentElement from @stripe/react-stripe-js
// 4. On successful payment, redirect to thank-you page
// ============================================================

const PLACEHOLDER_STRIPE_KEY = 'pk_test_PLACEHOLDER_REPLACE_WITH_REAL_KEY';

export default function EvaluationPaymentPage() {
  const router = useRouter();
  const { date, time, name, email } = router.query;
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T12:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  };

  const handlePayment = async () => {
    setProcessing(true);

    // ============================================================
    // TODO: Replace this mock with real Stripe PaymentIntent flow
    // const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    //   payment_method: { card: cardElement }
    // });
    // ============================================================

    // Mock payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setProcessing(false);
    router.push(`/book/evaluation/thank-you?date=${date}&time=${time}&name=${name}`);
  };

  const displayName = name ? decodeURIComponent(name as string) : '';

  return (
    <BookingLayout title="Secure Payment">
      <section className="max-w-7xl mx-auto px-8 py-16 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl leading-tight uppercase tracking-tight">
            SECURE <span className="text-primary-container">CHECKOUT</span>
          </h1>
        </div>

        <div className="w-full max-w-2xl">
          {/* Order Summary */}
          <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-2xl mb-6">
            <h3 className="text-xs font-bold tracking-widest text-secondary mb-6" style={{ fontFamily: "'Open Sans', sans-serif" }}>ORDER SUMMARY</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
                <div>
                  <p className="font-bold text-on-surface">Performance Evaluation</p>
                  <p className="text-sm text-on-surface-variant">60-min 1-on-1 with PGA Instructor + Full Swing Analysis</p>
                </div>
                <div className="text-right">
                  <span className="block text-sm line-through text-on-surface-variant/50">$150</span>
                  <span className="text-2xl font-bold text-primary" style={{ fontFamily: "'Bayon', sans-serif" }}>$75</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">calendar_today</span>
                  <span>{date ? formatDate(date as string) : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">schedule</span>
                  <span>{time ? decodeURIComponent(time as string) : ''}</span>
                </div>
              </div>
              {displayName && (
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-base">person</span>
                  <span>{displayName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary">lock</span>
              <h3 className="text-xs font-bold tracking-widest text-secondary" style={{ fontFamily: "'Open Sans', sans-serif" }}>SECURE PAYMENT</h3>
            </div>

            {/* Mock Card Form — Replace with Stripe Elements */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Card Number</label>
                <input
                  className="w-full bg-[#0A0A0A] border-outline-variant/30 text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  type="text"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Expiry</label>
                  <input
                    className="w-full bg-[#0A0A0A] border-outline-variant/30 text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                    placeholder="MM / YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    type="text"
                    maxLength={7}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">CVC</label>
                  <input
                    className="w-full bg-[#0A0A0A] border-outline-variant/30 text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    type="text"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={handlePayment}
                disabled={processing}
                className={`w-full py-5 px-8 bg-primary-container text-on-primary-container font-black text-lg rounded-full shadow-xl uppercase tracking-tight transition-all ${
                  processing ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.98]'
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Processing...
                  </span>
                ) : (
                  'Pay $75 & Confirm Booking'
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="w-full flex items-center justify-center gap-2 text-on-surface-variant text-sm font-semibold hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Go back
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-on-surface-variant/40 text-xs">
              <span className="material-symbols-outlined text-base">lock</span>
              <span>256-bit SSL Encryption</span>
              <span>•</span>
              <span>Powered by Stripe</span>
            </div>
          </div>
        </div>
      </section>
    </BookingLayout>
  );
}
