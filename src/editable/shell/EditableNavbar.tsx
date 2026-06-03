'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => [{ label: 'Home', href: '/' }, ...SITE_CONFIG.tasks.filter((task) => task.enabled).slice(0, 4).map((task) => ({ label: task.label, href: task.route })), { label: 'Contact', href: '/contact' }],
    []
  )
  const navVars = {
    '--editable-nav-bg': 'rgba(23, 28, 23, 0.92)',
    '--editable-nav-text': '#f8f3e1',
    '--editable-nav-muted': 'rgba(248, 243, 225, 0.72)',
    '--editable-nav-active': '#aeb784',
    '--editable-nav-border': 'rgba(248,243,225,0.12)',
  } as CSSProperties

  return (
    <header style={navVars} className="sticky top-0 z-50 border-b border-[var(--editable-nav-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-2xl">
      <nav className="mx-auto flex w-full max-w-[var(--slot4-container)] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/6">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
          </span>
          <span className="min-w-0">
            <span className="block font-serif text-2xl font-semibold tracking-[-0.04em]">{SITE_CONFIG.name}</span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--editable-nav-muted)] sm:block">
              {globalContent.nav.tagline}
            </span>
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium tracking-[0.02em] transition ${active ? 'text-[var(--editable-nav-active)]' : 'text-[var(--editable-nav-text)]/88 hover:text-[var(--editable-nav-active)]'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <form action="/search" className="hidden xl:block">
            <label className="flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2.5 text-[var(--editable-nav-muted)]">
              <Search className="h-4 w-4" />
              <input
                name="q"
                type="search"
                placeholder="Search"
                className="w-36 bg-transparent text-sm text-white outline-none placeholder:text-[var(--editable-nav-muted)]"
              />
            </label>
          </form>
          {session ? (
            <>
              <Link href="/create" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">
                <PlusCircle className="h-4 w-4" /> Create
              </Link>
              <button type="button" onClick={logout} className="rounded-full border border-white/12 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.12em] text-white/88">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.12em] text-white/88">
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">
                <UserPlus className="h-4 w-4" /> Sign up
              </Link>
            </>
          )}
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="ml-auto rounded-full border border-white/12 bg-white/6 p-2.5 md:hidden" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[var(--editable-nav-bg)] px-4 py-4 md:hidden">
          <form action="/search" className="mb-4">
            <label className="flex items-center gap-2 rounded-[1.3rem] border border-white/12 bg-white/6 px-4 py-3 text-[var(--editable-nav-muted)]">
              <Search className="h-4 w-4" />
              <input name="q" type="search" placeholder="Search pages" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[var(--editable-nav-muted)]" />
            </label>
          </form>
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-white/90">
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="rounded-[1.2rem] bg-[var(--slot4-accent)] px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">
                  Create
                </Link>
                <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-[1.2rem] border border-white/10 px-4 py-3 text-left text-sm font-bold uppercase tracking-[0.12em] text-white/90">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-[1.2rem] border border-white/10 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white/90">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-[1.2rem] bg-[var(--slot4-accent)] px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">
                  Sign up
                </Link>
              </>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/78">
            <span>{globalContent.site.tagline}</span>
            <ChevronDown className="h-4 w-4 opacity-55" />
          </div>
        </div>
      ) : null}
    </header>
  )
}
