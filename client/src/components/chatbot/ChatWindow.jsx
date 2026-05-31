import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import TypingIndicator from './TypingIndicator';

const API = 'http://localhost:5000';

const RupeesChatbot = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('online'); // online | thinking | searching | comparing
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const messagesEndRef = useRef(null);

  // Auto dark mode detection
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          text: "Hi! I'm **ShopSmart AI** 🛍️\nYour intelligent shopping companion. I can help you find the best deals, compare prices, track price drops, and recommend products tailored for you.\n\nWhat are you looking to buy today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = useCallback(async (messageText) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage, timestamp: new Date() }]);
    setIsLoading(true);
    setStatus('thinking');

    // Simulate status transitions
    const searchTimer = setTimeout(() => setStatus('searching'), 1200);
    const compareTimer = setTimeout(() => setStatus('comparing'), 2400);

    try {
      const chatHistory = messages
        .filter((m) => m.role !== 'system')
        .slice(-10)
        .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));

      chatHistory.push({ role: 'user', content: userMessage });

      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          context: context,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data.reply, timestamp: new Date() },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.message || 'Sorry, something went wrong. Please try again.',
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Cannot connect to server. Please check your connection and try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      clearTimeout(searchTimer);
      clearTimeout(compareTimer);
      setIsLoading(false);
      setStatus('online');
    }
  }, [input, messages, isLoading, context]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isMobile = window.innerWidth < 640;

  const windowVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 24, transformOrigin: 'bottom right' },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 320, damping: 28 },
    },
    exit: {
      opacity: 0,
      scale: 0.85,
      y: 20,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  };

  const fabVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.08 },
    tap: { scale: 0.94 },
  };

  const windowStyle = isExpanded || isMobile
    ? {
        bottom: isMobile ? '0' : '24px',
        right: isMobile ? '0' : '24px',
        width: isMobile ? '100vw' : '520px',
        height: isMobile ? '100dvh' : '85vh',
        maxHeight: isMobile ? '100dvh' : '780px',
        borderRadius: isMobile ? '0' : '24px',
      }
    : {
        bottom: '88px',
        right: '24px',
        width: '460px',
        height: '700px',
        maxHeight: 'calc(100vh - 110px)',
        borderRadius: '24px',
      };

  return (
    <div className={isDark ? 'dark' : ''}>
      {/* FAB Button */}
      <motion.button
        variants={fabVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close ShopSmart AI' : 'Open ShopSmart AI'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-400/50"
        style={{
          background: isOpen
            ? '#6b7280'
            : 'linear-gradient(135deg, #f97316 0%, #f59e0b 60%, #ef4444 100%)',
          boxShadow: isOpen
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 8px 32px rgba(249,115,22,0.5), 0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="material-icons text-white text-2xl"
            >
              close
            </motion.span>
          ) : (
            <motion.span
              key="fab"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-white font-extrabold text-xl select-none"
            >
              ₹
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            variants={windowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-label="ShopSmart AI Chat"
            aria-modal="true"
            className="fixed z-50 flex flex-col overflow-hidden"
            style={{
              ...windowStyle,
              background: isDark
                ? 'rgba(15, 15, 20, 0.92)'
                : 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(24px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
              border: isDark
                ? '1px solid rgba(255,255,255,0.08)'
                : '1px solid rgba(249,115,22,0.15)',
              boxShadow: isDark
                ? '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)'
                : '0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(249,115,22,0.08)',
            }}
          >
            {/* Header */}
            <ChatHeader
              status={status}
              isDark={isDark}
              isExpanded={isExpanded}
              onExpand={() => setIsExpanded(!isExpanded)}
              onClose={() => setIsOpen(false)}
              onToggleDark={() => setIsDark(!isDark)}
            />

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: isDark ? 'rgba(255,255,255,0.1) transparent' : 'rgba(0,0,0,0.1) transparent',
              }}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <ChatMessage
                    key={idx}
                    message={msg}
                    isDark={isDark}
                    isLast={idx === messages.length - 1}
                  />
                ))}
              </AnimatePresence>

              {isLoading && <TypingIndicator isDark={isDark} status={status} />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <QuickActions
              isDark={isDark}
              show={messages.length <= 2}
              onSelect={(prompt) => handleSend(prompt)}
            />

            {/* Input */}
            <ChatInput
              input={input}
              setInput={setInput}
              onSend={() => handleSend()}
              onKeyDown={handleKeyDown}
              isLoading={isLoading}
              isDark={isDark}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RupeesChatbot;