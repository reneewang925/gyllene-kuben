'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Sun, Moon, Globe, Menu, X,
  User, Star, LogOut, LayoutDashboard,
} from 'lucide-react';
import { useTheme, useLang, useCart, useAuth } from '@/app/providers';
import { t } from '@/lib/i18n';

// ─── Nav item definitions ──────────────────────────────────────────────────────

const navItems = [
  { key: 'nav.porcelain'  as const, slug: '/kollektioner/porslin'    },
  { key: 'nav.bronze'     as const, slug: '/kollektioner/bronskonst' },
  { key: 'nav.teaware'    as const, slug: '/kollektioner/tekannor'   },
  { key: 'nav.tea'        as const, slug: '/kollektioner/premium-te' },
  { key: 'nav.meditation' as const, slug: '/kollektioner/meditation' },
] as const;

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang }   = useLang();
  const { totalItems, openCart } = useCart();
  const { session, logout, isLoggedIn } = useAuth();
  const router = useRouter();

  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [accountOpen,  setAccountOpen]  = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleAccountClick() {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setAccountOpen((v) => !v);
    }
  }

  function handleLogout() {
    logout();
    setAccountOpen(false);
    router.push('/');
  }

  // Tier badge colour
  const tierColor: Record<string, string> = {
    BRONZE: '#cd7f32', SILVER: '#b0b8c1', GOLD: '#d4af37', PLATINUM: '#e8e0f0',
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
          background:      scrolled ? 'var(--gradient-header)' : 'transparent',
          backdropFilter:  scrolled ? 'blur(20px)' : 'none',
          borderBottom:    scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* ── Inner container: logo far-left · nav+utils far-right ─────────── */}
        <div style={{
          maxWidth: '1500px', margin: '0 auto',
          padding: '0 2.5rem', height: '72px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '2rem',
        }}>

          {/* ── FAR LEFT: Logotype ─────────────────────────────────────────── */}
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.35rem',
              fontWeight: 400,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            Gyllene Kuben
          </Link>

          {/* ── FAR RIGHT: All nav links + utility strip ────────────────────── */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '0', flexShrink: 0,
          }}>
            {/* Desktop nav — all 5 categories tightly clustered */}
            <nav
              className="hidden lg:flex"
              style={{ alignItems: 'center', gap: '2rem', marginRight: '2.25rem' }}
            >
              {navItems.map((item) => (
                <NavLink key={item.key} href={item.slug} label={t(item.key, lang)} />
              ))}
              {/* Pip separator */}
              <div style={{ width: '1px', height: '14px', background: 'var(--border-subtle)', flexShrink: 0 }} />
              <NavLink href="/journal" label={lang === 'sv' ? 'Journal' : 'Journal'} accent />
            </nav>

            {/* ── Utility strip ─────────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>

              {/* Language toggle */}
              <UtilButton id="lang-toggle" onClick={toggleLang} aria-label="Toggle language">
                <Globe size={12} />
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.64rem', letterSpacing: '0.12em', lineHeight: 1 }}>
                  {lang === 'sv' ? 'SV' : 'EN'}
                </span>
              </UtilButton>

              {/* Theme toggle */}
              <UtilButton id="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" square>
                {theme === 'imperial' ? <Sun size={13} /> : <Moon size={13} />}
              </UtilButton>

              {/* Separator */}
              <div className="hidden lg:block" style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', margin: '0 0.15rem' }} />

              {/* ── Account button + dropdown ─────────────────────────────── */}
              <div ref={accountRef} style={{ position: 'relative' }} className="hidden lg:block">
                <button
                  id="account-btn"
                  onClick={handleAccountClick}
                  aria-label={isLoggedIn ? 'Account menu' : 'Login'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    border: isLoggedIn ? '1px solid rgba(212,175,55,0.35)' : '1px solid var(--border-primary)',
                    background: isLoggedIn ? 'rgba(212,175,55,0.05)' : 'transparent',
                    color: isLoggedIn ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.64rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-gold)';
                    e.currentTarget.style.color = 'var(--accent-gold)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isLoggedIn ? 'rgba(212,175,55,0.35)' : 'var(--border-primary)';
                    e.currentTarget.style.color = isLoggedIn ? 'var(--accent-gold)' : 'var(--text-secondary)';
                  }}
                >
                  <User size={12} />
                  {isLoggedIn
                    ? <span>{session!.name.split(' ')[0]}</span>
                    : <span>{lang === 'sv' ? 'Konto' : 'Login'}</span>
                  }
                </button>

                {/* Account dropdown */}
                <AnimatePresence>
                  {accountOpen && isLoggedIn && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 0.6rem)', right: 0,
                        width: '220px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        backdropFilter: 'blur(20px)',
                        zIndex: 999,
                        overflow: 'hidden',
                      }}
                    >
                      {/* Member header */}
                      <div style={{
                        padding: '1rem 1.1rem 0.85rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        background: 'rgba(212,175,55,0.04)',
                      }}>
                        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                          {session!.name}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Star size={9} style={{ color: tierColor[session!.tier] ?? '#d4af37', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: tierColor[session!.tier] ?? '#d4af37' }}>
                            {session!.tier.charAt(0) + session!.tier.slice(1).toLowerCase()} Member
                          </span>
                        </div>
                        <p style={{ marginTop: '0.4rem', fontFamily: 'var(--font-cormorant)', fontSize: '0.9rem', color: 'var(--accent-gold)' }}>
                          {session!.loyaltyPoints.toLocaleString('sv-SE')} {lang === 'sv' ? 'poäng' : 'points'}
                        </p>
                      </div>

                      {/* Links */}
                      <div style={{ padding: '0.5rem 0' }}>
                        <DropdownLink href="/konto" icon={<LayoutDashboard size={12} />} label={lang === 'sv' ? 'Mitt konto' : 'My Account'} onClick={() => setAccountOpen(false)} />
                        <DropdownLink href="/konto#points" icon={<Star size={12} />} label={lang === 'sv' ? 'Lojalitetspoäng' : 'Loyalty Points'} onClick={() => setAccountOpen(false)} />
                      </div>

                      {/* Logout */}
                      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '0.5rem' }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.55rem',
                            width: '100%', padding: '0.6rem 0.65rem',
                            background: 'transparent', border: 'none',
                            color: 'var(--text-secondary)', fontSize: '0.65rem',
                            letterSpacing: '0.08em', cursor: 'pointer',
                            transition: 'color 0.2s', textAlign: 'left',
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#e05560'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
                        >
                          <LogOut size={12} />
                          {lang === 'sv' ? 'Logga ut' : 'Log out'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <button
                id="cart-open-btn"
                onClick={openCart}
                aria-label="Open cart"
                style={{
                  position: 'relative', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', width: '34px', height: '34px',
                  background: 'transparent', border: 'none',
                  color: 'var(--text-primary)', cursor: 'pointer',
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-gold)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              >
                <ShoppingBag size={18} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{
                        position: 'absolute', top: '-3px', right: '-3px',
                        width: '16px', height: '16px',
                        background: 'var(--accent-gold)', color: 'var(--bg-primary)',
                        fontSize: '0.52rem', fontWeight: 700,
                        fontFamily: 'var(--font-inter)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '50%',
                      }}
                    >
                      {totalItems > 9 ? '9+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile hamburger */}
              <button
                className="flex lg:hidden"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
                style={{
                  display: 'flex', background: 'transparent', border: 'none',
                  color: 'var(--text-primary)', cursor: 'pointer', padding: '0.25rem',
                }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', top: '72px', left: 0, right: 0, zIndex: 899,
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '2rem 2.5rem',
              display: 'flex', flexDirection: 'column', gap: '1.5rem',
            }}
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.055, duration: 0.35 }}
              >
                <Link
                  href={item.slug}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem',
                    color: 'var(--text-primary)', letterSpacing: '0.05em', textDecoration: 'none',
                  }}
                >
                  {t(item.key, lang)}
                </Link>
              </motion.div>
            ))}

            {/* Journal */}
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navItems.length * 0.055, duration: 0.35 }}>
              <Link href="/journal" onClick={() => setMobileOpen(false)}
                style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', color: 'var(--accent-gold)', letterSpacing: '0.05em', textDecoration: 'none' }}>
                {lang === 'sv' ? 'Kulturjournal' : 'Cultural Journal'}
              </Link>
            </motion.div>

            {/* Account mobile */}
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (navItems.length + 1) * 0.055, duration: 0.35 }}>
              <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)', marginBottom: '0.5rem' }} />
              {isLoggedIn ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link href="/konto" onClick={() => setMobileOpen(false)}
                    style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    {lang === 'sv' ? 'Mitt konto' : 'My Account'}
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }}
                    style={{ fontFamily: 'var(--font-inter)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e05560', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                    {lang === 'sv' ? 'Logga ut' : 'Log out'}
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  {lang === 'sv' ? 'Logga in / Konto' : 'Login / Account'}
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavLink({ href, label, accent = false }: { href: string; label: string; accent?: boolean }) {
  return (
    <Link
      href={href}
      style={{
        fontFamily: 'var(--font-inter)',
        fontSize: '0.68rem',
        fontWeight: 400,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: accent ? 'var(--accent-gold)' : 'var(--text-secondary)',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'color 0.25s ease',
        opacity: accent ? 0.88 : 1,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)';
        (e.currentTarget as HTMLElement).style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = accent ? 'var(--accent-gold)' : 'var(--text-secondary)';
        (e.currentTarget as HTMLElement).style.opacity = accent ? '0.88' : '1';
      }}
    >
      {label}
    </Link>
  );
}

function UtilButton({
  children, onClick, id, 'aria-label': ariaLabel, square = false,
}: {
  children: React.ReactNode; onClick: () => void;
  id?: string; 'aria-label'?: string; square?: boolean;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
        padding: square ? '0' : '0.28rem 0.55rem',
        width: square ? '32px' : undefined,
        height: '32px',
        border: '1px solid var(--border-primary)',
        background: 'transparent',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'border-color 0.25s ease, color 0.25s ease',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-hover)';
        e.currentTarget.style.color = 'var(--accent-gold)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-primary)';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }}
    >
      {children}
    </button>
  );
}

function DropdownLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        padding: '0.6rem 1.1rem',
        color: 'var(--text-secondary)',
        fontSize: '0.68rem',
        letterSpacing: '0.06em',
        textDecoration: 'none',
        transition: 'color 0.2s, background 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.05)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
        (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
    >
      {icon} {label}
    </Link>
  );
}
