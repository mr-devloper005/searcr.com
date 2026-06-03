import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f8f3e1',
  '--slot4-page-text': '#1f2210',
  '--slot4-panel-bg': '#f4edcf',
  '--slot4-surface-bg': '#fffdf6',
  '--slot4-muted-text': '#5d6138',
  '--slot4-soft-muted-text': '#727652',
  '--slot4-accent': '#aeb784',
  '--slot4-accent-fill': '#41431b',
  '--slot4-accent-soft': '#e3dbbb',
  '--slot4-dark-bg': '#171c17',
  '--slot4-dark-surface': '#202622',
  '--slot4-dark-text': '#f8f3e1',
  '--slot4-media-bg': '#d9d1ae',
  '--slot4-border': 'rgba(65,67,27,0.14)',
  '--slot4-border-strong': 'rgba(65,67,27,0.28)',
  '--slot4-shadow': '0 30px 90px rgba(34, 39, 24, 0.10)',
  '--slot4-shadow-strong': '0 36px 120px rgba(18, 22, 15, 0.24)',
  '--slot4-radius-sm': '1rem',
  '--slot4-radius-md': '1.6rem',
  '--slot4-radius-lg': '2.2rem',
  '--slot4-radius-xl': '2.8rem',
  '--slot4-container': '1280px',
  '--slot4-body-gradient':
    'radial-gradient(circle at top left, rgba(227,219,187,0.85) 0%, transparent 34%), radial-gradient(circle at 80% 20%, rgba(174,183,132,0.22) 0%, transparent 22%), linear-gradient(180deg, #f8f3e1 0%, #f6efd9 42%, #f1e8cd 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent-fill)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkSurfaceBg: 'bg-[var(--slot4-dark-surface)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  border: 'border-[var(--slot4-border)]',
  strongBorder: 'border-[var(--slot4-border-strong)]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[var(--slot4-shadow)]',
  shadowStrong: 'shadow-[var(--slot4-shadow-strong)]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--slot4-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-12 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[230px] shrink-0 snap-start',
    splitHero: 'grid gap-8 lg:grid-cols-[1.03fr_0.97fr] lg:items-center',
    editorialColumns: 'grid gap-6 xl:grid-cols-[0.82fr_1.18fr]',
  },
  type: {
    eyebrow: 'text-[11px] font-bold uppercase tracking-[0.28em]',
    heroTitle: 'font-serif text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl',
    sectionTitle: 'font-serif text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-5xl',
    body: 'text-base leading-8',
  },
  surface: {
    card: `rounded-[var(--slot4-radius-lg)] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[var(--slot4-radius-md)] border ${editablePalette.border} bg-white/70`,
    dark: `rounded-[var(--slot4-radius-lg)] border border-white/10 ${editablePalette.darkSurfaceBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
    glass: 'rounded-[var(--slot4-radius-lg)] border border-white/14 bg-white/8 backdrop-blur-xl',
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-[var(--slot4-dark-text)] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--slot4-border-strong)] bg-white/74 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-[var(--slot4-page-text)] transition duration-300 hover:-translate-y-0.5 hover:bg-white',
    dark:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-[var(--slot4-dark-text)] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg',
  },
  media: {
    frame: 'relative overflow-hidden rounded-[1.5rem] bg-[var(--slot4-media-bg)]',
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(32,38,24,0.16)]',
    soft: 'transition duration-300 hover:opacity-88',
  },
} as const

export const aiLayoutRules = [
  'Keep edits inside src/editable only.',
  'Use the olive, parchment, and deep ink palette defined in editableRootStyle.',
  'Preserve existing route/data behavior and use current props/functions for post rendering.',
  'Support missing image, summary, and category values with graceful fallbacks.',
  'Mix featured, compact, horizontal, editorial, and image-first card treatments instead of one repeated card.',
  'Keep mobile layouts polished with stacked grids, protected overflow, and readable line lengths.',
] as const
