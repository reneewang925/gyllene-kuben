'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Star, Gift, ShoppingBag, User, Shield,
  ChevronRight, LogOut, Award,
} from 'lucide-react';
import { useAuth, useLang } from '@/app/providers';

// Tier metadata
const TIER_META: Record<string, { label: string; color: string; bg: string; nextTier?: string; nextAt?: number }> = {
  BRONZE:   { label: 'Bronze',   color: '#cd7f32', bg: 'rgba(205,127,50,0.1)',   nextTier: 'Silver',   nextAt: 1000 },
  SILVER:   { label: 'Silver',   color: '#b0b8c1', bg: 'rgba(176,184,193,0.1)',  nextTier: 'Gold',     nextAt: 3000 },
  GOLD:     { label: 'Gold',     color: '#d4af37', bg: 'rgba(212,175,55,0.12)',  nextTier: 'Platinum', nextAt: 5000 },
  PLATINUM: { label: 'Platinum', color: '#e8e0f0', bg: 'rgba(232,224,240,0.1)',  nextTier: undefined   },
};

const REWARDS = [
  { name: 'Exclusive Tea Tasting Kit',  points: 2000, icon: <Gift size={14} /> },
  { name: 'Free Shipping — 12 months', points: 1000, icon: <ShoppingBag size={14} /> },
  { name: 'Signed Art Print',          points: 5000, icon: <Award size={14} /> },
];

