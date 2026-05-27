import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_LABELS = {
  thinking:  'Thinking',
  searching: 'Searching deals',
  comparing: 'Comparing prices',
};

const TypingIndicator = ({ isDark, status }) => {
  const label = STATUS_LABELS[status] || 'Thinking';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.22 }}
      className="flex items-end gap-2"
    >
      {/* Bot avatar */}
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs"
        style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)' }}
        aria-hidden="true"
      >
        ₹
      </div>

      <div
        className="flex items-center gap-3 px-4 py-3 rounded-3xl rounded-bl-md"
        style={{
          background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(249,115,22,0.06)',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(249,115,22,0.12)',
        }}
        aria-label={`ShopSmart AI is ${label}`}
        role="status"
      >
        {/* Animated dots */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: '#f97316' }}
              animate={{
                y: [0, -5, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Status label */}
        <AnimatePresence mode="wait">
          <motion.span
            key={status}
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-medium"
            style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)' }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;