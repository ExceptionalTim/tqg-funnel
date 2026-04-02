import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    // Submit button navigates to thank-you; change button goes back
    document.querySelectorAll('button').forEach(function(btn) {
      const t = (btn.textContent || '').trim();
      if (t.includes('Confirm My Free Session')) {
        btn.addEventListener('click', function(e) { e.preventDefault(); router.push('/book/thank-you'); });
      } else if (t.includes('Change date or time') || t === 'Change') {
        btn.addEventListener('click', function() { router.push('/book/time'); });
      }
    });
    var form = document.querySelector('form');
    if (form) form.addEventListener('submit', function(e) { e.preventDefault(); router.push('/book/thank-you'); });
  }, [router]);

  return (
    <>
      <Head>
        <title>Your Details — Tour Quality Golf</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bayon&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: `tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "primary-fixed-dim": "#ffb77c",
              "on-tertiary-container": "#303221",
              "inverse-surface": "#e2e2e2",
              "surface-container-lowest": "#0e0e0e",
              "on-secondary": "#003735",
              "on-primary-fixed-variant": "#6d3900",
              "secondary-fixed-dim": "#78d6d0",
              "on-background": "#e2e2e2",
              "secondary": "#78d6d0",
              "error": "#ffb4ab",
              "surface-tint": "#ffb77c",
              "on-primary-container": "#4d2700",
              "tertiary-fixed-dim": "#c8c8c8",
              "surface-dim": "#131313",
              "primary-fixed": "#ffdcc2",
              "surface-container": "#1f1f1f",
              "background": "#131313",
              "on-tertiary-fixed": "#1b1d0e",
              "on-surface": "#e2e2e2",
              "surface-container-low": "#1b1b1b",
              "error-container": "#93000a",
              "surface-container-highest": "#353535",
              "on-surface-variant": "#d8c2b4",
              "primary-container": "#d38743",
              "outline-variant": "#534439",
              "on-secondary-fixed-variant": "#00504c",
              "on-primary-fixed": "#2e1500",
              "surface": "#131313",
              "on-tertiary": "#303221",
              "on-error": "#690005",
              "on-error-container": "#ffdad6",
              "outline": "#a08d80",
              "surface-variant": "#353535",
              "secondary-fixed": "#94f3ec",
              "primary": "#ffb77c",
              "tertiary": "#c8c8b0",
              "surface-container-high": "#2a2a2a",
              "inverse-primary": "#8d4f0c",
              "secondary-container": "#007d78",
              "tertiary-container": "#999a84",
              "on-secondary-fixed": "#00201e",
              "tertiary-fixed": "#e4e4cc",
              "surface-bright": "#393939",
              "inverse-on-surface": "#303030",
              "on-secondary-container": "#c7fffa",
              "on-primary": "#4d2700",
              "on-tertiary-fixed-variant": "#474836"
            },
            fontFamily: {
              "bayon": ["Bayon", "sans-serif"],
              "open-sans": ["Open Sans", "sans-serif"],
            },
            borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
          },
        },
      }` }} />
        <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Open Sans', sans-serif; }
        h1, h2, h3 { font-family: 'Bayon', sans-serif; }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    ` }} />
      </Head>
      <div
        className="bg-background text-on-background antialiased"
        dangerouslySetInnerHTML={{ __html: `<!-- TopAppBar -->
<header class="bg-[#131313] fixed top-0 w-full z-50">
<div class="flex justify-center items-center w-full py-6 px-8 max-w-7xl mx-auto">
<div class="w-full flex justify-start items-center"><img alt="Tour Quality Golf Logo" class="h-12 w-auto" src="https://lh3.googleusercontent.com/aida/ADBb0uh-KMXU18JXT89ngp0Fkui-Kyz0SZk9mLFSK8IC6lvcDBvbltx5UC8MPJHBIfNSOAWMUneDiMKe7DRJ7Xqr6aTTdnRzd7kw3LtXE4ohmvxMoS-XzvDfBRYeH1XyYU3tgiV3Tou-5UgZ1tVv6GFSa2mwH3H5DcpuHBQGxM6aRmdeYWdjhkhA0-C_gWojtF8tgihng6sVjlMnANZ3EKL8dvigGHOrSYJb1RIQEcWQyUdq50qtdGXqpKHgyYdfBNUBX280WVe1zf2Ylw"/></div>
</div>
</header>
<main class="pt-24 min-h-screen">
<!-- Section 1: Hero & Booking -->
<section class="max-w-7xl mx-auto px-8 py-16 flex flex-col items-center">
<!-- Centered Headline -->
<div class="text-center mb-16">
<h1 class="text-6xl md:text-8xl leading-tight uppercase tracking-tight">
                    YOUR FREE SESSION <br/>
