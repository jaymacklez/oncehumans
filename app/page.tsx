'use client'

import { useEffect, useMemo, useState } from 'react'
import GalleryMediaSection from '@/components/GalleryMediaSection'
import LiveChatDrawer from '@/components/LiveChatDrawer'
import {
  categories,
  type ContentPage,
  findPageById,
  getRelatedPages,
  getPagesForSubcategory,
  seededPages,
  type Category,
  type SectionType,
} from '@/lib/content'

type CompactPagePreviewProps = {
  page: ContentPage
  onSelectRelated: (page: ContentPage) => void
}

function CompactPagePreview({ page, onSelectRelated }: CompactPagePreviewProps) {
  const [postBody, setPostBody] = useState('')
  const [posts, setPosts] = useState<string[]>([])
  const relatedPages = getRelatedPages(page)

  const addPost = () => {
    if (!postBody.trim()) return
    setPosts((current) => [postBody.trim(), ...current])
    setPostBody('')
  }

  return (
    <article className="space-y-4 rounded-[1.25rem] border border-black/10 bg-white/95 p-4 shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:space-y-5 sm:rounded-[2rem] sm:p-6">
      <div className="rounded-[1.25rem] bg-slate-950 p-4 text-white sm:rounded-[1.75rem] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="break-words text-[0.7rem] uppercase tracking-[0.16em] text-white/55 sm:text-xs sm:tracking-[0.3em]">
              {page.section} / {page.category} / {page.subcategory}
            </p>
            <h2 className="mt-3 break-words text-2xl font-black uppercase tracking-[0.08em] text-white sm:text-3xl sm:tracking-[0.18em]">{page.title}</h2>
          </div>
          <LiveChatDrawer
            key={`entry:${page.id}`}
            room={{
              id: `entry:${page.id}`,
              title: page.title,
              section: page.section,
              href: `/entry/${page.id}`,
            }}
          />
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-7 text-white/78">{page.description}</p>
      </div>

      <GalleryMediaSection key={page.id} seedItems={page.gallery} compact />

      {relatedPages.length > 0 && (
        <section className="rounded-[1.25rem] border border-black/10 bg-slate-50 p-4 sm:rounded-[1.5rem] sm:p-5">
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-black sm:tracking-[0.25em]">Related</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {relatedPages.map((relatedPage) => (
              <button
                key={relatedPage.id}
                type="button"
                onClick={() => onSelectRelated(relatedPage)}
                className="rounded-[1.1rem] bg-slate-950 p-4 text-left text-white transition hover:-translate-y-0.5 hover:bg-black"
              >
                <p className="break-words text-[0.65rem] uppercase tracking-[0.14em] text-white/50 sm:tracking-[0.22em]">{relatedPage.subcategory}</p>
                <h4 className="mt-2 break-words text-sm font-black uppercase tracking-[0.08em] sm:tracking-[0.14em]">{relatedPage.title}</h4>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-[1.25rem] border border-black/10 bg-slate-50 p-4 sm:rounded-[1.5rem] sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-black sm:tracking-[0.25em]">Posts</h3>
          <button
            type="button"
            onClick={addPost}
            className="rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
          >
            post
          </button>
        </div>
        <textarea
          value={postBody}
          onChange={(event) => setPostBody(event.target.value)}
          className="mt-4 w-full resize-none rounded-[1.25rem] border border-black/10 bg-white p-4 text-sm text-black outline-none focus:border-black/25"
          rows={3}
          placeholder="Write a new post..."
        />
        <div className="mt-4 space-y-3">
          {posts.length === 0 ? (
            <p className="text-sm text-black/50">No posts yet.</p>
          ) : (
            posts.map((post, index) => (
              <div key={index} className="rounded-[1.1rem] border border-black/10 bg-white p-4 text-sm leading-6 text-black/75">
                {post}
              </div>
            ))
          )}
        </div>
      </section>
    </article>
  )
}

export default function Home() {
  const [openSection, setOpenSection] = useState<SectionType | null>(null)
  const [openCategory, setOpenCategory] = useState('')
  const [openSubcategory, setOpenSubcategory] = useState('')
  const [selectedPageId, setSelectedPageId] = useState('')

  const selectedPage = useMemo(() => findPageById(selectedPageId), [selectedPageId])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      const entry = params.get('entry')
      const page = entry ? findPageById(entry) : undefined
      if (!page) return

      setOpenSection(page.section)
      setOpenCategory(page.category)
      setOpenSubcategory(page.subcategory)
      setSelectedPageId(page.id)
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [])

  const chooseSection = (section: SectionType) => {
    setOpenSection((current) => current === section ? null : section)
    setOpenCategory('')
    setOpenSubcategory('')
    setSelectedPageId('')
  }

  const chooseCategory = (category: Category) => {
    setOpenCategory((current) => current === category.title ? '' : category.title)
    setOpenSubcategory('')
    setSelectedPageId('')
  }

  const chooseSubcategory = (subcategory: string) => {
    setOpenSubcategory((current) => current === subcategory ? '' : subcategory)
    setSelectedPageId('')
  }

  const focusPage = (page: ContentPage) => {
    setOpenSection(page.section)
    setOpenCategory(page.category)
    setOpenSubcategory(page.subcategory)
    setSelectedPageId(page.id)
  }

  const activeCategories = openSection ? categories[openSection] : []
  const orderedCategories = openCategory
    ? [
        ...activeCategories.filter((category) => category.title === openCategory),
        ...activeCategories.filter((category) => category.title !== openCategory),
      ]
    : activeCategories
  const browseRail = (
    <div className="space-y-4">
      {orderedCategories.map((category) => (
        <div key={category.title} className="space-y-3">
          <button
            type="button"
            onClick={() => chooseCategory(category)}
            className={`group block w-full overflow-hidden rounded-[1.6rem] border text-left shadow-[0_18px_45px_rgba(15,23,42,0.13)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.18)] ${openCategory === category.title ? 'border-black bg-black' : 'border-black/10 bg-slate-950'}`}
          >
            <div className={`h-28 rounded-t-[1.6rem] bg-gradient-to-br ${category.accent} bg-cover bg-center`} />
            <div className="bg-slate-950 p-5">
              <h3 className="break-words text-lg font-black uppercase tracking-[0.12em] text-white sm:text-xl sm:tracking-[0.18em]">{category.title}</h3>
            </div>
          </button>

          {openCategory === category.title && (
            <div className="grid gap-3 rounded-[1.35rem] border border-black/10 bg-white/95 p-3 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
              {category.subcategories.map((subcategory) => {
                const subcategoryPages = openSection
                  ? getPagesForSubcategory(openSection, category.title, subcategory.title)
                  : []

                return (
                  <div key={subcategory.title} className="space-y-3">
                    <button
                      type="button"
                      onClick={() => chooseSubcategory(subcategory.title)}
                      className={`w-full rounded-[1rem] border px-4 py-3 text-left transition hover:-translate-y-0.5 ${openSubcategory === subcategory.title ? 'border-black bg-black text-white' : 'border-black/10 bg-slate-50 text-black'}`}
                    >
                      <h3 className="break-words text-sm font-black uppercase tracking-[0.1em] sm:tracking-[0.18em]">{subcategory.title}</h3>
                    </button>

                    {openSubcategory === subcategory.title && (
                      <div className="grid gap-3 rounded-[1.1rem] border border-black/10 bg-slate-50 p-3">
                        {subcategoryPages.length === 0 ? (
                          <div className="rounded-[1rem] border border-dashed border-black/15 bg-white p-4 text-sm text-black/55">
                            No starter entries here yet.
                          </div>
                        ) : (
                          subcategoryPages.map((page) => (
                            <div key={page.id} className="space-y-3">
                              <button
                                type="button"
                                onClick={() => setSelectedPageId(page.id)}
                                className={`w-full rounded-[1rem] border p-4 text-left transition hover:-translate-y-0.5 ${selectedPageId === page.id ? 'border-black bg-slate-950 text-white' : 'border-black/10 bg-white text-black'}`}
                              >
                                <h3 className="break-words text-base font-black uppercase tracking-[0.08em] sm:tracking-[0.13em]">{page.title}</h3>
                              </button>

                              {selectedPageId === page.id && selectedPage && (
                                <div className="lg:hidden">
                                  <CompactPagePreview page={selectedPage} onSelectRelated={focusPage} />
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f4ead4] text-black font-sans">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col items-center px-4 py-8 sm:px-6 sm:py-16">
        <div className="flex w-full max-w-6xl items-stretch justify-center gap-3 sm:items-center sm:gap-10">
          <button
            type="button"
            onClick={() => chooseSection('once')}
            className="min-w-0 flex-1 overflow-hidden rounded-[1.25rem] border border-black/20 bg-[#d8c3a5] px-3 py-5 text-center text-[clamp(1.45rem,6vw,5rem)] font-black uppercase tracking-[0.04em] text-black transition duration-200 hover:bg-[#d2b18c] sm:min-h-40 sm:px-8 sm:py-7 sm:tracking-[0.08em] lg:min-h-48 lg:px-6 lg:tracking-[0.06em]"
          >
            once
          </button>
          <button
            type="button"
            onClick={() => chooseSection('humans')}
            className="min-w-0 flex-1 overflow-hidden rounded-[1.25rem] border border-black/20 bg-[#d8c3a5] px-3 py-5 text-center text-[clamp(1.45rem,6vw,5rem)] font-black uppercase tracking-[0.04em] text-black transition duration-200 hover:bg-[#d2b18c] sm:min-h-40 sm:px-8 sm:py-7 sm:tracking-[0.08em] lg:min-h-48 lg:px-6 lg:tracking-[0.06em]"
          >
            humans
          </button>
        </div>

        {openSection && (
          <section className="mt-8 w-full max-w-7xl space-y-6 sm:mt-16 sm:space-y-8">
            <div className="rounded-[1.5rem] border border-black/10 bg-white/90 p-5 shadow-[0_35px_80px_rgba(15,23,42,0.12)] sm:rounded-[2rem] sm:p-8">
              <div className="space-y-3">
                <h2 className="break-words text-3xl font-black uppercase tracking-[0.1em] text-black sm:text-5xl sm:tracking-[0.2em]">{openSection}</h2>
                <p className="text-sm uppercase tracking-[0.16em] text-black/75 sm:text-base sm:tracking-[0.35em]">
                  {openSection === 'once' ? 'during life' : 'in existence'}
                </p>
                {openCategory && (
                  <p className="break-words text-xs uppercase tracking-[0.12em] text-black/45 sm:text-sm sm:tracking-[0.25em]">
                    {[openSection, openCategory, openSubcategory, selectedPage?.title].filter(Boolean).join(' / ')}
                  </p>
                )}
              </div>
            </div>

            {!openCategory ? (
              <div className={`grid gap-6 lg:grid-cols-3 ${openSection === 'once' ? 'mr-auto w-full max-w-5xl justify-items-start' : 'ml-auto w-full max-w-5xl justify-items-end'}`}>
                {activeCategories.map((category) => (
                  <button
                    key={category.title}
                    type="button"
                    onClick={() => chooseCategory(category)}
                  className="group block w-full overflow-hidden rounded-[1.5rem] border border-black/10 bg-slate-950 text-left shadow-[0_25px_60px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.22)] sm:min-w-[18rem] sm:rounded-[2rem]"
                >
                    <div className={`h-36 rounded-t-[1.5rem] bg-gradient-to-br ${category.accent} bg-cover bg-center sm:h-48 sm:rounded-t-[2rem]`} />
                    <div className="bg-slate-950 p-5 sm:p-6">
                      <h3 className="break-words text-xl font-black uppercase tracking-[0.12em] text-white sm:text-2xl sm:tracking-[0.2em]">{category.title}</h3>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className={`grid w-full gap-8 ${openSection === 'humans' ? 'lg:grid-cols-[minmax(0,1fr)_20rem]' : 'lg:grid-cols-[20rem_minmax(0,1fr)]'}`}>
                <aside className={openSection === 'humans' ? 'lg:order-2' : ''}>
                  {browseRail}
                </aside>

                <div className={`hidden lg:block ${openSection === 'humans' ? 'lg:order-1' : ''}`}>
                  {selectedPage ? (
                    <CompactPagePreview page={selectedPage} onSelectRelated={focusPage} />
                  ) : (
                    <div className="rounded-[2rem] border border-black/10 bg-white/70 p-8 text-center text-sm text-black/60">
                      {seededPages.length} starter pages are ready to discover.
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
