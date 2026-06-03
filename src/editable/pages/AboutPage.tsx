import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="bg-[#171c17] text-[var(--slot4-dark-text)]">
          <div className="mx-auto grid max-w-[var(--slot4-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-16">
            <article className="rounded-[var(--slot4-radius-xl)] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.about.badge}</p>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl">About {SITE_CONFIG.name}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">{pagesContent.about.description}</p>
            </article>
            <div className="rounded-[var(--slot4-radius-lg)] border border-white/10 bg-[#fffdf6] p-6 text-[var(--slot4-page-text)] shadow-[var(--slot4-shadow-strong)] sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">A more refined structure</p>
              <p className="mt-4 text-sm leading-8 text-[var(--slot4-soft-muted-text)]">
                The site is built to feel collected, comfortable, and visually distinct while still keeping every route and data flow working exactly as before.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--slot4-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <article className="rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-white/72 p-6 shadow-[var(--slot4-shadow)] sm:p-8">
              <div className="space-y-4 text-sm leading-8 text-[var(--slot4-soft-muted-text)]">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>
            <aside className="grid gap-4">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className={`rounded-[var(--slot4-radius-lg)] border p-6 shadow-[var(--slot4-shadow)] ${index === 1 ? 'border-[#171c17] bg-[#171c17] text-[var(--slot4-dark-text)]' : 'border-[var(--slot4-border)] bg-white/72 text-[var(--slot4-page-text)]'}`}>
                  <h2 className="font-serif text-2xl font-semibold tracking-[-0.03em]">{value.title}</h2>
                  <p className={`mt-3 text-sm leading-7 ${index === 1 ? 'text-white/72' : 'text-[var(--slot4-soft-muted-text)]'}`}>{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
