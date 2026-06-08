'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import type { JournalPost } from '@/lib/types';

interface Props { initialPosts: JournalPost[]; }

export function AdminJournalListClient({ initialPosts }: Props) {
  const [posts, setPosts] = useState<JournalPost[]>(initialPosts);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = posts.filter(
    (p) => p.titleEn.toLowerCase().includes(search.toLowerCase()) ||
           p.titleSv.toLowerCase().includes(search.toLowerCase()),
  );

  function togglePublish(id: number) {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, isPublished: !p.isPublished } : p));
  }

  function deletePost(id: number) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  }

  return (
    <div style={{ padding: '2.5rem', color: '#f0ebe0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, color: '#f0ebe0', letterSpacing: '0.02em', marginBottom: '0.3rem' }}>
            Kulturjournal
          </h1>
          <p style={{ fontSize: '0.7rem', color: '#5a5550', letterSpacing: '0.06em' }}>
            {posts.filter((p) => p.isPublished).length} publicerade · {posts.length} totalt
          </p>
        </div>
        <Link
          href="/admin/journal/new"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.4rem', background: 'linear-gradient(135deg, #a11d23, #d4af37)', color: '#f0ebe0', fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={13} /> Ny artikel
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '2rem', maxWidth: '400px' }}>
        <Search size={13} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#5a5550' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Sök artikel…"
          style={{ width: '100%', padding: '0.65rem 0.9rem 0.65rem 2.2rem', background: '#131315', border: '1px solid rgba(255,255,255,0.08)', color: '#f0ebe0', fontSize: '0.75rem', outline: 'none' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        />
      </div>

      {/* Table */}
      <div style={{ border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr 120px 100px 120px 130px', gap: '0', background: '#0f0f11', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem 1.25rem', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5a5550' }}>
          <span></span>
          <span>Titel</span>
          <span>Kategori</span>
          <span>Datum</span>
          <span>Status</span>
          <span style={{ textAlign: 'right' }}>Åtgärder</span>
        </div>

        {/* Rows */}
        {filtered.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            style={{ display: 'grid', gridTemplateColumns: '64px 1fr 120px 100px 120px 130px', gap: '0', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? '#0a0a0b' : '#0c0c0d', transition: 'background 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#131315'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#0a0a0b' : '#0c0c0d'; }}
          >
            {/* Thumbnail */}
            <div style={{ position: 'relative', width: '48px', height: '36px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Image src={post.coverImage} alt={post.titleEn} fill style={{ objectFit: 'cover' }} sizes="48px" />
            </div>

            {/* Title */}
            <div>
              <p style={{ fontSize: '0.82rem', color: '#f0ebe0', fontFamily: "'Cormorant Garamond', serif", marginBottom: '0.2rem' }}>{post.titleEn}</p>
              <p style={{ fontSize: '0.62rem', color: '#5a5550' }}>{post.titleSv}</p>
            </div>

            {/* Tag */}
            <span style={{ fontSize: '0.6rem', color: '#d4af37', letterSpacing: '0.08em' }}>{post.tag}</span>

            {/* Date */}
            <span style={{ fontSize: '0.65rem', color: '#5a5550' }}>{post.publishedAt}</span>

            {/* Status toggle */}
            <button
              onClick={() => togglePublish(post.id)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem', background: post.isPublished ? 'rgba(76,175,125,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${post.isPublished ? 'rgba(76,175,125,0.3)' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: post.isPublished ? '#4caf7d' : '#5a5550', transition: 'all 0.2s' }}
            >
              {post.isPublished ? <Eye size={10} /> : <EyeOff size={10} />}
              {post.isPublished ? 'Live' : 'Utkast'}
            </button>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <Link
                href={`/admin/journal/edit/${post.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.7rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#a09890', fontSize: '0.6rem', cursor: 'pointer', textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.4)'; (e.currentTarget as HTMLElement).style.color = '#d4af37'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#a09890'; }}
              >
                <Pencil size={10} /> Redigera
              </Link>
              {deleteConfirm === post.id ? (
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button onClick={() => deletePost(post.id)} style={{ padding: '0.35rem 0.6rem', background: 'rgba(161,29,35,0.3)', border: '1px solid rgba(161,29,35,0.5)', color: '#e05560', fontSize: '0.6rem', cursor: 'pointer' }}>Ja</button>
                  <button onClick={() => setDeleteConfirm(null)} style={{ padding: '0.35rem 0.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#5a5550', fontSize: '0.6rem', cursor: 'pointer' }}>Nej</button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(post.id)}
                  style={{ padding: '0.35rem 0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#3a3530', fontSize: '0.6rem', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(161,29,35,0.5)'; (e.currentTarget as HTMLElement).style.color = '#e05560'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#3a3530'; }}
                >
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#3a3530', fontSize: '0.8rem' }}>
            Inga artiklar hittades.
          </div>
        )}
      </div>
    </div>
  );
}
