import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Curated social bookmarks and collected discoveries',
      description: 'Browse saved pages, editorial picks, image-led finds, and useful collections through a premium reading-first layout.',
      openGraphTitle: 'Curated social bookmarks and collected discoveries',
      openGraphDescription: 'Explore bookmarks, articles, visuals, and collected references through a refined classical interface.',
      keywords: ['social bookmarking', 'saved links', 'curated collections', 'discoverable content'],
    },
    hero: {
      badge: '',
      title: ['Collected pages with a', 'richer way to browse.'],
      description:
        'Discover saved links, fresh reading, and useful visual finds through a polished library-style homepage built for people who love keeping good things close.',
      primaryCta: { label: 'Browse collections', href: '/sbm' },
      secondaryCta: { label: 'Search the archive', href: '/search' },
      searchPlaceholder: 'Search bookmarks, collections, topics, and titles',
      focusLabel: 'Highlights',
      featureCardBadge: 'Featured collection',
      featureCardTitle: 'Start with a strong lead story, then move through shelves of compact discoveries.',
      featureCardDescription: 'The homepage is designed to feel like a premium discovery room rather than a generic feed.',
    },
    intro: {
      badge: 'Why it feels different',
      title: 'A homepage shaped like a private reading room.',
      paragraphs: [
        'The layout pairs a dramatic lead panel with elegant browsing rails, compact collection cards, and calmer information blocks.',
        'Collections, articles, profiles, and resources stay connected so visitors can keep discovering without losing their place.',
        'Every section uses varied card styles to create rhythm, contrast, and a more memorable browsing experience.',
      ],
      sideBadge: 'Inside the layout',
      sidePoints: [
        'A search-led hero with a strong split layout.',
        'Featured and compact cards mixed together for depth.',
        'Collection shelves, editorial blocks, and image-first modules.',
        'Mobile layouts that keep the same sense of polish.',
      ],
      primaryLink: { label: 'Open collections', href: '/sbm' },
      secondaryLink: { label: 'See all routes', href: '/search' },
    },
    cta: {
      badge: 'Start browsing',
      title: 'Move through saved pages, stories, and references with confidence.',
      description: 'Use the archive, search, and collection pages to keep useful discoveries close and easy to revisit.',
      primaryCta: { label: 'Browse bookmarks', href: '/sbm' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About the collection',
    title: 'A more thoughtful way to keep and revisit good pages.',
    description: `${slot4BrandConfig.siteName} is designed as a premium discovery surface where saved links, articles, visuals, and supporting resources feel connected instead of scattered.`,
    paragraphs: [
      'The site favors elegant structure over clutter, with enough contrast and breathing room to make browsing feel intentional.',
      'Whether someone arrives for a bookmark collection or wanders into articles, images, or profiles, the experience stays calm, readable, and visually distinct.',
    ],
    values: [
      {
        title: 'Curation with character',
        description: 'Useful pages should feel selected, arranged, and easy to come back to rather than buried in a generic grid.',
      },
      {
        title: 'Visual variety',
        description: 'Different card forms create a richer rhythm and help collections, features, and quick reads stand apart.',
      },
      {
        title: 'Comfortable exploration',
        description: 'Search, browsing, and detail pages are designed to feel polished on both large screens and phones.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Reach the desk behind the collections.',
    description:
      'Use this page for questions, partnership ideas, collection suggestions, or general support. The layout keeps the experience calm and direct instead of forcing everything into one plain form.',
    formTitle: 'Send a note',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search bookmarks, topics, categories, and saved discoveries across the site.',
    },
    hero: {
      badge: 'Search the shelves',
      title: 'Find saved pages and useful references faster.',
      description: 'Search across every active section with filters for category and content type, then open the result that fits your next read.',
      placeholder: 'Search by keyword, category, topic, or title',
    },
    resultsTitle: 'Latest searchable finds',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and save a new draft for the site.',
    },
    locked: {
      badge: 'Member access',
      title: 'Sign in to open the submission desk.',
      description: 'Use your account to draft new posts, save details locally, and work across the supported sections of the site.',
    },
    hero: {
      badge: 'Submission desk',
      title: 'Shape a new post with the same calm structure.',
      description: 'Choose a section, add its details, and prepare a clean draft with title, summary, image, source, and body content.',
    },
    formTitle: 'Draft details',
    submitLabel: 'Save draft',
    successTitle: 'Draft saved successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Return to your saved workspace.',
      description: 'Login to continue browsing, creating drafts, and moving through the collection with your local session.',
      formTitle: 'Login',
      submitLabel: 'Enter',
      noAccount: 'Those details do not match an account yet. Create one first, then return here.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Open an account',
      title: 'Create your account and keep building your collection.',
      description: 'Set up a local account to access the submission desk, save drafts, and move through the site with your own profile.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit site',
    },
  },
} as const
