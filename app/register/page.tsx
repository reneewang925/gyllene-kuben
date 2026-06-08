'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth, useLang } from '@/app/providers';

export default function RegisterPage() {
  const { login }  = useAuth();
  const { lang }   = useLang();
  const router     = useRouter();

  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPass,   setShowPass]   = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [marketing,   setMarketing]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!gdprConsent) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    // Mock: create session for new user
    login({
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      tier: 'BRONZE',
      loyaltyPoints: 0,
    });
    setSuccess(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.push('/konto');
  }

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['transparent', '#e05560', '#d4af37', '#4caf7d'];
  const strengthLabels = ['', lang === 'sv' ? 'Svagt' : 'Weak', lang === 'sv' ? 'Medel' : 'Fair', lang === 'sv' ? 'Starkt' : 'Strong'];

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '6rem 1.5rem 3rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        {/* Brand mark */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
            Gyllene Kuben
          </p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.2rem', fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
            {lang === 'sv' ? 'Bli medlem' : 'Create account'}
          </h1>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            {lang === 'sv' ? 'Börja samla lojalitetspoäng' : 'Start earning loyalty points'}
          </p>
        </div>

        {success ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(76,175,125,0.15)', border: '1px solid rgba(76,175,125,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Check size={20} style={{ color: '#4caf7d' }} />
            </div>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              {lang === 'sv' ? 'Konto skapat!' : 'Account created!'}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>{lang === 'sv' ? 'Fullständigt namn' : 'Full name'}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Sofia Lindqvist"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>{lang === 'sv' ? 'E-postadress' : 'Email address'}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="namn@example.se"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>{lang === 'sv' ? 'Lösenord' : 'Password'}</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  required minLength={6} placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: '2.8rem' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {/* Strength meter */}
              {password.length > 0 && (
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.4rem', alignItems: 'center' }}>
                  {[1,2,3].map((n) => (
                    <div key={n} style={{ flex: 1, height: '2px', background: n <= passwordStrength ? strengthColors[passwordStrength] : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
                  ))}
                  <span style={{ fontSize: '0.55rem', color: strengthColors[passwordStrength], letterSpacing: '0.1em', marginLeft: '0.5rem', flexShrink: 0 }}>
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
            </div>

            {/* GDPR consent */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} required
                  style={{ marginTop: '0.15rem', accentColor: '#d4af37', width: '14px', height: '14px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', lineHeight: 1.6, letterSpacing: '0.03em' }}>
                  {lang === 'sv'
                    ? 'Jag har läst och godkänner integritetspolicyn och användarvillkoren. (GDPR-samtycke)'
                    : 'I have read and accept the privacy policy and terms of use. (GDPR consent)'}
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)}
                  style={{ marginTop: '0.15rem', accentColor: '#d4af37', width: '14px', height: '14px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', lineHeight: 1.6, letterSpacing: '0.03em' }}>
                  {lang === 'sv'
                    ? 'Ja, skicka mig kulturnyhetsbrev och exklusiva erbjudanden (valfritt)'
                    : 'Yes, send me cultural newsletters and exclusive offers (optional)'}
                </span>
              </label>
            </div>

            <motion.button type="submit" disabled={loading || !gdprConsent} whileTap={{ scale: 0.98 }}
              style={{
                marginTop: '0.5rem', padding: '0.9rem',
                background: !gdprConsent ? 'rgba(255,255,255,0.06)' : loading ? 'rgba(212,175,55,0.3)' : 'linear-gradient(135deg, #a11d23, #d4af37)',
                border: 'none', color: 'var(--text-primary)',
                fontFamily: 'var(--font-inter)', fontSize: '0.7rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', cursor: !gdprConsent || loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                opacity: !gdprConsent ? 0.5 : 1,
              }}>
              {loading
                ? (lang === 'sv' ? 'Skapar konto…' : 'Creating account…')
                : <>{lang === 'sv' ? 'Skapa konto' : 'Create account'} <ArrowRight size={14} /></>}
            </motion.button>
          </form>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <Link href="/login" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.06em', textDecoration: 'none' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
            {lang === 'sv' ? 'Har du redan ett konto? Logga in' : 'Already have an account? Sign in'}
          </Link>
          <Link href="/" style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', opacity: 0.5, letterSpacing: '0.06em', textDecoration: 'none' }}>
            ← {lang === 'sv' ? 'Tillbaka till butiken' : 'Back to store'}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.58rem', letterSpacing: '0.16em',
  textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.75rem 0.9rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text-primary)', fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
  outline: 'none', transition: 'border-color 0.25s ease',
};
