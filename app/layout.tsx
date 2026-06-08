import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { Footer } from '@/components/layout/Footer';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Gyllene Kuben — Österns Konst i Nordiskt Ljus',
    template: '%s | Gyllene Kuben',
  },
  description:
    'Handplockade mästerverk av kinesisk porslain, bronskonst, ostasiatisk tekannor, premium te och meditationsredskap. Fri frakt i Sverige. Klarna & Swish.',
  keywords: [
    'kinesisk konst',
    'porslin',
    'bronskonst',
    'tekannor',
    'premium te',
    'meditation',
    'japandi',
    'luxury',
    'handcrafted',
    'Sverige',
  ],
  authors: [{ name: 'Gyllene Kuben', url: 'https://www.gyllenekuben.se' }],
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    alternateLocale: 'en_SE',
    siteName: 'Gyllene Kuben',
    title: 'Gyllene Kuben — Österns Konst i Nordiskt Ljus',
    description:
      'Handplockade mästerverk av kinesisk porslain, bronskonst, ostasiatisk tekannor, premium te och meditationsredskap.',
    url: 'https://www.gyllenekuben.se',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gyllene Kuben — Österns Konst i Nordiskt Ljus',
    description: 'Handplockade mästerverk. Fri frakt i Sverige.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${cormorant.variable} ${inter.variable} antialiased`}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
