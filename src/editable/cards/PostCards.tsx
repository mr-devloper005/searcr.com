import Link from 'next/link'
import { ArrowRight, Bookmark, Clock3, ExternalLink, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const featured = typeof content.featuredImage === 'string' ? content.featuredImage : ''
  const image = typeof content.image === 'string' ? content.image : ''
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || featured || image || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block self-start overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative p-6 sm:p-8 lg:p-10">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-72 transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,28,23,0.04),rgba(23,28,23,0.9))]" />
        <div className="relative z-10 flex min-h-[340px] flex-col justify-end sm:min-h-[420px] lg:min-h-[480px]">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">
            <Sparkles className="h-3.5 w-3.5" /> {label}
          </span>
          <h3 className="mt-6 max-w-4xl font-serif text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">{post.title}</h3>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/74 sm:text-base">{getEditableExcerpt(post, 220)}</p>
          <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">
            Open story <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(15,18,12,0.82)_100%)]" />
        <span className="absolute left-3 top-3 rounded-full bg-white/88 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">{getEditableCategory(post)}</p>
          <h3 className="mt-2 line-clamp-3 text-lg font-semibold leading-tight tracking-[-0.03em] text-white">{post.title}</h3>
        </div>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block ${dc.surface.soft} p-5 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-sm font-bold text-[var(--slot4-page-text)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
            <Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}
          </p>
          <h3 className="mt-2 line-clamp-2 font-serif text-2xl font-semibold leading-tight tracking-[-0.03em] text-[var(--slot4-page-text)]">{post.title}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 108)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid gap-5 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} min-h-[220px]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0 py-2 sm:pr-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
            Read {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">{getEditableCategory(post)}</span>
        </div>
        <h2 className="mt-4 line-clamp-3 font-serif text-3xl font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-8 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 190)}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
          Open article <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export function HorizontalBookmarkCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const source = getEditableExcerpt(post, 98)
  return (
    <Link href={href} className={`group grid gap-5 overflow-hidden ${dc.surface.card} p-5 ${dc.motion.lift} md:grid-cols-[110px_minmax(0,1fr)]`}>
      <div className="flex h-24 w-24 items-center justify-center rounded-[1.7rem] bg-[var(--slot4-accent-soft)] text-[var(--slot4-page-text)]">
        <Bookmark className="h-8 w-8" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[var(--slot4-border)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">
            Shelf {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">{getEditableCategory(post)}</span>
        </div>
        <h3 className="mt-3 font-serif text-3xl font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{source || 'A saved page worth opening again.'}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
          View bookmark <ExternalLink className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
