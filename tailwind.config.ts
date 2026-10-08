import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin.js'

/**
 * Design tokens live here. Components use semantic names (canvas, surface, ink, primary, sage…)
 * rather than raw hex values. Text/background pairs below are chosen for WCAG AA contrast.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      canvas: '#FBF7F0', // page background (warm cream)
      surface: { DEFAULT: '#FFFFFF', sunken: '#F5EFE5' },
      ink: { DEFAULT: '#2B2420', soft: '#4A413A', muted: '#6B6058' }, // all AA on canvas/surface
      line: { DEFAULT: '#E4DCCF', strong: '#C9BEAE' },
      primary: {
        50: '#FBEEE7',
        100: '#F6DACB',
        500: '#C8603A',
        600: '#B04F2B', // white text on this is AA
        700: '#8F3F20',
      },
      sage: {
        50: '#F1F5EC',
        100: '#E1EAD6',
        500: '#6F8F5B',
        700: '#4A6340',
        800: '#384D31',
      },
      // Rating tones are intentionally soft and non-judgmental (no red/green good/bad).
      honey: { bg: '#FBE9C6', fg: '#6E4308' },
      leaf: { bg: '#E1EAD6', fg: '#344A2C' },
      mist: { bg: '#E8EBF0', fg: '#3E4859' },
      danger: { DEFAULT: '#B3261E', bg: '#FCEBEA' },
    },
    fontFamily: {
      display: ['Fraunces', 'Georgia', 'serif'],
      sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
    },
    fontSize: {
      caption: ['0.75rem', { lineHeight: '1rem' }],
      small: ['0.875rem', { lineHeight: '1.25rem' }],
      body: ['1rem', { lineHeight: '1.5rem' }],
      lead: ['1.125rem', { lineHeight: '1.75rem' }],
      h3: ['1.25rem', { lineHeight: '1.75rem' }],
      h2: ['1.5rem', { lineHeight: '2rem' }],
      h1: ['1.875rem', { lineHeight: '2.25rem' }],
      display: ['2.5rem', { lineHeight: '2.75rem' }],
    },
    borderRadius: {
      none: '0',
      sm: '0.375rem',
      md: '0.625rem',
      lg: '0.875rem',
      xl: '1.25rem',
      '2xl': '1.75rem',
      full: '9999px',
    },
    boxShadow: {
      none: 'none',
      soft: '0 1px 2px rgb(43 36 32 / 0.06), 0 4px 12px rgb(43 36 32 / 0.05)',
      lift: '0 2px 4px rgb(43 36 32 / 0.08), 0 10px 24px rgb(43 36 32 / 0.10)',
    },
    extend: {
      // Spacing keeps Tailwind's 4px-based scale; these are named layout sizes.
      spacing: {
        tabbar: '4rem',
        sidebar: '16rem',
        touch: '2.75rem', // 44px minimum touch target
      },
      minHeight: { touch: '2.75rem' },
      minWidth: { touch: '2.75rem' },
      maxWidth: { content: '48rem', wide: '64rem' },
    },
  },
  plugins: [
    // Safe-area inset utilities (notches / home indicator).
    plugin(({ addUtilities }) => {
      addUtilities({
        '.pt-safe': { paddingTop: 'env(safe-area-inset-top)' },
        '.pb-safe': { paddingBottom: 'env(safe-area-inset-bottom)' },
        '.pl-safe': { paddingLeft: 'env(safe-area-inset-left)' },
        '.pr-safe': { paddingRight: 'env(safe-area-inset-right)' },
        '.mb-safe': { marginBottom: 'env(safe-area-inset-bottom)' },
      })
    }),
  ],
} satisfies Config
