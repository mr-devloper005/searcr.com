import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#171c17] text-[var(--slot4-dark-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--slot4-container)] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.auth.login.badge}</p>
            <h1 className="mt-5 max-w-xl font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-white/72">{pagesContent.auth.login.description}</p>
          </div>
          <div className="rounded-[var(--slot4-radius-xl)] border border-white/10 bg-[#fffdf6] p-6 text-[var(--slot4-page-text)] shadow-[var(--slot4-shadow-strong)] sm:p-8">
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-5 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">
              New here? <Link href="/signup" className="font-bold underline underline-offset-4">{pagesContent.auth.login.createCta}</Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
