import { Language } from './types';

type TranslationKey =
  // Navigation
  | 'nav.porcelain'
  | 'nav.bronze'
  | 'nav.teaware'
  | 'nav.tea'
  | 'nav.meditation'
  // Hero
  | 'hero.tagline'
  | 'hero.subtitle'
  | 'hero.cta'
  // Sections
  | 'section.curated.title'
  | 'section.curated.subtitle'
  | 'section.trust.handmade'
  | 'section.trust.shipping'
  | 'section.trust.payment'
  | 'section.trust.returns'
  | 'section.trust.heritage'
  // Cart
  | 'cart.title'
  | 'cart.empty'
  | 'cart.subtotal'
  | 'cart.checkout'
  | 'cart.continue'
  | 'cart.remove'
  // Product
  | 'product.add'
  | 'product.soldout'
  | 'product.limited'
  | 'product.tab.object'
  | 'product.tab.artisan'
  | 'product.tab.ritual'
  | 'product.from'
  | 'product.related'
  | 'product.dimensions'
  | 'product.weight'
  | 'product.materials'
  | 'product.origin'
  | 'product.era'
  | 'product.artisan'
  | 'product.stock.low'
  | 'product.stock.out'
  | 'product.stock.instock'
  | 'product.qty'
  | 'product.share'
  | 'product.wishlist'
  // Collection
  | 'collection.all'
  | 'collection.filter'
  | 'collection.sort'
  | 'collection.sort.price.asc'
  | 'collection.sort.price.desc'
  | 'collection.sort.newest'
  | 'collection.empty'
  | 'collection.showing'
  | 'collection.results'
  // Checkout
  | 'checkout.title'
  | 'checkout.contact'
  | 'checkout.email'
  | 'checkout.phone'
  | 'checkout.shipping'
  | 'checkout.name'
  | 'checkout.address'
  | 'checkout.address2'
  | 'checkout.city'
  | 'checkout.postal'
  | 'checkout.country'
  | 'checkout.payment'
  | 'checkout.pay.klarna'
  | 'checkout.pay.swish'
  | 'checkout.pay.card'
  | 'checkout.order.summary'
  | 'checkout.order.total'
  | 'checkout.order.shipping'
  | 'checkout.order.free'
  | 'checkout.submit'
  | 'checkout.secure'
  | 'checkout.terms'
  // Footer
  | 'footer.collections'
  | 'footer.company'
  | 'footer.about'
  | 'footer.contact'
  | 'footer.returns'
  | 'footer.privacy'
  | 'footer.newsletter.title'
  | 'footer.newsletter.placeholder'
  | 'footer.newsletter.cta'
  | 'footer.copyright'
  // Journal (public)
  | 'journal.title'
  | 'journal.subtitle'
  | 'journal.read'
  | 'journal.read.more'
  | 'journal.editors.pick'
  | 'journal.related'
  | 'journal.more'
  | 'journal.min.read'
  | 'journal.featured.in'
  // Misc
  | 'theme.imperial'
  | 'theme.xuan'
  | 'common.explore'
  | 'common.sek'
  | 'common.back'
  | 'common.loading';

type Translations = Record<TranslationKey, string>;

