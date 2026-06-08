'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Shield, ShieldOff, Star, Gift, ChevronDown, ChevronUp,
  Plus, Minus, Check, X, Users, Award, Clock,
} from 'lucide-react';
import type { Member, RedemptionRequest, Reward, MemberTier, RedemptionStatus } from '@/lib/types';

interface Props {
  initialMembers: Member[];
  initialRedemptions: RedemptionRequest[];
  rewards: Reward[];
}

type ActiveTab = 'members' | 'redemptions';

const TIER_META: Record<MemberTier, { label: string; color: string; bg: string }> = {
  BRONZE:   { label: 'Bronze',   color: '#cd7f32', bg: 'rgba(205,127,50,0.12)' },
  SILVER:   { label: 'Silver',   color: '#b0b8c1', bg: 'rgba(176,184,193,0.12)' },
  GOLD:     { label: 'Gold',     color: '#d4af37', bg: 'rgba(212,175,55,0.15)' },
  PLATINUM: { label: 'Platinum', color: '#e8e0f0', bg: 'rgba(232,224,240,0.15)' },
};

const STATUS_META: Record<RedemptionStatus, { label: string; color: string }> = {
  PENDING:   { label: 'Väntar',    color: '#d4af37' },
  APPROVED:  { label: 'Godkänd',   color: '#4caf7d' },
  SHIPPED:   { label: 'Skickad',   color: '#60a5fa' },
  CANCELLED: { label: 'Avbruten',  color: '#e05560' },
};

