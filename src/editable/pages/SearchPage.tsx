import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Bookmark, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => (typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : '')
const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? (content.images.find((item) => typeof item === 'string') as string | undefined) : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : ''].some((value) =>
    compactText(value).includes(query)
  )
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const summary = summaryOf(post)

  return (
    <Link href={href} className="group block rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white shadow-[var(--slot4-shadow)] transition duration-300 hover:-translate-y-1">
      <div className="grid gap-4 p-5 sm:grid-cols-[88px_minmax(0,1fr)] sm:items-start sm:p-6">
        <div className="flex h-[74px] w-[74px] items-center justify-center rounded-[1.4rem] bg-[var(--slot4-accent-soft)] text-[var(--slot4-page-text)]">
          <Bookmark className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--slot4-border)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">
              Shelf {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <h2 className="mt-4 line-clamp-3 font-serif text-3xl font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h2>
        {summary ? <p className="mt-4 line-clamp-3 text-sm leading-8 text-[var(--slot4-soft-muted-text)]">{summary}</p> : null}
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">View bookmark <ArrowRight className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="bg-[#171c17] text-[var(--slot4-dark-text)]">
          <div className="mx-auto grid max-w-[var(--slot4-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-16">
            <div className="rounded-[var(--slot4-radius-xl)] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.search.hero.badge}</p>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl">{pagesContent.search.hero.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">{pagesContent.search.hero.description}</p>
            </div>
            <form action="/search" className="self-end rounded-[var(--slot4-radius-lg)] border border-white/10 bg-[#fffdf6] p-5 text-[var(--slot4-page-text)] shadow-[var(--slot4-shadow-strong)]">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-[1.2rem] border border-[var(--slot4-border)] bg-white px-4 py-3">
                <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-[1.2rem] border border-[var(--slot4-border)] bg-white px-4 py-3">
                  <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                </label>
                <select name="task" defaultValue={task} className="rounded-[1.2rem] border border-[var(--slot4-border)] bg-white px-4 py-3 text-sm outline-none">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-[1.2rem] bg-[var(--slot4-accent-fill)] px-6 text-sm font-bold uppercase tracking-[0.14em] text-[var(--slot4-dark-text)] transition hover:-translate-y-0.5" type="submit">
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--slot4-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">{results.length} results</p>
              <h2 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em] text-[var(--slot4-page-text)]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/sbm" className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-border)] bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.12em]">
              Browse bookmarks <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-[var(--slot4-radius-lg)] border border-dashed border-[var(--slot4-border)] bg-white/70 p-10 text-center">
              <p className="font-serif text-3xl font-semibold tracking-[-0.03em]">No matching posts found.</p>
              <p className="mt-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
