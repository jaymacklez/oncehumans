'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import ContentPageSurface from '@/components/ContentPageSurface'
import LiveChatDrawer from '@/components/LiveChatDrawer'
import { type Category, type ContentPage, getPagesForSubcategory, slugify, type Subcategory, type SectionType } from '@/lib/content'

type SubcategoryPageSurfaceProps = {
  section: SectionType
  category: Category
  subcategory: Subcategory
  onBack?: () => void
  backHref?: string
}

export default function SubcategoryPageSurface({ section, category, subcategory, onBack, backHref }: SubcategoryPageSurfaceProps) {
  const pages = useMemo(
    () => getPagesForSubcategory(section, category.title, subcategory.title),
    [category.title, section, subcategory.title],
  )
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null)
  const href = `/${section}/${slugify(category.title)}/${slugify(subcategory.title)}`

  if (selectedPage) {
    return (
      <ContentPageSurface
        key={selectedPage.id}
        page={selectedPage}
        relatedMode="inline"
        onBack={() => setSelectedPage(null)}
        onSelectRelated={(page) => setSelectedPage(page)}
      />
    )
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-black/10 bg-white/95 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:p-8">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/65 transition hover:bg-slate-100 hover:text-black"
          >
            back
          </button>
        ) : backHref ? (
          <Link
            href={backHref}
            className="mb-6 inline-flex rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/65 transition hover:bg-slate-100 hover:text-black"
          >
            back
          </Link>
        ) : null}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-black/45 sm:tracking-[0.35em]">
              {section} / {category.title}
            </p>
            <h1 className="mt-3 break-words text-3xl font-black uppercase tracking-[0.08em] text-black sm:text-5xl sm:tracking-[0.16em]">
              {subcategory.title}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-black/70 sm:text-base">
              {subcategory.description}
            </p>
          </div>
          <LiveChatDrawer
            room={{
              id: `subcategory:${section}:${slugify(category.title)}:${slugify(subcategory.title)}`,
              title: subcategory.title,
              section,
              href,
            }}
          />
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={() => setSelectedPage(page)}
            className="group block w-full overflow-hidden rounded-[1.5rem] border border-black/10 bg-slate-950 text-left shadow-[0_25px_60px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.22)]"
          >
            <div className={`h-32 rounded-t-[1.5rem] bg-gradient-to-br ${category.accent} bg-cover bg-center sm:h-40`} />
            <div className="space-y-3 bg-slate-950 p-5">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-white/45">
                {page.category}
              </p>
              <h2 className="break-words text-xl font-black uppercase tracking-[0.1em] text-white sm:text-2xl sm:tracking-[0.14em]">
                {page.title}
              </h2>
              <p className="line-clamp-3 text-sm leading-6 text-white/65">
                {page.description}
              </p>
            </div>
          </button>
        ))}
      </section>

      {pages.length === 0 && (
        <div className="rounded-[2rem] border border-dashed border-black/15 bg-white/80 p-10 text-center text-sm text-black/55">
          No starter pages here yet.
        </div>
      )}
    </div>
  )
}
