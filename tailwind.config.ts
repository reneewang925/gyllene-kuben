/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        // Imperial theme palette
        imperial: {
          bg: '#0e0e0f',
          card: '#1a1a1c',
          red: '#a11d23',
          sapphire: '#1a3060',
          gold: '#d4af37',
          'gold-dim': '#9c7f25',
          text: '#f0ebe0',
          muted: '#5a5550',
        },
        // Xuan theme palette
        xuan: {
          bg: '#f4f1ea',
          card: '#eae6dc',
          jade: '#204035',
          bronze: '#a38a53',
          ink: '#1c1d1f',
          muted: '#8a857d',
        },
      },
      screens: {
        xs: '480px',
      },
      animation: {
        'marquee': 'marqueeScroll 30s linear infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scroll-pulse': 'scrollPulse 2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
