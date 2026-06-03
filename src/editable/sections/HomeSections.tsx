import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, Search, Star } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import {
  CompactIndexCard,
  EditorialFeatureCard,
  HorizontalBookmarkCard,
  RailPostCard,
  getEditableExcerpt,
  getEditablePostImage,
  postHref,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function SectionShell({
  eyebrow,
  title,
  description,
  action,
  children,
  dark = false,
}: {
  eyebrow: string
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  dark?: boolean
}) {
  return (
    <section className={dark ? 'bg-[#171c17] text-[var(--slot4-dark-text)]' : ''}>
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className={`text-[11px] font-bold uppercase tracking-[0.28em] ${dark ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-muted-text)]'}`}>{eyebrow}</p>
            <h2 className={`mt-4 font-serif text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-5xl ${dark ? 'text-[var(--slot4-dark-text)]' : 'text-[var(--slot4-page-text)]'}`}>{title}</h2>
            {description ? <p className={`mt-4 max-w-2xl text-base leading-8 ${dark ? 'text-[var(--slot4-dark-text)]/72' : 'text-[var(--slot4-soft-muted-text)]'}`}>{description}</p> : null}
          </div>
          {action}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const sideLead = posts[1]
  const tertiary = posts[2]

  return (
    <section className="relative overflow-hidden bg-[#171c17] text-[var(--slot4-dark-text)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-8%] top-[-3%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(174,183,132,0.22),transparent_64%)]" />
        <div className="absolute bottom-[-16%] left-[48%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(65,67,27,0.9),transparent_66%)]" />
        <div className="absolute bottom-[-18rem] right-[4%] h-[42rem] w-[42rem] rounded-[45%] border border-[rgba(174,183,132,0.25)] opacity-70" />
      </div>
      <div className={`${dc.shell.section} relative py-8 sm:py-10 lg:py-16`}>
        <div className={`${dc.layout.splitHero} gap-10`}>
          <div className="py-4 lg:py-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.home.hero.badge}</p>
            <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-white sm:text-6xl lg:text-[5.2rem]">
              Access curated collections and refined discoveries on {SITE_CONFIG.name}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-9 text-white/74 sm:text-lg">{pagesContent.home.hero.description}</p>

            <form action="/search" className="mt-8 flex max-w-xl flex-col gap-3 rounded-[1.9rem] border border-white/10 bg-white/8 p-3 backdrop-blur sm:flex-row">
              <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.2rem] bg-white px-4 py-3 text-[var(--slot4-page-text)]">
                <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input name="q" placeholder={pagesContent.home.hero.searchPlaceholder} className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
              </label>
              <button className="rounded-[1.2rem] bg-[var(--slot4-accent)] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[var(--slot4-page-text)]">Search</button>
            </form>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryRoute} className={dc.button.primary}>Browse {taskLabel(primaryTask)} <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/14 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white/88 transition hover:bg-white/8">
                Contact
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1 text-[#f3d36b]">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}
              </div>
              <span className="h-5 w-px bg-white/16" />
              <span>Thoughtful layout for people who like to save, revisit, and keep browsing.</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[var(--slot4-radius-xl)] border border-white/10 bg-[#fffdf7] p-4 text-[var(--slot4-page-text)] shadow-[var(--slot4-shadow-strong)] sm:p-6">
              <div className="grid gap-4 rounded-[2rem] bg-[linear-gradient(180deg,#fffdf6_0%,#f4edcf_100%)] p-4 sm:p-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Collection highlight</p>
                  <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-[-0.04em]">{lead?.title || 'Collected finds worth opening next'}</h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{lead ? getEditableExcerpt(lead, 150) : 'Fresh pages, thoughtful arrangement, and easier discovery across every section.'}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative min-h-[250px] overflow-hidden rounded-[1.7rem] bg-[var(--slot4-media-bg)]">
                    <img src={getEditablePostImage(lead)} alt={lead?.title || 'Featured post'} className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <div className="grid gap-4">
                    {[sideLead, tertiary].map((post, index) => (
                      <Link key={post?.id || index} href={post ? postHref(primaryTask, post, primaryRoute) : primaryRoute} className="rounded-[1.5rem] border border-[var(--slot4-border)] bg-white/86 p-4 transition hover:-translate-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">{index === 0 ? 'Quick pick' : 'Shortlist'}</p>
                        <h3 className="mt-2 font-serif text-xl font-semibold leading-tight">{post?.title || 'Browse the latest collection'}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-soft-muted-text)]">{post ? getEditableExcerpt(post, 72) : 'Fresh additions will appear here automatically.'}</p>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-[#171c17] px-5 py-4 text-white">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/56">Weekly rhythm</p>
                    <p className="mt-1 text-sm text-white/82">Featured covers, compact shelves, and steady archive browsing.</p>
                  </div>
                  <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--slot4-page-text)]">
                    Open now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 10)
  if (!railPosts.length) return null

  return (
    <SectionShell
      eyebrow="Featured shelf"
      title="A rail of quick discoveries for the next open tab."
      description="Use the shelf to skim what is trending before stepping into the deeper editorial blocks below."
      action={<Link href={primaryRoute} className={dc.button.secondary}>View all <ArrowRight className="h-4 w-4" /></Link>}
    >
      <div className={dc.layout.rail}>
        {railPosts.map((post, index) => (
          <RailPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
        ))}
      </div>
    </SectionShell>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feature = posts[3] || posts[0]
  const compactPosts = posts.slice(4, 10)
  if (!feature) return null

  return (
    <SectionShell
      eyebrow="Lead feature"
      title="A deeper editorial moment paired with compact collection notes."
      description="This section shifts from shelf browsing into a stronger feature-and-index composition inspired by premium landing pages."
      dark
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <EditorialFeatureCard post={feature} href={postHref(primaryTask, feature, primaryRoute)} label="Lead collection" />
        <div className="grid gap-4">
          {compactPosts.map((post, index) => (
            <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const grouped = timeSections.flatMap((section) => section.posts)
  const sourcePosts = grouped.length ? grouped : posts
  const bookmarkFeature = sourcePosts[0]
  const bookmarkList = sourcePosts.slice(1, 4)
  const imagePicks = posts.slice(10, 14)

  return (
    <>
      <SectionShell
        eyebrow="Collected references"
        title="Shelf-style lists, compact resource blocks, and image-first moments."
        description="The homepage keeps visual variety by alternating wide bookmark cards with lighter editorial notes and image-led tiles."
        action={<Link href="/search" className={dc.button.secondary}>Search archive <ArrowRight className="h-4 w-4" /></Link>}
      >
        <div className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="grid gap-4">
            {bookmarkFeature ? (
              <Link href={postHref(primaryTask, bookmarkFeature, primaryRoute)} className="group relative overflow-hidden rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-[#f4edcf] p-6 shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1">
                <div className="absolute right-[-4rem] top-[-4rem] h-44 w-44 rounded-full bg-white/45" />
                <div className="relative max-w-2xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]">Featured collection</p>
                  <h3 className="mt-4 font-serif text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--slot4-page-text)]">{bookmarkFeature.title}</h3>
                  <p className="mt-4 text-sm leading-8 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(bookmarkFeature, 160)}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
                    Open collection <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ) : null}
            {bookmarkList.map((post, index) => (
              <HorizontalBookmarkCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {imagePicks.map((post, index) => (
              <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className={`group overflow-hidden rounded-[1.9rem] border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1 ${index === 0 ? 'sm:col-span-2' : ''}`}>
                <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${index === 0 ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}>
                  <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_32%,rgba(23,28,23,0.76)_100%)]" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">{index === 0 ? 'Image-led pick' : 'Visual note'}</p>
                    <h3 className="mt-2 line-clamp-3 font-serif text-2xl font-semibold leading-tight tracking-[-0.03em] text-white">{post.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SectionShell>

      <section className="bg-[linear-gradient(180deg,#f5edd7_0%,#f8f3e1_100%)]">
        <div className={`${dc.shell.section} py-14 sm:py-16 lg:py-20`}>
          <div className="grid gap-8 rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-white/70 p-6 shadow-[var(--slot4-shadow)] backdrop-blur sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]">{pagesContent.home.intro.badge}</p>
              <h2 className="mt-4 font-serif text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--slot4-page-text)] sm:text-5xl">{pagesContent.home.intro.title}</h2>
              <div className="mt-5 space-y-4 text-sm leading-8 text-[var(--slot4-soft-muted-text)]">
                {pagesContent.home.intro.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={pagesContent.home.intro.primaryLink.href} className={dc.button.dark}>{pagesContent.home.intro.primaryLink.label}</Link>
                <Link href={pagesContent.home.intro.secondaryLink.href} className={dc.button.secondary}>{pagesContent.home.intro.secondaryLink.label}</Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {pagesContent.home.intro.sidePoints.map((point, index) => (
                <div key={point} className={`rounded-[1.8rem] border border-[var(--slot4-border)] p-5 ${index % 2 === 0 ? 'bg-[#171c17] text-white' : 'bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]'}`}>
                  <p className={`text-[11px] font-bold uppercase tracking-[0.24em] ${index % 2 === 0 ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-muted-text)]'}`}>0{index + 1}</p>
                  <p className="mt-3 text-sm leading-7">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[#171c17] text-[var(--slot4-dark-text)]">
      <div className={`${dc.shell.section} py-16 sm:py-20`}>
        <div className="mx-auto max-w-4xl rounded-[var(--slot4-radius-xl)] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-6 py-12 text-center shadow-[var(--slot4-shadow-strong)] sm:px-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.home.cta.badge}</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-5xl">{pagesContent.home.cta.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/72">{pagesContent.home.cta.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={pagesContent.home.cta.primaryCta.href} className={dc.button.primary}>{pagesContent.home.cta.primaryCta.label}</Link>
            <Link href={pagesContent.home.cta.secondaryCta.href} className="inline-flex items-center justify-center rounded-full border border-white/14 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white/88 transition hover:bg-white/8">
              {pagesContent.home.cta.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