const sv: Translations = {
  'nav.porcelain': 'Porslin',
  'nav.bronze': 'Bronskonst',
  'nav.teaware': 'Tekannor & Tillbehör',
  'nav.tea': 'Premium Te',
  'nav.meditation': 'Meditation & Inre Ro',
  'hero.tagline': 'Konst för Evigheten',
  'hero.subtitle': 'Handplockade mästerverk från Österns ateljeér — hemma i det nordiska ljuset.',
  'hero.cta': 'Utforska Kollektionen',
  'section.curated.title': 'Kurerade Mästerverk',
  'section.curated.subtitle': 'Fem samlingar. En vision om tidlös skönhet.',
  'section.trust.handmade': 'Handgjord i Jingdezhen',
  'section.trust.shipping': 'Fri frakt i Sverige',
  'section.trust.payment': 'Klarna & Swish',
  'section.trust.returns': '30 dagars retur',
  'section.trust.heritage': 'Certifierat ursprung',
  'cart.title': 'Din Korg',
  'cart.empty': 'Korgen är tom',
  'cart.subtotal': 'Delsumma',
  'cart.checkout': 'Till Kassan',
  'cart.continue': 'Fortsätt handla',
  'cart.remove': 'Ta bort',
  'product.add': 'Lägg i korg',
  'product.soldout': 'Slutsåld',
  'product.limited': 'Begränsad upplaga',
  'product.tab.object': 'Objektet',
  'product.tab.artisan': 'Hantverkaren & Ursprung',
  'product.tab.ritual': 'Ritualen',
  'product.from': 'Från',
  'product.related': 'Du kanske också gillar',
  'product.dimensions': 'Dimensioner',
  'product.weight': 'Vikt',
  'product.materials': 'Material',
  'product.origin': 'Ursprung',
  'product.era': 'Period / Stil',
  'product.artisan': 'Hantverkare',
  'product.stock.low': 'Få kvar — beställ snart',
  'product.stock.out': 'Slutsåld',
  'product.stock.instock': 'I lager',
  'product.qty': 'Antal',
  'product.share': 'Dela',
  'product.wishlist': 'Spara',
  'collection.all': 'Alla verk',
  'collection.filter': 'Filtrera',
  'collection.sort': 'Sortera',
  'collection.sort.price.asc': 'Pris: Lägst först',
  'collection.sort.price.desc': 'Pris: Högst först',
  'collection.sort.newest': 'Nyast',
  'collection.empty': 'Inga verk hittades.',
  'collection.showing': 'Visar',
  'collection.results': 'verk',
  'checkout.title': 'Kassan',
  'checkout.contact': 'Kontaktuppgifter',
  'checkout.email': 'E-postadress',
  'checkout.phone': 'Telefonnummer',
  'checkout.shipping': 'Leveransadress',
  'checkout.name': 'Fullständigt namn',
  'checkout.address': 'Gatuadress',
  'checkout.address2': 'Lägenhet, våning (valfritt)',
  'checkout.city': 'Stad',
  'checkout.postal': 'Postnummer',
  'checkout.country': 'Land',
  'checkout.payment': 'Betalningsmetod',
  'checkout.pay.klarna': 'Klarna — Betala senare',
  'checkout.pay.swish': 'Swish',
  'checkout.pay.card': 'Kredit- eller betalkort',
  'checkout.order.summary': 'Ordersammanfattning',
  'checkout.order.total': 'Totalt',
  'checkout.order.shipping': 'Frakt',
  'checkout.order.free': 'Gratis',
  'checkout.submit': 'Genomför köp',
  'checkout.secure': 'Säker betalning med SSL-kryptering',
  'checkout.terms': 'Genom att slutföra köpet godkänner du våra köpvillkor.',
  'footer.collections': 'Samlingar',
  'footer.company': 'Företaget',
  'footer.about': 'Om oss',
  'footer.contact': 'Kontakt',
  'footer.returns': 'Returer & villkor',
  'footer.privacy': 'Integritetspolicy',
  'footer.newsletter.title': 'Kulturnyheter & nya förvärv',
  'footer.newsletter.placeholder': 'Din e-postadress',
  'footer.newsletter.cta': 'Prenumerera',
  'footer.copyright': '© 2024 Gyllene Kuben. Alla rättigheter förbehållna.',
  // Journal (public)
  'journal.title': 'Kulturjournal',
  'journal.subtitle': 'Essäer & arv',
  'journal.read': 'Läs artikel',
  'journal.read.more': 'Läs mer',
  'journal.editors.pick': 'Redaktörens val',
  'journal.related': 'Relaterad artikel',
  'journal.more': 'Fler artiklar',
  'journal.min.read': 'min läsning',
  'journal.featured.in': 'Nämnda i denna artikel',
  'theme.imperial': 'Kejsarlig Dynasti',
  'theme.xuan': 'Tuschpapper',
  'common.explore': 'Utforska',
  'common.sek': 'kr',
  'common.back': 'Tillbaka',
  'common.loading': 'Laddar…',
};

