import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_PROMPTS = [
  { emoji: '🔥', label: 'Best deals today',        text: 'What are the best deals available today?' },
  { emoji: '📉', label: 'Track price',              text: 'How do I track price drops for a product?' },
  { emoji: '💻', label: 'Laptop under ₹50k',       text: 'Recommend a good laptop under ₹50,000' },
  { emoji: '📱', label: 'Compare phones',           text: 'Compare the top smartphones available right now' },
  { emoji: '🎧', label: 'Best headphones',         text: 'Recommend the best headphones for music and calls' },
  { emoji: '💰', label: 'Budget shopping tips',    text: 'Give me tips for smart budget shopping' },
];

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1, y: 0,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0, y: 8, transition: { duration: 0.2 } },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 6 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 22 } },
};

const QuickActions = ({ isDark, show, onSelect }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="shrink-0 px-3 pb-2"
          aria-label="Quick action suggestions"
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mb-2 pl-1"
            style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
          >
            Suggested
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p) => (
              <motion.button
                key={p.label}
                variants={chipVariants}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelect(p.text)}
                aria-label={`Quick prompt: ${p.label}`}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
                style={{
                  background: isDark
                    ? 'rgba(249,115,22,0.12)'
                    : 'rgba(249,115,22,0.08)',
                  border: isDark
                    ? '1px solid rgba(249,115,22,0.25)'
                    : '1px solid rgba(249,115,22,0.2)',
                  color: isDark ? '#fdba74' : '#c2410c',
                }}
              >
                <span role="img" aria-hidden="true">{p.emoji}</span>
                <span>{p.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickActions;