'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, X, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Product, Category } from '@/lib/types';

interface Props {
  mode: 'new' | 'edit';
  product?: Product;
  categories: Category[];
}

type Tab = 'object' | 'artisan' | 'ritual' | 'commerce';

const defaultProduct: Omit<Product, 'id'> = {
  slug: '', nameSv: '', nameEn: '', descSv: '', descEn: '',
  materialsSv: '', materialsEn: '', dimensionsCm: '', weightGrams: undefined,
  artisanNameSv: '', artisanNameEn: '', kilnOrigin: '', dynastyEra: '',
  heritageSv: '', heritageEn: '', ritualSv: '', ritualEn: '',
  priceOre: 0, compareAtOre: undefined, stockQty: 0,
  isAvailable: true, isFeatured: false, isLimitedEdition: false,
  images: [], categoryId: 1,
};

export function ProductEditorClient({ mode, product, categories }: Props) {
  const [draft, setDraft] = useState<Omit<Product, 'id'>>(product ?? defaultProduct);
  const [activeTab, setActiveTab] = useState<Tab>('object');
  const [saved, setSaved] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  function updateField<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function addImage() {
    if (newImageUrl.trim()) {
      setDraft((d) => ({ ...d, images: [...d.images, newImageUrl.trim()] }));
      setNewImageUrl('');
    }
  }

  function removeImage(idx: number) {
    setDraft((d) => ({ ...d, images: d.images.filter((_, i) => i !== idx) }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'object', label: 'The Object' },
    { key: 'artisan', label: 'The Artisan & Provenance' },
    { key: 'ritual', label: 'The Ritual' },
    { key: 'commerce', label: 'Commerce & Status' },
  ];

  return (
    <div style={{ padding: '2.5rem', color: '#f0ebe0', minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5a5550', fontSize: '0.68rem', letterSpacing: '0.1em', textDecoration: 'none' }}>
            <ArrowLeft size={13} /> Produkter
          </Link>
          <span style={{ color: '#3a3530' }}>/</span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 300, color: '#f0ebe0' }}>
            {mode === 'new' ? 'Ny produkt' : 'Redigera produkt'}
          </h1>
        </div>
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.97 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.4rem', background: saved ? 'rgba(76,175,125,0.2)' : 'linear-gradient(135deg, #a11d23, #d4af37)', border: 'none', color: '#f0ebe0', fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          <Save size={12} /> {saved ? '✓ Sparat' : 'Spara produkt'}
        </motion.button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
        {/* Main editor area */}
        <div>
          {/* Base fields */}
          <div style={{ background: '#131315', border: '1px solid rgba(255,255,255,0.06)', padding: '1.75rem', marginBottom: '1.5rem' }}>
            <SectionLabel>Grundläggande</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <PField label="Namn (SV)" value={draft.nameSv} onChange={(v) => updateField('nameSv', v)} />
              <PField label="Name (EN)" value={draft.nameEn} onChange={(v) => updateField('nameEn', v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <PField label="Slug (URL)" value={draft.slug} onChange={(v) => updateField('slug', v)} placeholder="blue-white-meiping-vase" />
              <div>
                <label style={labelStyle}>Kategori</label>
                <select
                  value={draft.categoryId}
                  onChange={(e) => updateField('categoryId', parseInt(e.target.value))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.nameEn}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <PField label="Beskrivning (SV)" value={draft.descSv ?? ''} onChange={(v) => updateField('descSv', v)} multiline />
              <PField label="Description (EN)" value={draft.descEn ?? ''} onChange={(v) => updateField('descEn', v)} multiline />
            </div>
          </div>

          {/* Tab system */}
          <div style={{ background: '#131315', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Tab headers — mirrors the public PDP */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{ flex: 1, padding: '0.85rem 0.5rem', background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === key ? '#d4af37' : 'transparent'}`, fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: activeTab === key ? '#d4af37' : '#5a5550', cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s', marginBottom: '-1px' }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{ padding: '1.75rem' }}>
              {activeTab === 'object' && (
                <div>
                  <SectionLabel>Tab 1 — The Object</SectionLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <PField label="Material (SV)" value={draft.materialsSv ?? ''} onChange={(v) => updateField('materialsSv', v)} multiline />
                    <PField label="Materials (EN)" value={draft.materialsEn ?? ''} onChange={(v) => updateField('materialsEn', v)} multiline />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <PField label="Dimensioner (cm)" value={draft.dimensionsCm ?? ''} onChange={(v) => updateField('dimensionsCm', v)} placeholder="H: 38cm, Ø: 18cm" />
                    <PField label="Vikt (gram)" value={String(draft.weightGrams ?? '')} onChange={(v) => updateField('weightGrams', parseInt(v) || undefined)} placeholder="1850" />
                  </div>
                </div>
              )}

              {activeTab === 'artisan' && (
                <div>
                  <SectionLabel>Tab 2 — The Artisan & Provenance</SectionLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <PField label="Hantverkare (SV)" value={draft.artisanNameSv ?? ''} onChange={(v) => updateField('artisanNameSv', v)} />
                    <PField label="Artisan (EN)" value={draft.artisanNameEn ?? ''} onChange={(v) => updateField('artisanNameEn', v)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <PField label="Ugnsursprung / Kiln Origin" value={draft.kilnOrigin ?? ''} onChange={(v) => updateField('kilnOrigin', v)} placeholder="Jingdezhen, Jiangxi" />
                    <PField label="Dynasti / Period" value={draft.dynastyEra ?? ''} onChange={(v) => updateField('dynastyEra', v)} placeholder="Yuan/Ming-stil" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <PField label="Arvsberättelse (SV)" value={draft.heritageSv ?? ''} onChange={(v) => updateField('heritageSv', v)} multiline rows={5} />
                    <PField label="Heritage Story (EN)" value={draft.heritageEn ?? ''} onChange={(v) => updateField('heritageEn', v)} multiline rows={5} />
                  </div>
                </div>
              )}

              {activeTab === 'ritual' && (
                <div>
                  <SectionLabel>Tab 3 — The Ritual</SectionLabel>
                  <p style={{ fontSize: '0.62rem', color: '#5a5550', marginBottom: '1rem', lineHeight: 1.6 }}>
                    Skriv steg-för-steg instruktioner separerade med ny rad. Varje rad renderas som ett numrerat steg på produktsidan.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <PField label="Ritual (SV)" value={draft.ritualSv ?? ''} onChange={(v) => updateField('ritualSv', v)} multiline rows={8} placeholder={'1. Skölj kärlet med kokande vatten.\n2. Tillsätt 5g te per 100ml vatten.\n3. Häll kokande vatten (95°C).'} />
                    <PField label="Ritual (EN)" value={draft.ritualEn ?? ''} onChange={(v) => updateField('ritualEn', v)} multiline rows={8} placeholder={'1. Rinse the vessel with boiling water.\n2. Add 5g tea per 100ml water.\n3. Pour boiling water (95°C).'} />
                  </div>
                </div>
              )}

              {activeTab === 'commerce' && (
                <div>
                  <SectionLabel>Prissättning</SectionLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <PField label="Pris (öre)" value={String(draft.priceOre)} onChange={(v) => updateField('priceOre', parseInt(v) || 0)} placeholder="148500" />
                    <PField label="Jmf-pris (öre, opt.)" value={String(draft.compareAtOre ?? '')} onChange={(v) => updateField('compareAtOre', parseInt(v) || undefined)} placeholder="" />
                    <PField label="Lagersaldo" value={String(draft.stockQty)} onChange={(v) => updateField('stockQty', parseInt(v) || 0)} placeholder="10" />
                  </div>
                  <SectionLabel>Synlighetsflaggor</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {([ ['isAvailable', 'Tillgänglig / Live'], ['isFeatured', 'Utvald (Hemsidan)'], ['isLimitedEdition', 'Begränsad upplaga'] ] as const).map(([field, label]) => (
                      <button
                        key={field}
                        onClick={() => updateField(field, !draft[field])}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: draft[field] ? 'rgba(212,175,55,0.06)' : 'transparent', border: `1px solid ${draft[field] ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                      >
                        {draft[field] ? <ToggleRight size={18} style={{ color: '#d4af37', flexShrink: 0 }} /> : <ToggleLeft size={18} style={{ color: '#3a3530', flexShrink: 0 }} />}
                        <span style={{ fontSize: '0.72rem', color: draft[field] ? '#d4af37' : '#5a5550', letterSpacing: '0.08em' }}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar: Image manager */}
        <div style={{ background: '#131315', border: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem', position: 'sticky', top: '2rem' }}>
          <SectionLabel>Produktbilder</SectionLabel>
          <p style={{ fontSize: '0.6rem', color: '#5a5550', marginBottom: '1rem', lineHeight: 1.55 }}>
            Ange URL för varje bild. Första bilden används som primär bild.
          </p>

          {/* Current images */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {draft.images.map((url, idx) => (
              <div key={idx} style={{ position: 'relative', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ position: 'relative', width: '100%', paddingBottom: '60%', overflow: 'hidden' }}>
                  <Image src={url} alt={`Image ${idx + 1}`} fill style={{ objectFit: 'cover' }} sizes="280px" onError={() => {}} />
                </div>
                <button
                  onClick={() => removeImage(idx)}
                  style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', width: '20px', height: '20px', background: 'rgba(161,29,35,0.8)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0ebe0' }}
                >
                  <X size={10} />
                </button>
                {idx === 0 && (
                  <div style={{ position: 'absolute', bottom: '0.4rem', left: '0.4rem', padding: '0.1rem 0.4rem', background: 'rgba(212,175,55,0.9)', fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0a0a0b', fontWeight: 600 }}>Primär</div>
                )}
              </div>
            ))}
            {draft.images.length === 0 && (
              <div style={{ padding: '2rem', border: '2px dashed rgba(255,255,255,0.06)', textAlign: 'center', color: '#3a3530', fontSize: '0.65rem' }}>
                Inga bilder tillagda
              </div>
            )}
          </div>

          {/* Add image URL */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="/images/produkt.jpg"
              onKeyDown={(e) => { if (e.key === 'Enter') addImage(); }}
              style={{ flex: 1, padding: '0.55rem 0.7rem', background: '#0a0a0b', border: '1px solid rgba(255,255,255,0.08)', color: '#a09890', fontSize: '0.68rem', outline: 'none' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
            <button
              onClick={addImage}
              style={{ padding: '0.55rem 0.7rem', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', color: '#d4af37', cursor: 'pointer' }}
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Related journal slug */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <SectionLabel>Relaterad journalartikel</SectionLabel>
            <PField
              label="Journal slug (opt.)"
              value={draft.relatedJournalSlug ?? ''}
              onChange={(v) => updateField('relatedJournalSlug', v)}
              placeholder="mindful-brewing-philosophy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Field helpers ────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.56rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#5a5550',
  marginBottom: '0.35rem',
};
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  background: '#0a0a0b',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#f0ebe0',
  fontSize: '0.78rem',
  fontFamily: "'Inter', sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s',
};

function PField({ label, value, onChange, placeholder, multiline, rows }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; rows?: number;
}) {
  const handlers = {
    onFocus: (e: React.FocusEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.35)'; },
    onBlur: (e: React.FocusEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; },
  };
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows ?? 3}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={handlers.onFocus as React.FocusEventHandler<HTMLTextAreaElement>}
          onBlur={handlers.onBlur as React.FocusEventHandler<HTMLTextAreaElement>}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={handlers.onFocus as React.FocusEventHandler<HTMLInputElement>}
          onBlur={handlers.onBlur as React.FocusEventHandler<HTMLInputElement>}
        />
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '0.56rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5a5550', marginBottom: '0.85rem', marginTop: '0.25rem' }}>
      {children}
    </p>
  );
}
