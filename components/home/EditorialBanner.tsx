'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useLang } from '@/app/providers';
import { getPublishedJournalPosts } from '@/lib/data';

export function EditorialBanner() {
  const { lang } = useLang();
  const posts = getPublishedJournalPosts();
  // Feature the first published post
  const featured = posts[0];
  if (!featured) return null;

  const title   = lang === 'sv' ? featured.titleSv   : featured.titleEn;
  const excerpt = lang === 'sv' ? featured.excerptSv : featured.excerptEn;

  return (
    <section
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0',
        overflow: 'hidden',
      }}
    >
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Section eyebrow */}
          <div style={{ padding: '3rem 0 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BookOpen size={14} style={{ color: 'var(--accent-gold)' }} />
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                {lang === 'sv' ? 'Från Kulturjournalen' : 'From the Cultural Journal'}
              </p>
            </div>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <Link
              href="/journal"
              style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'color 0.3s', whiteSpace: 'nowrap' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
            >
              {lang === 'sv' ? 'Alla artiklar' : 'All articles'} <ArrowRight size={11} />
            </Link>
          </div>

          {/* Wide editorial card */}
          <BannerCard
            href={`/journal/${featured.slug}`}
            coverImage={featured.coverImage}
            tag={featured.tag}
            title={title}
            excerpt={excerpt.length > 200 ? excerpt.slice(0, 200) + '…' : excerpt}
            readingTimeMin={featured.readingTimeMin}
            lang={lang}
          />

          {/* Secondary posts — 2-col strip below */}
          {posts.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', padding: '2rem 0 3.5rem' }}>
              {posts.slice(1, 3).map((post) => {
                const t = lang === 'sv' ? post.titleSv : post.titleEn;
                return (
                  <Link
                    key={post.id}
                    href={`/journal/${post.slug}`}
                    style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.1rem', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', textDecoration: 'none', transition: 'border-color 0.3s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-primary)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; }}
                  >
                    <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0, overflow: 'hidden' }}>
                      <Image src={post.coverImage} alt={t} fill style={{ objectFit: 'cover' }} sizes="64px" />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '0.3rem' }}>{post.tag}</p>
                      <h4 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{t}</h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function BannerCard({
  href, coverImage, tag, title, excerpt, readingTimeMin, lang,
}: {
  href: string; coverImage: string; tag?: string; title: string;
  excerpt: string; readingTimeMin: number; lang: 'sv' | 'en';
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'var(--border-primary)' : 'var(--border-subtle)'}`,
        textDecoration: 'none',
        transition: 'border-color 0.4s, box-shadow 0.4s',
        boxShadow: hovered ? 'var(--shadow-gold)' : 'none',
      }}
    >
      {/* Image side */}
      <div style={{ position: 'relative', paddingBottom: '52%', overflow: 'hidden' }}>
        <motion.div
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Image src={coverImage} alt={title} fill style={{ objectFit: 'cover' }} sizes="55vw" />
        </motion.div>
        {tag && (
          <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem' }}>
            <span style={{ background: 'var(--accent-gold)', color: 'var(--bg-primary)', fontFamily: 'var(--font-inter)', fontSize: '0.52rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '0.2rem 0.55rem', fontWeight: 600 }}>{tag}</span>
          </div>
        )}
      </div>

      {/* Text side */}
      <div style={{ background: 'var(--bg-card)', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.3rem, 2.2vw, 2rem)', fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '0.01em' }}>
            {title}
          </h3>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {excerpt}
          </p>
        </div>
        <motion.div
          animate={{ x: hovered ? 4 : 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.75rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-inter)', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}
        >
          {lang === 'sv' ? 'Läs artikel' : 'Read article'} <ArrowRight size={12} />
        </motion.div>
      </div>
    </Link>
  );
}
