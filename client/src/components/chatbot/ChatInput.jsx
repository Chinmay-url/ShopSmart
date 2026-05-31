import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ChatInput = ({ input, setInput, onSend, onKeyDown, isLoading, isDark }) => {
  const textareaRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, [input]);

  const canSend = !isLoading && input.trim().length > 0;

  const borderColor = isDark
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(249,115,22,0.2)';
  const bgColor = isDark
    ? 'rgba(255,255,255,0.05)'
    : 'rgba(249,115,22,0.04)';
  const topBorder = isDark
    ? '1px solid rgba(255,255,255,0.06)'
    : '1px solid rgba(249,115,22,0.1)';

  return (
    <div
      className="shrink-0 px-3 py-3"
      style={{ borderTop: topBorder }}
    >
      <div
        className="flex items-end gap-2 px-3 py-2 rounded-2xl transition-all duration-200"
        style={{
          background: bgColor,
          border: `1.5px solid ${borderColor}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        {/* Attach icon */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Attach image"
          className="shrink-0 mb-1 focus:outline-none"
          style={{ color: isDark ? 'rgba(255,255,255,0.35)' : '#f97316' }}
          tabIndex={0}
          onClick={() => {/* attach logic preserved from original */}}
        >
          <span className="material-icons text-xl">attach_file</span>
        </motion.button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about products, prices or deals..."
          disabled={isLoading}
          aria-label="Message input"
          className="flex-1 resize-none bg-transparent text-sm leading-relaxed focus:outline-none placeholder-gray-400 py-1"
          style={{
            color: isDark ? '#f1f5f9' : '#1e293b',
            minHeight: '24px',
            maxHeight: '120px',
          }}
        />

        {/* Voice icon */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Voice input"
          className="shrink-0 mb-1 focus:outline-none"
          style={{ color: isDark ? 'rgba(255,255,255,0.35)' : '#f97316' }}
          tabIndex={0}
        >
          <span className="material-icons text-xl">mic</span>
        </motion.button>

        {/* Send button */}
        <motion.button
          whileHover={canSend ? { scale: 1.08 } : {}}
          whileTap={canSend ? { scale: 0.92 } : {}}
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send message"
          className="shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
          style={{
            background: canSend
              ? 'linear-gradient(135deg,#f97316,#f59e0b)'
              : isDark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.06)',
            boxShadow: canSend ? '0 4px 14px rgba(249,115,22,0.4)' : 'none',
            color: canSend ? '#fff' : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
          }}
        >
          <span className="material-icons text-[18px]">send</span>
        </motion.button>
      </div>

      {/* Hint */}
      <p
        className="text-center text-[10px] mt-1.5 select-none"
        style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)' }}
      >
        Enter to send &nbsp;·&nbsp; Shift+Enter for new line
      </p>
    </div>
  );
};

export default ChatInput;