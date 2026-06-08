'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { useLang } from '@/app/providers';
import type { JournalPost } from '@/lib/types';

interface Props {
  posts: JournalPost[];
}

export function JournalIndexClient({ posts }: Props) {
  const { lang } = useLang();

  return (
    <>
      {/* ── Journal Hero ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          height: '52vh',
          minHeight: '340px',
          overflow: 'hidden',
          marginTop: '72px',
        }}
      >
        <Image
          src="/images/journal-editorial-banner.jpg"
          alt="Kulturjournal"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-hero)' }} />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '3rem 2.5rem',
            maxWidth: '1320px',
            margin: '0 auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
              {lang === 'sv' ? 'Kulturjournal' : 'Cultural Journal'}
            </p>
            <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '0.01em', lineHeight: 1.08 }}>
              {lang === 'sv' ? 'Essäer & Arv' : 'Essays & Heritage'}
            </h1>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-secondary)', maxWidth: '460px', marginTop: '0.75rem', lineHeight: 1.7 }}>
              {lang === 'sv'
                ? 'Djupdykningar i östasiatisk konsthistoria, tekonstens filosofi och den levande arvskedjan.'
                : 'Deep dives into East Asian art history, the philosophy of tea, and the living chain of heritage.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Article Grid ────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-primary)', padding: '5rem 2.5rem 8rem' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>

          {/* Feature article — first post, full width */}
          {posts[0] && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ marginBottom: '4rem' }}
            >
              <FeaturedArticleCard post={posts[0]} lang={lang} />
            </motion.div>
          )}

          {/* Divider with label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3.5rem' }}>
            <div style={{ height: '1px', background: 'var(--border-subtle)', flex: 1 }} />
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {lang === 'sv' ? 'Fler artiklar' : 'More articles'}
            </p>
            <div style={{ height: '1px', background: 'var(--border-subtle)', flex: 1 }} />
          </div>

          {/* Remaining articles — 3-column grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}
          >
            {posts.slice(1).map((post) => (
              <motion.div
                key={post.id}
                variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
              >
                <ArticleCard post={post} lang={lang} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

// ─── Featured Article Card (full-width) ───────────────────────────────────────

function FeaturedArticleCard({ post, lang }: { post: JournalPost; lang: 'sv' | 'en' }) {
  const title = lang === 'sv' ? post.titleSv : post.titleEn;
  const excerpt = lang === 'sv' ? post.excerptSv : post.excerptEn;
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      href={`/journal/${post.slug}`}
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', textDecoration: 'none', border: '1px solid var(--border-subtle)', overflow: 'hidden', transition: 'border-color 0.4s', borderColor: hovered ? 'var(--border-primary)' : 'var(--border-subtle)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden' }}>
        <motion.div
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Image src={post.coverImage} alt={title} fill style={{ objectFit: 'cover' }} sizes="50vw" />
        </motion.div>
        {/* Tag */}
        <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem' }}>
          <span style={{ background: 'var(--accent-gold)', color: 'var(--bg-primary)', fontFamily: 'var(--font-inter)', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', fontWeight: 600 }}>
            {post.tag}
          </span>
        </div>
      </div>
      {/* Content */}
      <div style={{ background: 'var(--bg-card)', padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '1.25rem' }}>
            {lang === 'sv' ? 'Redaktörens val' : "Editor's pick"} · {post.publishedAt}
          </p>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            {title}
          </h2>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
            {excerpt}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)', fontSize: '0.62rem' }}>
            <Clock size={11} />
            {post.readingTimeMin} {lang === 'sv' ? 'min läsning' : 'min read'}
          </div>
          <motion.div
            animate={{ x: hovered ? 4 : 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-inter)', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}
          >
            {lang === 'sv' ? 'Läs artikel' : 'Read article'} <ArrowRight size={12} />
          </motion.div>
        </div>
      </div>
    </Link>
  );
}

// ─── Standard Article Card ────────────────────────────────────────────────────

function ArticleCard({ post, lang }: { post: JournalPost; lang: 'sv' | 'en' }) {
  const title = lang === 'sv' ? post.titleSv : post.titleEn;
  const excerpt = lang === 'sv' ? post.excerptSv : post.excerptEn;
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      href={`/journal/${post.slug}`}
      className="card"
      style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '58%', overflow: 'hidden', flexShrink: 0 }}>
        <motion.div
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Image src={post.coverImage} alt={title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" />
        </motion.div>
        <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
          <span style={{ background: 'var(--accent-gold)', color: 'var(--bg-primary)', fontFamily: 'var(--font-inter)', fontSize: '0.52rem', letterSpacing: '0.16em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', fontWeight: 600 }}>
            {post.tag}
          </span>
        </div>
      </div>
      {/* Body */}
      <div style={{ flex: 1, padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {post.publishedAt}
        </p>
        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '0.75rem', flex: 1 }}>
          {title}
        </h3>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {excerpt}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)', fontSize: '0.6rem' }}>
            <BookOpen size={10} />
            {post.readingTimeMin} min
          </div>
          <motion.span
            animate={{ x: hovered ? 3 : 0 }}
            style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-inter)', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            {lang === 'sv' ? 'Läs' : 'Read'} <ArrowRight size={10} />
          </motion.span>
        </div>
      </div>
    </Link>
  );
}
