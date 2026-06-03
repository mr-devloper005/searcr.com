'use client'

import { Bookmark, Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

function lanesFor(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Business onboarding', body: 'Add listings, verify details, and make directory pages feel polished from the first entry.' },
      { icon: Phone, title: 'Partnership support', body: 'Discuss local growth, category planning, and operational questions with the team.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Need a new region or category lane? We can organize the browsing flow around it.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Editorial submissions', body: 'Share essays, features, and reading ideas that fit the site’s calmer publication style.' },
      { icon: Mail, title: 'Contributor questions', body: 'Reach out for help with article structure, publishing direction, or archive placement.' },
      { icon: Sparkles, title: 'Special projects', body: 'Plan a themed series, spotlight page, or other curated editorial moment.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Coordinate gallery launches, visual features, and image-first highlights.' },
      { icon: Sparkles, title: 'Licensing and usage', body: 'Ask about image use, feature placement, or commercial visual requests.' },
      { icon: Mail, title: 'Media requests', body: 'Request support for campaigns, collections, or creator-facing pages.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Collection suggestions', body: 'Recommend useful resources, shelves, links, or topic groupings that deserve a place in the archive.' },
    { icon: Mail, title: 'Partnership requests', body: 'Talk through curation projects, resource programs, or collection collaborations.' },
    { icon: Sparkles, title: 'General support', body: 'Get help with browsing, submissions, or keeping the site’s discovery flow working smoothly.' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = lanesFor(productKind)

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="bg-[#171c17] text-[var(--slot4-dark-text)]">
          <div className="mx-auto grid max-w-[var(--slot4-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.94fr] lg:px-8 lg:py-16">
            <div className="rounded-[var(--slot4-radius-xl)] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.contact.eyebrow}</p>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl">{pagesContent.contact.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">{pagesContent.contact.description}</p>
            </div>
            
          </div>
        </section>

        <section className="mx-auto max-w-[var(--slot4-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.94fr_1.06fr]">
            <div className="grid gap-4">
              {lanes.map((lane, index) => (
                <div key={lane.title} className={`rounded-[var(--slot4-radius-lg)] border p-6 shadow-[var(--slot4-shadow)] ${index === 1 ? 'border-[#171c17] bg-[#171c17] text-[var(--slot4-dark-text)]' : 'border-[var(--slot4-border)] bg-white/72 text-[var(--slot4-page-text)]'}`}>
                  <lane.icon className="h-5 w-5" />
                  <h2 className="mt-4 font-serif text-2xl font-semibold tracking-[-0.03em]">{lane.title}</h2>
                  <p className={`mt-3 text-sm leading-7 ${index === 1 ? 'text-white/72' : 'text-[var(--slot4-soft-muted-text)]'}`}>{lane.body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[var(--slot4-radius-xl)] border border-[var(--slot4-border)] bg-white/82 p-6 shadow-[var(--slot4-shadow)] sm:p-8">
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em]">{pagesContent.contact.formTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">Share a clear note and we’ll route it through the right lane.</p>
              <div className="mt-6">
                <EditableContactLeadForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
