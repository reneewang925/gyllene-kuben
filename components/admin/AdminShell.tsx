'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, LogOut, ChevronRight, Lock,
  Package, PlusCircle, Layers, Users, LayoutDashboard,
} from 'lucide-react';

interface Props { children: React.ReactNode; }

export function AdminShell({ children }: Props) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);

  function tryLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pin === '1234') {
      setAuthed(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPin('');
    }
  }

  // ── Auth gate ────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={shake ? { x: [-12, 12, -10, 10, -6, 6, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ background: '#131315', border: '1px solid rgba(212,175,55,0.12)', padding: '3rem', width: '360px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <Lock size={16} style={{ color: '#d4af37' }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#d4af37' }}>
              Gyllene Kuben Admin
            </span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, color: '#f0ebe0', marginBottom: '0.5rem' }}>
            Välkommen
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#5a5550', marginBottom: '2rem' }}>
            Demo PIN: <span style={{ color: '#d4af37', letterSpacing: '0.2em' }}>1234</span>
          </p>
          <form onSubmit={tryLogin}>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Ange PIN-kod"
              maxLength={8}
              autoFocus
              style={{ width: '100%', padding: '0.8rem 1rem', background: '#1a1a1c', border: '1px solid rgba(255,255,255,0.08)', color: '#f0ebe0', fontFamily: "'Inter', sans-serif", fontSize: '1rem', letterSpacing: '0.3em', outline: 'none', marginBottom: '1rem', textAlign: 'center' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
            <button
              type="submit"
              style={{ width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #a11d23, #d4af37)', border: 'none', color: '#f0ebe0', fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Logga in
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Sidebar nav groups ──────────────────────────────────────────────────────
  const navGroups = [
    {
      label: 'Katalog',
      links: [
        { href: '/admin/products',     label: 'Produkter',    icon: <Package size={14} /> },
        { href: '/admin/products/new', label: 'Ny produkt',   icon: <PlusCircle size={14} /> },
      ],
    },
    {
      label: 'Innehåll',
      links: [
        { href: '/admin/banners',      label: 'Banners & Tema', icon: <Layers size={14} /> },
        { href: '/admin/journal',      label: 'Kulturjournal',  icon: <BookOpen size={14} /> },
        { href: '/admin/journal/new',  label: 'Ny artikel',     icon: <PlusCircle size={14} /> },
      ],
    },
    {
      label: 'Kunder',
      links: [
        { href: '/admin/members', label: 'Medlemmar & GDPR', icon: <Users size={14} /> },
      ],
    },
    {
      label: 'System',
      links: [
        { href: '/admin',         label: 'Översikt',        icon: <LayoutDashboard size={14} /> },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0b', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside style={{ width: '240px', flexShrink: 0, background: '#0f0f11', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '0' }}>
        {/* Logo block */}
        <div style={{ padding: '1.75rem 1.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '0.52rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: '#d4af37', marginBottom: '0.3rem' }}>Admin Panel</p>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', letterSpacing: '0.12em', color: '#f0ebe0' }}>
            Gyllene Kuben
          </span>
        </div>

        {/* Nav groups */}
        <nav style={{ flex: 1, padding: '1.25rem 0.75rem', overflowY: 'auto' }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.5rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: '#3a3530', padding: '0 0.75rem', marginBottom: '0.5rem' }}>
                {group.label}
              </p>
              {group.links.map((link) => {
                const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href) && link.href.length > '/admin'.length);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.62rem 0.75rem', marginBottom: '0.15rem', background: active ? 'rgba(212,175,55,0.08)' : 'transparent', borderLeft: active ? '2px solid #d4af37' : '2px solid transparent', color: active ? '#d4af37' : '#5a5550', fontSize: '0.7rem', letterSpacing: '0.05em', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.color = '#a09890'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; } }}
                    onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.color = '#5a5550'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}
                  >
                    {link.icon}
                    <span style={{ flex: 1 }}>{link.label}</span>
                    {active && <ChevronRight size={10} />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setAuthed(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#5a5550', fontSize: '0.66rem', letterSpacing: '0.08em', padding: '0.4rem 0', transition: 'color 0.2s', width: '100%' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#e05560'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#5a5550'; }}
          >
            <LogOut size={12} /> Logga ut
          </button>
          <Link
            href="/"
            style={{ display: 'block', marginTop: '0.6rem', fontSize: '0.6rem', color: '#3a3530', letterSpacing: '0.05em', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#5a5550'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#3a3530'; }}
          >
            ← Tillbaka till butiken
          </Link>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
