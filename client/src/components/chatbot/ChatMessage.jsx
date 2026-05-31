import React, { memo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

// Minimal markdown renderer (bold, italic, code, line breaks)
const renderMarkdown = (text, isDark) => {
  if (!text) return null;

  const lines = text.split('\n');
  const textColor = isDark ? 'text-gray-100' : 'text-gray-800';

  return lines.map((line, li) => {
    // Bullet points
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (
        <li key={li} className={`ml-4 list-disc ${textColor}`}>
          {parseInline(line.replace(/^[-•]\s/, ''), isDark)}
        </li>
      );
    }
    // Headings
    if (line.startsWith('### ')) {
      return (
        <p key={li} className={`font-bold text-sm mt-2 ${textColor}`}>
          {parseInline(line.replace(/^### /, ''), isDark)}
        </p>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <p key={li} className={`font-bold text-base mt-2 ${textColor}`}>
          {parseInline(line.replace(/^## /, ''), isDark)}
        </p>
      );
    }
    // Empty line → spacer
    if (line.trim() === '') return <div key={li} className="h-1" />;
    return (
      <p key={li} className={`${textColor} leading-relaxed`}>
        {parseInline(line, isDark)}
      </p>
    );
  });
};

const parseInline = (text, isDark) => {
  // Split on **bold**, *italic*, `code`, and URLs
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|https?:\/\/\S+)/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));

    if (match[0].startsWith('**')) {
      parts.push(<strong key={match.index} className="font-semibold">{match[2]}</strong>);
    } else if (match[0].startsWith('*')) {
      parts.push(<em key={match.index}>{match[3]}</em>);
    } else if (match[0].startsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className={`px-1.5 py-0.5 rounded text-xs font-mono ${
            isDark ? 'bg-gray-700 text-orange-300' : 'bg-orange-50 text-orange-700'
          }`}
        >
          {match[4]}
        </code>
      );
    } else {
      parts.push(
        <a
          key={match.index}
          href={match[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-orange-400 hover:text-orange-300 break-all"
        >
          {match[0]}
        </a>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : text;
};

// Detect if text looks like it has product data (JSON array in text)
const extractProducts = (text) => {
  try {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed) && parsed[0]?.name) return parsed;
    }
  } catch {
    // not product json
  }
  return null;
};

const msgVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 26 },
  },
};

const ChatMessage = memo(({ message, isDark, isLast }) => {
  const isUser = message.role === 'user';
  const products = !isUser ? extractProducts(message.text) : null;
  const displayText = products
    ? message.text.replace(/```json[\s\S]*?```/, '').trim()
    : message.text;

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      variants={msgVariants}
      initial="hidden"
      animate="visible"
      className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1 text-white font-bold text-xs"
          style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)' }}
          aria-hidden="true"
        >
          ₹
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className="px-4 py-3 text-sm rounded-3xl"
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg,#f97316 0%,#f59e0b 60%,#ef4444 100%)',
                  color: '#fff',
                  borderBottomRightRadius: '6px',
                  boxShadow: '0 4px 16px rgba(249,115,22,0.3)',
                }
              : {
                  background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(249,115,22,0.06)',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(249,115,22,0.12)',
                  borderBottomLeftRadius: '6px',
                }
          }
        >
          {isUser ? (
            <p className="text-white leading-relaxed whitespace-pre-wrap">{displayText}</p>
          ) : (
            <div className="space-y-0.5">{renderMarkdown(displayText, isDark)}</div>
          )}
        </div>

        {/* Product cards */}
        {products && (
          <div className="flex flex-col gap-2 w-full mt-1">
            {products.map((p, i) => (
              <ProductCard key={i} product={p} isDark={isDark} />
            ))}
          </div>
        )}

        {/* Timestamp */}
        {message.timestamp && (
          <span
            className="text-[10px] px-1 select-none"
            style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
          >
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </motion.div>
  );
});

ChatMessage.displayName = 'ChatMessage';
export default ChatMessage;