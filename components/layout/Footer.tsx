'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Users } from 'lucide-react';
import { useLang } from '@/app/providers';
import { t } from '@/lib/i18n';
import { categories } from '@/lib/data';

export function Footer() {
  const { lang } = useLang();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  }

  const companyLinks = [
    { key: 'footer.about', href: '/om-oss' },
    { key: 'footer.contact', href: '/kontakt' },
    { key: 'footer.returns', href: '/retur' },
    { key: 'footer.privacy', href: '/integritetspolicy' },
  ] as const;

  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      {/* ── Main footer grid ────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '5rem 2.5rem 4rem',
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1fr 1.8fr',
          gap: '4rem',
        }}
      >
        {/* Brand column */}
        <div>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.3rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              display: 'block',
              marginBottom: '1.25rem',
            }}
          >
            Gyllene Kuben
          </Link>
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '0.95rem',
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              maxWidth: '260px',
              marginBottom: '2rem',
            }}
          >
            {lang === 'sv'
              ? 'Österns konstscener i nordiskt ljus — handplockade mästerverk för det moderna hemmet.'
              : 'Eastern art scenes in Nordic light — hand-curated masterworks for the modern home.'}
          </p>
          {/* Social icons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              { Icon: Camera, href: 'https://instagram.com/gyllenekuben', label: 'Instagram' },
              { Icon: Users,  href: 'https://facebook.com/gyllenekuben',  label: 'Facebook' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  width: '36px',
                  height: '36px',
                  border: '1px solid var(--border-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'border-color 0.3s, color 0.3s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-primary)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Collections column */}
        <div>
          <h3 style={footerHeadingStyle}>{t('footer.collections', lang)}</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/kollektioner/${cat.slug}`}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                >
                  {lang === 'sv' ? cat.nameSv : cat.nameEn}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company column */}
        <div>
          <h3 style={footerHeadingStyle}>{t('footer.company', lang)}</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {companyLinks.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                >
                  {t(key, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter column */}
        <div>
          <h3 style={footerHeadingStyle}>{t('footer.newsletter.title', lang)}</h3>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: '260px' }}>
            {lang === 'sv'
              ? 'Få exklusiv förhandsvisning av nya förvärv, kulturessäer och inbjudningar till vernissage.'
              : 'Get exclusive previews of new acquisitions, cultural essays, and vernissage invitations.'}
          </p>
          {subscribed ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--accent-gold)' }}
            >
              {lang === 'sv' ? '✓ Tack — välkommen till vår inre krets.' : '✓ Thank you — welcome to our inner circle.'}
            </motion.p>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletter.placeholder', lang)}
                required
                style={{
                  flex: 1,
                  padding: '0.7rem 0.9rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRight: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.72rem',
                  outline: 'none',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-gold)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0.7rem 1rem', borderRadius: 0, fontSize: '0.62rem', flexShrink: 0 }}
              >
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.5rem 2.5rem',
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
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            {t('footer.copyright', lang)}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['SSL', 'GDPR', 'PCI DSS'].map((badge) => (
              <span
                key={badge}
                style={{ padding: '0.15rem 0.45rem', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-inter)', fontSize: '0.5rem', letterSpacing: '0.08em', color: 'var(--text-muted)' }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerHeadingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '0.62rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
  marginBottom: '1.25rem',
};

const footerLinkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '0.72rem',
  color: 'var(--text-muted)',
  textDecoration: 'none',
  letterSpacing: '0.04em',
  transition: 'color 0.3s',
};
