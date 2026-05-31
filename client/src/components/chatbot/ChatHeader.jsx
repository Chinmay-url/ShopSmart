import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_CONFIG = {
  online:    { label: 'Online',           color: '#22c55e', pulse: false },
  thinking:  { label: 'Thinking...',      color: '#f97316', pulse: true  },
  searching: { label: 'Searching deals',  color: '#3b82f6', pulse: true  },
  comparing: { label: 'Comparing prices', color: '#a855f7', pulse: true  },
};

const ChatHeader = ({ status, isDark, isExpanded, onExpand, onClose, onToggleDark }) => {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.online;

  return (
    <div
      className="relative flex items-center gap-3 px-4 py-3 shrink-0"
      style={{
        background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 55%, #ef4444 100%)',
        borderRadius: 'inherit',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(255,255,255,0.3) 20px,rgba(255,255,255,0.3) 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,rgba(255,255,255,0.3) 20px,rgba(255,255,255,0.3) 21px)',
        }}
      />

      {/* Animated Avatar */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: 4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="relative w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
        aria-hidden="true"
      >
        <span className="text-white font-black text-lg select-none">₹</span>
        {/* Pulse ring when active */}
        {s.pulse && (
          <motion.span
            className="absolute inset-0 rounded-2xl"
            style={{ border: '2px solid rgba(255,255,255,0.6)' }}
            animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </motion.div>

      {/* Title + Status */}
      <div className="flex-1 min-w-0">
        <h2 className="text-white font-bold text-sm leading-tight tracking-wide">
          ShopSmart AI
        </h2>
        <div className="flex items-center gap-1.5 mt-0.5">
          <motion.span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: s.color }}
            animate={s.pulse ? { opacity: [1, 0.3, 1], scale: [1, 1.4, 1] } : { opacity: 1 }}
            transition={s.pulse ? { duration: 1.2, repeat: Infinity } : {}}
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={status}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
              className="text-orange-100 text-xs font-medium truncate"
            >
              {s.label}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <HeaderIconBtn
          onClick={onToggleDark}
          label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          icon={isDark ? 'light_mode' : 'dark_mode'}
        />
        <HeaderIconBtn
          onClick={onExpand}
          label={isExpanded ? 'Minimize' : 'Expand'}
          icon={isExpanded ? 'close_fullscreen' : 'open_in_full'}
        />
        <HeaderIconBtn
          onClick={onClose}
          label="Close chat"
          icon="close"
        />
      </div>
    </div>
  );
};

const HeaderIconBtn = ({ onClick, label, icon }) => (
  <motion.button
    whileHover={{ scale: 1.15, background: 'rgba(255,255,255,0.25)' }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    aria-label={label}
    className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
    style={{ background: 'rgba(255,255,255,0.12)' }}
  >
    <span className="material-icons text-white text-base">{icon}</span>
  </motion.button>
);

export default ChatHeader;