import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, animate } from 'framer-motion';

// ─── Floating Product Card ────────────────────────────────────────────────────
const FloatingCard = ({ delay, x, y, emoji, label, price, badge }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: [0, -10, 0] }}
    transition={{ delay, duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
    style={{ position: 'absolute', left: x, top: y }}
    className="glass-card-hero p-3 rounded-2xl shadow-xl flex items-center gap-3 min-w-[180px] z-10"
  >
    <div className="text-3xl">{emoji}</div>
    <div>
      <div className="text-xs font-semibold text-slate-700">{label}</div>
      <div className="text-sm font-bold text-emerald-600">{price}</div>
      {badge && (
        <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
      )}
    </div>
  </motion.div>
);

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      className="border border-slate-200/60 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-slate-800 hover:bg-slate-50/50 transition-colors"
      >
        <span>{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl text-indigo-500 font-light"
        >+</motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-slate-500 text-sm leading-relaxed">{a}</p>
      </motion.div>
    </motion.div>
  );
};

// ─── Small helpers ────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div className="flex justify-center mb-4">
    <span className="inline-block text-xs font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full">
      {children}
    </span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h2
    className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 text-center leading-tight mb-4"
    style={{ fontFamily: "'Sora',sans-serif" }}
  >
    {children}
  </h2>
);

const SectionSub = ({ children }) => (
  <p className="text-center text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">{children}</p>
);