<span class="text-primary-container">STARTS HERE</span>
</h1>
</div>
<!-- Expanded Booking Widget: Side-by-side layout -->
<div class="w-full max-w-4xl bg-surface-container-low p-10 rounded-xl border border-outline-variant/10 shadow-2xl">
<!-- Booking Summary Bar -->
<div class="bg-secondary-container/20 rounded-lg p-4 mb-8 flex items-center justify-between border border-secondary/10">
<div class="flex items-center gap-6">
<div class="flex items-center gap-2 text-on-surface">
<span class="material-symbols-outlined text-secondary">calendar_today</span>
<span class="font-semibold">Tuesday, April 21</span>
</div>
<div class="flex items-center gap-2 text-on-surface">
<span class="material-symbols-outlined text-secondary">schedule</span>
<span class="font-semibold">10:30am</span>
</div>
</div>
<button class="text-primary font-bold text-sm underline decoration-primary underline-offset-4 hover:opacity-80 transition-opacity">Change</button>
</div>
<!-- Contact Details Form -->
<div class="max-w-2xl mx-auto">
<h3 class="text-xs font-bold tracking-widest text-secondary mb-6">YOUR DETAILS</h3>
<form class="space-y-6">
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<!-- First Name with Error State -->
<div class="space-y-1.5">
<label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider" for="first_name">First Name</label>
<input class="w-full bg-[#0A0A0A] border-[#FF4444] text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all" id="first_name" placeholder="John" type="text"/>
<p class="text-[10px] text-[#FF4444] font-bold uppercase tracking-wider">This field is required.</p>
</div>
<div class="space-y-1.5">
<label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider" for="last_name">Last Name</label>
<input class="w-full bg-[#0A0A0A] border-outline-variant/30 text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all" id="last_name" placeholder="Doe" type="text"/>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-1.5">
<label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider" for="email">Email Address</label>
<input class="w-full bg-[#0A0A0A] border-outline-variant/30 text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all" id="email" placeholder="john@example.com" type="email"/>
</div>
<div class="space-y-1.5">
<label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider" for="phone">Phone Number</label>
<input class="w-full bg-[#0A0A0A] border-outline-variant/30 text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all" id="phone" placeholder="(555) 000-0000" type="tel"/>
</div>
</div>
<div class="space-y-1.5">
<label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider" for="notes">Anything we should know? <span class="text-[10px] opacity-50 lowercase font-normal italic">(optional)</span></label>
<textarea class="w-full bg-[#0A0A0A] border-outline-variant/30 text-white rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all resize-none" id="notes" placeholder="e.g. Bringing my own clubs, left-handed, etc." rows="3"></textarea>
</div>
<p class="text-xs text-on-surface-variant text-center opacity-60">
                    Your information is never shared or sold. We'll only contact you about your booking.
                </p>
<div class="flex flex-col items-center gap-6 pt-4">
<button class="w-full py-5 px-8 bg-primary-container text-on-primary-container font-black text-lg rounded-full shadow-xl hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-tight" type="submit">
                        Confirm My Free Session
                    </button>
<button class="flex items-center gap-2 text-on-surface-variant text-sm font-semibold hover:text-on-surface transition-colors">
<span class="material-symbols-outlined text-base">arrow_back</span>
                        Change date or time
                    </button>
</div>
</form>
</div>
</div>
</section>
<!-- New Experience Section: Details & Trust -->
<section class="bg-surface-container-lowest py-24 px-8 border-y border-outline-variant/5">
<div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
<div class="space-y-10 order-2 lg:order-1">
<div class="space-y-6">
<h2 class="text-4xl md:text-5xl uppercase tracking-tight text-white">The Tour Quality Experience</h2>
<p class="text-xl text-on-surface-variant leading-relaxed">
                            30 minutes on TrackMan. No cost. No commitment. Show up with your clubs — we handle everything else.
                        </p>
