import { slot4BrandConfig } from './brand.config'

export type Slot4VisualPreset =
  | 'classical-ledger'
  | 'midnight-salon'
  | 'linen-atlas'
  | 'gallery-notes'
  | 'directory-registry'
  | 'paper-archive'
  | 'private-library'

export const visualPresets = {
  'classical-ledger': {
    label: 'Classical Ledger',
    mood: 'luxury editorial with old-world restraint',
    fontDirection: 'serif headlines, refined sans body, uppercase labels',
    colors: {
      background: '#f8f3e1',
      foreground: '#1f2210',
      muted: '#727652',
      primary: '#41431b',
      accent: '#aeb784',
      surface: '#fffdf6',
    },
    shape: 'arched panels, oval badges, soft borders',
  },
  'midnight-salon': {
    label: 'Midnight Salon',
    mood: 'dark luxury with luminous highlights',
    fontDirection: 'display serif hero, polished compact body',
    colors: {
      background: '#171c17',
      foreground: '#f8f3e1',
      muted: '#c2c7a6',
      primary: '#f8f3e1',
      accent: '#aeb784',
      surface: '#202622',
    },
    shape: 'deep cards, glowing gradients, quiet glass',
  },
  'linen-atlas': {
    label: 'Linen Atlas',
    mood: 'warm map-room clarity',
    fontDirection: 'serif titles with disciplined information blocks',
    colors: {
      background: '#f5edd8',
      foreground: '#24240f',
      muted: '#6b6f4b',
      primary: '#41431b',
      accent: '#d0c69d',
      surface: '#fffaf0',
    },
    shape: 'document cards, section dividers, framed lists',
  },
  'gallery-notes': {
    label: 'Gallery Notes',
    mood: 'image-forward and atmospheric',
    fontDirection: 'minimal labels with larger artful headlines',
    colors: {
      background: '#ece5cb',
      foreground: '#1f2210',
      muted: '#6f7353',
      primary: '#41431b',
      accent: '#aeb784',
      surface: '#fffef8',
    },
    shape: 'media blocks, layered captions, floating chips',
  },
  'directory-registry': {
    label: 'Directory Registry',
    mood: 'premium directory with practical order',
    fontDirection: 'strong serif section titles and compact sans metadata',
    colors: {
      background: '#f4ecd3',
      foreground: '#232613',
      muted: '#676b46',
      primary: '#41431b',
      accent: '#aeb784',
      surface: '#fffef9',
    },
    shape: 'stacked ledgers, bordered rows, badges',
  },
  'paper-archive': {
    label: 'Paper Archive',
    mood: 'quiet curated archive',
    fontDirection: 'bookish serif titles with soft mono details',
    colors: {
      background: '#f8f3e1',
      foreground: '#262813',
      muted: '#747754',
      primary: '#41431b',
      accent: '#d8cfab',
      surface: '#fffdf7',
    },
    shape: 'paper stacks, inset panels, slim rules',
  },
  'private-library': {
    label: 'Private Library',
    mood: 'exclusive reading room elegance',
    fontDirection: 'classical display with controlled supporting copy',
    colors: {
      background: '#1a1f18',
      foreground: '#f8f3e1',
      muted: '#c5caad',
      primary: '#f8f3e1',
      accent: '#aeb784',
      surface: '#242b22',
    },
    shape: 'arched cards, dark paper, gilded separators',
  },
} as const

export const visualSystem = {
  productKind: slot4BrandConfig.productKind,
  recommendedPreset:
    slot4BrandConfig.productKind === 'visual'
      ? 'gallery-notes'
      : slot4BrandConfig.productKind === 'directory'
        ? 'directory-registry'
        : slot4BrandConfig.productKind === 'editorial'
          ? 'classical-ledger'
          : 'private-library',
  radius: {
    sm: '1rem',
    md: '1.5rem',
    lg: '2.2rem',
    xl: '2.8rem',
  },
  motion: {
    pageLoad: 'animate-in fade-in slide-in-from-bottom-4 duration-700',
    cardHover: 'transition duration-300 hover:-translate-y-1 hover:shadow-xl',
    softHover: 'transition duration-300 hover:opacity-90',
    reduceMotionSafe: 'motion-reduce:transform-none motion-reduce:transition-none',
  },
  typography: {
    eyebrow: 'text-[11px] font-bold uppercase tracking-[0.28em]',
    heroTitle: 'font-serif text-5xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl',
    sectionTitle: 'font-serif text-4xl font-semibold tracking-[-0.04em] sm:text-5xl',
    body: 'text-base leading-8',
    caption: 'text-[11px] font-bold uppercase tracking-[0.22em]',
  },
  surfaces: {
    glass: 'border border-white/14 bg-white/8 backdrop-blur-xl',
    paper: 'border border-[var(--slot4-border)] bg-[var(--slot4-surface-bg)] shadow-[var(--slot4-shadow)]',
    quiet: 'border border-[var(--slot4-border)] bg-white/65',
    dark: 'border border-white/10 bg-[var(--slot4-dark-surface)] shadow-[var(--slot4-shadow-strong)]',
  },
  layout: {
    page: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
    sectionY: 'py-12 sm:py-16 lg:py-20',
    cardGrid: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
  },
} as const

export function getVisualPreset(name: Slot4VisualPreset = visualSystem.recommendedPreset as Slot4VisualPreset) {
  return visualPresets[name]
}
