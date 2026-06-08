'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Minus, ShoppingBag, Share2, Heart,
  Ruler, Weight, MapPin, Clock, User, Leaf,
} from 'lucide-react';
import { useLang, useCart } from '@/app/providers';
import { t, formatPrice } from '@/lib/i18n';
import { getJournalForProduct } from '@/lib/data';
import { JournalTeaser } from '@/components/journal/JournalTeaser';
import type { Product, Category } from '@/lib/types';

type Tab = 'object' | 'artisan' | 'ritual';

interface Props {
  product: Product & { category?: Category };
  related: Product[];
}

export function ProductDetailPageClient({ product, related }: Props) {
  const { lang } = useLang();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>('object');
  const [activeImage, setActiveImage] = useState(0);
  const [addedFlash, setAddedFlash] = useState(false);

  const name = lang === 'sv' ? product.nameSv : product.nameEn;
  const desc = lang === 'sv' ? product.descSv : product.descEn;
  const categoryName = product.category
    ? lang === 'sv' ? product.category.nameSv : product.category.nameEn
    : '';
  const categorySlug = product.category?.slug ?? '';

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) addItem(product);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1800);
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'object',  label: t('product.tab.object', lang) },
    { key: 'artisan', label: t('product.tab.artisan', lang) },
    { key: 'ritual',  label: t('product.tab.ritual', lang) },
  ];

  const images = product.images.length > 0 ? product.images : ['/images/placeholder.jpg'];

  return (
    <>
      {/* ── Breadcrumb ────────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: '72px',
          padding: '1.25rem 2.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link href="/" style={breadcrumbStyle}>Gyllene Kuben</Link>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>/</span>
          <Link href={`/kollektioner/${categorySlug}`} style={breadcrumbStyle}>{categoryName}</Link>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>/</span>
          <span style={{ ...breadcrumbStyle, color: 'var(--text-primary)', cursor: 'default' }}>{name}</span>
        </div>
      </div>

      {/* ── Main PDP layout ──────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--bg-primary)',
          padding: '3.5rem 2.5rem 6rem',
        }}
      >
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '5rem',
            alignItems: 'start',
          }}
        >
          {/* ── LEFT — Image Gallery ──────────────────────────────────── */}
          <div>
            {/* Main image */}
            <motion.div
              layoutId={`product-${product.id}`}
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '100%',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <Image
                    src={images[activeImage]}
                    alt={name}
                    fill
                    priority
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Limited edition stamp */}
              {product.isLimitedEdition && (
                <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem' }}>
                  <span className="badge-gold">{t('product.limited', lang)}</span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail strip (if multiple images) */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      position: 'relative',
                      width: '72px',
                      height: '72px',
                      flexShrink: 0,
                      overflow: 'hidden',
                      border: `1px solid ${i === activeImage ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      background: 'none',
                      padding: 0,
                      transition: 'border-color 0.3s',
                    }}
                  >
                    <Image src={src} alt={`${name} ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="72px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT — Product Info ──────────────────────────────────── */}
          <div style={{ position: 'sticky', top: '100px' }}>
            {/* Back link */}
            <Link
              href={`/kollektioner/${categorySlug}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-inter)', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.5rem', transition: 'color 0.3s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
            >
              <ArrowLeft size={10} /> {categoryName}
            </Link>

            {/* Category eyebrow */}
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
              {categoryName}
              {product.kilnOrigin && ` — ${product.kilnOrigin}`}
            </p>

            {/* Product name */}
            <h1
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 300,
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                letterSpacing: '0.01em',
                marginBottom: '0.5rem',
              }}
            >
              {name}
            </h1>

            {/* Dynasty / era */}
            {product.dynastyEra && (
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
                {product.dynastyEra}
              </p>
            )}

            {/* Divider */}
            <div style={{ width: '40px', height: '1px', background: 'var(--gradient-accent)', marginBottom: '1.5rem' }} />

            {/* Short description */}
            {desc && (
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
                {desc}
              </p>
            )}

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', color: 'var(--accent-gold)' }}>
                {formatPrice(product.priceOre, lang)}
              </span>
              {product.compareAtOre && (
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {formatPrice(product.compareAtOre, lang)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: product.stockQty > 3 ? '#4caf7d' : product.stockQty > 0 ? 'var(--accent-gold)' : 'var(--accent-red)' }} />
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                {product.stockQty > 3
                  ? t('product.stock.instock', lang)
                  : product.stockQty > 0
                  ? t('product.stock.low', lang)
                  : t('product.stock.out', lang)}
              </span>
            </div>

            {/* Quantity + Add to cart */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              {/* Qty stepper */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-primary)' }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{ width: '40px', height: '48px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Minus size={13} />
                </button>
                <span style={{ width: '36px', textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stockQty, q + 1))}
                  style={{ width: '40px', height: '48px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Add to cart */}
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stockQty === 0}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', gap: '0.6rem', fontSize: '0.72rem', opacity: product.stockQty === 0 ? 0.5 : 1 }}
              >
                <ShoppingBag size={14} />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={addedFlash ? 'added' : 'add'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {addedFlash
                      ? (lang === 'sv' ? '✓ Tillagd!' : '✓ Added!')
                      : t('product.add', lang)}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Wishlist + Share */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', gap: '0.4rem', padding: '0.6rem 1rem', fontSize: '0.65rem' }}>
                <Heart size={13} /> {t('product.wishlist', lang)}
              </button>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', gap: '0.4rem', padding: '0.6rem 1rem', fontSize: '0.65rem' }}>
                <Share2 size={13} /> {t('product.share', lang)}
              </button>
            </div>

            {/* ── 3-Tab Information System ─────────────────────────── */}
            <div>
              {/* Tab headers */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
                {tabs.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    style={{
                      flex: 1,
                      padding: '0.9rem 0.5rem',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `2px solid ${activeTab === key ? 'var(--accent-gold)' : 'transparent'}`,
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: activeTab === key ? 'var(--accent-gold)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'color 0.3s, border-color 0.3s',
                      marginBottom: '-1px',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab panels */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {activeTab === 'object' && (
                    <ObjectTab product={product} lang={lang} />
                  )}
                  {activeTab === 'artisan' && (
                    <ArtisanTab product={product} lang={lang} />
                  )}
                  {activeTab === 'ritual' && (
                    <RitualTab product={product} lang={lang} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Related Products ──────────────────────────────────────── */}
        {related.length > 0 && (
          <div style={{ maxWidth: '1320px', margin: '6rem auto 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '0.03em' }}>
                {t('product.related', lang)}
              </h2>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}
            >
              {related.slice(0, 4).map((p) => (
                <motion.div
                  key={p.id}
                  variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
                >
                  <RelatedCard product={p} categorySlug={categorySlug} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Tab: The Object ───────────────────────────────────────────────────────────

function ObjectTab({ product, lang }: { product: Product; lang: 'sv' | 'en' }) {
  const materials = lang === 'sv' ? product.materialsSv : product.materialsEn;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {materials && (
        <TabRow icon={<Leaf size={13} />} label={t('product.materials', lang)} value={materials} />
      )}
      {product.dimensionsCm && (
        <TabRow icon={<Ruler size={13} />} label={t('product.dimensions', lang)} value={product.dimensionsCm} />
      )}
      {product.weightGrams && (
        <TabRow icon={<Weight size={13} />} label={t('product.weight', lang)} value={`${product.weightGrams}g`} />
      )}
    </div>
  );
}

// ─── Tab: The Artisan & Provenance ────────────────────────────────────────────

function ArtisanTab({ product, lang }: { product: Product; lang: 'sv' | 'en' }) {
  const artisanName  = lang === 'sv' ? product.artisanNameSv : product.artisanNameEn;
  const heritage     = lang === 'sv' ? product.heritageSv    : product.heritageEn;
  const journalPost  = getJournalForProduct(product.slug);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {artisanName && (
        <TabRow icon={<User size={13} />} label={t('product.artisan', lang)} value={artisanName} />
      )}
      {product.kilnOrigin && (
        <TabRow icon={<MapPin size={13} />} label={t('product.origin', lang)} value={product.kilnOrigin} />
      )}
      {product.dynastyEra && (
        <TabRow icon={<Clock size={13} />} label={t('product.era', lang)} value={product.dynastyEra} />
      )}
      {heritage && (
        <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            {heritage}
          </p>
        </div>
      )}
      {/* ── Journal cross-link ─────────────────────────────────────── */}
      {journalPost && (
        <JournalTeaser post={journalPost} variant="compact" />
      )}
    </div>
  );
}

// ─── Tab: The Ritual ──────────────────────────────────────────────────────────

function RitualTab({ product, lang }: { product: Product; lang: 'sv' | 'en' }) {
  const ritual = lang === 'sv' ? product.ritualSv : product.ritualEn;
  if (!ritual) return <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-inter)', fontSize: '0.85rem' }}>—</p>;
  // Split on numbered lines for step formatting
  const steps = ritual.split(/\n/).filter(Boolean);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
          style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
        >
          <div style={{ width: '24px', height: '24px', flexShrink: 0, border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', color: 'var(--accent-gold)' }}>{String(i + 1).padStart(2, '0')}</span>
          </div>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.65, paddingTop: '0.15rem' }}>
            {step.replace(/^\d+\.\s*/, '')}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Tab Row Helper ───────────────────────────────────────────────────────────

function TabRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1rem', alignItems: 'start', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
        {icon}
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{value}</span>
    </div>
  );
}

// ─── Related Card ─────────────────────────────────────────────────────────────

function RelatedCard({ product, categorySlug }: { product: Product; categorySlug: string }) {
  const { lang } = useLang();
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const name = lang === 'sv' ? product.nameSv : product.nameEn;
  return (
    <Link
      href={`/kollektioner/${categorySlug}/${product.slug}`}
      className="card"
      style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', overflow: 'hidden' }}>
        <motion.div animate={{ scale: hovered ? 1.04 : 1 }} transition={{ duration: 0.7 }} style={{ position: 'absolute', inset: 0 }}>
          <Image src={product.images[0] || '/images/placeholder.jpg'} alt={name} fill style={{ objectFit: 'cover' }} sizes="25vw" />
        </motion.div>
      </div>
      <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{name}</h3>
        <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', color: 'var(--accent-gold)', marginTop: 'auto' }}>{formatPrice(product.priceOre, lang)}</span>
      </div>
    </Link>
  );
}

// ─── Style helpers ────────────────────────────────────────────────────────────

const breadcrumbStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '0.62rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  textDecoration: 'none',
  transition: 'color 0.3s',
};