const en: Translations = {
  'nav.porcelain': 'Fine Porcelain',
  'nav.bronze': 'Bronze Artworks',
  'nav.teaware': 'Eastern Teaware',
  'nav.tea': 'Artisanal Tea',
  'nav.meditation': 'Meditation & Rituals',
  'hero.tagline': 'Art for Eternity',
  'hero.subtitle': 'Hand-curated masterworks from Eastern ateliers — at home in Nordic light.',
  'hero.cta': 'Explore the Collection',
  'section.curated.title': 'Curated Masterpieces',
  'section.curated.subtitle': 'Five collections. One vision of timeless beauty.',
  'section.trust.handmade': 'Handcrafted in Jingdezhen',
  'section.trust.shipping': 'Free shipping in Sweden',
  'section.trust.payment': 'Klarna & Swish',
  'section.trust.returns': '30-day returns',
  'section.trust.heritage': 'Certified provenance',
  'cart.title': 'Your Cart',
  'cart.empty': 'Your cart is empty',
  'cart.subtotal': 'Subtotal',
  'cart.checkout': 'Proceed to Checkout',
  'cart.continue': 'Continue shopping',
  'cart.remove': 'Remove',
  'product.add': 'Add to Cart',
  'product.soldout': 'Sold Out',
  'product.limited': 'Limited Edition',
  'product.tab.object': 'The Object',
  'product.tab.artisan': 'The Artisan & Provenance',
  'product.tab.ritual': 'The Ritual',
  'product.from': 'From',
  'product.related': 'You may also like',
  'product.dimensions': 'Dimensions',
  'product.weight': 'Weight',
  'product.materials': 'Materials',
  'product.origin': 'Origin',
  'product.era': 'Period / Style',
  'product.artisan': 'Artisan',
  'product.stock.low': 'Few remaining — order soon',
  'product.stock.out': 'Sold Out',
  'product.stock.instock': 'In Stock',
  'product.qty': 'Quantity',
  'product.share': 'Share',
  'product.wishlist': 'Save',
  'collection.all': 'All works',
  'collection.filter': 'Filter',
  'collection.sort': 'Sort',
  'collection.sort.price.asc': 'Price: Low to High',
  'collection.sort.price.desc': 'Price: High to Low',
  'collection.sort.newest': 'Newest',
  'collection.empty': 'No works found.',
  'collection.showing': 'Showing',
  'collection.results': 'works',
  'checkout.title': 'Checkout',
  'checkout.contact': 'Contact information',
  'checkout.email': 'Email address',
  'checkout.phone': 'Phone number',
  'checkout.shipping': 'Shipping address',
  'checkout.name': 'Full name',
  'checkout.address': 'Street address',
  'checkout.address2': 'Apartment, suite (optional)',
  'checkout.city': 'City',
  'checkout.postal': 'Postal code',
  'checkout.country': 'Country',
  'checkout.payment': 'Payment method',
  'checkout.pay.klarna': 'Klarna — Pay later',
  'checkout.pay.swish': 'Swish',
  'checkout.pay.card': 'Credit or debit card',
  'checkout.order.summary': 'Order summary',
  'checkout.order.total': 'Total',
  'checkout.order.shipping': 'Shipping',
  'checkout.order.free': 'Free',
  'checkout.submit': 'Complete purchase',
  'checkout.secure': 'Secured with SSL encryption',
  'checkout.terms': 'By completing your purchase you agree to our terms of sale.',
  'footer.collections': 'Collections',
  'footer.company': 'Company',
  'footer.about': 'About us',
  'footer.contact': 'Contact',
  'footer.returns': 'Returns & terms',
  'footer.privacy': 'Privacy policy',
  'footer.newsletter.title': 'Cultural dispatches & new acquisitions',
  'footer.newsletter.placeholder': 'Your email address',
  'footer.newsletter.cta': 'Subscribe',
  'footer.copyright': '© 2024 Gyllene Kuben. All rights reserved.',
  // Journal (public)
  'journal.title': 'Cultural Journal',
  'journal.subtitle': 'Essays & Heritage',
  'journal.read': 'Read article',
  'journal.read.more': 'Read more',
  'journal.editors.pick': "Editor's pick",
  'journal.related': 'Related article',
  'journal.more': 'More articles',
  'journal.min.read': 'min read',
  'journal.featured.in': 'Featured in this article',
  'theme.imperial': 'Imperial Dynasty',
  'theme.xuan': 'Xuan Paper',
  'common.explore': 'Explore',
  'common.sek': 'SEK',
  'common.back': 'Back',
  'common.loading': 'Loading…',
};

const dictionaries: Record<Language, Translations> = { sv, en };

export function t(key: TranslationKey, lang: Language): string {
  return dictionaries[lang][key] ?? key;
}

export function formatPrice(ore: number, lang: Language): string {
  const sek = ore / 100;
  return new Intl.NumberFormat(lang === 'sv' ? 'sv-SE' : 'en-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(sek);
}

export type { TranslationKey };
