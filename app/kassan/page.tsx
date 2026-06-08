import type { Metadata } from 'next';
import { CheckoutPageClient } from '@/components/checkout/CheckoutPageClient';

export const metadata: Metadata = {
  title: 'Kassan / Checkout',
  description: 'Slutför ditt köp säkert med Klarna, Swish eller kort.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
