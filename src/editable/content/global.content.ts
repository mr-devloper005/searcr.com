import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || '',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: '',
    primaryLinks: [
      { label: 'Collections', href: '/sbm' },
      { label: 'Articles', href: '/article' },
      { label: 'Images', href: '/image' },
      { label: 'About', href: '/about' },
    ],
    actions: {
      primary: { label: 'Open Collections', href: '/sbm' },
      secondary: { label: 'Contact', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Refined discovery, arranged with care.',
    description:
      'Discover and organize the web’s most valuable finds in one place. Our social bookmarking platform lets users save, share, and explore articles, websites, resources, profiles, listings, and media through a clean, community-driven discovery experience.',
    columns: [
      {
        title: 'Browse',
        links: [
          { label: 'Social bookmarks', href: '/sbm' },
          { label: 'Articles', href: '/article' },
          { label: 'Images', href: '/image' },
          { label: 'PDF library', href: '/pdf' },
        ],
      },
      {
        title: 'Visit',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: 'Made for readers who like their discoveries well arranged.',
  },
  commonLabels: {
    readMore: 'Open page',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
