'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { autocompletePages } from '@/lib/content'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const suggestions = useMemo(() => autocompletePages(query), [query])
  const hasQuery = query.trim().length > 0
  const topSuggestion = suggestions[0]

  const openTopSuggestion = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || !topSuggestion) return
    window.location.href = `/entry/${topSuggestion.id}`
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f4ead4] px-6 text-black">
      <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center">
        <div className="w-full">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={openTopSuggestion}
            autoFocus
            className="w-full rounded-full border border-black/10 bg-white/95 px-8 py-5 text-lg text-black shadow-[0_25px_60px_rgba(15,23,42,0.12)] outline-none placeholder:text-black/35 focus:border-black/25"
            placeholder="Search Once Humans"
          />

          {hasQuery && (
            <div className="mt-5 grid gap-3">
              {suggestions.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-black/20 bg-white/80 p-5 text-center text-sm text-black/55">
                  No matches yet.
                </div>
              ) : (
                suggestions.map((page) => (
                  <Link
                    key={page.id}
                    href={`/entry/${page.id}`}
                    className="rounded-[1.5rem] border border-black/10 bg-white/95 p-5 text-black shadow-[0_15px_35px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
                  >
                    <h2 className="text-xl font-black uppercase tracking-[0.15em] text-black">{page.title}</h2>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-black/45">
                      {page.section} / {page.category} / {page.subcategory}
                    </p>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
