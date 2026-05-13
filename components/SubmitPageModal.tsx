'use client'

import { useEffect, useState } from 'react'
import {
  categories,
  pendingSubmissionsStorageKey,
  type Category,
  type PendingSubmission,
  type SectionType,
} from '@/lib/content'

type SubmissionForm = {
  section: SectionType
  category: string
  subcategory: string
  title: string
  description: string
  galleryNote: string
}

const defaultSubmissionForm: SubmissionForm = {
  section: 'once',
  category: 'Inventions',
  subcategory: 'Household',
  title: '',
  description: '',
  galleryNote: '',
}

function getCategory(section: SectionType, title: string) {
  return categories[section].find((category) => category.title === title)
}

function getDefaultSubcategory(category: Category | undefined) {
  return category?.subcategories[0]?.title || ''
}

export default function SubmitPageModal() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState<SubmissionForm>(defaultSubmissionForm)

  useEffect(() => {
    if (!open) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  const updateSection = (section: SectionType) => {
    const category = categories[section][0]
    setForm((current) => ({
      ...current,
      section,
      category: category.title,
      subcategory: getDefaultSubcategory(category),
    }))
  }

  const updateCategory = (categoryTitle: string) => {
    const category = getCategory(form.section, categoryTitle)
    setForm((current) => ({
      ...current,
      category: categoryTitle,
      subcategory: getDefaultSubcategory(category),
    }))
  }

  const submitPage = (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.title.trim() || !form.description.trim()) return

    const pendingSubmission: PendingSubmission = {
      id: `${Date.now()}`,
      section: form.section,
      category: form.category,
      subcategory: form.subcategory,
      title: form.title.trim(),
      description: form.description.trim(),
      gallery: form.galleryNote.trim() ? [form.galleryNote.trim()] : [],
      createdAt: new Date().toISOString(),
    }
    const savedSubmissions = JSON.parse(localStorage.getItem(pendingSubmissionsStorageKey) || '[]') as PendingSubmission[]
    localStorage.setItem(pendingSubmissionsStorageKey, JSON.stringify([pendingSubmission, ...savedSubmissions]))
    setForm(defaultSubmissionForm)
    setMessage('Submission saved for review.')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true)
          setMessage('')
        }}
        className="text-xs uppercase tracking-[0.16em] text-black hover:text-gray-700 sm:text-[0.95rem] sm:tracking-[0.3em]"
      >
        Submit Page
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 px-4 py-6 sm:px-6 sm:py-10">
          <form onSubmit={submitPage} className="w-full max-w-2xl rounded-[1.5rem] border border-black/10 bg-white p-5 text-black shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:rounded-[2rem] sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 className="break-words text-xl font-black uppercase tracking-[0.12em] text-black sm:text-2xl sm:tracking-[0.2em]">Submit Page</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-gray-100 sm:px-4 sm:text-sm sm:tracking-[0.2em]"
              >
                close
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold uppercase tracking-[0.2em] text-black">
                Section
                <select
                  value={form.section}
                  onChange={(event) => updateSection(event.target.value as SectionType)}
                  className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm normal-case tracking-normal"
                >
                  <option value="once">once</option>
                  <option value="humans">humans</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold uppercase tracking-[0.2em] text-black">
                Category
                <select
                  value={form.category}
                  onChange={(event) => updateCategory(event.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm normal-case tracking-normal"
                >
                  {categories[form.section].map((category) => (
                    <option key={category.title} value={category.title}>{category.title}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold uppercase tracking-[0.2em] text-black">
                Subcategory
                <select
                  value={form.subcategory}
                  onChange={(event) => setForm((current) => ({ ...current, subcategory: event.target.value }))}
                  className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm normal-case tracking-normal"
                >
                  {getCategory(form.section, form.category)?.subcategories.map((subcategory) => (
                    <option key={subcategory.title} value={subcategory.title}>{subcategory.title}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold uppercase tracking-[0.2em] text-black">
                Title
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm normal-case tracking-normal"
                  placeholder="Microscope, Jane Austen, radio..."
                />
              </label>
            </div>
            <label className="mt-4 block space-y-2 text-sm font-semibold uppercase tracking-[0.2em] text-black">
              Description
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="w-full resize-none rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm normal-case tracking-normal"
                rows={4}
                placeholder="What should people know first?"
              />
            </label>
            <label className="mt-4 block space-y-2 text-sm font-semibold uppercase tracking-[0.2em] text-black">
              Gallery note
              <input
                value={form.galleryNote}
                onChange={(event) => setForm((current) => ({ ...current, galleryNote: event.target.value }))}
                className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm normal-case tracking-normal"
                placeholder="A visual idea or media note"
              />
            </label>

            <button
              type="submit"
              className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-900"
            >
              send for review
            </button>
            {message && (
              <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                {message}
              </p>
            )}
          </form>
        </div>
      )}
    </>
  )
}
