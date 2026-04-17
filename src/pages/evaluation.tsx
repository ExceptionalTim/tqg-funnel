import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import TestimonialSlider from '../components/TestimonialSlider';


export default function EvaluationLandingPage() {
  const router = useRouter();
  useEffect(() => {
    // All CTAs route to evaluation funnel only
    const evaluationCtaTexts = ['BOOK YOUR EVALUATION', 'YOUR EVALUATION', '50%', 'FULL LESSON', 'BOOK NOW'];

    document.querySelectorAll('button').forEach(function(btn) {
      const t = (btn.textContent || '').trim().toUpperCase();

      // All CTAs route to evaluation
      if (btn.id === 'nav-book-now') {
        btn.addEventListener('click', function() {
          document.getElementById('the-offer')?.scrollIntoView({ behavior: 'smooth' });
        });
        btn.style.cursor = 'pointer';
        return;
      }

      if (evaluationCtaTexts.some(function(k: string) { return t.includes(k); })) {
        btn.addEventListener('click', function() { router.push('/book/evaluation'); });
        btn.style.cursor = 'pointer';
        return;
      }
    });

    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.glass-nav a[href^="#"]');
    
    if (navLinks.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              link.className = "text-white/80 hover:text-white transition-colors font-['Bayon'] uppercase tracking-tight text-lg border-b-2 border-transparent pb-1";
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('nav-link-active');
              }
            });
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      
      sections.forEach(section => observer.observe(section));
    }

    const faqs = document.querySelectorAll<HTMLDetailsElement>('#faq details');
    faqs.forEach(faq => {
      faq.addEventListener('toggle', () => {
        if (faq.open) {
          faqs.forEach(other => {
            if (other !== faq) other.removeAttribute('open');
          });
        }
      });
    });



    }, [router]);

  return (
    <>
      <Head>
        <title>Performance Evaluation 50% Off — Tour Quality Golf Tulsa</title>
        <meta name="description" content="Get a full 60-minute swing diagnostic with a PGA-certified instructor and TrackMan data. Now just $75 (reg. $150). Book your performance evaluation in Tulsa today." />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
        <script dangerouslySetInnerHTML={{ __html: `tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "surface-bright": "#393939",
                        "surface-dim": "#131313",
                        "on-secondary-container": "#c7fffa",
                        "surface-container-lowest": "#0e0e0e",
                        "tertiary-fixed-dim": "#c8c8b0",
                        "on-primary-container": "#4d2700",
                        "on-error": "#690005",
                        "error-container": "#93000a",
                        "secondary-fixed-dim": "#78d6d0",
                        "on-tertiary-fixed-variant": "#474836",
                        "on-secondary-fixed": "#00201e",
                        "on-tertiary": "#303221",
                        "inverse-primary": "#8d4f0c",
                        "tertiary": "#c8c8b0",
                        "tertiary-container": "#999a84",
                        "primary-fixed-dim": "#ffb77c",
                        "inverse-surface": "#e2e2e2",
                        "primary-fixed": "#ffdcc2",
                        "primary-container": "#d38743",
                        "error": "#ffb4ab",
                        "surface-container": "#1f1f1f",
                        "on-primary-fixed-variant": "#6d3900",
                        "surface-variant": "#353535",
                        "on-background": "#e2e2e2",
                        "on-primary": "#4d2700",
                        "on-tertiary-container": "#303221",
                        "secondary-container": "#007d78",
                        "surface-tint": "#ffb77c",
                        "primary": "#ffb77c",
                        "surface-container-highest": "#353535",
                        "outline-variant": "#534439",
                        "on-surface-variant": "#d8c2b4",
                        "on-secondary-fixed-variant": "#00504c",
                        "surface-container-high": "#2a2a2a",
                        "tertiary-fixed": "#e4e4cc",
                        "on-secondary": "#003735",
                        "secondary-fixed": "#94f3ec",
                        "secondary": "#78d6d0",
                        "surface": "#131313",
                        "on-primary-fixed": "#2e1500",
                        "inverse-on-surface": "#303030",
                        "on-error-container": "#ffdad6",
                        "on-tertiary-fixed": "#1b1d0e",
                        "background": "#131313",
                        "outline": "#a08d80",
                        "on-surface": "#e2e2e2",
                        "surface-container-low": "#1b1b1b"
                    },
                    fontFamily: {
                        "headline": ["Bayon", "sans-serif"],
                        "body": ["Open Sans", "sans-serif"],
                        "label": ["Open Sans", "sans-serif"]
                    },
                    borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
                },
            },
        }` }} />
        <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .glass-nav { background: rgba(19, 19, 19, 0.7); backdrop-filter: blur(12px); }
        .tonal-stacking-alt-zebra > div:nth-child(even) { background-color: #0E0E0E; }
        .no-border { border: none !important; }
        html { scroll-behavior: smooth; }
        body { background-color: #131313; color: #e2e2e2; font-family: 'Open Sans', sans-serif; }
        h1, h2, h3 { font-family: 'Bayon', sans-serif; text-transform: uppercase; letter-spacing: -0.02em; }
        
        .testimonial-slider { scroll-behavior: smooth; -ms-overflow-style: none; scrollbar-width: none; }
        .testimonial-slider::-webkit-scrollbar { display: none; }
    ` }} />
      </Head>
      <div
        className="bg-surface text-on-surface"
        dangerouslySetInnerHTML={{ __html: `<!-- NAVIGATION SHELL -->
<nav class="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 max-w-full glass-nav">
<!-- Logo -->
<div class="flex items-center shrink-0">
<a href="/"><img alt="Tour Quality Golf Logo" class="h-8 md:h-10 w-auto object-contain cursor-pointer" src="https://www.tourqualitygolf.com/wp-content/uploads/2021/09/tour-quality-logo-1.webp"/></a>
</div>
<!-- Desktop Navigation Links (Hidden on md/tablet and below) -->
<div class="hidden lg:flex gap-8 items-center">
<a class="text-white/80 hover:text-white transition-colors font-['Bayon'] uppercase tracking-tight text-lg border-b-2 border-transparent pb-1" href="#how-it-works-section">HOW IT WORKS</a>
<a class="text-white/80 hover:text-white transition-colors font-['Bayon'] uppercase tracking-tight text-lg border-b-2 border-transparent pb-1" href="#why-tqg">WHY TQG</a>
<a class="text-white/80 hover:text-white transition-colors font-['Bayon'] uppercase tracking-tight text-lg border-b-2 border-transparent pb-1" href="#social-proof">Testimonials</a>
<a class="text-white/80 hover:text-white transition-colors font-['Bayon'] uppercase tracking-tight text-lg border-b-2 border-transparent pb-1" href="#the-offer">THE OFFER</a>
<a class="text-white/80 hover:text-white transition-colors font-['Bayon'] uppercase tracking-tight text-lg border-b-2 border-transparent pb-1" href="#the-facility">THE FACILITY</a>
<a class="text-white/80 hover:text-white transition-colors font-['Bayon'] uppercase tracking-tight text-lg border-b-2 border-transparent pb-1" href="#faq">FAQ</a>
</div>
<!-- Right Side Actions -->
<div class="flex items-center gap-4">
<button id="nav-book-now" class="bg-primary-container text-on-primary-container px-4 md:px-6 py-2 rounded-full font-bold hover:scale-95 transition-all duration-150 text-sm md:text-base">Book Now</button>
<!-- Hamburger Menu Icon (Visible on mobile and tablet) -->
<button class="lg:hidden text-white flex items-center justify-center p-1">
<span class="material-symbols-outlined text-3xl">menu</span>
</button>
</div>
</nav>
<!-- SECTION 1: HERO -->
<header class="relative min-h-[70vh] flex items-center py-28 px-6 md:px-12 overflow-hidden bg-surface">
<div class="absolute inset-0 z-0">
<img class="w-full h-full object-cover opacity-40" data-alt="cinematic wide shot of a golfer swinging in a high-tech indoor simulator with glowing Trackman data overlays on a massive screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGFj1hSjab2kigtzb70Hr7D8YDT5GeGclszEjkK8V5nwrKCd5FkWXaLWeYY3ZaN6Xwgg2kRouLVt8KYS2gipyo-xHPs5DJps3Pj3lnaU2J3b115GE1jTbTftxulac9dovetdKMhUPvTr-3xYWKtfUjpRsZjm5xhiJlpR8PMJu_d36POka3hX_KOKT7BeO5dFQ_C4tl5NaqphCR-uUcRg5atTUtiiernX2QW6ykPwoDlCvUvHKz53_jDLUj6yz5--Lrl_UkvVALoPc" style=""/>
<div class="absolute inset-0 bg-gradient-to-r from-surface via-surface/60 to-transparent"></div>
</div>
<div class="max-w-7xl mx-auto w-full grid gap-12 items-center z-10 relative lg:grid-cols-2">
<div class="max-w-2xl md:max-w-full md:text-center lg:text-left lg:max-w-2xl">
<h1 class="text-5xl md:text-6xl leading-none mb-6" style="">
                    GET YOUR GOLF-<br/>GAME <span class="text-primary-container" style="">DIALED IN.</span>
</h1>
<p class="text-lg md:text-xl text-on-surface-variant mb-10 leading-relaxed font-body" style="">
                    If your range game isn't showing up on the course, <br class="hidden md:block"/>you're not missing effort. You're missing information. <br class="hidden md:block"/>We fix that.
                </p>
<div class="flex flex-col gap-4 md:items-center lg:items-start">
<button class="w-full md:w-auto bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-bold text-lg hover:brightness-110 transition-all uppercase" style="">
                        GET A FULL LESSON — 50% OFF
                    </button>
</div>
</div>
<div class="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-white/10">
<iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/UP5UIvKoWwM?si=JgNBebXbiZtif-4f" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>
</div>
</header>
<!-- SECTION: HOW IT WORKS -->
<section class="py-16 px-6 md:px-12 bg-surface" id="how-it-works-section">
<div class="max-w-7xl mx-auto mb-16 text-left">
<h2 class="text-4xl md:text-6xl" style="">GOLF IS HARD ENOUGH WITHOUT <br/><span class="text-on-surface-variant opacity-60" style="">GUESSING WHY YOU MISSED.</span></h2>
<p class="mt-6 text-xl text-on-surface-variant max-w-3xl font-body font-light" style="">Ball flight doesn't lie. Most golfers spend years practicing the same mistakes because nothing in their routine tells them what's actually wrong. We show you what's happening on every swing, explain why, and help you actually fix it.</p>
</div>
<div class="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
<div class="text-left group bg-[#1A1A1A] p-8 rounded-xl transition-all hover:bg-surface-container">
<div class="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-8 transition-transform group-hover:rotate-12">
<span class="material-symbols-outlined text-3xl text-on-secondary-container" style="">query_stats</span>
</div>
<h3 class="text-2xl mb-4" style="">SEE YOUR NUMBERS</h3>
<p class="text-on-surface-variant font-body" style="">Capture every data point from swing path to dynamic loft using industry-leading TrackMan technology.</p>
</div>
<div class="text-left group bg-[#1A1A1A] p-8 rounded-xl transition-all hover:bg-surface-container">
<div class="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-8 transition-transform group-hover:scale-110">
<span class="material-symbols-outlined text-3xl text-on-primary-container" style="">psychology</span>
</div>
<h3 class="text-2xl mb-4" style="">UNDERSTAND THE WHY</h3>
<p class="text-on-surface-variant font-body" style="">Our PGA-certified pros translate complex data into actionable insights tailored to your physical swing DNA.</p>
</div>
<div class="text-left group bg-[#1A1A1A] p-8 rounded-xl transition-all hover:bg-surface-container">
<div class="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mb-8 transition-transform group-hover:-translate-y-2">
<span class="material-symbols-outlined text-3xl text-white" style="">build</span>
</div>
<h3 class="text-2xl mb-4" style="">FIX WHAT MATTERS</h3>
<p class="text-on-surface-variant font-body" style="">Zero in on the 20% of your swing that produces 80% of your results. No fluff, just performance.</p>
</div>
</div>
</section>
<!-- SECTION 2: PRIMARY OFFER -->
<section class="py-20 px-6 md:px-12 bg-surface-container-low" id="the-offer">
<div class="max-w-7xl mx-auto">
<h2 class="text-4xl md:text-5xl text-center mb-10" style="">Your PATH TO BETTER GOLF</h2>
<div class="max-w-2xl mx-auto">
<!-- Evaluation Card -->
<div class="bg-surface p-10 rounded-xl border-2 border-primary-container relative overflow-hidden">
<div class="absolute top-0 right-0 bg-primary-container text-on-primary-container px-4 py-1 text-xs font-bold uppercase tracking-tighter" style="">Best Value</div>
<div class="flex justify-between items-start mb-8">
<div>
<span class="text-primary font-bold uppercase tracking-widest text-sm font-label" style="">DIAGNOSTIC DEEP-DIVE</span>
<h3 class="text-3xl mt-2" style="">PERFORMANCE EVALUATION: <div class="" style=""><div class="cursor-text" data-stitch-added-classes="cursor-text" spellcheck="false">COMPLETE SWING DIAGNOSTIC</div></div></h3>
</div>
<div class="text-right">
<span class="block text-xl line-through text-on-surface-variant/50" style="">$150</span>
<span class="text-5xl text-primary font-headline" style="">$75</span>
</div>
</div>
<ul class="space-y-4 mb-10 text-on-surface-variant font-body">
<li class="flex items-center gap-3" style=""><span class="material-symbols-outlined text-primary" style="">check_circle</span> 60-minute Indoor Bay Access</li>
<li class="flex items-center gap-3" style=""><span class="material-symbols-outlined text-primary" style="">check_circle</span> 1-on-1 lesson with a PGA-Certified Instructor</li>
<li class="flex items-center gap-3" style=""><span class="material-symbols-outlined text-primary" style="">check_circle</span> Full Swing Analysis</li>
</ul>
<button class="w-full py-4 bg-primary-container text-on-primary-container hover:brightness-110 rounded-full transition-all uppercase font-bold tracking-tight" style="">Book Your Evaluation</button>
</div>
</div>
</div>
</section>
` }}
      />
      <TestimonialSlider />
      <div
        className="bg-surface text-on-surface"
        dangerouslySetInnerHTML={{ __html: `<!-- SECTION 6: WHY TQG -->
<section class="py-24 px-6 md:px-12 bg-surface" id="why-tqg">
<div class="max-w-7xl mx-auto mb-16 relative">
<span class="material-symbols-outlined absolute top-0 right-0 text-primary-container text-6xl opacity-30" style="">precision_manufacturing</span>
<h2 class="text-4xl md:text-6xl max-w-2xl" style="">WHY GOLFERS DRIVE HOURS<br/>To Get <span class="" style="color: rgb(211, 135, 67); font-size: 3.75rem; font-weight: inherit; letter-spacing: -0.02em;">HERE.</span></h2>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
<div class="bg-surface-container-low p-8 rounded-xl border-l-4 border-primary-container"><h4 class="text-xl mb-4 font-headline tracking-wide" style="">TRACKMAN ON EVERY SWING</h4><p class="text-on-surface-variant font-body" style="">Distance, spin, launch, dispersion — on every swing. Not what it feels like. What's actually happening.</p></div>
<div class="bg-surface-container-low p-8 rounded-xl border-l-4 border-secondary"><h4 class="text-xl mb-4 font-headline tracking-wide" style="">COACHING THAT CONNECTS THE DOTS</h4><p class="text-on-surface-variant font-body" style="">Data and video — not opinions. One or two things to work on. Not a dozen tips. A plan.</p></div>
<div class="bg-surface-container-low p-8 rounded-xl border-l-4 border-tertiary"><h4 class="text-xl mb-4 font-headline tracking-wide" style="">BRAND-NEUTRAL FITTING</h4><p class="text-on-surface-variant font-body" style="">We test combinations until the data confirms what works. No brand pressure. No inventory to push.</p></div>
<div class="bg-surface-container-low p-8 rounded-xl border-l-4 border-primary-container"><h4 class="text-xl mb-4 font-headline tracking-wide" style="">CERTIFIED REPAIR SHOP</h4><p class="text-on-surface-variant font-body" style="">Loft, lie, swing weight, reshafts, custom builds. Precision work. We don't accept close enough.</p></div>
<div class="bg-surface-container-low p-8 rounded-xl border-l-4 border-secondary"><h4 class="text-xl mb-4 font-headline tracking-wide" style="">EVERYTHING UNDER ONE ROOF</h4><p class="text-on-surface-variant font-body" style="">Coaching, fitting, repair, practice. Each one supports the others. Here, it's one system.</p></div>
<div class="bg-surface-container-low p-8 rounded-xl border-l-4 border-tertiary"><h4 class="text-xl mb-4 font-headline tracking-wide" style="">YEAR-ROUND NO EXCUSES</h4><p class="text-on-surface-variant font-body" style="">Indoor bays. 24/7 member access. Flexible scheduling. Weather doesn't get a vote.</p></div>
</div>
</section>
<!-- SECTION 5: MID-PAGE CTA -->
<section class="py-20 px-6 md:px-12 relative overflow-hidden">
<div class="absolute inset-0 bg-[#1B221B] z-0 opacity-80"></div>
<img class="absolute inset-0 w-full h-full object-cover mix-blend-overlay" data-alt="dramatic low angle shot of a golf ball on a high-end hitting mat with soft green ambient lighting and dark shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUxMyO_EPc3LkDGZ_3WrUC_VukJY8Pl1b3yUOIPXPgtcHzZndtXLKC9vkASZR7Ya2Sh-AZdx3M4vDqWWymVPpMv4mNYsEPAMgoue9MUNCdiDWIVx32n88amDvkAKvU5Az2qDGOTnCib_UnqCaN0APPFRJJwv1VFOS0gRgDTDJjjLGMmjheQeZcE0iGjSBE9v2EgoNtLUAtrHzWvj1zNRP0DrKIXS7hC192mocP_K1vl9ODHuvofaNie4iZY3iV_Z8sKDBLq6fmzm4" style=""/>
<div class="relative z-10 max-w-4xl mx-auto text-center">
<h2 class="text-5xl md:text-7xl mb-10" style=""><div>STILL GUESSING WHAT'S WRONG?</div></h2><p class="text-xl text-on-surface-variant mb-10 max-w-2xl mx-auto font-body" style="">Find out what's holding you back, why it matters, and how to fix it. Takes 60 minutes or less.</p>
<div class="flex flex-col sm:flex-row justify-center gap-6">
<button class="bg-primary-container text-on-primary-container px-10 py-5 rounded-full font-bold text-lg uppercase tracking-tight hover:scale-105 transition-transform" style="">BOOK YOUR EVALUATION</button>
</div>
</div>
</section>
<!-- SECTION 7: THE FACILITY -->
<section class="py-24 px-6 md:px-12 bg-surface-container-lowest" id="the-facility">
<div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
<div class="flex-1">
<h2 class="text-5xl md:text-7xl mb-12" style="">BUILT FOR PERFORMANCE.</h2>
<div class="space-y-8">
<div class="flex items-start gap-6 border-b border-outline-variant/20 pb-8">
<span class="text-3xl font-headline text-primary" style="">01</span>
<div>
<h3 class="text-2xl mb-2" style="">TOUR-GRADE HITTING MATS</h3>
<p class="text-on-surface-variant font-body" style="">Surface technology that mimics turf interaction without the joint fatigue of standard mats.</p>
</div>
</div>
<div class="flex items-start gap-6 border-b border-outline-variant/20 pb-8">
<span class="text-3xl font-headline text-secondary" style="">02</span>
<div>
<h3 class="text-2xl mb-2" style="">ULTRA-HD IMPACT SCREENS</h3>
<p class="text-on-surface-variant font-body" style=""><div>Immersive visuals that put you on world-class courses without leaving Tulsa.</div></p>
</div>
</div>
<div class="flex items-start gap-6">
<span class="text-3xl font-headline text-tertiary" style="">03</span>
<div>
<h3 class="text-2xl mb-2" style="">ON-SITE WORKSHOP</h3>
<p class="text-on-surface-variant font-body" style=""><div>Immediate adjustments and repairs by GolfWorks-certified technicians.</div></p>
</div>
</div>
</div>
</div>
<div class="flex-1 grid grid-cols-2 gap-4 h-[600px]">
<div class="col-span-1 row-span-2">
<img class="w-full h-full object-cover rounded-xl shadow-2xl" data-alt="extreme close up of a premium golf club head hitting a golf ball with dramatic motion blur and sharp focus on the impact" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCl3cheum3D3YDMwdDDPPWZPePZvHsVIeoKYBkbs7GiUK6kcD_BLYly5iHnUvRwCOYZHdwhNOSdM63i_AVqOLoSAdmoe1ApDcbRMieTr2SAtXliMU9lRGG9i-jpCxTvkqXpkj1mKS_uxUilQau2RLf-kCytapVdfDc0KihqMRLOxnkVoyYLjhKmjofgNSq01jgGk3rYgYJdsS63Uh_15FVjDDMGOKzNRqo-3HyO1UA0hjmZNjeru3OazRbkGNs_4D8APVtR6SovwyQ" style=""/>
</div>
<div class="col-span-1">
<img class="w-full h-full object-cover rounded-xl shadow-2xl" data-alt="wide shot of a sleek modern golf simulator bay with dark grey walls and high-end tech equipment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsVSsJ5_kp0x1K5zbjqIVsLCRXDfqD9qgcdsJzj2eN8S2Ow3edxhq8XcYsAXWxXfMdCmBZHZSsOllSWKcOFcPmDrPDyL1q3bvTQqCCCTcYqMjQ7ckcUZYjfK5hl8TaPj36iZev3I6Qng7VibpX9KcDZxWoF0xtxuejwYnVaaeTKtAku0CCpDcXjKHj8Gr7SJFTI5LyOr5GcsgOjWq9M-Oak9cYDJOUy426fzBNehRe8OaXNO1icRgGNneTebn3xonM9oiC7qlO-LQ" style=""/>
</div>
<div class="col-span-1">
<img class="w-full h-full object-cover rounded-xl shadow-2xl" data-alt="Professional golf club workshop interior. Close-up of golf club heads and shafts arranged on a dark wooden workbench. Precision tools visible. Warm focused lighting. Dark background. No people. Clean, technical, high-end." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC06jddNO0c2tyGfSh1xwr4vbef2dxlSdONU3MN2XIR6cNho2W8VbavRfoKnsmfFs1Ow6pjsCQt5F4st2BJFO5LUZ1zQDU8I1dr_bvEIUaiWUBL2z7Wlv3-1hEy2rkX1k3RtqZegCsmUPzV8R__jp3N1fijd9CSjFPW-V7srfhmfA_nT21l_mpTzOY7NsqyFTRZJzUrJMWfcmar8hF4_0f3TmkfjX9E1Qq58dhfgT7k15ccmHdz2zYaF65xDVNIiBlZGykOx4885sQ" style=""/>
</div>
</div>
</div>
</section>
<!-- SECTION 8: FINAL CTA -->
<section class="py-32 px-6 md:px-12 bg-[#3A3D2E] text-on-primary-container text-center">
<h2 class="text-5xl md:text-8xl mb-12 leading-tight max-w-5xl mx-auto text-white" style="">READY TO Work on WHAT'S <br/>ACTUALLY holding you back?</h2>
<div class="flex flex-col sm:flex-row justify-center gap-6">
<button class="bg-surface text-white px-12 py-6 rounded-full font-bold text-xl uppercase tracking-tighter hover:scale-105 transition-transform shadow-xl" style="">BOOK YOUR EVALUATION</button>
</div>
</section>
<!-- SECTION 9: FAQ + FOOTER -->
<section class="py-24 px-6 md:px-12 bg-surface" id="faq">
<div class="max-w-4xl mx-auto mb-24">
<h2 class="text-4xl mb-12 text-center" style="">FREQUENTLY ASKED QUESTIONS</h2>
<div class="space-y-4">
<details class="bg-surface-container-low rounded-lg p-6 group cursor-pointer" open="" style="">
<summary class="flex justify-between items-center font-bold text-xl list-none uppercase font-headline" style="">
                        What should I bring to my first session?
                        <span class="material-symbols-outlined transition-transform group-open:rotate-180 text-primary-container" style="">expand_more</span>
</summary>
<p class="mt-4 text-on-surface-variant font-body leading-relaxed" style="">Just your clubs and your usual golf attire. We handle everything else — TrackMan, balls, and the coaching. If you're coming in for a fitting, bring the clubs you currently play so we have a baseline to compare against.</p>
</details>
<details class="bg-surface-container-low rounded-lg p-6 group cursor-pointer" style="">
<summary class="flex justify-between items-center font-bold text-xl list-none uppercase font-headline" style="">
                        Do I need to be a good golfer to benefit?
                        <span class="material-symbols-outlined transition-transform group-open:rotate-180" style="">expand_more</span>
</summary>
<p class="mt-4 text-on-surface-variant font-body leading-relaxed" style="">No. In fact, the earlier you work with real data, the faster you improve. We work with beginners, mid-handicappers, and competitive players. The common thread isn't skill level — it's wanting to actually understand what's happening instead of guessing.</p>
</details>
<details class="bg-surface-container-low rounded-lg p-6 group cursor-pointer" style="">
<summary class="flex justify-between items-center font-bold text-xl list-none uppercase font-headline" style="">
                        How long does a club fitting take?
                        <span class="material-symbols-outlined transition-transform group-open:rotate-180" style="">expand_more</span>
</summary>
<p class="mt-4 text-on-surface-variant font-body leading-relaxed" style="">It depends on the fitting. A driver fitting runs about 90 minutes. A full bag fitting is 3 hours. We don't rush the process — we test combinations until the data confirms what works for your swing, not what's convenient for us to sell.</p>
</details>
<details class="bg-surface-container-low rounded-lg p-6 group cursor-pointer" style="">
<summary class="flex justify-between items-center font-bold text-xl list-none uppercase font-headline" style="">
                        Why isn't the fitting fee credited toward a club purchase?
                        <span class="material-symbols-outlined transition-transform group-open:rotate-180" style="">expand_more</span>
</summary>
<p class="mt-4 text-on-surface-variant font-body leading-relaxed" style="">Because we want to stay brand-neutral. If your fitting fee covered the cost of a purchase, we'd have a reason to steer you toward brands we carry. We don't want that pressure in the room. Our job is to tell you what actually works — even if that means you buy somewhere else.</p>
</details>
<details class="bg-surface-container-low rounded-lg p-6 group cursor-pointer" style="">
<summary class="flex justify-between items-center font-bold text-xl list-none uppercase font-headline" style="">
                        What's the difference between a lesson and the Performance Evaluation?
                        <span class="material-symbols-outlined transition-transform group-open:rotate-180" style="">expand_more</span>
</summary>
<p class="mt-4 text-on-surface-variant font-body leading-relaxed" style="">A single lesson focuses on a specific area of your swing. The Performance Evaluation is a diagnostic first — we identify the root cause of your misses before we start working on anything. Think of it as the difference between getting a prescription and just buying something off the shelf. Most golfers benefit from starting with the evaluation so we're working on the right thing from day one.</p>
</details>
<details class="bg-surface-container-low rounded-lg p-6 group cursor-pointer" style="">
<summary class="flex justify-between items-center font-bold text-xl list-none uppercase font-headline" style="">
                        What is TrackMan, and why does it matter?
                        <span class="material-symbols-outlined transition-transform group-open:rotate-180" style="">expand_more</span>
</summary>
<p class="mt-4 text-on-surface-variant font-body leading-relaxed" style="">TrackMan is a radar-based launch monitor used on the PGA Tour. It tracks 26+ data points on every shot — club path, face angle, launch angle, spin rate, ball speed, carry distance, and more. What matters isn't the technology itself — it's that you stop relying on feel alone. The ball doesn't lie. TrackMan shows you exactly what's happening so we can fix the actual problem, not the symptom.</p>
</details>
<details class="bg-surface-container-low rounded-lg p-6 group cursor-pointer" style="">
<summary class="flex justify-between items-center font-bold text-xl list-none uppercase font-headline" style="">
                        Can I practice on my own without a lesson or fitting?
                        <span class="material-symbols-outlined transition-transform group-open:rotate-180" style="">expand_more</span>
</summary>
<p class="mt-4 text-on-surface-variant font-body leading-relaxed" style="">Yes. Bay rentals are open to the public at $50/hour for up to 4 players ($40/hour during twilight hours, Monday–Friday 5–7 PM). Members get 24/7 access with no hourly rates. If you're going to practice on your own, we recommend at least understanding your baseline numbers first so your practice time has a direction.</p>
</details>
<details class="bg-surface-container-low rounded-lg p-6 group cursor-pointer" style="">
<summary class="flex justify-between items-center font-bold text-xl list-none uppercase font-headline" style="">
                        What is the Sheridan Club membership?
                        <span class="material-symbols-outlined transition-transform group-open:rotate-180" style="">expand_more</span>
</summary>
<p class="mt-4 text-on-surface-variant font-body leading-relaxed" style="">It's built for golfers who want to improve consistently, not just show up occasionally. The Diamond membership ($249.99/month) includes unlimited 24/7 TrackMan bay access, one private lesson per month, an onboarding session, and discounts across services. There's also a Junior, Family, and Corporate tier. It's a 12-month commitment — because real improvement requires consistency, not one-off sessions.</p>
</details></div>
</div>
<footer class="bg-[#0E0E0E] w-full pt-20 pb-10">
<div class="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 max-w-7xl mx-auto">
<div>
<span class="font-['Bayon'] text-3xl text-white mb-6 block" style="">Tour Quality Golf</span>
<p class="text-gray-400 font-['Open_Sans'] text-sm leading-relaxed mb-8" style="">Precision performance for the modern golfer. Based in Tulsa, OK.</p>
<div class="flex gap-4">
<a class="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center hover:text-[#78D6D0] transition-colors" href="#" style=""><span class="material-symbols-outlined" style="">public</span></a>
<a class="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center hover:text-[#78D6D0] transition-colors" href="#" style=""><span class="material-symbols-outlined" style="">mail</span></a>
<a class="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center hover:text-[#78D6D0] transition-colors" href="#" style=""><span class="material-symbols-outlined" style="">call</span></a></div>
</div>
<div>
<h5 class="font-['Bayon'] text-xl text-[#FFB77C] mb-6" style="">SERVICES</h5>
<ul class="space-y-4 font-['Open_Sans'] text-sm">
<li class="" style=""><a class="text-gray-400 hover:text-[#78D6D0] transition-colors" href="#why-tqg" style="">Full Bag Fitting</a></li>
<li class="" style=""><a class="text-gray-400 hover:text-[#78D6D0] transition-colors" href="#why-tqg" style="">PGA Instruction</a></li>
<li class="" style=""><a class="text-gray-400 hover:text-[#78D6D0] transition-colors" href="#why-tqg" style="">TrackMan Rental</a></li>
<li class="" style=""><a class="text-gray-400 hover:text-[#78D6D0] transition-colors" href="#why-tqg" style="">Club Repair</a></li></ul>
</div>
<div>
<h5 class="font-['Bayon'] text-xl text-[#FFB77C] mb-6" style="">COMPANY</h5>
<ul class="space-y-4 font-['Open_Sans'] text-sm">
<li class="" style=""><a class="text-gray-400 hover:text-[#78D6D0] transition-colors" href="#the-facility" style="">The Facility</a></li>
<li class="" style=""><a class="text-gray-400 hover:text-[#78D6D0] transition-colors" href="#why-tqg" style="">Why TQG</a></li>
<li class="" style=""><a class="text-gray-400 hover:text-[#78D6D0] transition-colors" href="#faq" style="">FAQ</a></li>
<li class="" style=""><a class="text-gray-400 hover:text-[#78D6D0] transition-colors" href="#" style="">Privacy Policy</a></li></ul>
</div>
<div>
<h5 class="font-['Bayon'] text-xl text-[#FFB77C] mb-6" style="">CONTACT US</h5>
<ul class="space-y-4 font-['Open_Sans'] text-sm text-gray-400">
<li class="flex items-center gap-2" style=""><span class="material-symbols-outlined text-xs" style="">location_on</span> 61st &amp; Sheridan, Tulsa, OK 74133</li>
<li class="flex items-center gap-2" style=""><span class="material-symbols-outlined text-xs" style="">call</span> (918) 221-7096</li><li class="mt-6 rounded-lg overflow-hidden border border-outline-variant/20 shadow-lg" style="">
<iframe allowfullscreen="" height="150" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3225.432644265083!2d-95.90562472343883!3d36.05835620959828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87b68d609c916781%3A0xc3f925b6826379a0!2sE%2061st%20St%20%26%20S%20Sheridan%20Rd%2C%20Tulsa%2C%20OK%2074133!5e0!3m2!1sen!2sus!4v1715854432123!5m2!1sen!2sus" style="border:0; filter: invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%);" width="100%">
</iframe>
</li></ul>
</div>
</div>
<div class="mt-20 pt-8 border-t border-outline-variant/10 px-12 text-center">
<div class="flex flex-col md:flex-row justify-between items-center gap-4">
<p class="text-gray-500 font-['Open_Sans'] text-xs tracking-widest uppercase" style="">© 2024 Tour Quality Golf Tulsa. All Rights Reserved.</p>
<p class="text-gray-500 font-['Open_Sans'] text-xs tracking-widest uppercase" style="">TERMS | PRIVACY | ACCESSIBILITY</p>
</div></div>
</footer>
</section>` }}
      />
    </>
  );
}
