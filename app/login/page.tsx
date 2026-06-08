'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/app/providers';
import { useLang } from '@/app/providers';

// Demo credentials that trigger a successful mock login
const DEMO_ACCOUNTS = [
  { email: 'sofia.lindqvist@example.se', password: 'gyllene2024', id: 1, name: 'Sofia Lindqvist', tier: 'GOLD' as const,     loyaltyPoints: 3240 },
  { email: 'mei.chen@example.eu',        password: 'gyllene2024', id: 5, name: 'Mei Chen',        tier: 'PLATINUM' as const, loyaltyPoints: 5800 },
];

export default function LoginPage() {
  const { login }   = useAuth();
  const { lang }    = useLang();
  const router      = useRouter();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // mock network

    const match = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase().trim() && a.password === password
    );
    if (match) {
      login({ id: match.id, name: match.name, email: match.email, tier: match.tier, loyaltyPoints: match.loyaltyPoints });
      router.push('/konto');
    } else {
      setError(lang === 'sv' ? 'Fel e-post eller lösenord.' : 'Incorrect email or password.');
    }
    setLoading(false);
  }

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '6rem 1.5rem 3rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        {/* Brand mark */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
            Gyllene Kuben
          </p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.2rem', fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
            {lang === 'sv' ? 'Välkommen tillbaka' : 'Welcome back'}
          </h1>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            {lang === 'sv' ? 'Logga in på ditt konto' : 'Sign in to your account'}
          </p>
        </div>

        {/* Demo hint */}
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)', marginBottom: '1.75rem' }}>
          <p style={{ fontSize: '0.62rem', color: 'var(--accent-gold)', letterSpacing: '0.06em', lineHeight: 1.55 }}>
            <strong>Demo:</strong> sofia.lindqvist@example.se / gyllene2024
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email */}
          <div>
            <label style={labelStyle}>{lang === 'sv' ? 'E-postadress' : 'Email address'}</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required autoComplete="email"
              placeholder="namn@example.se"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>{lang === 'sv' ? 'Lösenord' : 'Password'}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)}
                required autoComplete="current-password"
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: '2.8rem' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
              <button type="button" onClick={() => setShowPass((v) => !v)}
                style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: '0.68rem', color: '#e05560', letterSpacing: '0.04em' }}>
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <motion.button
            type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
            style={{
              marginTop: '0.5rem', padding: '0.9rem',
              background: loading ? 'rgba(212,175,55,0.3)' : 'linear-gradient(135deg, #a11d23, #d4af37)',
              border: 'none', color: 'var(--text-primary)',
              fontFamily: 'var(--font-inter)', fontSize: '0.7rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            {loading ? (lang === 'sv' ? 'Loggar in…' : 'Signing in…') : (
              <>{lang === 'sv' ? 'Logga in' : 'Sign in'} <ArrowRight size={14} /></>
            )}
          </motion.button>
        </form>

        {/* Footer links */}
        <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <Link href="/register" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.06em', textDecoration: 'none' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
            {lang === 'sv' ? 'Inget konto? Registrera dig' : "Don't have an account? Register"}
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
