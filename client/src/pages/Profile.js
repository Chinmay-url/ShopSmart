import React, { useState, useEffect, useContext } from 'react';
import { Trash2, ExternalLink, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ── Shared accent token ────────────────────────────────────────────────────
const ACCENT = '#6366f1';
const ACCENT_DARK = '#4f46e5';
const GRAD = 'linear-gradient(135deg, #6366f1, #7c3aed)';

const gradientText = {
  background: GRAD,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// ── Animation variants ─────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] } },
});

const cardHover = {
  rest:  { scale: 1,    boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.06)' },
  hover: { scale: 1.02, boxShadow: '0 8px 32px rgba(99,102,241,0.18), 0 0 0 1.5px rgba(99,102,241,0.4)' },
};

// ── Subtle dot grid background ─────────────────────────────────────────────
const DotGrid = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      opacity: 0.45,
    }}
  />
);

// ── Stat pill ──────────────────────────────────────────────────────────────
const StatPill = ({ label, value }) => (
  <div style={{
    background: '#fff',
    border: '1.5px solid #e5e7eb',
    borderRadius: 16,
    padding: '14px 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  }}>
    <p style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
      color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4,
    }}>{label}</p>
    <p style={{ fontSize: 24, fontWeight: 800, ...gradientText }}>{value}</p>
  </div>
);

