import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--slot4-container)] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:px-8">
          <div className="rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-white/82 p-6 shadow-[var(--slot4-shadow)] sm:p-8">
            <h1 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[var(--slot4-page-text)]">{pagesContent.auth.signup.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-5 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">
              Already have an account? <Link href="/login" className="font-bold underline underline-offset-4">{pagesContent.auth.signup.loginCta}</Link>
            </p>
          </div>
          <div className="rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-[#171c17] p-8 text-[var(--slot4-dark-text)] shadow-[var(--slot4-shadow-strong)] sm:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.auth.signup.badge}</p>
            <h2 className="mt-5 max-w-xl font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-white/72">{pagesContent.auth.signup.description}</p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
