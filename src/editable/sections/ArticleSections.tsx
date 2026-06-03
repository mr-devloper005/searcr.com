import Link from 'next/link'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({
  posts,
  pagination,
  category = 'all',
  basePath = '/article',
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category?: string
  basePath?: string
}) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`

  return (
    <main className={dc.shell.page}>
      <section className="bg-[#171c17] text-[var(--slot4-dark-text)]">
        <div className={`${dc.shell.section} py-12 lg:py-16`}>
          <div className="grid gap-8 rounded-[var(--slot4-radius-xl)] border border-white/10 bg-white/6 p-6 backdrop-blur-xl lg:grid-cols-[1.02fr_0.98fr] sm:p-8 lg:p-10">
            <div>
              <p className={`${dc.type.eyebrow} text-[var(--slot4-accent)]`}>{voice.eyebrow}</p>
              <h1 className={`${dc.type.heroTitle} mt-5 max-w-4xl text-white`}>{voice.headline}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/72">{voice.description}</p>
            </div>
            <form action={basePath} className="self-end rounded-[var(--slot4-radius-lg)] border border-white/10 bg-[#fffdf6] p-5 text-[var(--slot4-page-text)] shadow-[var(--slot4-shadow-strong)]">
              <select name="category" defaultValue={category || 'all'} className={`min-w-0 w-full rounded-[1.2rem] border ${pal.border} bg-white px-5 py-3 text-sm ${pal.panelText} outline-none`}>
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="mt-3 w-full rounded-[1.2rem] bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[var(--slot4-dark-text)]">Filter</button>
            </form>
          </div>
        </div>
      </section>

      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        {posts.length ? (
          <div className="grid gap-5">
            {posts.map((post, index) => <ArticleListCard key={post.id || post.slug} post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * (pagination.limit || 24)} />)}
          </div>
        ) : (
          <div className={`${dc.surface.soft} p-8 text-center`}>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em]">No articles found</h2>
            <p className={`mt-3 text-sm leading-7 ${pal.softMutedText}`}>Try another category or return to all articles.</p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className={`rounded-full border ${pal.border} bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.12em]`}>Previous</Link> : null}
          <span className={`rounded-full ${pal.darkBg} px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white`}>Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className={`rounded-full border ${pal.border} bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.12em]`}>Next</Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className="bg-[#171c17] text-[var(--slot4-dark-text)]">
        <div className={`${dc.shell.section} py-10 lg:py-14`}>
          <div className="grid gap-6 rounded-[var(--slot4-radius-xl)] border border-white/10 bg-white/6 p-6 backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_320px] lg:p-10">
            <div className="min-w-0">
              <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white/88"><ChevronLeft className="h-4 w-4" /> Articles</Link>
              <p className={`${dc.type.eyebrow} mt-8 text-[var(--slot4-accent)]`}>{voice.eyebrow}</p>
              <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
            </div>
            <aside className="min-w-0 rounded-[var(--slot4-radius-lg)] border border-white/10 bg-[#fffdf6] p-6 text-[var(--slot4-page-text)] shadow-[var(--slot4-shadow-strong)]">
              <p className={`${dc.type.eyebrow} ${pal.accentText}`}>Reading note</p>
              <p className="mt-4 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{voice.secondaryNote}</p>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[var(--slot4-dark-text)]">Contact <ArrowRight className="h-4 w-4" /></Link>
            </aside>
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
        <div className={`rounded-[var(--slot4-radius-lg)] border ${pal.border} bg-white p-6 shadow-[var(--slot4-shadow)] sm:p-8 lg:p-10`}>
          <p className={`text-sm leading-8 ${pal.softMutedText}`}>{post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}</p>
        </div>
      </section>
    </main>
  )
}