// ── Product card ───────────────────────────────────────────────────────────
const ProductCard = ({ product, onRemove, index }) => (
  <motion.div
    variants={fadeUp(0.05 * index)}
    initial="initial"
    animate="animate"
    whileHover="hover"
    variants={cardHover}
    transition={{ type: 'spring', stiffness: 340, damping: 28 }}
    style={{
      background: '#ffffff',
      border: '1.5px solid #e5e7eb',
      borderRadius: 20,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    }}
  >
    {/* Image */}
    {product.image ? (
      <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: '#f9fafb' }}>
        <img
          src={product.image}
          alt={product.productName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <span style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0,0,0,0.08)',
          color: '#374151',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
          padding: '4px 10px', borderRadius: 999,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}>
          {product.store}
        </span>
      </div>
    ) : (
      <div style={{
        height: 120,
        background: 'linear-gradient(135deg, #f0f0ff, #faf5ff)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 40 }}>🛍️</span>
      </div>
    )}

    {/* Body */}
    <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h3 style={{
        fontFamily: "'Sora', sans-serif",
        fontWeight: 700, fontSize: 14, lineHeight: 1.5,
        color: '#111827',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {product.productName}
      </h3>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>₹</span>
        <span style={{ fontSize: 26, fontWeight: 800, ...gradientText }}>{product.price}</span>
      </div>

      <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, marginTop: 'auto' }}>
        Saved {new Date(product.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <a
          href={product.link && product.link.startsWith('http') ? product.link : `https://${product.link || '#'}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => { if (!product.link) { e.preventDefault(); alert('Store link not available for this product'); } }}
          style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: GRAD,
            color: '#fff', fontWeight: 700, fontSize: 13,
            padding: '10px 0', borderRadius: 12,
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            transition: 'opacity 0.18s, box-shadow 0.18s',
          }}
          onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)'; }}
          onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)'; }}
        >
          Buy <ExternalLink size={13} />
        </a>
        <button
          onClick={() => onRemove(product.productId)}
          style={{
            background: '#fff0f0',
            border: '1.5px solid #fecaca',
            color: '#ef4444',
            padding: '10px 14px', borderRadius: 12,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            transition: 'background 0.18s, border-color 0.18s',
          }}
          onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#fca5a5'; }}
          onMouseOut={e => { e.currentTarget.style.background = '#fff0f0'; e.currentTarget.style.borderColor = '#fecaca'; }}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  </motion.div>
);

// ── Profile ────────────────────────────────────────────────────────────────
const Profile = () => {
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedProducts();
  }, []);

  const fetchSavedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/products/saved', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSavedProducts(data);
      } else {
        setError('Failed to fetch saved products');
      }
    } catch (err) {
      setError('Error fetching saved products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await fetch(`/products/saved/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setSavedProducts(savedProducts.filter((p) => p.productId !== productId));
        alert('Product removed from favourites');
      }
    } catch (err) {
      console.error('Error removing product:', err);
      alert('Error removing product');
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#f9fafb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <DotGrid />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid #e0e7ff',
            borderTopColor: ACCENT,
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: '#6b7280', fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14 }}>
            Loading your favourites…
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const initials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', color: '#111827', fontFamily: "'Sora', 'Nunito', sans-serif", position: 'relative' }}>
      <DotGrid />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* ── Back to Home ─────────────────────────────────────────────── */}
        <motion.button
          {...fadeUp(0)}
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#fff',
            border: '1.5px solid #e5e7eb',
            color: '#374151',
            fontSize: 13, fontWeight: 700,
            padding: '9px 18px 9px 12px',
            borderRadius: 999,
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            marginBottom: 40,
            transition: 'box-shadow 0.18s, border-color 0.18s, color 0.18s',
            letterSpacing: '0.01em',
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = '#c7d2fe';
            e.currentTarget.style.color = ACCENT;
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.15)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.color = '#374151';
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
          }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </motion.button>

        {/* ── Hero header ─────────────────────────────────────────────── */}
        <motion.div {...fadeUp(0.05)} style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Avatar */}
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: GRAD,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, color: '#fff',
              boxShadow: '0 4px 18px rgba(99,102,241,0.3)',
              flexShrink: 0,
            }}>
              {initials(user?.name)}
            </div>
            <div>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4,
              }}>
                My Profile
              </p>
              <h1 style={{
                fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800,
                letterSpacing: '-0.03em', lineHeight: 1.1, ...gradientText,
              }}>
                Welcome back, {user?.name?.split(' ')[0]}
              </h1>
            </div>
          </div>
        </motion.div>

        {/* ── Account card ─────────────────────────────────────────────── */}
        <motion.div {...fadeUp(0.10)} style={{
          background: '#ffffff',
          border: '1.5px solid #e5e7eb',
          borderRadius: 24,
          padding: '28px 32px',
          marginBottom: 28,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
            color: '#9ca3af', textTransform: 'uppercase', marginBottom: 20,
          }}>
            Account Information
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            <div>
              <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Name</p>
              <p style={{ fontSize: 17, fontWeight: 800, color: '#111827' }}>{user?.name}</p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email</p>
              <p style={{ fontSize: 17, fontWeight: 600, color: '#374151' }}>{user?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Stats row ─────────────────────────────────────────────────── */}
        <motion.div {...fadeUp(0.15)} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
          <StatPill label="Saved items" value={savedProducts.length} />
          {savedProducts.length > 0 && (
            <StatPill
              label="Lowest price"
              value={`₹${Math.min(...savedProducts.map(p => Number(p.price) || 0)).toLocaleString('en-IN')}`}
            />
          )}
        </motion.div>

        {/* ── Saved products section ────────────────────────────────────── */}
        <motion.div {...fadeUp(0.20)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: '#111827', display: 'flex', alignItems: 'center', gap: 10 }}>
              Saved Products
              <span style={{
                fontSize: 12, fontWeight: 700,
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                color: ACCENT,
                padding: '2px 10px', borderRadius: 999,
              }}>
                {savedProducts.length}
              </span>
            </h2>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fff5f5', border: '1.5px solid #fecaca',
              color: '#dc2626', padding: '12px 16px', borderRadius: 12, marginBottom: 24,
              fontSize: 14, fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          {/* Empty state */}
          {savedProducts.length === 0 ? (
            <div style={{
              background: '#fff',
              border: '1.5px dashed #d1d5db',
              borderRadius: 24, padding: '64px 24px', textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
                No saved products yet
              </p>
              <p style={{ fontSize: 14, color: '#9ca3af', fontWeight: 500 }}>
                Search for products and save them to your favourites
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}>
              <AnimatePresence>
                {savedProducts.map((product, i) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    onRemove={handleRemoveProduct}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;