</div>
<!-- Trust Signals -->
<div class="space-y-4">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary" style='font-variation-settings: "FILL" 1;'>check_circle</span>
<span class="font-open-sans font-bold uppercase tracking-wider text-sm">PGA-Certified Coaching</span>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary" style='font-variation-settings: "FILL" 1;'>check_circle</span>
<span class="font-open-sans font-bold uppercase tracking-wider text-sm">TrackMan on Every Swing</span>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary" style='font-variation-settings: "FILL" 1;'>check_circle</span>
<span class="font-open-sans font-bold uppercase tracking-wider text-sm">No Strings Attached</span>
</div>
</div>
</div>
<div class="order-1 lg:order-2">
<img alt="Friendly PGA-certified golf instructor smiling and greeting a customer in a modern, luxury indoor golf simulator facility. High-end TrackMan equipment visible. Professional, welcoming atmosphere. Dark background with orange accents." class="w-full aspect-video lg:aspect-square object-cover rounded-xl shadow-2xl border border-outline-variant/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL2L89YrpG1YTKz1wZixBFXtP945e4VB4btHrRHjas1ghv43WGgehAQmngvyK2os8FekRTUOOsyy7VrNerO3-jT6xQrdtPNMRrnkgRVd2qebfEIjdtraAJVp_JkVcTyExmEalqEWIugEpl5muJHxZQDeXGcnJkV-Az7lgp97ySXI2NyoMnn0ViLHZtUHQ-7g8SNW8dB_jk0NaE8WCjCsu2VKI9gNvMbrlhQe2zciK7BVslIBaaYzaNDdFjApkIlYHfvkjO9CNwaHo"/>
</div>
</div>
</section>
<!-- Section 3: Testimonial Slider -->
<section class="bg-surface-container-lowest py-24">
<div class="max-w-7xl mx-auto px-8 mb-16 text-center md:text-left">
<h2 class="text-4xl md:text-6xl text-white font-bayon uppercase leading-tight">REAL GOLFERS. REAL NUMBERS.</h2>
<h3 class="text-3xl md:text-5xl font-bayon uppercase mt-2 text-[#A89880]">HERE'S WHAT HAPPENS WHEN YOU STOP GUESSING.</h3>
</div>
<div class="max-w-7xl mx-auto px-8 relative group">
<!-- Navigation Arrows -->
<button class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center hover:bg-surface-variant transition-colors shadow-lg">
<span class="material-symbols-outlined text-on-surface">chevron_left</span>
</button>
<button class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center hover:bg-surface-variant transition-colors shadow-lg">
<span class="material-symbols-outlined text-on-surface">chevron_right</span>
</button>
<!-- Slider Container -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
<!-- Card 1 -->
<div class="bg-[#1A1A1A] p-10 rounded-xl flex flex-col justify-between h-[360px] border border-outline-variant/5 text-white">
<div class="space-y-4">
<div class="flex gap-1 text-[#D38743]">
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
</div>
<p class="text-lg italic font-light leading-relaxed">"The level of detail in the fitting process is unlike anything I've experienced. My dispersion tightened up immediately."</p>
</div>
<span class="font-bold uppercase tracking-widest text-xs opacity-60">— MARK S.</span>
</div>
<!-- Card 2 (FEATURED/CENTER) -->
<div class="bg-[#D38743] p-10 rounded-xl flex flex-col justify-between h-[360px] text-on-primary-container shadow-2xl scale-105 z-10">
<div class="space-y-4">
<div class="flex gap-1 text-on-primary-container">
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
</div>
<p class="text-xl italic font-bold leading-relaxed">"Traveled all the way from Ireland just to get my clubs dialed in here. Best facility in the country, period."</p>
</div>
<span class="font-bold uppercase tracking-widest text-xs">— DAVID O., IRELAND</span>
</div>
<!-- Card 3 -->
<div class="bg-[#1A1A1A] p-10 rounded-xl flex flex-col justify-between h-[360px] border border-outline-variant/5 text-white">
<div class="space-y-4">
<div class="flex gap-1 text-[#D38743]">
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>star</span>
</div>
<p class="text-lg italic font-light leading-relaxed">"Started as a 15 handicap, down to an 8 in four months thanks to the TrackMan data and professional guidance."</p>
</div>
<span class="font-bold uppercase tracking-widest text-xs opacity-60">— SARAH T.</span>
</div>
</div>
<!-- Pagination Dots -->
<div class="flex justify-center gap-2 mt-12">
<div class="w-2.5 h-2.5 rounded-full bg-[#D38743]"></div>
<div class="w-2 h-2 rounded-full bg-surface-container-highest"></div>
<div class="w-2 h-2 rounded-full bg-surface-container-highest"></div>
<div class="w-2 h-2 rounded-full bg-surface-container-highest"></div>
<div class="w-2 h-2 rounded-full bg-surface-container-highest"></div>
<div class="w-2 h-2 rounded-full bg-surface-container-highest"></div>
<div class="w-2 h-2 rounded-full bg-surface-container-highest"></div>
<div class="w-2 h-2 rounded-full bg-surface-container-highest"></div>
<div class="w-2 h-2 rounded-full bg-surface-container-highest"></div>
<div class="w-2 h-2 rounded-full bg-surface-container-highest"></div>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-surface-container-lowest py-8 w-full border-t border-outline-variant/5">
<div class="flex justify-center items-center w-full px-4">
<span class="text-[10px] font-normal font-open-sans tracking-widest text-on-surface-variant opacity-60 uppercase">
                © 2024 Tour Quality Golf Tulsa. All Rights Reserved.
            </span>
</div>
</footer>` }}
      />
    </>
  );
}
