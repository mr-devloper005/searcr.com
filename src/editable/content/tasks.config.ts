import type { TaskKey } from '@/lib/site-config'

export const slot4TaskSupport = {
  article: false,
  classified: false,
  sbm: true,
  profile: false,
  pdf: false,
  listing: false,
  image: false,
} satisfies Record<TaskKey, boolean>

export const slot4TaskNotes = {
  article: 'Editorial pages and article detail routes',
  classified: 'Classified archive and offer detail routes',
  sbm: 'Primary social bookmarking archive and detail routes',
  profile: 'Profile archive and identity detail routes',
  pdf: 'Document library archive and PDF detail routes',
  listing: 'Directory archive and business detail routes',
  image: 'Visual archive and image detail routes',
} satisfies Record<TaskKey, string>
