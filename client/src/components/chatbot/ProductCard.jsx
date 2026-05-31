import React, { memo } from 'react';
import { motion } from 'framer-motion';

const StarRating = ({ rating }) => {
  const stars = Math.round(rating || 0);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`text-xs ${s <= stars ? 'text-amber-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
      {rating && (
        <span className="text-[10px] text-gray-400 ml-0.5">({rating})</span>
      )}
    </div>
  );
};

const ProductCard = memo(({ product, isDark }) => {
  const {
    name = 'Product',
    image,
    price,
    originalPrice,
    discount,
    rating,
    buyUrl,
    compareUrl,
    trackUrl,
  } = product;

  const discountPercent = discount || (originalPrice && price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: isDark
        ? '0 12px 32px rgba(0,0,0,0.5)'
        : '0 12px 32px rgba(249,115,22,0.15)' }}
      transition={{ type: 'spring', stiffness: 360, damping: 22 }}
      className="rounded-2xl overflow-hidden flex gap-3 p-3"
      style={{
        background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(249,115,22,0.15)',
        boxShadow: isDark
          ? '0 4px 20px rgba(0,0,0,0.3)'
          : '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      {/* Product image */}
      <div
        className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
        style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#fff7ed' }}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <span className="material-icons text-2xl" style={{ color: '#f97316' }}>
            shopping_bag
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5">
        <div>
          <p
            className="text-sm font-semibold leading-tight line-clamp-2"
            style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}
          >
            {name}
          </p>
          <StarRating rating={rating} />
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2 flex-wrap">
          {price && (
            <span className="text-base font-bold" style={{ color: '#f97316' }}>
              ₹{Number(price).toLocaleString('en-IN')}
            </span>
          )}
          {originalPrice && originalPrice !== price && (
            <span
              className="text-xs line-through"
              style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}
            >
              ₹{Number(originalPrice).toLocaleString('en-IN')}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-500">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5 flex-wrap">
          <CardBtn
            href={buyUrl}
            label="Buy"
            primary
            icon="shopping_cart"
          />
          {compareUrl && (
            <CardBtn href={compareUrl} label="Compare" icon="compare" />
          )}
          {trackUrl && (
            <CardBtn href={trackUrl} label="Track" icon="notifications" />
          )}
        </div>
      </div>
    </motion.div>
  );
});

const CardBtn = ({ href, label, primary, icon }) => (
  <motion.a
    href={href || '#'}
    target={href ? '_blank' : undefined}
    rel="noopener noreferrer"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    aria-label={label}
    className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition-colors"
    style={
      primary
        ? {
            background: 'linear-gradient(135deg,#f97316,#f59e0b)',
            color: '#fff',
            boxShadow: '0 3px 10px rgba(249,115,22,0.3)',
          }
        : {
            background: 'rgba(249,115,22,0.1)',
            color: '#f97316',
            border: '1px solid rgba(249,115,22,0.25)',
          }
    }
  >
    <span className="material-icons text-[13px]">{icon}</span>
    {label}
  </motion.a>
);

ProductCard.displayName = 'ProductCard';
export default ProductCard;