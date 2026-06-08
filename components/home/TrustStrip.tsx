'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Truck, CreditCard, RotateCcw, Award } from 'lucide-react';
import { useLang } from '@/app/providers';
import { t } from '@/lib/i18n';

const trustItems = [
  { key: 'section.trust.handmade' as const, icon: Star },
  { key: 'section.trust.shipping' as const, icon: Truck },
  { key: 'section.trust.payment' as const, icon: CreditCard },
  { key: 'section.trust.returns' as const, icon: RotateCcw },
  { key: 'section.trust.heritage' as const, icon: Award },
];

export function TrustStrip() {
  const { lang } = useLang();

  // Duplicate items for seamless infinite scroll
  const allItems = [...trustItems, ...trustItems, ...trustItems];

  return (
    <section
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1.25rem 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left fade */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: 'linear-gradient(to right, var(--bg-secondary), transparent)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
      {/* Right fade */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: 'linear-gradient(to left, var(--bg-secondary), transparent)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{
          duration: 28,
          ease: 'linear',
          repeat: Infinity,
        }}
        style={{
          display: 'flex',
          gap: '3.5rem',
          width: 'max-content',
        }}
      >
        {allItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <Icon
                size={12}
                style={{ color: 'var(--accent-gold)', flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.65rem',
                  fontWeight: 400,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                }}
              >
                {t(item.key, lang)}
              </span>

              {/* Dot separator */}
              <span
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: 'var(--accent-gold)',
                  opacity: 0.4,
                  marginLeft: '0.5rem',
                }}
              />
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