export default function KontoPage() {
  const { session, logout, isLoggedIn } = useAuth();
  const { lang }  = useLang();
  const router    = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) router.replace('/login');
  }, [isLoggedIn, router]);

  if (!session) return null;

  const tier     = TIER_META[session.tier] ?? TIER_META.BRONZE;
  const pts      = session.loyaltyPoints;
  const progress = tier.nextAt ? Math.min((pts / tier.nextAt) * 100, 100) : 100;

  function handleLogout() {
    logout();
    router.push('/');
  }

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid var(--border-subtle)',
    padding: '1.75rem',
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '7rem 1.5rem 4rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
          style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
            {lang === 'sv' ? 'Mitt konto' : 'My Account'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {lang === 'sv' ? `Välkommen, ${session.name.split(' ')[0]}` : `Welcome, ${session.name.split(' ')[0]}`}
          </h1>
        </motion.div>

        {/* Top grid: Membership card + quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

          {/* Membership card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            style={{ ...cardStyle, background: `linear-gradient(135deg, ${tier.bg}, rgba(10,6,8,0.95))`, position: 'relative', overflow: 'hidden' }}>
            {/* Decorative circle */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '140px', height: '140px', borderRadius: '50%', background: tier.bg, opacity: 0.6, pointerEvents: 'none' }} />
            <p style={{ fontSize: '0.52rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: tier.color, marginBottom: '0.35rem' }}>
              Gyllene Kuben
            </p>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{session.name}</p>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', letterSpacing: '0.04em' }}>{session.email}</p>

            {/* Tier badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: tier.bg, border: `1px solid ${tier.color}40`, marginBottom: '1.25rem' }}>
              <Star size={10} style={{ color: tier.color }} />
              <span style={{ fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: tier.color }}>{tier.label} Member</span>
            </div>

            {/* Points */}
            <p id="points" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.4rem', fontWeight: 300, color: 'var(--accent-gold)', lineHeight: 1 }}>
              {pts.toLocaleString('sv-SE')}
            </p>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginTop: '0.2rem' }}>
              {lang === 'sv' ? 'lojalitetspoäng' : 'loyalty points'}
            </p>

            {/* Progress to next tier */}
            {tier.nextTier && (
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                    {lang === 'sv' ? `Mot ${tier.nextTier}` : `Towards ${tier.nextTier}`}
                  </span>
                  <span style={{ fontSize: '0.55rem', color: tier.color }}>
                    {pts.toLocaleString('sv-SE')} / {tier.nextAt!.toLocaleString('sv-SE')} p
                  </span>
                </div>
                <div style={{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '1px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ delay: 0.5, duration: 0.9, ease: [0.16,1,0.3,1] }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${tier.color}80, ${tier.color})` }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick links card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.6 }}
            style={cardStyle}>
            <p style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {lang === 'sv' ? 'Snabblänkar' : 'Quick links'}
            </p>
            {[
              { href: '/konto#points',  icon: <Star size={13} />,        label: lang === 'sv' ? 'Lojalitetspoäng' : 'Loyalty Points' },
              { href: '/konto#rewards', icon: <Gift size={13} />,        label: lang === 'sv' ? 'Inlösen belöningar' : 'Redeem Rewards' },
              { href: '/konto#profile', icon: <User size={13} />,        label: lang === 'sv' ? 'Min profil' : 'My Profile' },
              { href: '/konto#privacy', icon: <Shield size={13} />,      label: lang === 'sv' ? 'Sekretesspolicy & GDPR' : 'Privacy & GDPR' },
              { href: '/kollektioner/porslin', icon: <ShoppingBag size={13} />, label: lang === 'sv' ? 'Fortsätt handla' : 'Continue shopping' },
            ].map(({ href, icon, label }) => (
              <Link key={href} href={href}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.72rem', letterSpacing: '0.05em', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>{icon}{label}</span>
                <ChevronRight size={11} />
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Rewards catalogue */}
        <motion.div id="rewards" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}
          style={{ ...cardStyle, marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            {lang === 'sv' ? 'Tillgängliga belöningar' : 'Available Rewards'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            {REWARDS.map((reward) => {
              const canRedeem = pts >= reward.points;
              return (
                <div key={reward.name} style={{ padding: '1.1rem', border: `1px solid ${canRedeem ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)'}`, background: canRedeem ? 'rgba(212,175,55,0.04)' : 'transparent', transition: 'all 0.3s' }}>
                  <div style={{ color: canRedeem ? 'var(--accent-gold)' : 'var(--text-secondary)', marginBottom: '0.6rem' }}>{reward.icon}</div>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.4rem', lineHeight: 1.3 }}>{reward.name}</p>
                  <p style={{ fontSize: '0.62rem', color: canRedeem ? 'var(--accent-gold)' : 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {reward.points.toLocaleString('sv-SE')} {lang === 'sv' ? 'poäng' : 'points'}
                  </p>
                  <button disabled={!canRedeem}
                    style={{ width: '100%', padding: '0.5rem', background: canRedeem ? 'rgba(212,175,55,0.15)' : 'transparent', border: `1px solid ${canRedeem ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.06)'}`, color: canRedeem ? 'var(--accent-gold)' : '#3a3530', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: canRedeem ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
                    {canRedeem ? (lang === 'sv' ? 'Lös in' : 'Redeem') : (lang === 'sv' ? 'Ej nog poäng' : 'Not enough points')}
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Profile & GDPR */}
        <motion.div id="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.6 }}
          style={{ ...cardStyle, marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            {lang === 'sv' ? 'Min profil' : 'My Profile'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: lang === 'sv' ? 'Namn' : 'Name', value: session.name },
              { label: lang === 'sv' ? 'E-post' : 'Email', value: session.email },
              { label: lang === 'sv' ? 'Tier' : 'Tier', value: tier.label },
              { label: lang === 'sv' ? 'Poäng' : 'Points', value: pts.toLocaleString('sv-SE') },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: '0.56rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{label}</p>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* GDPR section */}
        <motion.div id="privacy" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.6 }}
          style={{ ...cardStyle, marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Shield size={14} style={{ color: 'var(--accent-gold)' }} />
            <p style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              {lang === 'sv' ? 'Dina datarättigheter (GDPR)' : 'Your Data Rights (GDPR)'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: lang === 'sv' ? 'GDPR-samtycke' : 'GDPR Consent',         value: lang === 'sv' ? '✓ Lämnat' : '✓ Given' },
              { label: lang === 'sv' ? 'Marknadsförning' : 'Marketing consent',   value: lang === 'sv' ? 'Valfritt' : 'Optional' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--accent-gold)' }}>{value}</span>
              </div>
            ))}
            <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginTop: '0.4rem' }}>
              {lang === 'sv'
                ? 'Du har rätt att begära radering, rättelse och export av dina personuppgifter. Kontakta oss på privacy@gyllenekuben.se.'
                : 'You have the right to request deletion, correction, and export of your personal data. Contact us at privacy@gyllenekuben.se.'}
            </p>
          </div>
        </motion.div>

        {/* Logout */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={handleLogout}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(224,85,96,0.5)'; (e.currentTarget as HTMLElement).style.color = '#e05560'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
            <LogOut size={13} />
            {lang === 'sv' ? 'Logga ut' : 'Log out'}
          </button>
        </div>
      </div>
    </main>
  );
}
