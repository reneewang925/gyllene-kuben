'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang, useCart } from '@/app/providers';
import { t, formatPrice } from '@/lib/i18n';
import { categories, featuredProducts } from '@/lib/data';
import type { Category } from '@/lib/types';

// ─── Animation Variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' as const },
  },
};

// ─── Main Grid Component ───────────────────────────────────────────────────────

export function CategoryGrid() {
  const { lang } = useLang();

  // Split categories into left and right columns for the staggered 2-col layout.
  // Left column: indices 0, 2, 4  |  Right column: indices 1, 3
  // The right column is pushed down by a fixed offset to create the elegant
  // "错落有致" (staggered / curated gallery) feel.
  const leftCol  = categories.filter((_, i) => i % 2 === 0);  // [0,2,4]
  const rightCol = categories.filter((_, i) => i % 2 !== 0);  // [1,3]

  return (
    <section
      id="curated"
      className="section-padding"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="container-narrow">

        {/* ── Section Header ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: 'center',
            marginBottom: '4.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.65rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
            }}
          >
            {lang === 'sv' ? 'Samlingar' : 'Collections'}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 300,
              color: 'var(--text-primary)',
              letterSpacing: '0.02em',
            }}
          >
            {t('section.curated.title', lang)}
          </h2>
          <div className="divider-gold" />
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.1rem',
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              maxWidth: '440px',
              lineHeight: 1.7,
            }}
          >
            {t('section.curated.subtitle', lang)}
          </p>
        </motion.div>

        {/* ── Staggered 2-Column Category Gallery ──────────────────────── */}
        {/*
          The right column is offset downward by ~10% of the card height.
          This creates the "错落有致" staggered gallery feel —
          columns are aligned but not in lockstep, giving an editorial,
          curated look rather than a rigid grid.

          Each card uses a uniform aspect-[4/3] ratio so all images
          are precisely the same size regardless of source dimensions.
        */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.75rem',
            alignItems: 'start',
          }}
        >
          {/* Left column — no offset */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {leftCol.map((cat) => (
              <motion.div key={cat.id} variants={cardVariants}>
                <CategoryCard category={cat} index={categories.indexOf(cat)} />
              </motion.div>
            ))}
          </div>

          {/* Right column — offset downward for staggered feel */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              // This is the key stagger offset: push the right column down
              // by roughly one-third of a card's height for a gallery cadence
              marginTop: 'calc(4/3 * (50vw - 3.5rem) * 0.33)',
            }}
          >
            {rightCol.map((cat) => (
              <motion.div key={cat.id} variants={cardVariants}>
                <CategoryCard category={cat} index={categories.indexOf(cat)} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Featured Products Row ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: '6rem' }}
        >
          {/* Row header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                fontWeight: 400,
                color: 'var(--text-primary)',
                letterSpacing: '0.04em',
              }}
            >
              {lang === 'sv' ? 'Utvalda Verk' : 'Featured Works'}
            </h3>
            <a
              href="/kollektioner"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.65rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'gap 0.3s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.gap = '0.8rem'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.gap = '0.4rem'; }}
            >
              {t('common.explore', lang)} <ArrowRight size={12} />
            </a>
          </div>

          {/*
            Product grid: fixed 5-column layout (or fewer on mobile).
            Each card uses h-full flex-col so all zones stretch uniformly:
              ┌──────────────────┐
              │  Image (4:3)     │  ← fixed aspect ratio
              │──────────────────│
              │  Category tag    │  ← fixed min-height row
              │  Title           │  ← flex-1 grows, pushes price to bottom
              │  Price           │  ← always at the same baseline
              │  Stock note      │  ← fixed min-height slot (empty = invisible)
              └──────────────────┘
          */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1.5rem',
              alignItems: 'stretch',
            }}
          >
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={cardVariants}
                style={{
                  // Make every grid cell the same height via stretch
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

// ─── Category Card ─────────────────────────────────────────────────────────────
//  Uniform aspect-[4/3] enforced via paddingBottom trick.
//  This guarantees every card is exactly the same height
//  regardless of the source image dimensions.

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const { lang } = useLang();
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`/kollektioner/${category.slug}`}
      style={{
        display: 'block',
        position: 'relative',
        // Enforce uniform 4:3 aspect ratio using a padding-bottom trick
        // so all cards have identical dimensions regardless of content
        width: '100%',
        paddingBottom: 'calc(100% * 3/4)',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--border-subtle)',
        textDecoration: 'none',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image with Ken Burns zoom on hover ─────────────────────── */}
      <motion.div
        animate={{ scale: hovered ? 1.06 : 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'absolute', inset: 0 }}
      >
        {category.imageUrl && (
          <Image
            src={category.imageUrl}
            alt={lang === 'sv' ? category.nameSv : category.nameEn}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </motion.div>

      {/* ── Dark gradient scrim ─────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--gradient-card)',
          transition: 'opacity 0.4s ease',
          opacity: hovered ? 0.96 : 0.72,
        }}
      />

      {/* ── Gold border glow on hover ───────────────────────────────── */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: 'absolute',
          inset: 0,
          border: '1px solid var(--accent-gold)',
          boxShadow: 'inset 0 0 24px rgba(212,175,55,0.08)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Text content ───────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.75rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {/* Index ordinal */}
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.58rem',
            letterSpacing: '0.22em',
            color: 'var(--accent-gold)',
            opacity: 0.65,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Category name */}
        <h3
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1.25rem, 2.2vw, 1.6rem)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            letterSpacing: '0.03em',
            lineHeight: 1.2,
          }}
        >
          {lang === 'sv' ? category.nameSv : category.nameEn}
        </h3>

        {/* Description — reveals on hover */}
        <motion.p
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            maxWidth: '320px',
          }}
        >
          {lang === 'sv' ? category.descSv : category.descEn}
        </motion.p>

        {/* Explore CTA — reveals on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -10 }}
          transition={{ duration: 0.35, delay: 0.04 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.35rem',
          }}
        >
          <div style={{ width: '20px', height: '1px', background: 'var(--accent-gold)' }} />
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.58rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
            }}
          >
            {lang === 'sv' ? 'Utforska' : 'Explore'}
          </span>
        </motion.div>
      </div>
    </a>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────
//  Full-height flex column layout with three fixed zones:
//   [IMAGE ZONE]  — fixed aspect-[4/3], never varies
//   [BODY ZONE]   — flex-1, grows to fill remaining space
//     ├ category + origin tag  — fixed slot at top of body
//     ├ product title           — flex-1, allows multi-line without breaking layout
//     └ [FOOTER ZONE]          — always pinned to bottom of body
//         ├ price row
//         └ stock warning slot  — fixed min-height, empty if not needed

function ProductCard({ product }: { product: (typeof featuredProducts)[0] }) {
  const { lang } = useLang();
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);

  const name = lang === 'sv' ? product.nameSv : product.nameEn;
  const categorySlug = product.categoryId === 1 ? 'porslin'
    : product.categoryId === 2 ? 'bronskonst'
    : product.categoryId === 3 ? 'tekannor'
    : product.categoryId === 4 ? 'premium-te'
    : 'meditation';
  const href = `/kollektioner/${categorySlug}/${product.slug}`;

  return (
    <motion.div
      layoutId={`product-${product.id}`}
      className="card"
      style={{
        // h-full + flex-col so this card fills the grid cell height
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ borderColor: hovered ? 'var(--border-primary)' : 'var(--border-subtle)' }}
      transition={{ duration: 0.4 }}
    >
      {/* ── IMAGE ZONE — strictly fixed 4:3 aspect ratio ────────────── */}
      <a href={href} style={{ display: 'block', textDecoration: 'none' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: 'calc(100% * 3/4)',   // 4:3 ratio
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Image
            src={product.images[0] || '/images/placeholder.jpg'}
            alt={name}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </motion.div>

        {/* Limited Edition badge */}
        {product.isLimitedEdition && (
          <div style={{ position: 'absolute', top: '0.875rem', left: '0.875rem' }}>
            <span className="badge-gold">{t('product.limited', lang)}</span>
          </div>
        )}

        {/* Quick-add CTA slides up on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
          transition={{ duration: 0.28 }}
          style={{
            position: 'absolute',
            bottom: '0.875rem',
            left: '0.875rem',
            right: '0.875rem',
          }}
        >
          <button
            id={`add-to-cart-${product.id}`}
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.63rem' }}
          >
            {t('product.add', lang)}
          </button>
        </motion.div>
      </div>
      </a>

      {/* ── BODY ZONE — fills remaining card height ──────────────────── */}
      <div
        style={{
          flex: 1,               // grows to fill available height
          display: 'flex',
          flexDirection: 'column',
          padding: '1.1rem 1.1rem 1.3rem',
        }}
      >
        {/* Category + origin tag — fixed at top */}
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.58rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--accent-gold)',
            marginBottom: '0.5rem',
            // clamp to single line so it never causes height variance
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {lang === 'sv' ? product.category?.nameSv : product.category?.nameEn}
          {product.kilnOrigin && ` — ${product.kilnOrigin}`}
        </p>

        {/* Product title — flex-1 so it absorbs any height difference */}
        <h3
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.1rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.35,
            flex: 1,             // key: pushes price footer to bottom
            // Clamp to max 3 lines to prevent extreme height variance
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {name}
        </h3>

        {/* ── FOOTER ZONE — always at the bottom ──────────────────── */}
        <div style={{ marginTop: '0.85rem' }}>
          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.25rem',
                color: 'var(--accent-gold)',
              }}
            >
              {formatPrice(product.priceOre, lang)}
            </span>
            {product.compareAtOre && (
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through',
                }}
              >
                {formatPrice(product.compareAtOre, lang)}
              </span>
            )}
          </div>

          {/* Stock warning — fixed min-height slot so cards without it
              don't collapse and break horizontal alignment */}
          <div style={{ minHeight: '1.4rem', marginTop: '0.35rem' }}>
            {product.stockQty <= 3 && product.stockQty > 0 && (
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.1em',
                  color: 'var(--accent-red)',
                  textTransform: 'uppercase',
                }}
              >
                {lang === 'sv'
                  ? `Endast ${product.stockQty} kvar`
                  : `Only ${product.stockQty} left`}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
