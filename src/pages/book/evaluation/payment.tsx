import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { loadStripe, Appearance } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import BookingLayout from '../../../components/BookingLayout';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

let stripePromise: ReturnType<typeof loadStripe> | null = null;
function getStripe() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Stripe publishable key is not configured');
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}

const appearance: Appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#d38743',
    colorBackground: '#0A0A0A',
    colorText: '#e2e2e2',
    colorTextSecondary: '#d8c2b4',
    colorDanger: '#ffb4ab',
    fontFamily: "'Open Sans', sans-serif",
    borderRadius: '8px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      backgroundColor: '#0A0A0A',
      border: '1px solid rgba(83, 68, 57, 0.3)',
      padding: '12px 16px',
      color: '#ffffff',
      fontSize: '14px',
    },
    '.Input:focus': {
      borderColor: '#d38743',
      boxShadow: '0 0 0 1px #d38743',
    },
    '.Label': {
      color: '#d8c2b4',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    },
    '.Tab': {
      backgroundColor: '#1b1b1b',
      borderColor: 'rgba(83, 68, 57, 0.1)',
      color: '#d8c2b4',
    },
    '.Tab--selected': {
      backgroundColor: '#1f1f1f',
      borderColor: '#d38743',
      color: '#e2e2e2',
    },
  },
};

function CheckoutForm({ date, time, name: bookingName, email, phone }: { date: string; time: string; name: string; email: string; phone: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymentInfoPushed = useRef(false);

  const handlePaymentFocus = () => {
    if (paymentInfoPushed.current) return;
    paymentInfoPushed.current = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'add_payment_info',
      ecommerce: {
        currency: 'USD',
        value: 75,
        payment_type: 'credit_card',
        items: [{
          item_name: 'Performance Evaluation',
          item_category: 'Golf Services',
          price: 75,
          quantity: 1,
        }],
      },
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const returnUrl = `${window.location.origin}/book/evaluation/thank-you?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&name=${encodeURIComponent(bookingName)}`;

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    // Only reaches here if there's an error (successful payments redirect automatically)
    if (stripeError) {
      setError(stripeError.message || 'Payment failed. Please try again.');
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-secondary">lock</span>
        <h3 className="text-xs font-bold tracking-widest text-secondary" style={{ fontFamily: "'Open Sans', sans-serif" }}>SECURE PAYMENT</h3>
      </div>

      <div onFocus={handlePaymentFocus}>
        <PaymentElement />
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-error-container/20 text-error text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      <div className="mt-8 space-y-4">
        <button
          type="submit"
          disabled={!stripe || !elements || processing}
          className={`w-full py-5 px-8 bg-primary-container text-on-primary-container font-black text-lg rounded-full shadow-xl uppercase tracking-tight transition-all ${
            processing || !stripe ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.98]'
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
    </form>
  );
}

export default function EvaluationPaymentPage() {
  const router = useRouter();
  const { date, time, name, last_name, email, phone } = router.query;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T12:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  };

  useEffect(() => {
    if (!router.isReady) return;

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: date || '',
        time: time || '',
        name: name || '',
        last_name: last_name || '',
        email: email || '',
        phone: phone || '',
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setLoadError(data.error || 'Failed to initialize payment');
        }
      })
      .catch(() => setLoadError('Failed to connect to payment server'));
  }, [router.isReady, date, time, name, email]);

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
            {loadError ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-error text-4xl mb-4 block">error</span>
                <p className="text-error">{loadError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-primary underline text-sm"
                >
                  Try again
                </button>
              </div>
            ) : clientSecret ? (
              getStripe() ? (
                <Elements stripe={getStripe()!} options={{ clientSecret, appearance }}>
                  <CheckoutForm
                    date={(date as string) || ''}
                    time={(time as string) || ''}
                    name={(name as string) || ''}
                    email={(email as string) || ''}
                    phone={(phone as string) || ''}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-error text-4xl mb-4 block">error</span>
                  <p className="text-error">Payment system configuration error. Please try again later.</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
                <p className="text-on-surface-variant text-sm">Loading secure payment...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </BookingLayout>
  );
}
