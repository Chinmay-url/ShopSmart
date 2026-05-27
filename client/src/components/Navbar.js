import React, { useContext, useState, useEffect, useRef, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// ── Icons ─────────────────────────────────────────────────────────────────────
const BagIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const MenuIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>;
const XIcon      = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ChevronIcon= () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const BellIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const HeartIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const LogoutIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const ArrowIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const UserIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

// ── Data ──────────────────────────────────────────────────────────────────────
const PUBLIC_LINKS = [
  { to: null,      label: 'Features',   anchor: 'features'  },
  { to: null,      label: 'FAQ',        anchor: 'faq'       },
  { to: null,      label: 'Community',  anchor: 'community' },
  { to: '/profile', label: 'Favourites', icon: HeartIcon     },  // ← new link
];

const initials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

const ddVariants = {
  hidden:  { opacity: 0, y: -6, scale: 0.95 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 380, damping: 26 } },
  exit:    { opacity: 0, y: -4, scale: 0.95, transition: { duration: 0.14 } },
};

// ── Logo styles ───────────────────────────────────────────────────────────────
const logoStyleBase = {
  fontFamily: "'Sora', 'Nunito', sans-serif",
  fontWeight: 800,
  letterSpacing: '-0.02em',
};

const logoStyleAuth = {
  ...logoStyleBase,
  color: '#ffffff',
};

