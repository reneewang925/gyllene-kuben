'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, CreditCard, Smartphone } from 'lucide-react';
import Image from 'next/image';
import { useCart, useLang } from '@/app/providers';
import { t, formatPrice } from '@/lib/i18n';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalOre } = useCart();
  const { lang } = useLang();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="cart-backdrop"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '460px',
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-subtle)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.5rem 1.75rem',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShoppingBag size={18} style={{ color: 'var(--accent-gold)' }} />
                <h2
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    letterSpacing: '0.06em',
                    color: 'var(--text-primary)',
                  }}
                >
                  {t('cart.title', lang)}
                </h2>
              </div>
              <button
                id="cart-close-btn"
                onClick={closeCart}
                aria-label="Close cart"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s, color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.75rem' }}>
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      gap: '1rem',
                      paddingTop: '4rem',
                    }}
                  >
                    <ShoppingBag size={40} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                    <p
                      style={{
                        fontFamily: 'var(--font-cormorant)',
                        fontSize: '1.1rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {t('cart.empty', lang)}
                    </p>
                    <button className="btn-ghost" onClick={closeCart} style={{ marginTop: '0.5rem' }}>
                      {t('cart.continue', lang)}
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '1.25rem 0',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      {/* Image */}
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          flexShrink: 0,
                          overflow: 'hidden',
                          border: '1px solid var(--border-subtle)',
                          position: 'relative',
                        }}
                      >
                        <Image
                          src={item.product.images[0] || '/images/placeholder.jpg'}
                          alt={lang === 'sv' ? item.product.nameSv : item.product.nameEn}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="80px"
                        />
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <p
                          style={{
                            fontFamily: 'var(--font-cormorant)',
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                            lineHeight: 1.3,
                          }}
                        >
                          {lang === 'sv' ? item.product.nameSv : item.product.nameEn}
                        </p>
                        <p
                          style={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '0.75rem',
                            color: 'var(--accent-gold)',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {formatPrice(item.product.priceOre, lang)}
                        </p>

                        {/* Qty Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            style={{
                              width: '24px', height: '24px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: 'transparent',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                          >
                            <Minus size={10} />
                          </button>
                          <span
                            style={{
                              fontFamily: 'var(--font-inter)',
                              fontSize: '0.8rem',
                              color: 'var(--text-primary)',
                              minWidth: '20px',
                              textAlign: 'center',
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            style={{
                              width: '24px', height: '24px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: 'transparent',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                          >
                            <Plus size={10} />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            style={{
                              marginLeft: 'auto',
                              fontFamily: 'var(--font-inter)',
                              fontSize: '0.65rem',
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: 'var(--text-muted)',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'color 0.3s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-red)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                          >
                            {t('cart.remove', lang)}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                style={{
                  padding: '1.5rem 1.75rem 2rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                {/* Subtotal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {t('cart.subtotal', lang)}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.4rem',
                      color: 'var(--accent-gold)',
                    }}
                  >
                    {formatPrice(totalOre, lang)}
                  </span>
                </div>

                {/* Checkout CTA */}
                <a href="/kassan" className="btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  {t('cart.checkout', lang)}
                </a>

                {/* Payment Method Icons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
                  {/* Klarna */}
                  <PaymentBadge label="Klarna" color="#FFB3C7" textColor="#1c0010" />
                  {/* Swish */}
                  <PaymentBadge label="Swish" color="#4D9B8F" textColor="#fff" />
                  {/* Card */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.25rem 0.55rem',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <CreditCard size={12} />
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', letterSpacing: '0.05em' }}>Kort</span>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function PaymentBadge({ label, color, textColor }: { label: string; color: string; textColor: string }) {
  return (
    <div
      style={{
        padding: '0.25rem 0.6rem',
        background: color,
        color: textColor,
        fontFamily: 'var(--font-inter)',
        fontSize: '0.6rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
      }}
    >
      {label}
    </div>
  );
}
