'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Eye, Sun, Moon, ImageIcon, Type } from 'lucide-react';
import type { BannerConfig } from '@/lib/types';

interface Props {
  initialBanners: BannerConfig[];
}

export function AdminBannersClient({ initialBanners }: Props) {
  const [banners, setBanners] = useState<BannerConfig[]>(initialBanners);
  const [selected, setSelected] = useState<BannerConfig>(banners[0]);
  const [saved, setSaved] = useState(false);
  const [previewLang, setPreviewLang] = useState<'sv' | 'en'>('en');

  function updateSelected(patch: Partial<BannerConfig>) {
    const updated = { ...selected, ...patch };
    setSelected(updated);
    setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }

  function handleSave() {
    // In production: await fetch('/api/admin/banners', { method: 'PUT', body: JSON.stringify(selected) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  const previewTitle = previewLang === 'sv' ? selected.titleSv : selected.titleEn;
  const previewSubtitle = previewLang === 'sv' ? selected.subtitleSv : selected.subtitleEn;
  const previewCta = previewLang === 'sv' ? selected.ctaLabelSv : selected.ctaLabelEn;

  return (
    <div style={{ padding: '2.5rem', color: '#f0ebe0', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, color: '#f0ebe0', marginBottom: '0.3rem' }}>
            Banners & Tema
          </h1>
          <p style={{ fontSize: '0.68rem', color: '#5a5550', letterSpacing: '0.06em' }}>
            CMS för hemsidans hero, kategoribanner och visuellt tema
          </p>
        </div>
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.97 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.4rem', background: saved ? 'rgba(76,175,125,0.2)' : 'linear-gradient(135deg, #a11d23, #d4af37)', border: 'none', color: '#f0ebe0', fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          <Save size={12} /> {saved ? '✓ Sparat' : 'Spara banner'}
        </motion.button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Banner selector */}
        <div style={{ background: '#131315', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem' }}>
          <p style={{ fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5a5550', marginBottom: '0.75rem' }}>Banners</p>
          {banners.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelected(b)}
              style={{ display: 'block', width: '100%', padding: '0.7rem 0.75rem', background: selected.id === b.id ? 'rgba(212,175,55,0.08)' : 'transparent', border: `1px solid ${selected.id === b.id ? 'rgba(212,175,55,0.3)' : 'transparent'}`, color: selected.id === b.id ? '#d4af37' : '#5a5550', fontSize: '0.68rem', letterSpacing: '0.06em', cursor: 'pointer', textAlign: 'left', marginBottom: '0.25rem', transition: 'all 0.2s' }}
            >
              {b.key.replace(/_/g, ' ')}
              <span style={{ display: 'block', fontSize: '0.52rem', color: '#3a3530', marginTop: '0.2rem', letterSpacing: '0.04em' }}>{b.isActive ? '● Active' : '○ Inactive'}</span>
            </button>
          ))}
        </div>

        {/* Right: Editor + Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Live preview */}
          <div style={{ border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.1rem', background: '#131315', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5a5550', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                <Eye size={12} /> Förhandsvisning
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {(['sv', 'en'] as const).map((l) => (
                  <button key={l} onClick={() => setPreviewLang(l)}
                    style={{ padding: '0.2rem 0.5rem', background: previewLang === l ? 'rgba(212,175,55,0.15)' : 'transparent', border: `1px solid ${previewLang === l ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`, color: previewLang === l ? '#d4af37' : '#5a5550', fontSize: '0.56rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Banner preview tile */}
            <div style={{ position: 'relative', height: '220px', background: selected.theme === 'xuan' ? '#f4f0e8' : '#12080c', overflow: 'hidden' }}>
              {selected.imageUrl && (
                <Image src={selected.imageUrl} alt="Banner preview" fill style={{ objectFit: 'cover', opacity: 0.4 }} sizes="100%" onError={() => {}} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: selected.theme === 'xuan' ? 'linear-gradient(135deg, rgba(244,240,232,0.7), rgba(211,198,166,0.4))' : 'linear-gradient(135deg, rgba(10,6,8,0.7), rgba(161,29,35,0.2))' }} />
              <div style={{ position: 'absolute', bottom: '2rem', left: '2.5rem' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', marginBottom: '0.5rem' }}>
                  Gyllene Kuben
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.4rem, 3vw, 2.5rem)', fontWeight: 300, color: selected.theme === 'xuan' ? '#2c1810' : '#f0ebe0', lineHeight: 1.1, marginBottom: '0.5rem' }}>
                  {previewTitle || '—'}
                </h2>
                {previewSubtitle && (
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', fontStyle: 'italic', color: selected.theme === 'xuan' ? '#5a3a2a' : '#a09890', marginBottom: '1rem' }}>
                    {previewSubtitle.length > 80 ? previewSubtitle.slice(0, 80) + '…' : previewSubtitle}
                  </p>
                )}
                {previewCta && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.2rem', background: 'linear-gradient(135deg, #a11d23, #d4af37)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f0ebe0' }}>
                    {previewCta}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Editor fields */}
          <div style={{ background: '#131315', border: '1px solid rgba(255,255,255,0.06)', padding: '1.75rem' }}>
            {/* Copy */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Type size={14} style={{ color: '#d4af37' }} />
              <p style={secLabelStyle}>Kopieringstext</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <BField label="Titel (SV)" value={selected.titleSv} onChange={(v) => updateSelected({ titleSv: v })} />
              <BField label="Title (EN)" value={selected.titleEn} onChange={(v) => updateSelected({ titleEn: v })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <BField label="Underrubrik (SV)" value={selected.subtitleSv ?? ''} onChange={(v) => updateSelected({ subtitleSv: v })} multiline />
              <BField label="Subtitle (EN)" value={selected.subtitleEn ?? ''} onChange={(v) => updateSelected({ subtitleEn: v })} multiline />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <BField label="CTA-text (SV)" value={selected.ctaLabelSv ?? ''} onChange={(v) => updateSelected({ ctaLabelSv: v })} placeholder="Utforska" />
              <BField label="CTA text (EN)" value={selected.ctaLabelEn ?? ''} onChange={(v) => updateSelected({ ctaLabelEn: v })} placeholder="Explore" />
              <BField label="CTA Länk / href" value={selected.ctaHref ?? ''} onChange={(v) => updateSelected({ ctaHref: v })} placeholder="/kollektioner/porslin" />
            </div>

            {/* Image */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <ImageIcon size={14} style={{ color: '#d4af37' }} />
              <p style={secLabelStyle}>Bannerbild</p>
            </div>
            <BField label="Bild-URL" value={selected.imageUrl ?? ''} onChange={(v) => updateSelected({ imageUrl: v })} placeholder="/images/hero-inkwash-landscape.jpg" />

            {/* Theme toggle */}
            <div style={{ paddingTop: '1.5rem', marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {selected.theme === 'imperial' ? <Sun size={14} style={{ color: '#d4af37' }} /> : <Moon size={14} style={{ color: '#d4af37' }} />}
                <p style={secLabelStyle}>Visuellt tema — System-wide override</p>
              </div>
              <p style={{ fontSize: '0.6rem', color: '#5a5550', marginBottom: '1rem', lineHeight: 1.6 }}>
                Välj ett tema för denna banner. Homepagebannern kan säsongsmässigt byta hela sajtstemningen.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {(['imperial', 'xuan'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => updateSelected({ theme })}
                    style={{ flex: 1, padding: '0.85rem', background: selected.theme === theme ? (theme === 'imperial' ? 'rgba(161,29,35,0.15)' : 'rgba(255,255,255,0.06)') : 'transparent', border: `1px solid ${selected.theme === theme ? (theme === 'imperial' ? 'rgba(161,29,35,0.5)' : 'rgba(255,255,255,0.2)') : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', color: selected.theme === theme ? '#d4af37' : '#5a5550', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                      {theme === 'imperial' ? '帝国 Imperial' : '宣 Xuan Paper'}
                    </p>
                    <p style={{ fontSize: '0.55rem', color: '#3a3530', letterSpacing: '0.08em' }}>
                      {theme === 'imperial' ? 'Djupröd, guld, dramatik' : 'Papper, svart tusch, stillhet'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const secLabelStyle: React.CSSProperties = {
  fontSize: '0.56rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: '#5a5550',
};

function BField({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) {
  const shared: React.CSSProperties = { width: '100%', padding: '0.6rem 0.75rem', background: '#0a0a0b', border: '1px solid rgba(255,255,255,0.08)', color: '#f0ebe0', fontSize: '0.76rem', fontFamily: "'Inter', sans-serif", outline: 'none', transition: 'border-color 0.2s', resize: 'vertical' as const };
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <label style={{ display: 'block', fontSize: '0.54rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5a5550', marginBottom: '0.3rem' }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={2} style={shared} onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={shared} onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }} />
      }
    </div>
  );
}
