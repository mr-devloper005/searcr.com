'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass =
  'rounded-[1.2rem] border border-[var(--slot4-border)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-border-strong)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="bg-[var(--slot4-page-bg)]">
          <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--slot4-container)] items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:px-8">
            <div className="rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-[#171c17] p-10 text-[var(--slot4-dark-text)] shadow-[var(--slot4-shadow-strong)]">
              <Lock className="h-16 w-16 text-[var(--slot4-accent)]" />
            </div>
            <div className="rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-white/76 p-6 shadow-[var(--slot4-shadow)] sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]">{pagesContent.create.locked.badge}</p>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-6xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[var(--slot4-soft-muted-text)]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[var(--slot4-dark-text)]">
                  Login <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-border)] bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.14em]">
                  Sign up
                </Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="bg-[#171c17] text-[var(--slot4-dark-text)]">
          <div className="mx-auto grid max-w-[var(--slot4-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-16">
            <div className="rounded-[var(--slot4-radius-xl)] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.create.hero.badge}</p>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/72">{pagesContent.create.hero.description}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <button key={item.key} type="button" onClick={() => setTask(item.key)} className={`rounded-[1.4rem] border p-4 text-left transition ${active ? 'border-[var(--slot4-accent)] bg-white/10 text-white' : 'border-white/10 bg-white/6 text-white/82 hover:-translate-y-0.5'}`}>
                      <Icon className="h-5 w-5" />
                      <span className="mt-3 block text-sm font-bold uppercase tracking-[0.12em]">{item.label}</span>
                      <span className="mt-2 block text-xs leading-6 text-white/62">{item.description}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <form onSubmit={submit} className="rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-white/82 p-6 text-[var(--slot4-page-text)] shadow-[var(--slot4-shadow)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.03em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="rounded-full bg-[var(--slot4-panel-bg)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em]">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 rounded-[1.2rem] bg-[#e8f0d7] p-4 text-[#394117]">
                  <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-2 text-sm leading-7">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[1.2rem] bg-[var(--slot4-accent-fill)] px-6 text-sm font-bold uppercase tracking-[0.14em] text-[var(--slot4-dark-text)] transition hover:-translate-y-0.5">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
