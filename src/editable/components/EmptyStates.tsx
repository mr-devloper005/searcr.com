import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh posts will appear here automatically once this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-[var(--slot4-radius-lg)] border border-[var(--slot4-border)] bg-white/70 p-8 text-center shadow-[var(--slot4-shadow)]', className)}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-page-text)]">
        <SearchX className="h-7 w-7" />
      </div>
      <h2 className="mt-5 font-serif text-3xl font-semibold tracking-[-0.03em]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-[var(--slot4-soft-muted-text)]">{description}</p>
      <Link href={actionHref} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[var(--slot4-dark-text)] transition hover:-translate-y-0.5">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically once they are available. The layout is ready and waiting.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
