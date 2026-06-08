'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, SlidersHorizontal, Package, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/i18n';
import type { Product, Category } from '@/lib/types';

interface Props {
  products: Product[];
  categories: Category[];
}

const TIER_COLORS: Record<string, string> = {
  limited: 'rgba(212,175,55,0.2)',
  normal: 'rgba(255,255,255,0.06)',
};

export function AdminProductsClient({ products: initial, categories }: Props) {
  const [products, setProducts] = useState<Product[]>(initial);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<'name' | 'price' | 'stock'>('name');

  const filtered = products
    .filter((p) =>
      (categoryFilter === 'all' || p.categoryId === categoryFilter) &&
      (p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
       p.nameSv.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortKey === 'price') return b.priceOre - a.priceOre;
      if (sortKey === 'stock') return a.stockQty - b.stockQty;
      return a.nameEn.localeCompare(b.nameEn);
    });

  function deleteProduct(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  }

  const statsData = [
    { label: 'Total Products', value: products.length, icon: <Package size={16} /> },
    { label: 'Limited Editions', value: products.filter((p) => p.isLimitedEdition).length, icon: <AlertCircle size={16} /> },
    { label: 'Low Stock (≤3)', value: products.filter((p) => p.stockQty > 0 && p.stockQty <= 3).length, icon: <AlertCircle size={16} /> },
    { label: 'Out of Stock', value: products.filter((p) => p.stockQty === 0).length, icon: <AlertCircle size={16} /> },
  ];

  return (
    <div style={{ padding: '2.5rem', color: '#f0ebe0', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, color: '#f0ebe0', letterSpacing: '0.02em', marginBottom: '0.3rem' }}>
            Produkthantering
          </h1>
          <p style={{ fontSize: '0.68rem', color: '#5a5550', letterSpacing: '0.06em' }}>
            Museum-grade product CRUD — The Object · The Artisan · The Ritual
          </p>
        </div>
        <Link
          href="/admin/products/new"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.4rem', background: 'linear-gradient(135deg, #a11d23, #d4af37)', color: '#f0ebe0', fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          <Plus size={13} /> Ny produkt
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {statsData.map((stat) => (
          <div key={stat.label} style={{ background: '#131315', border: '1px solid rgba(255,255,255,0.06)', padding: '1.1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5a5550', marginBottom: '0.5rem' }}>
              {stat.icon}
              <span style={{ fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{stat.label}</span>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, color: '#d4af37' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={13} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#5a5550' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök produkt…"
            style={{ width: '100%', padding: '0.65rem 0.9rem 0.65rem 2.2rem', background: '#131315', border: '1px solid rgba(255,255,255,0.08)', color: '#f0ebe0', fontSize: '0.75rem', outline: 'none' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          />
        </div>
        {/* Category filter */}
        <div style={{ position: 'relative' }}>
          <SlidersHorizontal size={13} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#5a5550' }} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            style={{ padding: '0.65rem 1rem 0.65rem 2.2rem', background: '#131315', border: '1px solid rgba(255,255,255,0.08)', color: '#a09890', fontSize: '0.72rem', outline: 'none', cursor: 'pointer', appearance: 'none', paddingRight: '1.5rem' }}
          >
            <option value="all">Alla kategorier</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nameEn}</option>)}
          </select>
        </div>
        {/* Sort */}
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as 'name' | 'price' | 'stock')}
          style={{ padding: '0.65rem 1rem', background: '#131315', border: '1px solid rgba(255,255,255,0.08)', color: '#a09890', fontSize: '0.72rem', outline: 'none', cursor: 'pointer' }}
        >
          <option value="name">Sortera: Namn</option>
          <option value="price">Sortera: Pris ↓</option>
          <option value="stock">Sortera: Lager ↑</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '72px 2fr 140px 80px 80px 80px 160px', alignItems: 'center', background: '#0f0f11', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem 1.25rem', fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5a5550', gap: '0.5rem' }}>
          <span></span>
          <span>Produkt</span>
          <span>Kategori</span>
          <span>Lager</span>
          <span>Pris</span>
          <span>Status</span>
          <span style={{ textAlign: 'right' }}>Åtgärder</span>
        </div>

        {filtered.map((product, i) => {
          const catName = categories.find((c) => c.id === product.categoryId)?.nameEn ?? '—';
          const stockColor = product.stockQty === 0 ? '#e05560' : product.stockQty <= 3 ? '#d4af37' : '#4caf7d';
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              style={{ display: 'grid', gridTemplateColumns: '72px 2fr 140px 80px 80px 80px 160px', alignItems: 'center', padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? '#0a0a0b' : '#0c0c0d', gap: '0.5rem', transition: 'background 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#131315'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#0a0a0b' : '#0c0c0d'; }}
            >
              {/* Thumbnail */}
              <div style={{ position: 'relative', width: '56px', height: '42px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                <Image src={product.images[0] || '/images/placeholder.jpg'} alt={product.nameEn} fill style={{ objectFit: 'cover' }} sizes="56px" />
              </div>
              {/* Name */}
              <div>
                <p style={{ fontSize: '0.82rem', color: '#f0ebe0', fontFamily: "'Cormorant Garamond', serif", marginBottom: '0.15rem' }}>{product.nameEn}</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {product.isLimitedEdition && <span style={{ fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.1rem 0.35rem', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37' }}>Limited</span>}
                  {product.isFeatured && <span style={{ fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.1rem 0.35rem', background: 'rgba(76,175,125,0.12)', border: '1px solid rgba(76,175,125,0.3)', color: '#4caf7d' }}>Featured</span>}
                </div>
              </div>
              {/* Category */}
              <span style={{ fontSize: '0.65rem', color: '#5a5550' }}>{catName}</span>
              {/* Stock */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: stockColor, flexShrink: 0 }} />
                <span style={{ fontSize: '0.72rem', color: stockColor }}>{product.stockQty}</span>
              </div>
              {/* Price */}
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.85rem', color: '#d4af37' }}>
                {formatPrice(product.priceOre, 'en')}
              </span>
              {/* Available */}
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: product.isAvailable ? '#4caf7d' : '#e05560' }}>
                {product.isAvailable ? '● Live' : '○ Hidden'}
              </span>
              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <Link
                  href={`/admin/products/edit/${product.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.7rem', border: '1px solid rgba(255,255,255,0.1)', color: '#a09890', fontSize: '0.6rem', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.4)'; (e.currentTarget as HTMLElement).style.color = '#d4af37'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#a09890'; }}
                >
                  <Pencil size={10} /> Redigera
                </Link>
                {deleteConfirm === product.id ? (
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button onClick={() => deleteProduct(product.id)} style={{ padding: '0.35rem 0.6rem', background: 'rgba(161,29,35,0.3)', border: '1px solid rgba(161,29,35,0.5)', color: '#e05560', fontSize: '0.6rem', cursor: 'pointer' }}>Ja</button>
                    <button onClick={() => setDeleteConfirm(null)} style={{ padding: '0.35rem 0.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#5a5550', fontSize: '0.6rem', cursor: 'pointer' }}>Nej</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    style={{ padding: '0.35rem 0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#3a3530', fontSize: '0.6rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(161,29,35,0.5)'; (e.currentTarget as HTMLElement).style.color = '#e05560'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#3a3530'; }}
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#3a3530', fontSize: '0.8rem' }}>
            Inga produkter hittades.
          </div>
        )}
      </div>
    </div>
  );
}
