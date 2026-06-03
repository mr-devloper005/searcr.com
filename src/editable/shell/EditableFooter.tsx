'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="relative border-t border-[var(--slot4-border)] bg-[#171c17] text-[var(--slot4-dark-text)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(174,183,132,0.24),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-[var(--slot4-container)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr_0.85fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/8">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
            </span>
            <span className="font-serif text-2xl font-semibold tracking-[-0.04em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-xl text-sm leading-8 text-[var(--slot4-dark-text)]/72">{globalContent.footer.description}</p>
          
        </div>

        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-dark-text)]/55">Sections</h3>
          <div className="mt-5 grid gap-3">
            {taskLinks.map((task) => (
              <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-dark-text)]/82 hover:text-[var(--slot4-accent)]">
                {task.label} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-dark-text)]/55">Site</h3>
          <div className="mt-5 grid gap-3">
            <Link href="/about" className="text-sm font-medium text-[var(--slot4-dark-text)]/82 hover:text-[var(--slot4-accent)]">About</Link>
            <Link href="/contact" className="text-sm font-medium text-[var(--slot4-dark-text)]/82 hover:text-[var(--slot4-accent)]">Contact</Link>
            <Link href="/search" className="text-sm font-medium text-[var(--slot4-dark-text)]/82 hover:text-[var(--slot4-accent)]">Search</Link>
            {session ? (
              <>
                <Link href="/create" className="text-sm font-medium text-[var(--slot4-dark-text)]/82 hover:text-[var(--slot4-accent)]">Create</Link>
                <button type="button" onClick={logout} className="text-left text-sm font-medium text-[var(--slot4-dark-text)]/82 hover:text-[var(--slot4-accent)]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-[var(--slot4-dark-text)]/82 hover:text-[var(--slot4-accent)]">Login</Link>
                <Link href="/signup" className="text-sm font-medium text-[var(--slot4-dark-text)]/82 hover:text-[var(--slot4-accent)]">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[var(--slot4-container)] flex-col gap-2 px-4 py-5 text-xs text-[var(--slot4-dark-text)]/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{globalContent.footer.bottomNote}</p>
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