// ─── MAIN HOME COMPONENT ──────────────────────────────────────────────────────
const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [qrFailed, setQrFailed]       = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickSearch = (term) => {
    navigate(`/results?query=${encodeURIComponent(term)}`);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <div className="bg-[#f8f9fc] font-sans text-slate-900 overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#eef2ff 0%,#f0fdf4 50%,#eff6ff 100%)' }}
      >
        {/* Background mesh */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(99,102,241,.18),transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(16,185,129,.12),transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(59,130,246,.1),transparent 70%)', filter: 'blur(30px)' }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1.2" fill="#6366f1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
            <motion.div variants={fadeUp}
              className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              AI-Powered Shopping Intelligence
            </motion.div>

            <motion.h1 variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-[4.2rem] font-extrabold leading-[1.1] tracking-tight mb-6"
              style={{ fontFamily: "'Sora','Nunito',sans-serif" }}>
              Shop Smarter.<br />
              <span style={{ background: 'linear-gradient(90deg,#6366f1,#0ea5e9,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Spend Less.
              </span><br />
              Buy Better.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
              Use AI to compare prices across Amazon, Flipkart &amp; more. Discover deals, track price history,
              and get alerts the moment your product hits your target price.
            </motion.p>

            <motion.div variants={fadeUp}>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 font-medium placeholder:text-slate-400 transition-all"
                    placeholder="Search product or paste a link…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(99,102,241,.45)' }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="px-8 py-4 rounded-2xl font-bold text-white shadow-xl flex items-center gap-2 whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}
                >
                  Find Deals
                  <span className="material-icons text-base">arrow_forward</span>
                </motion.button>
              </form>

              <div className="flex flex-wrap gap-2 text-sm text-slate-400 items-center">
                <span>Try:</span>
                {['iPhone 15 Pro', 'Laptops', 'Air Conditioners', 'Nike Shoes'].map(t => (
                  <motion.button key={t} whileHover={{ scale: 1.05 }} onClick={() => quickSearch(t)}
                    className="bg-white/80 border border-slate-200 px-3 py-1 rounded-full text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all text-xs font-medium shadow-sm">
                    {t}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right – Floating Cards */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="relative h-[460px] hidden lg:block">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-96 rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white/60"
              style={{ background: 'linear-gradient(160deg,#eef2ff,#f0fdf4)', backdropFilter: 'blur(20px)' }}
            >
              <div className="p-4 h-full flex flex-col">
                <div className="text-[10px] font-bold text-slate-400 mb-3">ShopSmart AI</div>
                {[
                  { l: '🎧 Sony WH-1000XM5', p: '₹24,990', d: '-18%' },
                  { l: '📱 Samsung S24',      p: '₹68,000', d: '-12%' },
                  { l: '👟 Nike Air Max',     p: '₹8,995',  d: '-22%' },
                ].map(item => (
                  <div key={item.l} className="bg-white/70 rounded-xl p-2 mb-2 text-[10px]">
                    <div className="font-semibold text-slate-700">{item.l}</div>
                    <div className="flex justify-between mt-0.5">
                      <span className="text-emerald-600 font-bold">{item.p}</span>
                      <span className="text-red-500 font-bold">{item.d}</span>
                    </div>
                  </div>
                ))}
                <div className="mt-auto text-center">
                  <div className="bg-indigo-500 text-white text-[9px] font-bold py-2 rounded-xl">Compare Now →</div>
                </div>
              </div>
            </div>

            <FloatingCard delay={0.2} x="0%"  y="5%"  emoji="🎧" label="Sony WH-1000XM5" price="₹24,990"    badge="↓18% today"   />
            <FloatingCard delay={0.5} x="55%" y="0%"  emoji="📱" label="iPhone 15 Pro"   price="₹1,19,900" badge="Price drop!"   />
            <FloatingCard delay={0.8} x="5%"  y="65%" emoji="💻" label="MacBook Air M3"  price="₹1,14,900" badge="All-time low"  />
            <FloatingCard delay={1.1} x="52%" y="72%" emoji="🎮" label="PS5 Console"     price="₹49,990"   badge="₹5k off"      />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-0 top-[42%] glass-card-hero px-4 py-2 rounded-2xl shadow-lg text-xs font-bold text-indigo-700 flex items-center gap-2"
            >
              <span className="text-lg">✨</span> AI Comparison Ready
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 text-xs"
        >
          <span>Scroll</span>
          <div className="w-5 h-8 border-2 border-slate-300 rounded-full flex justify-center pt-1">
            <div className="w-1 h-2 bg-slate-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section id="features" className="py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%,rgba(99,102,241,.06),transparent)' }} />
        <div className="max-w-7xl mx-auto px-6">
          <SectionLabel>CAPABILITIES</SectionLabel>
          <SectionTitle>Everything you need to shop with confidence</SectionTitle>
          <SectionSub>From AI-powered recommendations to instant price alerts — ShopSmart puts the intelligence of a personal shopping analyst in your pocket.</SectionSub>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {[
              { icon: '🤖', title: 'AI Recommendations',  desc: 'Our engine learns your preferences and surfaces the best products at the right price point — before you even know to search.', color: '#6366f1' },
              { icon: '📈', title: 'Price History Charts', desc: 'View 6-month historical price graphs so you can identify patterns and know with certainty that a "sale" is actually a sale.',   color: '#0ea5e9' },
              { icon: '🔔', title: 'Smart Price Alerts',   desc: 'Set your target price. The moment any retailer drops to your number, we send an instant push notification or email alert.',      color: '#f59e0b' },
              { icon: '💰', title: 'Budget Mode',          desc: 'Filter every search by your budget and instantly surface the best quality-to-price ratio products across all stores.',            color: '#10b981' },
              { icon: '⚡', title: 'Real-Time Comparison', desc: 'Live price scraping across Amazon, Flipkart, Myntra, and more. Prices update every few minutes — never stale data.',             color: '#ec4899' },
              { icon: '🎯', title: 'Deal Discovery',       desc: 'An always-on deal radar surfaces hidden flash sales, coupon stacks, and limited-time offers across the entire web.',             color: '#8b5cf6' },
            ].map((f, i) => (
              <motion.div key={f.title} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,0,0,.08)' }}
                className="rounded-3xl p-7 border border-slate-100 bg-white transition-all cursor-default group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-sm"
                  style={{ background: f.color + '18' }}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-5 flex items-center gap-1 text-xs font-semibold transition-colors" style={{ color: f.color }}>
                  Learn more
                  <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#f0f4ff 0%,#f8f9fc 100%)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <SectionLabel>PROCESS</SectionLabel>
          <SectionTitle>Four steps to smarter shopping</SectionTitle>
          <SectionSub>Built for speed. No signup required to compare prices.</SectionSub>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-indigo-200 via-sky-200 to-emerald-200 z-0" />
            {[
              { step: '01', icon: '🔍', title: 'Search',   desc: 'Enter a product name or paste any product URL from any store.' },
              { step: '02', icon: '⚖️', title: 'Compare',  desc: 'Instantly see side-by-side prices from all major Indian retailers.' },
              { step: '03', icon: '📊', title: 'Track',    desc: 'Add to watchlist and monitor the price history over time.' },
              { step: '04', icon: '🛒', title: 'Buy Smart',desc: 'Get alerted at your target price and buy with total confidence.' },
            ].map((s, i) => (
              <motion.div key={s.step} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="relative z-10 bg-white rounded-3xl p-7 border border-slate-100 shadow-sm text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow"
                  style={{ background: `hsl(${220 + i * 30},85%,95%)` }}>
                  {s.icon}
                </div>
                <div className="text-xs font-black text-slate-300 mb-1 tracking-widest">{s.step}</div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COMMUNITY  (id="community")
      ══════════════════════════════════════════ */}
      <section id="community" className="py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1e2340 0%,#0d1b2a 100%)' }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle,#6366f1,transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-[-20%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#0ea5e9,transparent 70%)', filter: 'blur(50px)' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="rounded-3xl border border-white/10 overflow-hidden"
            style={{ background: 'rgba(255,255,255,.04)', backdropFilter: 'blur(24px)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* Left */}
              <div className="p-12 md:p-16 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  Community
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6"
                  style={{ fontFamily: "'Sora',sans-serif" }}>
                  Join the<br />
                  <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ShopSmart
                  </span><br />
                  Community
                </h2>

                <p className="text-slate-300 text-base leading-relaxed mb-10 max-w-md">
                  Get exclusive shopping deals, real-time price alerts, AI tips, early feature access and connect
                  with thousands of smart shoppers across India.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.a
                    href="https://t.me/ss17ShopSmart75231"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(37,150,255,.4)' }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white shadow-xl"
                    style={{ background: 'linear-gradient(135deg,#2196f3,#0d76e3)' }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Join Telegram
                  </motion.a>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { navigator.clipboard && navigator.clipboard.writeText('https://t.me/ss17ShopSmart75231'); }}
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-300 border border-white/20 hover:border-white/40 transition-all"
                  >
                    <span className="material-icons text-base">content_copy</span>
                    Copy Invite Link
                  </motion.button>
                </div>

                <p className="mt-6 text-slate-400 text-xs flex items-center gap-2">
                  <span className="material-icons text-sm text-blue-400">qr_code_scanner</span>
                  Scan or tap to join instantly
                </p>
              </div>

              {/* Right – QR */}
              <div className="p-12 flex flex-col items-center justify-center border-t border-white/10 lg:border-t-0 lg:border-l border-white/10">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20"
                  style={{ width: 220, height: 220 }}
                >
                  {!qrFailed ? (
                    <img
                      src="/images/qr.png"
                      alt="Telegram QR code"
                      className="w-full h-full object-cover"
                      onError={() => setQrFailed(true)}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', background: '#1e3a5f',
                      color: '#60a5fa', fontSize: 13, padding: 20, textAlign: 'center', gap: 8,
                    }}>
                      <span style={{ fontSize: 48 }}>📲</span>
                      <span style={{ fontWeight: 700 }}>Scan QR code</span>
                      <span style={{ opacity: 0.7, fontSize: 11 }}>Place qr.png in client/public/images/</span>
                    </div>
                  )}
                </motion.div>

                <div className="mt-5 text-center">
                  <div className="text-white font-bold text-sm">@ss17ShopSmart75231</div>
                  <div className="text-slate-400 text-xs mt-1">Scan with your phone camera</div>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {['🛍️ Daily Deals', '🔔 Price Alerts', '🤖 AI Tips'].map(tag => (
                    <span key={tag} className="text-[11px] bg-white/10 text-slate-300 px-3 py-1 rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ  (id="faq") ← ADDED for navbar scroll
      ══════════════════════════════════════════ */}
      <section id="faq" className="py-28 relative" style={{ background: 'linear-gradient(180deg,#f8f9fc,#eef2ff 100%)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <SectionLabel>FAQ</SectionLabel>
          <SectionTitle>Common questions</SectionTitle>

          <div className="mt-12 flex flex-col gap-3">
            {[
              { q: 'Is ShopSmart free to use?',             a: 'Yes! ShopSmart is completely free. You can compare prices, view price history, and set alerts without any subscription.' },
              { q: 'Which stores does ShopSmart compare?',  a: 'We currently compare prices from Amazon India, Flipkart, Myntra, Croma, Reliance Digital, and several other leading Indian retailers, with more being added regularly.' },
              { q: 'How accurate are the prices?',          a: 'Prices are fetched in real-time using our live scraping engine. Most listings update every 15–30 minutes to ensure you always see current pricing.' },
              { q: 'Can I track multiple products?',        a: 'Absolutely. Your watchlist supports unlimited products. You can set individual target prices for each and receive alerts independently.' },
              { q: 'Does ShopSmart sell products directly?',a: "No — ShopSmart is a pure comparison and tracking service. When you click 'Buy', you are redirected directly to the retailer's website." },
            ].map(faq => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-slate-950 text-slate-400 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
                  <span className="material-icons text-white text-base">shopping_bag</span>
                </div>
                <span className="text-xl font-extrabold text-white" style={{ fontFamily: "'Sora',sans-serif" }}>ShopSmart</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs mb-6">
                The AI-powered price comparison and deal tracking engine for the modern Indian shopper.
              </p>
              <div className="flex gap-3">
                {['twitter', 'instagram', 'linkedin', 'telegram'].map(sn => (
                  <a key={sn} href="#"
                    className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                    <span className="material-icons text-sm">link</span>
                  </a>
                ))}
              </div>
            </div>

            {[
              { head: 'Product', links: ['Browser Extension', 'Price History', 'Deals API', 'Mobile App'] },
              { head: 'Company', links: ['About Us', 'Careers', 'Privacy Policy', 'Terms'] },
            ].map(col => (
              <div key={col.head}>
                <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">{col.head}</h4>
                <ul className="space-y-3 text-sm">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Newsletter</h4>
              <p className="text-xs mb-4 leading-relaxed">Get the weekly top 10 price drops directly in your inbox.</p>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="you@email.com"
                  type="email"
                />
                <motion.button whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-white text-sm">send</span>
                </motion.button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <span>© 2024 ShopSmart Inc. Prices fetched in real-time. Trademarks belong to respective owners.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card-hero {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.5);
        }
        :root { --primary: #6366f1; }
      `}</style>
    </div>
  );
};

export default Home;