import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || 'Open this page for the full details.'
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as never)
  const detailVars = {
    '--detail-bg': preset.colors.background,
    '--detail-text': preset.colors.foreground,
    '--detail-surface': preset.colors.surface,
    '--detail-accent': preset.colors.accent,
  } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function DetailHero({
  task,
  post,
  category,
  icon,
  children,
}: {
  task: TaskKey
  post: SitePost
  category: string
  icon: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="bg-[#171c17] text-[var(--slot4-dark-text)]">
      <div className="mx-auto grid max-w-[var(--slot4-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:px-8 lg:py-14">
        <div className="rounded-[var(--slot4-radius-xl)] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
          <BackLink task={task} />
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
            {icon} {category}
          </div>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">{post.title}</h1>
        </div>
        <div className="self-end">{children}</div>
      </div>
    </section>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white/88">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <DetailHero task="article" post={post} category={categoryOf(post, 'Article')} icon={<FileText className="h-4 w-4" />}>
        <div className="rounded-[var(--slot4-radius-lg)] border border-white/10 bg-[#fffdf6] p-5 text-[var(--slot4-page-text)] shadow-[var(--slot4-shadow-strong)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Reading note</p>
          <p className="mt-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">Long-form pages use a quieter body layout, wider image support, and a clean sidebar for related reading.</p>
        </div>
      </DetailHero>
      <section className="mx-auto grid max-w-[var(--slot4-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-16">
        <article className="min-w-0 rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-[var(--detail-surface)] p-6 shadow-[var(--slot4-shadow)] sm:p-8 lg:p-10">
          {images[0] ? <img src={images[0]} alt={post.title} className="max-h-[620px] w-full rounded-[1.8rem] object-cover" /> : null}
          <BodyContent post={post} />
          <EditableComments slug={post.slug} comments={comments} />
        </article>
        <RelatedPanel task="article" post={post} related={related} />
      </section>
    </>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <>
      <DetailHero task="listing" post={post} category={categoryOf(post, 'Listing')} icon={<Building2 className="h-4 w-4" />}>
        <ContactAction website={website} phone={phone} email={email} inHero />
      </DetailHero>
      <section className="mx-auto grid max-w-[var(--slot4-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
        <article className="rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] sm:p-8">
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images} label="Listing gallery" large />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </section>
    </>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <DetailHero task="classified" post={post} category={categoryOf(post, 'Classified')} icon={<Tag className="h-4 w-4" />}>
        <div className="grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
      </DetailHero>
      <section className="mx-auto grid max-w-[var(--slot4-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.84fr_1.16fr] lg:px-8 lg:py-16">
        <aside className="rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-[#171c17] p-6 text-[var(--slot4-dark-text)] shadow-[var(--slot4-shadow-strong)] lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Quick actions</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {phone ? <a href={`tel:${phone}`} className="rounded-full bg-[var(--slot4-accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">Call now</a> : null}
            {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/12 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em]">Email</a> : null}
          </div>
          <ContactAction website={website} phone={phone} email={email} dark />
        </aside>
        <article className="rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] sm:p-8">
          <ImageStrip images={images} label="Offer images" large />
          <BodyContent post={post} />
          <RelatedPanel task="classified" post={post} related={related} />
        </article>
      </section>
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <>
      <DetailHero task="image" post={post} category={categoryOf(post, 'Image')} icon={<Camera className="h-4 w-4" />}>
        <div className="rounded-[var(--slot4-radius-lg)] border border-white/10 bg-white/8 p-5 text-white/72 backdrop-blur">
          Visual posts lead with media and keep the supporting copy lighter so the page feels more like a gallery than a document.
        </div>
      </DetailHero>
      <section className="mx-auto max-w-[var(--slot4-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] lg:sticky lg:top-24 lg:self-start">
            <BodyContent post={post} compact />
          </aside>
          <div className="columns-1 gap-5 space-y-5 md:columns-2">
            {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
              <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)]">
                <img src={image} alt={post.title} className="w-full object-cover" />
                {index === 0 ? <figcaption className="p-4 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">Featured visual from this image post.</figcaption> : null}
              </figure>
            ))}
          </div>
        </div>
        <div className="mt-10">
          <RelatedPanel task="image" post={post} related={related} />
        </div>
      </section>
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <DetailHero task="sbm" post={post} category={categoryOf(post, 'Collection')} icon={<Bookmark className="h-4 w-4" />}>
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">
            Open saved resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
      </DetailHero>
      <section className="mx-auto grid max-w-[var(--slot4-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-16">
        <article className="rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] sm:p-8 lg:p-10">
          <BodyContent post={post} />
        </article>
        <RelatedPanel task="sbm" post={post} related={related} />
      </section>
    </>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <>
      <DetailHero task="pdf" post={post} category={categoryOf(post, 'PDF')} icon={<Download className="h-4 w-4" />}>
        {fileUrl ? (
          <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">
            Download file <Download className="h-4 w-4" />
          </Link>
        ) : null}
      </DetailHero>
      <section className="mx-auto grid max-w-[var(--slot4-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-16">
        <article className="rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] sm:p-8">
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-8 overflow-hidden rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-[var(--slot4-panel-bg)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--slot4-border)] bg-white px-4 py-3">
                <span className="text-sm font-bold uppercase tracking-[0.12em]">Document preview</span>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
            </div>
          ) : null}
        </article>
        <RelatedPanel task="pdf" post={post} related={related} />
      </section>
    </>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <DetailHero task="profile" post={post} category={role || categoryOf(post, 'Profile')} icon={<UserRound className="h-4 w-4" />}>
        <ContactAction website={website} email={email} inHero />
      </DetailHero>
      <section className="mx-auto grid max-w-[var(--slot4-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8 lg:py-16">
        <aside className="rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white p-6 text-center shadow-[var(--slot4-shadow)] lg:sticky lg:top-24 lg:self-start">
          <div className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-panel-bg)]">
            {images[0] ? <img src={images[0]} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 text-[var(--slot4-muted-text)]" />}
          </div>
          <h2 className="mt-6 font-serif text-3xl font-semibold tracking-[-0.04em]">{post.title}</h2>
          {role ? <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">{role}</p> : null}
        </aside>
        <article className="rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-white p-6 shadow-[var(--slot4-shadow)] sm:p-8">
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Profile gallery" />
          <RelatedPanel task="profile" post={post} related={related} />
        </article>
      </section>
    </>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.4rem] border border-[var(--slot4-border)] bg-[var(--slot4-panel-bg)] p-4">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
            <Icon className="h-4 w-4" /> {label}
          </div>
          <p className="mt-2 break-words text-sm leading-7 text-[var(--slot4-page-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt={label} className="aspect-[4/3] rounded-[1.3rem] object-cover" />
        ))}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)]">
      <div className="flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em]">
        <MapPin className="h-4 w-4" /> {label || 'Map location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({
  website,
  phone,
  email,
  inHero = false,
  dark = false,
}: {
  website?: string
  phone?: string
  email?: string
  inHero?: boolean
  dark?: boolean
}) {
  if (!website && !phone && !email) return null
  return (
    <div className={`${inHero ? '' : 'mt-5'} rounded-[var(--slot4-radius-lg)] border ${dark ? 'border-white/10 bg-white/6 text-white/88' : 'border-[var(--slot4-border)] bg-white text-[var(--slot4-page-text)]'} p-5 backdrop-blur`}>
      <p className={`text-[11px] font-bold uppercase tracking-[0.24em] ${dark ? 'text-white/55' : 'text-[var(--slot4-muted-text)]'}`}>Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] ${dark ? 'bg-[var(--slot4-accent)] text-[var(--slot4-page-text)]' : 'bg-[#171c17] text-[var(--slot4-dark-text)]'}`}>
            Website <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        {phone ? <a href={`tel:${phone}`} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] ${dark ? 'border-white/10' : 'border-[var(--slot4-border)]'}`}><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] ${dark ? 'border-white/10' : 'border-[var(--slot4-border)]'}`}><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.3rem] border border-white/10 bg-white/8 px-4 py-3 text-sm">
      <span className="font-bold uppercase tracking-[0.18em] text-white/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  const showMeta = !compact && task === 'sbm'
  const showRelated = task !== 'sbm' && related.length > 0
  return (
    <aside className="space-y-5">
      {showMeta ? (
        <div className="rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white/78 p-5 backdrop-blur">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">About this page</p>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">
            <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Task: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}</p>
          </div>
        </div>
      ) : null}
      {showRelated ? (
        <div className="rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white/78 p-5 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-2xl font-semibold tracking-[-0.03em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-[1.4rem] border border-[var(--slot4-border)] bg-white p-3 transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--slot4-shadow)]">
      {image && task !== 'sbm' ? (
        <img src={image} alt={post.title} className="h-20 w-20 shrink-0 rounded-[1rem] object-cover" />
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1rem] bg-[var(--slot4-panel-bg)]">
          <FileText className="h-6 w-6 text-[var(--slot4-muted-text)]" />
        </div>
      )}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-semibold leading-6 tracking-[-0.02em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-6 text-[var(--slot4-soft-muted-text)]">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-[var(--slot4-panel-bg)] p-5">
      <div className="flex items-center gap-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
        <MessageCircle className="h-5 w-5" /> Comments
      </div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[1.4rem] border border-[var(--slot4-border)] bg-white p-4">
            <p className="text-sm font-semibold">{comment.name}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm leading-7 text-[var(--slot4-soft-muted-text)]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
