import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body) || 'Open this page to see the full details.'
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  article: {
    icon: FileText,
    archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
    promise: 'Editorial cards, lead images, and summaries arranged like a magazine archive.',
    badge: 'Read',
  },
  listing: {
    icon: Building2,
    archiveClass: 'grid gap-5 xl:grid-cols-2',
    promise: 'Directory entries show identity, place, and contact cues before the click.',
    badge: 'Business',
  },
  classified: {
    icon: Megaphone,
    archiveClass: 'grid gap-5 xl:grid-cols-2',
    promise: 'Offer cards stay fast to scan while fitting the richer visual system.',
    badge: 'Offer',
  },
  image: {
    icon: Camera,
    archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3',
    promise: 'Visual browsing uses a masonry rhythm with larger media-led moments.',
    badge: 'Gallery',
  },
  sbm: {
    icon: Bookmark,
    archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3',
    promise: 'Social bookmarks are treated like curated shelves instead of plain text listings.',
    badge: 'Bookmark',
  },
  pdf: {
    icon: Download,
    archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
    promise: 'Documents feel like part of a polished archive with clear entry points.',
    badge: 'PDF',
  },
  profile: {
    icon: UserRound,
    archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4',
    promise: 'Profiles emphasize identity, portrait, role, and clean discovery.',
    badge: 'Profile',
  },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as never)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = {
    '--archive-bg': preset.colors.background,
    '--archive-text': preset.colors.foreground,
    '--archive-surface': preset.colors.surface,
    '--archive-accent': preset.colors.accent,
  } as CSSProperties
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="bg-[#171c17] text-[var(--slot4-dark-text)]">
          <div className="mx-auto grid max-w-[var(--slot4-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-16">
            <div className="rounded-[var(--slot4-radius-xl)] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                <Icon className="h-4 w-4" /> {voice.eyebrow}
              </div>
              <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl">{voice.headline || `Browse ${label}`}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">{voice.description || SITE_CONFIG.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {voice.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-8 rounded-[1.7rem] border border-white/10 bg-white/8 p-4 text-sm leading-7 text-white/74">{deck.promise}</div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={basePath} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">
                  Browse all <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white/88">
                  Search archive
                </Link>
              </div>
            </div>

            <div className="self-end rounded-[var(--slot4-radius-lg)] border border-white/10 bg-[#fffdf6] p-5 text-[var(--slot4-page-text)] shadow-[var(--slot4-shadow-strong)]">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                <Filter className="h-4 w-4" /> {voice.filterLabel}
              </div>
              <form action={basePath} className="mt-4 grid gap-3">
                <select name="category" defaultValue={category} className="h-12 rounded-[1.2rem] border border-[var(--slot4-border)] bg-white px-4 text-sm font-medium outline-none">
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <button className="h-12 rounded-[1.2rem] bg-[var(--slot4-accent-fill)] text-sm font-bold uppercase tracking-[0.12em] text-[var(--slot4-dark-text)]">Apply</button>
              </form>
              <div className="mt-4 rounded-[1.25rem] bg-[var(--slot4-panel-bg)] px-4 py-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">
                Showing: <span className="font-semibold text-[var(--slot4-page-text)]">{categoryLabel}</span>
                <br />
                {voice.secondaryNote}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--slot4-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => (
                <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index + (page - 1) * (pagination.limit || 24)} />
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--slot4-radius-lg)] border border-dashed border-[var(--slot4-border)] bg-white/65 p-10 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--slot4-muted-text)]" />
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-[-0.04em]">No posts found</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">Try another category or check back when new posts are published.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? (
              <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--slot4-border)] bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.12em]">
                Previous
              </Link>
            ) : null}
            <span className="rounded-full bg-[#171c17] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--slot4-dark-text)]">
              Page {page} of {pagination.totalPages || 1}
            </span>
            {pagination.hasNextPage ? (
              <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--slot4-border)] bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.12em]">
                Next
              </Link>
            ) : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = post.slug ? `${basePath}/${post.slug}` : buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group overflow-hidden rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(23,28,23,0.78)_100%)]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">{getCategory(post, 'Article')}</span>
        <p className="absolute bottom-4 left-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/75">Story {String(index + 1).padStart(2, '0')}</p>
      </div>
      <div className="p-5">
        <h2 className="line-clamp-3 font-serif text-2xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white p-5 shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1 sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.4rem] bg-[var(--slot4-panel-bg)]">
        {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 text-[var(--slot4-muted-text)]" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#171c17] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--slot4-dark-text)]">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[var(--slot4-border)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getSummary(post)}</p>
        {phone ? <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">Phone available</p> : null}
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1">
      <div className="grid min-h-[19rem] sm:grid-cols-[0.76fr_1fr]">
        <div className="relative bg-[#171c17] p-5 text-[var(--slot4-dark-text)]">
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Classified</span>
          <h2 className="mt-10 font-serif text-4xl font-semibold leading-none tracking-[-0.05em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm leading-7 text-white/70">{location || 'Open to view details'}</p>
          {image ? <img src={image} alt={post.title} className="absolute bottom-4 right-4 h-20 w-20 rounded-[1.3rem] object-cover" /> : null}
        </div>
        <div className="p-6">
          <h2 className="font-serif text-3xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={getImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">
          <ImageIcon className="h-3 w-3" /> Visual
        </div>
        <h2 className="mt-4 line-clamp-3 font-serif text-2xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[var(--slot4-radius-md)] border border-[var(--slot4-border)] bg-white p-6 text-[var(--slot4-page-text)] shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/18 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">Collection {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 font-serif text-3xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 opacity-75">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-[11px] font-bold uppercase tracking-[0.18em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.3rem] bg-[#171c17] p-5 text-[var(--slot4-dark-text)]">
          <FileText className="h-8 w-8" />
        </div>
        <span className="rounded-full bg-[var(--slot4-panel-bg)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">{getCategory(post, 'PDF')}</span>
      </div>
      <h2 className="mt-8 font-serif text-3xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white p-6 text-center shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-panel-bg)]">
        {avatar ? <img src={avatar} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--slot4-muted-text)]" />}
      </div>
      <h2 className="mt-5 font-serif text-2xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
      {role ? <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getSummary(post)}</p>
    </Link>
  )
}