const logoStyleMain = {
  ...logoStyleBase,
  background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// ── Smooth-scroll helper ──────────────────────────────────────────────────────
const useAnchorNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback((anchor) => {
    const scroll = () => {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (location.pathname === '/') {
      scroll();
    } else {
      navigate('/');
      setTimeout(scroll, 350);
    }
  }, [navigate, location.pathname]);
};

// ── NavLink ───────────────────────────────────────────────────────────────────
const NavLink = memo(({ item, onClick, className }) => {
  const scrollTo = useAnchorNav();

  if (item.anchor) {
    return (
      <button
        onClick={() => { scrollTo(item.anchor); onClick && onClick(); }}
        className={className}
      >
        {item.icon && <item.icon />}
        {item.label}
      </button>
    );
  }

  return (
    <Link to={item.to} onClick={onClick} className={className}>
      {item.icon && <item.icon />}
      {item.label}
    </Link>
  );
});

// ── Main Navbar ───────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [ddOpen, setDdOpen]         = useState(false);
  const ddRef = useRef(null);

  const isAuthPage   = ['/login', '/signup'].includes(location.pathname);
  const isHiddenPage =
    location.pathname.startsWith('/results') ||
    location.pathname.startsWith('/price-history') ||
    location.pathname.startsWith('/product') ||
    location.pathname.startsWith('/alerts') ||
    location.pathname.startsWith('/profile');

  useEffect(() => {
    const fn = e => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setDdOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = useCallback(() => { logout(); navigate('/'); }, [logout, navigate]);

  if (isHiddenPage) return null;

  // ── AUTH PAGES ─────────────────────────────────────────────────────────────
  if (isAuthPage) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 w-full h-16" style={{ background: 'transparent' }}>
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
              <BagIcon />
            </div>
            <span className="text-lg" style={logoStyleAuth}>ShopSmart</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg text-white/70 hover:text-white transition-colors">
            <ArrowIcon /> Back
          </Link>
        </div>
      </nav>
    );
  }

  // ── MAIN NAV ───────────────────────────────────────────────────────────────
  const links = PUBLIC_LINKS;

  const desktopLinkClass =
    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 " +
    "bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600 " +
    "hover:opacity-75";

  const mobileLinkClass =
    "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold " +
    "text-indigo-400 hover:text-indigo-300 hover:bg-white/8 min-h-[52px] transition-colors w-full text-left";

  // ── Dropdown menu items — Favourites removed ───────────────────────────────
  const dropdownItems = [
    { to: '/profile', icon: UserIcon, label: 'Profile'      },
    { to: '/alerts',  icon: BellIcon, label: 'Price Alerts' },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 w-full"
        style={{ background: 'transparent', border: 'none', boxShadow: 'none', height: 72 }}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

          {/* Logo */}
          <Link to="/" aria-label="ShopSmart" className="flex items-center gap-2.5 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30"
            >
              <BagIcon />
            </motion.div>
            <span className="text-[1.05rem]" style={logoStyleMain}>ShopSmart</span>
          </Link>

          {/* Centered links */}
          <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {links.map((item) => (
              <NavLink key={item.label} item={item} className={desktopLinkClass} />
            ))}
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="relative" ref={ddRef}>
                <motion.button
                  onClick={() => setDdOpen(o => !o)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  aria-expanded={ddOpen} aria-haspopup="true" aria-label="User menu"
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-2xl border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {initials(user?.name)}
                  </div>
                  <span className="text-sm font-medium text-violet-700">{user?.name?.split(' ')[0]}</span>
                  <motion.span animate={{ rotate: ddOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="opacity-60">
                    <ChevronIcon />
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {ddOpen && (
                    <motion.div
                      variants={ddVariants} initial="hidden" animate="visible" exit="exit"
                      className="absolute right-0 top-[calc(100%+10px)] w-52 rounded-2xl shadow-2xl border border-white/10 bg-black/80 overflow-hidden z-50"
                      style={{ backdropFilter: 'blur(20px)' }} role="menu"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-white/8">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {initials(user?.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-white/50 truncate">{user?.email || 'Member'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        {dropdownItems.map(({ to, icon: Icon, label }) => (
                          <Link
                            key={label}
                            to={to}
                            onClick={() => setDdOpen(false)}
                            role="menuitem"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <span className="text-white/40"><Icon /></span>
                            {label}
                          </Link>
                        ))}
                      </div>

                      {/* Sign out */}
                      <div className="border-t border-white/8">
                        <button
                          onClick={handleLogout}
                          role="menuitem"
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogoutIcon /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-white hover:text-white/60 transition-colors">
                  Sign In
                </Link>
                <Link to="/signup">
                  <motion.span
                    whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                  >
                    Get Started
                  </motion.span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <motion.button
              onClick={() => setMobileOpen(o => !o)} whileTap={{ scale: 0.88 }}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={mobileOpen ? 'x' : 'm'}
                  initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                  exit={{    rotate: 30,  opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.16 }}>
                  {mobileOpen ? <XIcon /> : <MenuIcon />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)} aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[80vw] max-w-xs flex flex-col bg-[#09090b] text-white shadow-2xl"
              role="dialog" aria-modal="true"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-white/8">
                <span style={logoStyleMain}>ShopSmart</span>
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 text-white">
                  <XIcon />
                </motion.button>
              </div>

              <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
                {links.map((item, i) => (
                  <motion.div key={item.label}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.055, type: 'spring', stiffness: 300, damping: 28 }}
                  >
                    <NavLink
                      item={item}
                      onClick={() => setMobileOpen(false)}
                      className={mobileLinkClass}
                    />
                  </motion.div>
                ))}

                {/* Mobile profile links when logged in */}
                {user && (
                  <div className="mt-2 pt-2 border-t border-white/8 flex flex-col gap-0.5">
                    {dropdownItems.map(({ to, icon: Icon, label }, i) => (
                      <motion.div key={label}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (links.length + i) * 0.055, type: 'spring', stiffness: 300, damping: 28 }}
                      >
                        <Link
                          to={to}
                          onClick={() => setMobileOpen(false)}
                          className={mobileLinkClass}
                        >
                          <span className="text-indigo-400/70"><Icon /></span>
                          {label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </nav>

              <div className="px-3 py-4 border-t border-white/8">
                {user ? (
                  <button onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/16 transition-colors">
                    <LogoutIcon /> Sign Out
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)}
                      className="text-center py-3 rounded-2xl text-sm font-semibold border border-white/12 text-white hover:bg-white/8 transition-colors">
                      Sign In
                    </Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)}
                      className="text-center py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Navbar);