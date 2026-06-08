'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Theme, Language, CartItem, Product } from '@/lib/types';

// ─── Theme Context ─────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'imperial',
  setTheme: () => {},
  toggleTheme: () => {},
});

// ─── Language Context ──────────────────────────────────────────────────────────

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'sv',
  setLang: () => {},
  toggleLang: () => {},
});

// ─── Cart Context ──────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  totalItems: number;
  totalOre: number;
}

const CartContext = createContext<CartContextValue>({
  items: [],
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  totalItems: 0,
  totalOre: 0,
});

// ─── Auth Context ──────────────────────────────────────────────────────────────
// Lightweight mock-auth session. Wire to NextAuth / JWT cookie in production.

export interface MemberSession {
  id: number;
  name: string;
  email: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  loyaltyPoints: number;
}

interface AuthContextValue {
  session: MemberSession | null;
  login: (session: MemberSession) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
});

// ─── Providers ────────────────────────────────────────────────────────────────

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('imperial');
  const [lang, setLangState] = useState<Language>('sv');
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<MemberSession | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('gk-theme') as Theme | null;
    const savedLang  = localStorage.getItem('gk-lang')  as Language | null;
    const savedSession = localStorage.getItem('gk-session');
    if (savedTheme === 'imperial' || savedTheme === 'xuan') setThemeState(savedTheme);
    if (savedLang === 'sv' || savedLang === 'en') setLangState(savedLang);
    if (savedSession) {
      try { setSession(JSON.parse(savedSession)); } catch { /* corrupt data — ignore */ }
    }
    setMounted(true);
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gk-theme', theme);
  }, [theme, mounted]);

  // Persist language
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('gk-lang', lang);
  }, [lang, mounted]);

  const setTheme   = useCallback((t: Theme)    => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState((t) => (t === 'imperial' ? 'xuan' : 'imperial')), []);
  const setLang    = useCallback((l: Language) => setLangState(l), []);
  const toggleLang  = useCallback(() => setLangState((l) => (l === 'sv' ? 'en' : 'sv')), []);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQty = useCallback((productId: number, qty: number) => {
    if (qty <= 0) { removeItem(productId); return; }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  }, [removeItem]);

  const login = useCallback((s: MemberSession) => {
    setSession(s);
    localStorage.setItem('gk-session', JSON.stringify(s));
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem('gk-session');
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalOre   = items.reduce((sum, i) => sum + i.product.priceOre * i.quantity, 0);

  // Prevent flash of wrong theme before hydration
  if (!mounted) return <div style={{ visibility: 'hidden' }}>{children}</div>;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
        <CartContext.Provider value={{
          items, isOpen,
          openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
          addItem, removeItem, updateQty, totalItems, totalOre,
        }}>
          <AuthContext.Provider value={{ session, login, logout, isLoggedIn: session !== null }}>
            {children}
          </AuthContext.Provider>
        </CartContext.Provider>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useTheme = () => useContext(ThemeContext);
export const useLang  = () => useContext(LanguageContext);
export const useCart  = () => useContext(CartContext);
export const useAuth  = () => useContext(AuthContext);
