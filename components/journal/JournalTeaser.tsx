'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { useLang } from '@/app/providers';
import type { JournalPost } from '@/lib/types';

interface Props {
  post: JournalPost;
  /** compact = inlined in a PDP tab; default = homepage banner style */
  variant?: 'compact' | 'banner';
}

export function JournalTeaser({ post, variant = 'compact' }: Props) {
  const { lang } = useLang();
  const title   = lang === 'sv' ? post.titleSv   : post.titleEn;
  const excerpt = lang === 'sv' ? post.excerptSv : post.excerptEn;
  const [hovered, setHovered] = React.useState(false);

  if (variant === 'compact') {
    return (
      <Link
        href={`/journal/${post.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr',
          gap: '1.25rem',
          padding: '1.25rem',
          border: `1px solid ${hovered ? 'var(--border-primary)' : 'var(--border-subtle)'}`,
          background: 'var(--bg-secondary)',
          textDecoration: 'none',
          transition: 'border-color 0.3s',
          marginTop: '2rem',
        }}
      >
        {/* Thumbnail */}
        <div style={{ position: 'relative', width: '100px', paddingBottom: '75px', flexShrink: 0, overflow: 'hidden' }}>
          <Image
            src={post.coverImage}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="100px"
          />
        </div>
        {/* Text */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <BookOpen size={10} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
              {lang === 'sv' ? 'Relaterad artikel' : 'Related article'}
            </span>
          </div>
          <h4 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '0.4rem' }}>
            {title}
          </h4>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', color: 'var(--text-muted)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {excerpt}
          </p>
          <motion.div
            animate={{ x: hovered ? 3 : 0 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.6rem', fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}
          >
            {lang === 'sv' ? 'Läs artikel' : 'Read article'} <ArrowRight size={9} />
          </motion.div>
        </div>
      </Link>
    );
  }

  // Banner variant (used on homepage)
  return (
    <Link
      href={`/journal/${post.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'var(--border-primary)' : 'var(--border-subtle)'}`,
        textDecoration: 'none',
        transition: 'border-color 0.4s',
      }}
    >
      <div style={{ position: 'relative', paddingBottom: '55%', overflow: 'hidden' }}>
        <motion.div animate={{ scale: hovered ? 1.04 : 1 }} transition={{ duration: 0.8 }} style={{ position: 'absolute', inset: 0 }}>
          <Image src={post.coverImage} alt={title} fill style={{ objectFit: 'cover' }} sizes="50vw" />
        </motion.div>
      </div>
      <div style={{ background: 'var(--bg-card)', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
          {lang === 'sv' ? 'Kulturjournal' : 'Cultural Journal'}
        </p>
        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {title}
        </h3>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          {excerpt.length > 140 ? excerpt.slice(0, 140) + '…' : excerpt}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)', fontSize: '0.6rem' }}>
            <Clock size={10} /> {post.readingTimeMin} min
          </div>
          <motion.div animate={{ x: hovered ? 4 : 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-inter)', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {lang === 'sv' ? 'Läs mer' : 'Read more'} <ArrowRight size={11} />
          </motion.div>
        </div>
      </div>
    </Link>
  );
}
