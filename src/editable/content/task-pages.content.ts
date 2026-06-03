import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Editorial shelf',
    headline: 'Long-form reading arranged with a stronger editorial presence.',
    description: 'Article pages should feel like a premium magazine archive, with clear hierarchy, generous spacing, and an easy path into deeper reading.',
    filterLabel: 'Choose article topic',
    secondaryNote: 'Strong article pages balance visual richness with comfortable reading.',
    chips: ['Editorial', 'Long reads', 'Feature stories'],
  },
  classified: {
    eyebrow: 'Offer ledger',
    headline: 'Fast-moving notices presented with cleaner structure.',
    description: 'Classified pages should stay practical and quick to scan while still matching the premium visual system.',
    filterLabel: 'Filter notices',
    secondaryNote: 'Urgency matters, but the page can still feel composed.',
    chips: ['Offers', 'Quick scan', 'Action-ready'],
  },
  sbm: {
    eyebrow: 'Collection room',
    headline: 'Social bookmarks presented as collected shelves of useful finds.',
    description: 'Bookmark pages should feel curated and elegant, with a mix of featured panels, compact cards, and calm metadata.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Bookmarking works best when collections feel intentional, not mechanical.',
    chips: ['Curated', 'Collections', 'Useful pages'],
  },
  profile: {
    eyebrow: 'Profiles',
    headline: 'People and identities with stronger presence and trust cues.',
    description: 'Profile pages should emphasize identity, role, and browsing confidence before the content continues.',
    filterLabel: 'Filter profile type',
    secondaryNote: 'Make the person or brand visible immediately.',
    chips: ['Identity', 'Trust', 'Discoverability'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'Reports, guides, and files arranged like a refined archive.',
    description: 'Document pages should feel clear, sturdy, and library-like, with file context visible before the download action.',
    filterLabel: 'Filter documents',
    secondaryNote: 'Useful documents deserve a stronger archive treatment.',
    chips: ['Documents', 'Library', 'Reference'],
  },
  listing: {
    eyebrow: 'Registry',
    headline: 'Listings presented with practical details and a premium directory rhythm.',
    description: 'Directory pages should make it easy to compare, scan, and contact without losing the overall polish of the site.',
    filterLabel: 'Filter listings',
    secondaryNote: 'Useful metadata should feel elegant, not heavy.',
    chips: ['Directory', 'Compare', 'Business'],
  },
  image: {
    eyebrow: 'Visual shelf',
    headline: 'Image posts shaped by larger media moments and calmer captions.',
    description: 'Image routes should lean into visual drama, masonry rhythm, and softer supporting text.',
    filterLabel: 'Filter visuals',
    secondaryNote: 'Let the image lead, then support it quietly.',
    chips: ['Visual-first', 'Gallery', 'Showcase'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
