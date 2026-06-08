'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLang } from '@/app/providers';
import { t } from '@/lib/i18n';

export function HeroSection() {
  const { lang } = useLang();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: '640px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Background Image */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/images/hero-inkwash-landscape.jpg"
          alt="Shanshui ink wash landscape — the world of Gyllene Kuben"
          fill
          priority
          quality={90}
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          sizes="100vw"
          onLoad={() => setLoaded(true)}
        />
        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--gradient-hero)',
          }}
        />
        {/* Subtle vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem 5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--accent-gold)',
          }}
        >
          www.gyllenekuben.se — Est. MMXXIV
        </motion.p>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={loaded ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            transformOrigin: 'left',
            width: '48px',
            height: '1px',
            background: 'var(--gradient-accent)',
          }}
        />

        {/* Main Title */}
        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '110%' }}
            animate={loaded ? { y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(3rem, 8vw, 7.5rem)',
              fontWeight: 300,
              lineHeight: 1.0,
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
            }}
          >
            {t('hero.tagline', lang)}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            lineHeight: 1.6,
          }}
        >
          {t('hero.subtitle', lang)}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}
        >
          <a href="#curated" className="btn-primary">
            {t('hero.cta', lang)}
          </a>
          <a href="/kollektioner" className="btn-ghost">
            {t('common.explore', lang)}
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.a
        href="#curated"
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          textDecoration: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            writingMode: 'vertical-rl',
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{ color: 'var(--accent-gold)', opacity: 0.7 }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </motion.a>
    </section>
  );
}
