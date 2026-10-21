import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import headphonesImage from "../../assets/teal-wireless-headphones.png";
import shoesImage from "../../assets/hero-shoes.png";
// import heroImage from "../../assets/hero.png";
import shirtImage from "../../assets/hero-shirt.png";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const AUTOPLAY_MS = 5500;
const SWIPE_THRESHOLD = 50;

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const icons = {
  headset: (
    <>
      <path d="M3 13v-2a9 9 0 0 1 18 0v2" />
      <path d="M5 12h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Zm14 0h-1a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Z" />
    </>
  ),
  battery: (
    <>
      <rect x="6" y="5" width="12" height="17" rx="2" />
      <path d="M10 2h4M10 9h4M9 13h6M9 17h6" />
    </>
  ),
  feather: (
    <>
      <path d="M20.5 3.5C13 4 6 7.5 4 14c-1 3.2.8 5.5 3.4 5.5 6.8 0 11.6-7.4 13.1-16Z" />
      <path d="M3 22c3.5-5.5 7.5-9 13-12" />
    </>
  ),
  heart: <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" />,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  wave: <path d="M2 12h3l2-6 4 12 3-9 2 3h6" />,
  truck: (
    <>
      <path d="M3 7h11v12H3zM14 11h4l3 3v5h-7z" />
      <circle cx="7.5" cy="19" r="2" />
      <circle cx="17.5" cy="19" r="2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

const Icon = ({ name, className = "h-7 w-7", strokeWidth = 1.6 }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {icons[name]}
  </svg>
);

/* ------------------------------------------------------------------ */
/* Slides                                                              */
/* Add / edit slides here. For slides 2 and 3 you can replace the      */
/* illustration with your own image: set `image` and remove `art`.     */
/* ------------------------------------------------------------------ */

const heroSlides = [
  {
    pill: "Best Deals Online",
    eyebrow: "Upgrade Your Lifestyle",
    titleTop: "Premium Products",
    titleBottom: "Better Prices",
    body: ["Discover top-quality products, curated just for you.", "Shop smart, live better — only at ShopWave."],
    badge: { value: "50%" },
    image: headphonesImage,
    alt: "Teal premium over-ear wireless headphones",
    artWidth: "w-[98%] max-w-[36rem]",
    features: [
      { title: "Crystal Clear Sound", description: "Feel every beat", icon: "headset" },
      { title: "Long Battery Life", description: "Up to 40 hours", icon: "battery" },
      { title: "Lightweight & Comfortable", description: "All day wear", icon: "feather" },
    ],
  },
  {
    pill: "New Arrival",
    eyebrow: "Made for Every Day",
    titleTop: "Comfortable Shoes",
    titleBottom: "Better Moves",
    body: ["Find your next favorite pair for every occasion.", "Step out in comfort and style."],
    badge: { value: "40%" },
    image: shoesImage,
    alt: "Teal and black athletic shoes",
    artWidth: "w-[85%] max-w-[36rem]",
    features: [
      { title: "Everyday Comfort", description: "Made for all day wear", icon: "heart" },
      { title: "Lightweight Design", description: "Easy on every step", icon: "feather" },
      { title: "Ready to Go", description: "Style for every day", icon: "bolt" },
    ],
  },
  {
    pill: "Top Rated",
    eyebrow: "Shop Smarter",
    titleTop: "Everything You Need",
    titleBottom: "All in One Place",
    body: ["Explore great finds for your everyday life.", "Shop smarter and live better."],
    badge: { value: "35%" },
    image: shirtImage,
    alt: "Teal E-Shop shopping graphic",
    artWidth: "w-[90%] max-w-[30rem]",
    features: [
      { title: "Great Finds", description: "Products for every day", icon: "heart" },
      { title: "Easy Shopping", description: "A smooth experience", icon: "bolt" },
      { title: "Secure Checkout", description: "Shop with confidence", icon: "shield" },
    ],
  },
];

const serviceBenefits = [
  { title: "Free Shipping", description: "On orders over $50", icon: "truck" },
  { title: "Secure Payment", description: "100% secure checkout", icon: "shield" },
  { title: "24/7 Support", description: "We’re here to help", icon: "headset" },
];

/* ------------------------------------------------------------------ */
/* Illustrations (used until you add real product images)              */
/* ------------------------------------------------------------------ */

const SmartWatchArt = () => (
  <svg viewBox="0 0 300 340" fill="none" role="img" aria-label="Smart watch" className="w-full">
    <defs>
      <linearGradient id="sw-strap" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#24B1B1" />
        <stop offset="1" stopColor="#006666" />
      </linearGradient>
      <linearGradient id="sw-case" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3fd0d0" />
        <stop offset=".5" stopColor="#0a8f8f" />
        <stop offset="1" stopColor="#005a5a" />
      </linearGradient>
    </defs>
    <rect x="95" y="0" width="110" height="110" rx="26" fill="url(#sw-strap)" />
    <rect x="95" y="230" width="110" height="110" rx="26" fill="url(#sw-strap)" />
    {[262, 284, 306].map((y) => (
      <circle key={y} cx="150" cy={y} r="4" fill="#004a4a" opacity=".6" />
    ))}
    <rect x="240" y="136" width="12" height="38" rx="5" fill="#24B1B1" />
    <rect x="56" y="64" width="188" height="212" rx="52" fill="url(#sw-case)" />
    <rect x="68" y="76" width="164" height="188" rx="42" fill="#06292b" />
    <text x="150" y="150" textAnchor="middle" fontSize="44" fontWeight="800" fill="#fff" fontFamily="system-ui, sans-serif">
      10:09
    </text>
    <text x="150" y="176" textAnchor="middle" fontSize="13" fontWeight="600" fill="#24B1B1" fontFamily="system-ui, sans-serif">
      Tue 20
    </text>
    {[
      { cx: 105, color: "#24B1B1", dash: "50 78" },
      { cx: 150, color: "#ff8a1f", dash: "38 78" },
      { cx: 195, color: "#7ee0e0", dash: "62 78" },
    ].map((ring) => (
      <g key={ring.cx} transform={`translate(${ring.cx} 224)`}>
        <circle r="14" stroke="#17474a" strokeWidth="5" />
        <circle r="14" stroke={ring.color} strokeWidth="5" strokeLinecap="round" strokeDasharray={ring.dash} transform="rotate(-90)" />
      </g>
    ))}
  </svg>
);

const SpeakerArt = () => (
  <svg viewBox="0 0 320 320" fill="none" role="img" aria-label="Bluetooth speaker" className="w-full">
    <defs>
      <linearGradient id="sp-body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3fd0d0" />
        <stop offset=".5" stopColor="#0a8f8f" />
        <stop offset="1" stopColor="#005a5a" />
      </linearGradient>
      <pattern id="sp-grille" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="2" fill="#03393b" opacity=".75" />
      </pattern>
    </defs>
    <path d="M30 120c-14 20-14 60 0 80M12 100c-24 32-24 88 0 120" stroke="#24B1B1" strokeWidth="5" strokeLinecap="round" opacity=".45" />
    <path d="M290 120c14 20 14 60 0 80M308 100c24 32 24 88 0 120" stroke="#24B1B1" strokeWidth="5" strokeLinecap="round" opacity=".45" />
    <rect x="62" y="30" width="196" height="262" rx="70" fill="url(#sp-body)" />
    <rect x="80" y="86" width="160" height="188" rx="52" fill="#0a8f8f" />
    <rect x="80" y="86" width="160" height="188" rx="52" fill="url(#sp-grille)" />
    <rect x="80" y="86" width="160" height="188" rx="52" stroke="#24B1B1" strokeOpacity=".7" strokeWidth="3" />
    {[126, 160, 194].map((cx) => (
      <circle key={cx} cx={cx} cy="58" r="9" fill="#06292b" stroke="#7ee0e0" strokeWidth="2" />
    ))}
    <rect x="112" y="274" width="96" height="6" rx="3" fill="#004a4a" opacity=".5" />
  </svg>
);

const SlideArt = ({ slide }) => {
  if (slide.art === "watch") return <SmartWatchArt />;
  if (slide.art === "speaker") return <SpeakerArt />;
  return (
    <img
      src={slide.image}
      alt={slide.alt}
      width={1536}
      height={1024}
      decoding="async"
      className="w-full object-contain"
    />
  );
};

/* Scalloped "seal" outline for the OFF badge */
const buildSealPath = (cx = 50, cy = 50, radius = 44, bumps = 12, amplitude = 3.2) => {
  const steps = 240;
  let d = "";
  for (let i = 0; i <= steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2;
    const r = radius + amplitude * Math.cos(bumps * angle);
    d += `${i === 0 ? "M" : "L"}${(cx + r * Math.cos(angle)).toFixed(2)} ${(cy + r * Math.sin(angle)).toFixed(2)} `;
  }
  return `${d}Z`;
};
const sealPath = buildSealPath();

/* Animations used by the slider (kept here so index.css needs no change) */
const heroStyles = `
@keyframes heroSlideIn { from { opacity: 0; transform: translate3d(var(--hero-shift, 40px), 0, 0); } to { opacity: 1; transform: none; } }
@keyframes heroPop { from { opacity: 0; transform: translate3d(var(--hero-shift, 40px), 0, 0) scale(.92); } to { opacity: 1; transform: none; } }
@keyframes heroFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes heroFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.hero-in { animation: heroSlideIn 650ms cubic-bezier(.22, 1, .36, 1) both; animation-delay: var(--hero-delay, 0ms); }
.hero-pop { animation: heroPop 800ms cubic-bezier(.22, 1, .36, 1) both; animation-delay: var(--hero-delay, 0ms); }
.hero-float { animation: heroFloat 6s ease-in-out infinite; }
.hero-fill { transform-origin: left; animation: heroFill linear both; }
`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const HeroSection = ({ onWatchVideo }) => {
  const total = heroSlides.length;
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [cycle, setCycle] = useState(0); // restarts timer + progress bar
  const touchStartX = useRef(null);

  const slide = heroSlides[active];
  const isPaused = hoverPaused || manualPaused;
  const autoplayOn = total > 1 && !reduceMotion;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);
    const onChange = (event) => setReduceMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setActive((i) => (i + 1) % total);
    setCycle((c) => c + 1);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActive((i) => (i - 1 + total) % total);
    setCycle((c) => c + 1);
  }, [total]);

  const goTo = (index) => {
    if (index === active) return;
    setDirection(index > active ? 1 : -1);
    setActive(index);
    setCycle((c) => c + 1);
  };

  // Autoplay timer
  useEffect(() => {
    if (!autoplayOn || isPaused) return undefined;
    const id = setTimeout(goNext, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, cycle, autoplayOn, isPaused, goNext]);

  // When autoplay resumes, restart the progress bar so it matches the timer
  useEffect(() => {
    if (!isPaused) setCycle((c) => c + 1);
  }, [isPaused]);

  // Pause when the tab is hidden
  useEffect(() => {
    const onVisibility = () => setHoverPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };
  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") goNext();
    if (event.key === "ArrowLeft") goPrev();
  };

  const shift = { "--hero-shift": `${direction * 40}px` };
  const delay = (ms) => ({ ...shift, "--hero-delay": `${ms}ms` });

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured offers"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={() => setHoverPaused(false)}
      onKeyDown={onKeyDown}
      className="hero-section relative isolate overflow-hidden bg-gradient-to-br from-white via-white to-secondary/10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900"
    >
      <style>{heroStyles}</style>

      {/* Soft glow behind the product */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_62%_46%,rgba(36,177,177,0.16),transparent_46%)]" />

      {/* Large teal blade, top right */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        className="pointer-events-none absolute right-[15%] top-0 z-0 hidden h-[42%] w-[28%] lg:block"
      >
        <defs>
          <linearGradient id="hero-blade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#007979" />
            <stop offset="1" stopColor="#24B1B1" />
          </linearGradient>
        </defs>
        <path d="M90 0H400C396 60 360 110 290 150C220 190 130 195 20 235C65 172 105 82 90 0Z" fill="url(#hero-blade)" />
      </svg>

      {/* Bottom-right waves + tagline */}
      <svg
        aria-hidden="true"
        viewBox="0 0 650 300"
        preserveAspectRatio="none"
        className="pointer-events-none absolute bottom-0 right-0 z-0 hidden h-[40%] w-[42%] lg:block"
      >
        <path d="M0 300C120 140 260 110 380 150S560 130 650 40V300Z" fill="#24B1B1" fillOpacity=".35" />
        <path d="M180 300C300 190 420 210 520 160C580 130 620 90 650 60V300Z" fill="#007979" />
      </svg>
      <p
        className="pointer-events-none absolute bottom-[9%] right-[4%] z-10 hidden -rotate-[11deg] text-[1.5rem] italic leading-7 text-white lg:block xl:text-[1.8rem] xl:leading-8"
        style={{ fontFamily: '"Segoe Script", "Brush Script MT", "Snell Roundhand", cursive' }}
      >
        Better Tech
        <span className="block pl-3">
          Brighter You
          <svg aria-hidden="true" viewBox="0 0 160 12" fill="none" className="mt-0.5 h-2 w-32" preserveAspectRatio="none">
            <path d="M2 9C40 3 100 3 158 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </p>

      <div className="relative z-10 mx-auto grid max-w-[88rem] items-center gap-4 px-4 pb-2 pt-8 sm:px-6 sm:pt-10 lg:min-h-[500px] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-4 lg:px-8 lg:pt-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)_11rem]">
        {/* ---------------------------- Left: copy ---------------------------- */}
        <div className="relative z-10 mx-auto w-full max-w-xl text-center sm:mx-0 sm:text-left">
          <div key={`copy-${active}`} aria-live={isPaused ? "polite" : "off"}>
            <span
              className="hero-in inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1.5 text-xs font-bold text-slate-800 dark:border-secondary/30 dark:text-slate-100 sm:text-sm"
              style={delay(0)}
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0b3b3b]">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                  <path d="M12 2c.6 3.3-2.6 4.8-3.6 8-.6 2 .2 3.6 1.2 4.4C9.2 12.6 11 11 12.4 9.6c.4 2.4 3.1 3.8 3.1 6.4a3.5 3.5 0 0 1-7 0" fill="#ff8a1f" />
                  <path d="M12 22a5 5 0 0 1-5-5c0-2.4 2-3.6 3.2-5.4.4 1.2 1.4 1.8 2.2 1.6C14 15 17 14.4 17 17a5 5 0 0 1-5 5Z" fill="#ff5a1f" />
                </svg>
              </span>
              {slide.pill}
            </span>

            <p className="hero-in mt-4 text-xl font-light tracking-wide text-slate-700 dark:text-slate-300 sm:text-2xl" style={delay(70)}>
              {slide.eyebrow}
            </p>

            <h1 className="hero-in mt-1 text-[2.1rem] font-extrabold leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[2.9rem] xl:text-[3.4rem]" style={delay(130)}>
              {slide.titleTop}
              <span className="mt-1 block text-secondary">{slide.titleBottom}</span>
            </h1>

            <p className="hero-in mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-700 dark:text-slate-300 sm:mx-0 sm:text-base sm:leading-7" style={delay(190)}>
              {slide.body[0]}
              <br className="hidden sm:block" /> {slide.body[1]}
            </p>

            <div className="hero-in mt-6 flex flex-wrap items-center justify-center gap-4 sm:justify-start sm:gap-5" style={delay(250)}>
              <Link
                to="/products"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#007979] to-[#0a9a9a] px-8 py-3 text-base font-bold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:min-h-14 sm:px-9"
              >
                Shop Now
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </Link>

              <button
                type="button"
                onClick={onWatchVideo}
                className="group inline-flex items-center gap-3 rounded-full text-base font-bold text-[#007979] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary dark:text-secondary"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-secondary/30 bg-secondary/10 transition group-hover:border-secondary group-hover:bg-secondary/20 sm:h-14 sm:w-14">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
                    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                  </svg>
                </span>
                Watch Video
              </button>
            </div>
          </div>

          {/* Service benefits (static) */}
          <div className="mt-7 grid grid-cols-3 gap-2 sm:mt-8 sm:max-w-xl sm:gap-0">
            {serviceBenefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-3 sm:px-4 sm:text-left ${
                  index === 0 ? "sm:pl-0" : "sm:border-l sm:border-slate-200 dark:sm:border-slate-700"
                }`}
              >
                <Icon name={benefit.icon} className="h-7 w-7 shrink-0 text-[#0b3b3b] dark:text-secondary sm:h-8 sm:w-8" />
                <div>
                  <p className="text-[11px] font-bold leading-4 text-slate-800 dark:text-slate-100 sm:text-xs">{benefit.title}</p>
                  <p className="mt-0.5 hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --------------------------- Middle: product ------------------------- */}
        <div
          className="hero-visual relative mx-auto flex min-h-[330px] w-full max-w-2xl touch-pan-y items-center justify-center sm:min-h-[400px] lg:min-h-[480px]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Circles */}
          <div className="absolute left-1/2 top-[46%] h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 sm:h-[22rem] sm:w-[22rem]" />
          <div className="absolute left-1/2 top-[46%] h-[19rem] w-[19rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/10 sm:h-[27rem] sm:w-[27rem]" />

          {/* Pedestal */}
          <div className="absolute bottom-[4%] left-1/2 z-10 h-[4.5rem] w-[74%] -translate-x-1/2 sm:h-24">
            <div className="absolute inset-x-0 bottom-0 h-[78%] rounded-[0_0_50%_50%/0_0_100%_100%] bg-gradient-to-b from-[#0a9a9a] to-[#007979] shadow-[0_22px_34px_rgba(0,121,121,0.25)]" />
            <div className="absolute inset-x-0 top-0 h-[58%] rounded-[50%] bg-gradient-to-b from-white to-slate-100 shadow-[0_4px_10px_rgba(0,121,121,0.12)]" />
          </div>

          {/* Leaves (left) */}
          <svg aria-hidden="true" viewBox="0 0 160 220" fill="none" className="absolute bottom-[17%] left-[1%] z-20 w-[18%] max-w-[7rem] sm:left-[3%]">
            <path d="M92 214C86 160 70 110 36 44" stroke="#2a5a4a" strokeWidth="3" strokeLinecap="round" />
            <path d="M36 44c-14 18-16 40-4 56 14-8 24-32 4-56Z" fill="#2f6b57" />
            <path d="M60 86c-26 6-40 26-38 46 22 0 42-18 38-46Z" fill="#1f4d40" />
            <path d="M72 128c-28-4-52 10-58 30 22 8 52-2 58-30Z" fill="#2f6b57" />
            <path d="M52 66c18-8 26-28 22-46-18 6-30 26-22 46Z" fill="#1f4d40" />
            <path d="M84 168c24-14 44-12 62 0-14 20-48 22-62 0Z" fill="#24594a" />
            <path d="M80 100c20-10 34-4 44 10-16 14-34 12-44-10Z" fill="#2f6b57" />
          </svg>

          {/* Small floating leaf (right) */}
          <svg aria-hidden="true" viewBox="0 0 60 60" className="absolute bottom-[22%] right-[5%] z-20 hidden w-[8%] sm:block">
            <path d="M6 54C4 24 24 4 54 6c2 30-18 50-48 48Z" fill="#24B1B1" />
          </svg>

          {/* Product (animates on every slide change) */}
          <div key={`art-${active}`} className={`absolute bottom-[14%] left-1/2 z-20 -translate-x-1/2 sm:bottom-[15%] lg:bottom-[16%] ${slide.artWidth}`}>
            <div className="hero-pop" style={delay(60)}>
              <div className="hero-float drop-shadow-[0_24px_24px_rgba(0,70,70,0.28)]">
                <SlideArt slide={slide} />
              </div>
            </div>
          </div>

          {/* OFF seal */}
          <div key={`seal-${active}`} className="absolute left-[2%] top-[6%] z-30 h-[5.5rem] w-[5.5rem] sm:left-[6%] sm:top-[8%] sm:h-28 sm:w-28 lg:h-[7.5rem] lg:w-[7.5rem]">
            <div className="hero-pop h-full w-full" style={delay(200)}>
              <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full drop-shadow-[0_10px_16px_rgba(0,121,121,0.3)]">
                <defs>
                  <linearGradient id="hero-seal" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#0a9a9a" />
                    <stop offset="1" stopColor="#007979" />
                  </linearGradient>
                </defs>
                <path d={sealPath} fill="url(#hero-seal)" />
              </svg>
              <span className="relative grid h-full w-full place-items-center text-center text-white">
                <span className="text-[10px] font-semibold uppercase leading-tight tracking-wide sm:text-xs">
                  Up to
                  <strong className="block text-[1.6rem] font-extrabold leading-7 sm:text-3xl sm:leading-8">{slide.badge.value}</strong>
                  Off
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ----------------------- Right: feature list ------------------------- */}
        <div key={`features-${active}`} className="relative z-20 hidden w-44 flex-col xl:flex">
          {slide.features.map((feature, index) => (
            <div
              key={feature.title}
              className={`hero-in flex items-start gap-3 py-4 ${index > 0 ? "border-t border-slate-200 dark:border-slate-700" : ""}`}
              style={delay(150 + index * 90)}
            >
              <Icon name={feature.icon} className="mt-0.5 h-8 w-8 shrink-0 text-[#0b3b3b] dark:text-secondary" />
              <div>
                <p className="text-[13px] font-bold leading-[1.15rem] text-slate-800 dark:text-slate-100">{feature.title}</p>
                <p className="mt-1.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------- Slider controls ------------------------- */}
      <div className="relative z-20 mx-auto flex max-w-[88rem] items-center justify-center gap-5 px-4 pb-5 pt-1 sm:px-6 lg:justify-start lg:px-8 lg:pb-5">
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide" onKeyDown={onKeyDown}>
          {heroSlides.map((item, index) => {
            const isActive = index === active;
            return (
              <button
                key={item.titleTop}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Slide ${index + 1} of ${total}: ${item.titleTop}`}
                onClick={() => goTo(index)}
                className={`relative h-2 overflow-hidden rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                  isActive ? "w-10 bg-[#007979]/25" : "w-2 bg-slate-300 hover:bg-secondary/60"
                }`}
              >
                {isActive && (
                  <span
                    key={`${active}-${cycle}`}
                    className={`absolute inset-0 rounded-full bg-[#007979] ${autoplayOn ? "hero-fill" : ""}`}
                    style={
                      autoplayOn
                        ? { animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: isPaused ? "paused" : "running" }
                        : undefined
                    }
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          {[
            { label: "Previous slide", onClick: goPrev, d: "m15 6-6 6 6 6" },
            { label: "Next slide", onClick: goNext, d: "m9 6 6 6-6 6" },
          ].map((control) => (
            <button
              key={control.label}
              type="button"
              aria-label={control.label}
              onClick={control.onClick}
              className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-800 transition hover:bg-secondary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:h-11 sm:w-11"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d={control.d} />
              </svg>
            </button>
          ))}
          {autoplayOn && (
            <button
              type="button"
              aria-label={manualPaused ? "Play slideshow" : "Pause slideshow"}
              onClick={() => setManualPaused((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-800 transition hover:bg-secondary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:h-11 sm:w-11"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                {manualPaused ? <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
