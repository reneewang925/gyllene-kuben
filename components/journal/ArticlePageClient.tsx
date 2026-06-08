'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, ShoppingBag } from 'lucide-react';
import { useLang, useCart } from '@/app/providers';
import { formatPrice } from '@/lib/i18n';
import type { JournalPost, ContentBlock, Product } from '@/lib/types';

interface Props {
  post: JournalPost;
  relatedProducts: Product[];
}

export function ArticlePageClient({ post, relatedProducts }: Props) {
  const { lang } = useLang();
  const title   = lang === 'sv' ? post.titleSv   : post.titleEn;
  const excerpt = lang === 'sv' ? post.excerptSv : post.excerptEn;
  const author  = lang === 'sv' ? post.authorSv  : post.authorEn;

  return (
    <article style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '72px' }}>

      {/* ── Article Hero ─────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: '62vh', minHeight: '400px', overflow: 'hidden' }}>
        <Image
          src={post.coverImage}
          alt={title}
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-hero)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4rem 2.5rem', maxWidth: '860px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            {/* Breadcrumb */}
            <Link href="/journal" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-inter)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.5rem', transition: 'color 0.3s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
              <ArrowLeft size={10} /> {lang === 'sv' ? 'Kulturjournal' : 'Cultural Journal'}
            </Link>

            {/* Tag + reading time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              {post.tag && (
                <span style={{ background: 'var(--accent-gold)', color: 'var(--bg-primary)', fontFamily: 'var(--font-inter)', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', fontWeight: 600 }}>
                  {post.tag}
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)', fontSize: '0.6rem' }}>
                <Clock size={10} /> {post.readingTimeMin} {lang === 'sv' ? 'min läsning' : 'min read'}
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '0.01em', marginBottom: '1rem' }}>
              {title}
            </h1>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '640px' }}>
              {excerpt}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Meta bar ─────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '1rem 2.5rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            {author}
          </p>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
            {post.publishedAt}
          </p>
        </div>
      </div>

      {/* ── Article Body ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '4rem 2.5rem 6rem' }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {post.blocks.map((block, i) => (
            <motion.div
              key={block.id}
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
            >
              <RenderBlock block={block} lang={lang} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Featured Products row ─────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', padding: '4rem 2.5rem 6rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '0.03em' }}>
                {lang === 'sv' ? 'Nämnda i denna artikel' : 'Featured in this article'}
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {relatedProducts.map((product) => (
                <JournalProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

// ─── Block Renderer ───────────────────────────────────────────────────────────

function RenderBlock({ block, lang }: { block: ContentBlock; lang: 'sv' | 'en' }) {
  const text = lang === 'sv' ? block.textSv : block.textEn;

  switch (block.type) {
    case 'heading':
      if (block.level === 2) return (
        <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.2, margin: '3rem 0 1.25rem', letterSpacing: '0.01em' }}>
          {text}
        </h2>
      );
      return (
        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--text-primary)', margin: '2rem 0 1rem' }}>
          {text}
        </h3>
      );

    case 'paragraph':
      return (
        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '1.5rem', letterSpacing: '0.01em' }}>
          {text}
        </p>
      );

    case 'quote':
      return (
        <blockquote style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '2rem', margin: '2.5rem 0', position: 'relative' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6, letterSpacing: '0.01em' }}>
            {text}
          </p>
        </blockquote>
      );

    case 'image':
      return (
        <figure style={{ margin: '2.5rem 0' }}>
          <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <Image
              src={block.imageUrl!}
              alt={block.imageCaption ?? ''}
              fill
              style={{ objectFit: 'cover' }}
              sizes="860px"
            />
          </div>
          {block.imageCaption && (
            <figcaption style={{ fontFamily: 'var(--font-inter)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center', letterSpacing: '0.06em', lineHeight: 1.6 }}>
              {block.imageCaption}
            </figcaption>
          )}
        </figure>
      );

    case 'video':
      return (
        <figure style={{ margin: '2.5rem 0' }}>
          <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            {block.videoUrl && !block.videoUrl.includes('placeholder') ? (
              <iframe
                src={block.videoUrl}
                title={block.videoCaption ?? 'Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid var(--accent-gold)', marginLeft: '3px' }} />
                </div>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                  {block.videoCaption}
                </p>
              </div>
            )}
          </div>
          {block.videoCaption && !block.videoUrl?.includes('placeholder') && (
            <figcaption style={{ fontFamily: 'var(--font-inter)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center', letterSpacing: '0.06em' }}>
              {block.videoCaption}
            </figcaption>
          )}
        </figure>
      );

    case 'divider':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '3rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ width: '6px', height: '6px', background: 'var(--accent-gold)', transform: 'rotate(45deg)' }} />
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>
      );

    default:
      return null;
  }
}

// ─── Journal Product Card ─────────────────────────────────────────────────────

function JournalProductCard({ product }: { product: Product }) {
  const { lang } = useLang();
  const { addItem } = useCart();
  const [hovered, setHovered] = React.useState(false);
  const name = lang === 'sv' ? product.nameSv : product.nameEn;
  const categorySlug = product.categoryId === 1 ? 'porslin' : product.categoryId === 2 ? 'bronskonst' : product.categoryId === 3 ? 'tekannor' : product.categoryId === 4 ? 'premium-te' : 'meditation';

  return (
    <div
      className="card"
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/kollektioner/${categorySlug}/${product.slug}`} style={{ display: 'block', position: 'relative', paddingBottom: '75%', overflow: 'hidden', flexShrink: 0 }}>
        <motion.div animate={{ scale: hovered ? 1.04 : 1 }} transition={{ duration: 0.7 }} style={{ position: 'absolute', inset: 0 }}>
          <Image src={product.images[0] || '/images/placeholder.jpg'} alt={name} fill style={{ objectFit: 'cover' }} sizes="300px" />
        </motion.div>
      </Link>
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', color: 'var(--accent-gold)' }}>
            {formatPrice(product.priceOre, lang)}
          </span>
          <button
            onClick={() => addItem(product)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.7rem', background: 'var(--gradient-accent)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-primary)' }}
          >
            <ShoppingBag size={11} />
            {lang === 'sv' ? 'Lägg i korg' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
