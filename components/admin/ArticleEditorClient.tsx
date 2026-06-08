'use client';

import React, { useState, useId } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Trash2, Save, Eye,
  Type, AlignLeft, Image as ImageIcon, Video,
  Quote as QuoteIcon, Minus as DividerIcon,
  Tag, ChevronDown,
} from 'lucide-react';
import { featuredProducts } from '@/lib/data';
import type { JournalPost, ContentBlock, BlockType } from '@/lib/types';

interface Props {
  mode: 'new' | 'edit';
  post?: JournalPost;
}

const defaultPost: Omit<JournalPost, 'id'> = {
  slug: '',
  titleSv: '',
  titleEn: '',
  excerptSv: '',
  excerptEn: '',
  coverImage: '',
  videoUrl: '',
  blocks: [],
  relatedProductIds: [],
  authorSv: 'Gyllene Kubens kulturredaktion',
  authorEn: "Gyllene Kuben's cultural editorial",
  tag: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  isPublished: false,
  readingTimeMin: 5,
};

export function ArticleEditorClient({ mode, post }: Props) {
  const [draft, setDraft] = useState<Omit<JournalPost, 'id'>>(post ?? defaultPost);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState<'sv' | 'en'>('en');
  const uid = useId();

  function updateField<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function addBlock(type: BlockType) {
    const block: ContentBlock = {
      id: `${uid}-${Date.now()}`,
      type,
      textSv: '',
      textEn: '',
      level: type === 'heading' ? 2 : undefined,
    };
    setDraft((d) => ({ ...d, blocks: [...d.blocks, block] }));
    setActiveBlock(block.id);
  }

  function updateBlock(id: string, patch: Partial<ContentBlock>) {
    setDraft((d) => ({
      ...d,
      blocks: d.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
  }

  function deleteBlock(id: string) {
    setDraft((d) => ({ ...d, blocks: d.blocks.filter((b) => b.id !== id) }));
  }

  function toggleProduct(id: number) {
    setDraft((d) => ({
      ...d,
      relatedProductIds: d.relatedProductIds.includes(id)
        ? d.relatedProductIds.filter((x) => x !== id)
        : [...d.relatedProductIds, id],
    }));
  }

  function handleSave() {
    // In a real app, POST to API route
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const blockTypeOptions: { type: BlockType; label: string; icon: React.ReactNode }[] = [
    { type: 'heading',   label: 'Rubrik',     icon: <Type size={13} /> },
    { type: 'paragraph', label: 'Stycke',     icon: <AlignLeft size={13} /> },
    { type: 'quote',     label: 'Citat',      icon: <QuoteIcon size={13} /> },
    { type: 'image',     label: 'Bild',       icon: <ImageIcon size={13} /> },
    { type: 'video',     label: 'Video',      icon: <Video size={13} /> },
    { type: 'divider',   label: 'Divider',    icon: <DividerIcon size={13} /> },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', minHeight: '100vh', color: '#f0ebe0' }}>

      {/* ── Editor Main ────────────────────────────────────────────── */}
      <div style={{ padding: '2.5rem', borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <Link href="/admin/journal" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5a5550', fontSize: '0.68rem', letterSpacing: '0.1em' }}>
            <ArrowLeft size={13} /> Tillbaka
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => updateField('isPublished', !draft.isPublished)}
              style={{ padding: '0.55rem 1.1rem', background: draft.isPublished ? 'rgba(76,175,125,0.12)' : 'transparent', border: `1px solid ${draft.isPublished ? 'rgba(76,175,125,0.4)' : 'rgba(255,255,255,0.1)'}`, color: draft.isPublished ? '#4caf7d' : '#5a5550', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              {draft.isPublished ? '● Live' : '○ Utkast'}
            </button>
            <motion.button
              onClick={handleSave}
              whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.4rem', background: saved ? 'rgba(76,175,125,0.2)' : 'linear-gradient(135deg, #a11d23, #d4af37)', border: 'none', color: '#f0ebe0', fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              <Save size={12} />
              {saved ? '✓ Sparat' : 'Spara'}
            </motion.button>
          </div>
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, color: '#f0ebe0', marginBottom: '2rem' }}>
          {mode === 'new' ? 'Ny artikel' : 'Redigera artikel'}
        </h1>

        {/* ── Meta fields ──────────────────────────────────────────── */}
        <SectionLabel>Metadata</SectionLabel>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <AdminField label="Titel (SV)" value={draft.titleSv} onChange={(v) => updateField('titleSv', v)} placeholder="Brygdets Filosofi…" />
          <AdminField label="Title (EN)" value={draft.titleEn} onChange={(v) => updateField('titleEn', v)} placeholder="The Philosophy of Brewing…" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <AdminField label="Ingress (SV)" value={draft.excerptSv} onChange={(v) => updateField('excerptSv', v)} multiline />
          <AdminField label="Excerpt (EN)" value={draft.excerptEn} onChange={(v) => updateField('excerptEn', v)} multiline />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <AdminField label="Slug" value={draft.slug} onChange={(v) => updateField('slug', v)} placeholder="mindful-brewing-philosophy" />
          <AdminField label="Tagg" value={draft.tag ?? ''} onChange={(v) => updateField('tag', v)} placeholder="Te & Ritual" />
          <AdminField label="Lästid (min)" value={String(draft.readingTimeMin)} onChange={(v) => updateField('readingTimeMin', parseInt(v) || 5)} placeholder="7" />
        </div>

        {/* Cover image */}
        <SectionLabel>Omslagsbild</SectionLabel>
        <AdminField label="Bild-URL" value={draft.coverImage} onChange={(v) => updateField('coverImage', v)} placeholder="/images/journal-tea-ritual.jpg" />
        {draft.coverImage && (
          <div style={{ position: 'relative', height: '160px', marginTop: '0.75rem', marginBottom: '1.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Image src={draft.coverImage} alt="Cover preview" fill style={{ objectFit: 'cover' }} sizes="400px" onError={() => {}} />
          </div>
        )}

        {/* Video URL */}
        <SectionLabel>Video (valfri)</SectionLabel>
        <AdminField label="Video-URL (YouTube embed)" value={draft.videoUrl ?? ''} onChange={(v) => updateField('videoUrl', v)} placeholder="https://www.youtube.com/embed/…" />

        {/* ── Content blocks ────────────────────────────────────────── */}
        <SectionLabel>Innehåll</SectionLabel>

        {/* Block toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {blockTypeOptions.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => addBlock(type)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#a09890', fontSize: '0.62rem', letterSpacing: '0.08em', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.4)'; (e.currentTarget as HTMLElement).style.color = '#d4af37'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#a09890'; }}
            >
              {icon} <Plus size={9} /> {label}
            </button>
          ))}
        </div>

        {/* Block list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <AnimatePresence>
            {draft.blocks.map((block, i) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BlockEditor
                  block={block}
                  index={i}
                  isActive={activeBlock === block.id}
                  onActivate={() => setActiveBlock(block.id)}
                  onUpdate={(patch) => updateBlock(block.id, patch)}
                  onDelete={() => deleteBlock(block.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {draft.blocks.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', border: '2px dashed rgba(255,255,255,0.06)', color: '#3a3530', fontSize: '0.75rem' }}>
              Klicka på en blocktyp ovan för att börja skriva.
            </div>
          )}
        </div>
      </div>

      {/* ── Right Sidebar ──────────────────────────────────────────── */}
      <div style={{ padding: '2rem 1.5rem', background: '#0f0f11', overflowY: 'auto' }}>
        {/* Product tagging */}
        <SectionLabel>Taggade produkter</SectionLabel>
        <p style={{ fontSize: '0.62rem', color: '#5a5550', marginBottom: '1rem', lineHeight: 1.55 }}>
          Välj de produkter som visas i artikelns "Nämnda i denna artikel"-rad.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {featuredProducts.map((product) => {
            const selected = draft.relatedProductIds.includes(product.id);
            return (
              <button
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', background: selected ? 'rgba(212,175,55,0.08)' : 'transparent', border: `1px solid ${selected ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: `1px solid ${selected ? '#d4af37' : '#5a5550'}`, background: selected ? '#d4af37' : 'transparent', flexShrink: 0 }} />
                <span style={{ fontSize: '0.68rem', color: selected ? '#d4af37' : '#a09890', lineHeight: 1.3 }}>
                  {product.nameEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live preview strip */}
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <SectionLabel style={{ marginBottom: 0 }}>Förhandsvisning</SectionLabel>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {(['sv', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setPreview(l)}
                  style={{ padding: '0.25rem 0.55rem', background: preview === l ? 'rgba(212,175,55,0.15)' : 'transparent', border: `1px solid ${preview === l ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`, color: preview === l ? '#d4af37' : '#5a5550', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: '#0a0a0b', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#f0ebe0', lineHeight: 1.25, marginBottom: '0.5rem' }}>
              {preview === 'sv' ? (draft.titleSv || '—') : (draft.titleEn || '—')}
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.85rem', fontStyle: 'italic', color: '#5a5550', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {preview === 'sv' ? (draft.excerptSv || '—') : (draft.excerptEn || '—')}
            </p>
            {draft.tag && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.75rem', padding: '0.15rem 0.5rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <Tag size={9} style={{ color: '#d4af37' }} />
                <span style={{ fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#d4af37' }}>{draft.tag}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Block Editor Card ────────────────────────────────────────────────────────

function BlockEditor({ block, index, isActive, onActivate, onUpdate, onDelete }: {
  block: ContentBlock; index: number; isActive: boolean;
  onActivate: () => void; onUpdate: (patch: Partial<ContentBlock>) => void; onDelete: () => void;
}) {
  const blockLabel = block.type.charAt(0).toUpperCase() + block.type.slice(1);

  return (
    <div
      onClick={onActivate}
      style={{ border: `1px solid ${isActive ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.06)'}`, background: isActive ? 'rgba(212,175,55,0.03)' : '#0a0a0b', cursor: 'pointer', transition: 'border-color 0.2s' }}
    >
      {/* Block header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0f0f11' }}>
        <span style={{ fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5a5550' }}>
          {String(index + 1).padStart(2, '0')} · {blockLabel}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3a3530', padding: '0.2rem', transition: 'color 0.2s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#e05560'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#3a3530'; }}
        >
          <Trash2 size={11} />
        </button>
      </div>

      {/* Block body */}
      <div style={{ padding: '0.75rem' }}>
        {(block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote') && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {block.type === 'heading' && (
              <div style={{ gridColumn: '1 / -1', marginBottom: '0.4rem' }}>
                <select
                  value={block.level ?? 2}
                  onChange={(e) => onUpdate({ level: parseInt(e.target.value) as 1 | 2 | 3 })}
                  onClick={(e) => e.stopPropagation()}
                  style={{ padding: '0.3rem 0.6rem', background: '#131315', border: '1px solid rgba(255,255,255,0.1)', color: '#a09890', fontSize: '0.62rem', cursor: 'pointer', outline: 'none' }}
                >
                  <option value={1}>H1</option>
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
              </div>
            )}
            <BlockTextArea label="SV" value={block.textSv ?? ''} onChange={(v) => onUpdate({ textSv: v })} />
            <BlockTextArea label="EN" value={block.textEn ?? ''} onChange={(v) => onUpdate({ textEn: v })} />
          </div>
        )}
        {block.type === 'image' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <AdminField label="Bild-URL" value={block.imageUrl ?? ''} onChange={(v) => onUpdate({ imageUrl: v })} placeholder="/images/…" />
            <AdminField label="Bildtext (valfri)" value={block.imageCaption ?? ''} onChange={(v) => onUpdate({ imageCaption: v })} placeholder="Beskrivning av bilden…" />
          </div>
        )}
        {block.type === 'video' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <AdminField label="Video-URL (embed)" value={block.videoUrl ?? ''} onChange={(v) => onUpdate({ videoUrl: v })} placeholder="https://www.youtube.com/embed/…" />
            <AdminField label="Bildtext" value={block.videoCaption ?? ''} onChange={(v) => onUpdate({ videoCaption: v })} />
          </div>
        )}
        {block.type === 'divider' && (
          <p style={{ fontSize: '0.6rem', color: '#3a3530', textAlign: 'center', padding: '0.5rem 0' }}>— Divider —</p>
        )}
      </div>
    </div>
  );
}

// ─── Admin helpers ────────────────────────────────────────────────────────────

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5a5550', marginBottom: '0.75rem', marginTop: '1.75rem', ...style }}>
      {children}
    </p>
  );
}

function AdminField({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) {
  const sharedStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.6rem 0.75rem',
    background: '#131315',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#f0ebe0',
    fontSize: '0.78rem',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    resize: 'vertical' as const,
    transition: 'border-color 0.2s',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
      <label style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a5550' }}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={sharedStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={sharedStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        />
      )}
    </div>
  );
}

function BlockTextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p style={{ fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3a3530', marginBottom: '0.3rem' }}>{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        rows={3}
        style={{ width: '100%', padding: '0.5rem', background: '#131315', border: '1px solid rgba(255,255,255,0.06)', color: '#a09890', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", resize: 'vertical', outline: 'none' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
      />
    </div>
  );
}