export function AdminMembersClient({ initialMembers, initialRedemptions, rewards }: Props) {
  const [members, setMembers]           = useState<Member[]>(initialMembers);
  const [redemptions, setRedemptions]   = useState<RedemptionRequest[]>(initialRedemptions);
  const [activeTab, setActiveTab]       = useState<ActiveTab>('members');
  const [search, setSearch]             = useState('');
  const [tierFilter, setTierFilter]     = useState<MemberTier | 'all'>('all');
  const [expanded, setExpanded]         = useState<number | null>(null);
  const [pointsModal, setPointsModal]   = useState<Member | null>(null);

  const filteredMembers = members.filter((m) =>
    (tierFilter === 'all' || m.tier === tierFilter) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
     m.email.toLowerCase().includes(search.toLowerCase()))
  );

  // Stats
  const totalPoints = members.reduce((s, m) => s + m.loyaltyPoints, 0);
  const pendingCount = redemptions.filter((r) => r.status === 'PENDING').length;

  return (
    <div style={{ padding: '2.5rem', color: '#f0ebe0', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, color: '#f0ebe0', marginBottom: '0.3rem' }}>
          Medlemmar & Lojalitet
        </h1>
        <p style={{ fontSize: '0.68rem', color: '#5a5550', letterSpacing: '0.06em' }}>
          GDPR-kompatibel kundlista · Poängregister · Inlösningskö
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: <Users size={16} />, label: 'Aktiva Medlemmar', value: members.filter((m) => m.isActive).length },
          { icon: <Star size={16} />, label: 'Platinum / Gold', value: members.filter((m) => m.tier === 'PLATINUM' || m.tier === 'GOLD').length },
          { icon: <Award size={16} />, label: 'Totala Poäng (aktiva)', value: totalPoints.toLocaleString('sv-SE') },
          { icon: <Gift size={16} />, label: 'Inlösen Väntar', value: pendingCount },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: '#131315', border: '1px solid rgba(255,255,255,0.06)', padding: '1.1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5a5550', marginBottom: '0.5rem' }}>
              {kpi.icon}
              <span style={{ fontSize: '0.56rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{kpi.label}</span>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, color: '#d4af37' }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.5rem' }}>
        {[{ key: 'members' as const, label: 'Kundlista' }, { key: 'redemptions' as const, label: `Inlösningskö (${pendingCount})` }].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{ padding: '0.85rem 1.5rem', background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === key ? '#d4af37' : 'transparent'}`, color: activeTab === key ? '#d4af37' : '#5a5550', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s', marginBottom: '-1px' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Members tab */}
      {activeTab === 'members' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={13} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#5a5550' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Sök namn eller e-post…"
                style={{ width: '100%', padding: '0.6rem 0.9rem 0.6rem 2.2rem', background: '#131315', border: '1px solid rgba(255,255,255,0.08)', color: '#f0ebe0', fontSize: '0.75rem', outline: 'none' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {(['all', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  style={{ padding: '0.5rem 0.85rem', background: tierFilter === t ? 'rgba(212,175,55,0.1)' : 'transparent', border: `1px solid ${tierFilter === t ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.08)'}`, color: tierFilter === t ? '#d4af37' : '#5a5550', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  {t === 'all' ? 'Alla' : t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Table header */}
          <div style={{ background: '#0f0f11', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.7rem 1.25rem', display: 'grid', gridTemplateColumns: '2fr 1fr 80px 90px 100px 110px 80px', gap: '0.5rem', fontSize: '0.56rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5a5550', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span>Kund</span><span>Tier</span><span>Poäng</span><span>GDPR</span><span>Marknadsf.</span><span>Registrerad</span><span></span>
          </div>

          {/* Member rows */}
          {filteredMembers.map((member, i) => {
            const tierMeta = TIER_META[member.tier];
            const isExp = expanded === member.id;
            return (
              <div key={member.id} style={{ border: '1px solid rgba(255,255,255,0.04)', borderTop: 'none' }}>
                {/* Main row */}
                <div
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 90px 100px 110px 80px', gap: '0.5rem', padding: '0.9rem 1.25rem', background: i % 2 === 0 ? '#0a0a0b' : '#0c0c0d', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                  onClick={() => setExpanded(isExp ? null : member.id)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#131315'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#0a0a0b' : '#0c0c0d'; }}
                >
                  <div>
                    <p style={{ fontSize: '0.8rem', color: member.isActive ? '#f0ebe0' : '#5a5550', fontFamily: "'Cormorant Garamond', serif" }}>{member.name}</p>
                    <p style={{ fontSize: '0.6rem', color: '#5a5550', letterSpacing: '0.04em' }}>{member.email}</p>
                  </div>
                  {/* Tier badge */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.55rem', background: tierMeta.bg, border: `1px solid ${tierMeta.color}30` }}>
                    <span style={{ fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: tierMeta.color }}>{tierMeta.label}</span>
                  </div>
                  {/* Points */}
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#d4af37' }}>
                    {member.loyaltyPoints.toLocaleString('sv-SE')}
                  </span>
                  {/* GDPR */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {member.gdprConsent
                      ? <><Shield size={11} style={{ color: '#4caf7d' }} /><span style={{ fontSize: '0.58rem', color: '#4caf7d' }}>Samtyckt</span></>
                      : <><ShieldOff size={11} style={{ color: '#e05560' }} /><span style={{ fontSize: '0.58rem', color: '#e05560' }}>Ej lämnat</span></>}
                  </div>
                  {/* Marketing */}
                  <span style={{ fontSize: '0.6rem', color: member.marketingConsent ? '#4caf7d' : '#5a5550' }}>
                    {member.marketingConsent ? '● Ja' : '○ Nej'}
                  </span>
                  {/* Date */}
                  <span style={{ fontSize: '0.6rem', color: '#5a5550' }}>
                    {new Date(member.createdAt).toLocaleDateString('sv-SE')}
                  </span>
                  {/* Expand */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {isExp ? <ChevronUp size={13} style={{ color: '#d4af37' }} /> : <ChevronDown size={13} style={{ color: '#5a5550' }} />}
                  </div>
                </div>

                {/* Expanded ledger */}
                <AnimatePresence>
                  {isExp && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '1.25rem 1.25rem 1.5rem', background: '#0f0f11', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          {/* GDPR details */}
                          <div>
                            <p style={{ fontSize: '0.56rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5a5550', marginBottom: '0.75rem' }}>GDPR-detaljer</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              {member.gdprConsentAt && <GdprRow label="Samtycke daterat" value={new Date(member.gdprConsentAt).toLocaleString('sv-SE')} />}
                              {member.gdprConsentIp && <GdprRow label="IP-adress" value={member.gdprConsentIp} />}
                              <GdprRow label="Marknadsföring" value={member.marketingConsent ? 'Ja' : 'Nej'} />
                              <GdprRow label="Konto aktivt" value={member.isActive ? 'Ja' : 'Inaktiverat'} />
                            </div>
                          </div>

                          {/* Points ledger */}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                              <p style={{ fontSize: '0.56rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5a5550' }}>Poängregister</p>
                              <button
                                onClick={(e) => { e.stopPropagation(); setPointsModal(member); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.7rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', fontSize: '0.56rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                              >
                                <Plus size={9} /> Justera
                              </button>
                            </div>
                            {(member.pointsTransactions ?? []).slice(-5).reverse().map((tx) => (
                              <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <div>
                                  <p style={{ fontSize: '0.62rem', color: '#a09890' }}>{tx.reason}</p>
                                  <p style={{ fontSize: '0.55rem', color: '#3a3530' }}>{new Date(tx.createdAt).toLocaleDateString('sv-SE')}</p>
                                </div>
                                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', color: tx.delta > 0 ? '#4caf7d' : '#e05560', flexShrink: 0, marginLeft: '1rem' }}>
                                  {tx.delta > 0 ? '+' : ''}{tx.delta.toLocaleString('sv-SE')}
                                </span>
                              </div>
                            ))}
                            {(!member.pointsTransactions || member.pointsTransactions.length === 0) && (
                              <p style={{ fontSize: '0.62rem', color: '#3a3530' }}>Inga transaktioner.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </>
      )}

      {/* Redemptions tab */}
      {activeTab === 'redemptions' && (
        <div>
          <p style={{ fontSize: '0.65rem', color: '#5a5550', marginBottom: '1.5rem', lineHeight: 1.65 }}>
            Inlösningsbegäran som ska paketeras med nästa order. Godkänn, skicka eller avbryt varje begäran.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {redemptions.map((r) => {
              const statusMeta = STATUS_META[r.status];
              const reward = rewards.find((rw) => rw.id === r.rewardId);
              return (
                <div key={r.id} style={{ background: '#131315', border: '1px solid rgba(255,255,255,0.06)', padding: '1.1rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#f0ebe0' }}>{r.memberName}</span>
                      <span style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: statusMeta.color, padding: '0.15rem 0.5rem', border: `1px solid ${statusMeta.color}40` }}>{statusMeta.label}</span>
                    </div>
                    <p style={{ fontSize: '0.62rem', color: '#5a5550', marginBottom: '0.25rem' }}>{r.memberEmail}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Gift size={11} style={{ color: '#d4af37' }} />
                      <p style={{ fontSize: '0.68rem', color: '#a09890' }}>{r.rewardName}</p>
                      {reward && <span style={{ fontSize: '0.55rem', color: '#5a5550' }}>— {reward.pointsCost.toLocaleString('sv-SE')} p</span>}
                    </div>
                    {r.adminNote && <p style={{ fontSize: '0.6rem', color: '#5a5550', marginTop: '0.35rem', fontStyle: 'italic' }}>"{r.adminNote}"</p>}
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.55rem', color: '#3a3530', marginTop: '0.3rem' }}>
                      <Clock size={9} /> {new Date(r.createdAt).toLocaleString('sv-SE')}
                    </p>
                  </div>
                  {/* Actions */}
                  {r.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => setRedemptions((prev) => prev.map((x) => x.id === r.id ? { ...x, status: 'APPROVED' as const } : x))}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.8rem', background: 'rgba(76,175,125,0.12)', border: '1px solid rgba(76,175,125,0.3)', color: '#4caf7d', fontSize: '0.6rem', cursor: 'pointer' }}
                      >
                        <Check size={10} /> Godkänn
                      </button>
                      <button
                        onClick={() => setRedemptions((prev) => prev.map((x) => x.id === r.id ? { ...x, status: 'CANCELLED' as const } : x))}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.8rem', background: 'rgba(224,85,96,0.08)', border: '1px solid rgba(224,85,96,0.3)', color: '#e05560', fontSize: '0.6rem', cursor: 'pointer' }}
                      >
                        <X size={10} /> Avbryt
                      </button>
                    </div>
                  )}
                  {r.status === 'APPROVED' && (
                    <button
                      onClick={() => setRedemptions((prev) => prev.map((x) => x.id === r.id ? { ...x, status: 'SHIPPED' as const } : x))}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.8rem', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', fontSize: '0.6rem', cursor: 'pointer' }}
                    >
                      <Check size={10} /> Markera skickad
                    </button>
                  )}
                </div>
              );
            })}
            {redemptions.length === 0 && (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#3a3530', fontSize: '0.8rem' }}>
                Inga inlösningsbegäran.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Points adjustment modal */}
      <AnimatePresence>
        {pointsModal && (
          <PointsModal
            member={pointsModal}
            onClose={() => setPointsModal(null)}
            onAdjust={(delta, reason, note) => {
              setMembers((prev) => prev.map((m) => m.id === pointsModal.id
                ? { ...m, loyaltyPoints: m.loyaltyPoints + delta, pointsTransactions: [...(m.pointsTransactions ?? []), { id: Date.now(), memberId: m.id, delta, reason, adminNote: note, createdAt: new Date().toISOString() }] }
                : m
              ));
              setPointsModal(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── GDPR Row ─────────────────────────────────────────────────────────────────

function GdprRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
      <span style={{ fontSize: '0.58rem', color: '#5a5550', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontSize: '0.62rem', color: '#a09890' }}>{value}</span>
    </div>
  );
}

// ─── Points Adjustment Modal ──────────────────────────────────────────────────

function PointsModal({ member, onClose, onAdjust }: {
  member: Member;
  onClose: () => void;
  onAdjust: (delta: number, reason: string, note: string) => void;
}) {
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#131315', border: '1px solid rgba(212,175,55,0.2)', padding: '2rem', width: '420px', maxWidth: '90vw' }}
      >
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#f0ebe0', marginBottom: '0.3rem' }}>Justera Poäng</h3>
        <p style={{ fontSize: '0.65rem', color: '#5a5550', marginBottom: '1.5rem' }}>{member.name} — Nuvarande: {member.loyaltyPoints.toLocaleString('sv-SE')} p</p>

        {/* Delta */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.56rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a5550', marginBottom: '0.35rem' }}>
            Justering (+ för tillägg, – för avdrag)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => setDelta((d) => d - 50)} style={adjBtn}><Minus size={11} /></button>
            <input
              type="number"
              value={delta}
              onChange={(e) => setDelta(parseInt(e.target.value) || 0)}
              style={{ flex: 1, padding: '0.6rem', background: '#0a0a0b', border: '1px solid rgba(255,255,255,0.08)', color: delta > 0 ? '#4caf7d' : delta < 0 ? '#e05560' : '#f0ebe0', fontSize: '1rem', textAlign: 'center', outline: 'none', fontFamily: "'Cormorant Garamond', serif" }}
            />
            <button onClick={() => setDelta((d) => d + 50)} style={adjBtn}><Plus size={11} /></button>
          </div>
          <p style={{ fontSize: '0.6rem', color: '#5a5550', marginTop: '0.4rem' }}>
            Nytt saldo: <span style={{ color: '#d4af37' }}>{(member.loyaltyPoints + delta).toLocaleString('sv-SE')} p</span>
          </p>
        </div>

        {/* Reason */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.56rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a5550', marginBottom: '0.35rem' }}>Orsak (visas för kund)</label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Admin-justering — Kompensation försenad frakt"
            style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#0a0a0b', border: '1px solid rgba(255,255,255,0.08)', color: '#f0ebe0', fontSize: '0.75rem', outline: 'none' }}
          />
        </div>

        {/* Admin note */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.56rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a5550', marginBottom: '0.35rem' }}>Admin-anteckning (intern)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Intern notering…"
            style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#0a0a0b', border: '1px solid rgba(255,255,255,0.08)', color: '#a09890', fontSize: '0.72rem', outline: 'none', resize: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '0.7rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#5a5550', fontSize: '0.65rem', cursor: 'pointer' }}
          >
            Avbryt
          </button>
          <button
            onClick={() => { if (delta !== 0 && reason.trim()) onAdjust(delta, reason, note); }}
            disabled={delta === 0 || !reason.trim()}
            style={{ flex: 2, padding: '0.7rem', background: 'linear-gradient(135deg, #a11d23, #d4af37)', border: 'none', color: '#f0ebe0', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: delta === 0 || !reason.trim() ? 'not-allowed' : 'pointer', opacity: delta === 0 || !reason.trim() ? 0.5 : 1 }}
          >
            Bekräfta justering
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const adjBtn: React.CSSProperties = {
  width: '36px', height: '36px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#a09890', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};
