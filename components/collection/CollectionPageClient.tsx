'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useLang, useCart } from '@/app/providers';
import { t, formatPrice } from '@/lib/i18n';
import type { Category, Product } from '@/lib/types';

type SortKey = 'newest' | 'price.asc' | 'price.desc';

interface Props {
  category: Category;
  products: Product[];
}

export function CollectionPageClient({ category, products }: Props) {
  const { lang } = useLang();
  const [sort, setSort] = useState<SortKey>('newest');
  const [sortOpen, setSortOpen] = useState(false);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price.asc') return a.priceOre - b.priceOre;
    if (sort === 'price.desc') return b.priceOre - a.priceOre;
    return b.id - a.id;
  });

  const categoryName = lang === 'sv' ? category.nameSv : category.nameEn;
  const categoryDesc = lang === 'sv' ? category.descSv : category.descEn;

  const sortLabels: Record<SortKey, string> = {
    newest: t('collection.sort.newest', lang),
    'price.asc': t('collection.sort.price.asc', lang),
    'price.desc': t('collection.sort.price.desc', lang),
  };

  return (
    <>
      {/* ── Collection Hero Banner ────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          height: '55vh',
          minHeight: '360px',
          overflow: 'hidden',
          marginTop: '72px', // header height offset
        }}
      >
        {category.imageUrl && (
          <Image
            src={category.imageUrl}
            alt={categoryName}
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
            sizes="100vw"
          />
        )}
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--gradient-hero)',
          }}
        />
        {/* Text */}
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.65rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '1.25rem',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
            >
              <ArrowLeft size={11} /> {t('common.back', lang)}
            </Link>
            <h1
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                fontWeight: 300,
                color: 'var(--text-primary)',
                letterSpacing: '0.01em',
                lineHeight: 1.1,
              }}
            >
              {categoryName}
            </h1>
            {categoryDesc && (
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '1.05rem',
                  fontStyle: 'italic',
                  color: 'var(--text-secondary)',
                  maxWidth: '520px',
                  marginTop: '0.75rem',
                  lineHeight: 1.65,
                }}
              >
                {categoryDesc}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.9rem 2.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Count */}
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
            }}
          >
            {t('collection.showing', lang)}{' '}
            <span style={{ color: 'var(--text-primary)' }}>{sorted.length}</span>{' '}
            {t('collection.results', lang)}
          </p>

          {/* Sort dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setSortOpen((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.9rem',
                background: 'transparent',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              <SlidersHorizontal size={11} />
              {sortLabels[sort]}
              <ChevronDown size={11} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    right: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-primary)',
                    zIndex: 50,
                    minWidth: '200px',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => { setSort(key); setSortOpen(false); }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        background: sort === key ? 'rgba(212,175,55,0.08)' : 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--border-subtle)',
                        color: sort === key ? 'var(--accent-gold)' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.68rem',
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                      }}
                    >
                      {sortLabels[key]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Product Grid ─────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--bg-primary)',
          padding: '3.5rem 2.5rem 7rem',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          {sorted.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '6rem 0',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.3rem',
              }}
            >
              {t('collection.empty', lang)}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '2rem',
                alignItems: 'stretch',
              }}
            >
              {sorted.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
                  }}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <CollectionProductCard product={product} categorySlug={category.slug} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

// ─── Collection Product Card ───────────────────────────────────────────────────

function CollectionProductCard({
  product,
  categorySlug,
}: {
  product: Product;
  categorySlug: string;
}) {
  const { lang } = useLang();
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);

  const name = lang === 'sv' ? product.nameSv : product.nameEn;
  const href = `/kollektioner/${categorySlug}/${product.slug}`;

  return (
    <motion.div
      className="card"
      layoutId={`product-${product.id}`}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ borderColor: hovered ? 'var(--border-primary)' : 'var(--border-subtle)' }}
    >
      {/* Image */}
      <Link href={href} style={{ display: 'block', position: 'relative', width: '100%', paddingBottom: '75%', flexShrink: 0, overflow: 'hidden' }}>
        <motion.div
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Image
            src={product.images[0] || '/images/placeholder.jpg'}
            alt={name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>
        {product.isLimitedEdition && (
          <div style={{ position: 'absolute', top: '0.875rem', left: '0.875rem' }}>
            <span className="badge-gold">{t('product.limited', lang)}</span>
          </div>
        )}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
          transition={{ duration: 0.25 }}
          style={{ position: 'absolute', bottom: '0.875rem', left: '0.875rem', right: '0.875rem' }}
        >
          <button
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.63rem' }}
          >
            {t('product.add', lang)}
          </button>
        </motion.div>
      </Link>

      {/* Details */}
      <Link href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.1rem 1.1rem 1.3rem', textDecoration: 'none' }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.kilnOrigin ?? ''}
        </p>
        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.35, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {name}
        </h3>
        <div style={{ marginTop: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
            <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.25rem', color: 'var(--accent-gold)' }}>
              {formatPrice(product.priceOre, lang)}
            </span>
          </div>
          <div style={{ minHeight: '1.4rem', marginTop: '0.3rem' }}>
            {product.stockQty <= 3 && product.stockQty > 0 && (
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.1em', color: 'var(--accent-red)', textTransform: 'uppercase' }}>
                {t('product.stock.low', lang)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
