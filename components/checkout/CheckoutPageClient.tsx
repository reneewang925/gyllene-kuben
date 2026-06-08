'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Check } from 'lucide-react';
import { useLang, useCart } from '@/app/providers';
import { t, formatPrice } from '@/lib/i18n';

type PaymentMethod = 'klarna' | 'swish' | 'card';

interface FormState {
  email: string;
  phone: string;
  name: string;
  address: string;
  address2: string;
  city: string;
  postal: string;
  country: string;
}

export function CheckoutPageClient() {
  const { lang } = useLang();
  const { items, totalOre, closeCart } = useCart();
  const [payment, setPayment] = useState<PaymentMethod>('klarna');
  const [form, setForm] = useState<FormState>({
    email: '', phone: '', name: '', address: '',
    address2: '', city: '', postal: '', country: 'Sverige',
  });

  const shippingOre = 0; // free shipping
  const totalWithShipping = totalOre + shippingOre;

  function handleField(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const paymentOptions: { key: PaymentMethod; icon: React.ReactNode; label: string; sub: string }[] = [
    {
      key: 'klarna',
      icon: <span style={{ fontFamily: 'var(--font-inter)', fontWeight: 700, fontSize: '0.75rem', color: '#1c0010' }}>K</span>,
      label: t('checkout.pay.klarna', lang),
      sub: lang === 'sv' ? 'Dela upp eller betala i efterhand.' : 'Split or pay later.',
    },
    {
      key: 'swish',
      icon: <Smartphone size={14} />,
      label: t('checkout.pay.swish', lang),
      sub: lang === 'sv' ? 'Betala direkt med Swish-appen.' : 'Pay instantly via the Swish app.',
    },
    {
      key: 'card',
      icon: <CreditCard size={14} />,
      label: t('checkout.pay.card', lang),
      sub: lang === 'sv' ? 'Visa, Mastercard, Amex.' : 'Visa, Mastercard, Amex.',
    },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '72px' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 420px',
          gap: '4rem',
          padding: '3rem 2.5rem 6rem',
          alignItems: 'start',
        }}
      >
        {/* ── LEFT — Form ─────────────────────────────────────────── */}
        <div>
          {/* Page title */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: '3rem' }}
          >
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
              Gyllene Kuben
            </p>
            <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
              {t('checkout.title', lang)}
            </h1>
          </motion.div>

          {/* Contact */}
          <FormSection title={t('checkout.contact', lang)} delay={0.1}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField label={t('checkout.email', lang)} id="email" type="email" value={form.email} onChange={(v) => handleField('email', v)} />
              <FormField label={t('checkout.phone', lang)} id="phone" type="tel" value={form.phone} onChange={(v) => handleField('phone', v)} />
            </div>
          </FormSection>

          {/* Shipping */}
          <FormSection title={t('checkout.shipping', lang)} delay={0.2}>
            <FormField label={t('checkout.name', lang)} id="name" value={form.name} onChange={(v) => handleField('name', v)} fullWidth />
            <FormField label={t('checkout.address', lang)} id="address" value={form.address} onChange={(v) => handleField('address', v)} fullWidth />
            <FormField label={t('checkout.address2', lang)} id="address2" value={form.address2} onChange={(v) => handleField('address2', v)} fullWidth />
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
              <FormField label={t('checkout.city', lang)} id="city" value={form.city} onChange={(v) => handleField('city', v)} />
              <FormField label={t('checkout.postal', lang)} id="postal" value={form.postal} onChange={(v) => handleField('postal', v)} />
              <FormField label={t('checkout.country', lang)} id="country" value={form.country} onChange={(v) => handleField('country', v)} />
            </div>
          </FormSection>

          {/* Payment */}
          <FormSection title={t('checkout.payment', lang)} delay={0.3}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {paymentOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setPayment(opt.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.1rem 1.25rem',
                    background: payment === opt.key ? 'rgba(212,175,55,0.06)' : 'var(--bg-card)',
                    border: `1px solid ${payment === opt.key ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.3s, background 0.3s',
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: payment === opt.key ? 'var(--accent-gold)' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: payment === opt.key ? 'var(--bg-primary)' : 'var(--text-muted)', flexShrink: 0, transition: 'background 0.3s, color 0.3s' }}>
                    {opt.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{opt.label}</p>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{opt.sub}</p>
                  </div>
                  {payment === opt.key && (
                    <Check size={14} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                  )}
                </button>
              ))}
            </div>
          </FormSection>

          {/* Swish placeholder */}
          {payment === 'swish' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}
            >
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                {lang === 'sv' ? 'QR-kod och betalningslänk genereras efter bekräftelse.' : 'QR code and payment link will be generated after confirmation.'}
              </p>
            </motion.div>
          )}

          {/* Card fields placeholder */}
          {payment === 'card' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ marginBottom: '2rem' }}
            >
              <FormField label={lang === 'sv' ? 'Kortnummer' : 'Card number'} id="card-number" value="" onChange={() => {}} fullWidth placeholder="•••• •••• •••• ••••" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <FormField label={lang === 'sv' ? 'Utgångsdatum' : 'Expiry'} id="card-expiry" value="" onChange={() => {}} placeholder="MM / ÅÅ" />
                <FormField label="CVC" id="card-cvc" value="" onChange={() => {}} placeholder="•••" />
              </div>
            </motion.div>
          )}

          {/* Submit */}
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '1.1rem 2rem', fontSize: '0.75rem', marginBottom: '1rem' }}
          >
            {t('checkout.submit', lang)}
          </button>

          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            🔒 {t('checkout.secure', lang)}<br />
            {t('checkout.terms', lang)}
          </p>
        </div>

        {/* ── RIGHT — Order Summary ────────────────────────────────── */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '2rem' }}
          >
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '1.5rem', letterSpacing: '0.04em' }}>
              {t('checkout.order.summary', lang)}
            </h2>

            {/* Line items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {items.map((item) => {
                const name = lang === 'sv' ? item.product.nameSv : item.product.nameEn;
                return (
                  <div key={item.product.id} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                      <Image
                        src={item.product.images[0] || '/images/placeholder.jpg'}
                        alt={name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="56px"
                      />
                      {/* Qty badge */}
                      <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--accent-gold)', color: 'var(--bg-primary)', fontFamily: 'var(--font-inter)', fontSize: '0.55rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.quantity}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '0.25rem' }}>{name}</p>
                      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>{formatPrice(item.product.priceOre, lang)} × {item.quantity}</p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', color: 'var(--accent-gold)', flexShrink: 0 }}>
                      {formatPrice(item.product.priceOre * item.quantity, lang)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={subtotalLabelStyle}>{t('checkout.order.shipping', lang)}</span>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.72rem', color: '#4caf7d' }}>{t('checkout.order.free', lang)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {t('checkout.order.total', lang)}
                </span>
                <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: 'var(--accent-gold)' }}>
                  {formatPrice(totalWithShipping, lang)}
                </span>
              </div>
            </div>

            {/* Payment icons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'center' }}>
              {['Klarna', 'Swish', 'Visa', 'MC'].map((m) => (
                <div key={m} style={{ padding: '0.2rem 0.5rem', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-inter)', fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{m}</div>
              ))}
            </div>
          </motion.div>

          {/* Back to cart */}
          <Link
            href="/"
            style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', fontFamily: 'var(--font-inter)', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', transition: 'color 0.3s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
          >
            {t('cart.continue', lang)}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Form helpers ─────────────────────────────────────────────────────────────

function FormSection({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      style={{ marginBottom: '2.5rem' }}
    >
      <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {children}
      </div>
    </motion.div>
  );
}

function FormField({ label, id, type = 'text', value, onChange, fullWidth, placeholder }: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; fullWidth?: boolean; placeholder?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label htmlFor={id} style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '0.7rem 0.9rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-inter)',
          fontSize: '0.82rem',
          outline: 'none',
          transition: 'border-color 0.3s',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-gold)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
      />
    </div>
  );
}

const subtotalLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '0.72rem',
  color: 'var(--text-muted)',
  letterSpacing: '0.08em',
};
