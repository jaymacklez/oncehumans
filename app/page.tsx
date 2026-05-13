'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import GalleryMediaSection from '@/components/GalleryMediaSection'
import LiveChatDrawer from '@/components/LiveChatDrawer'
import SubcategoryPageSurface from '@/components/SubcategoryPageSurface'
import {
  categories,
  type ContentPage,
  findPageById,
  getRelatedPages,
  getPagesForSubcategory,
  seededPages,
  slugify,
  type Category,
  type Subcategory,
  type SectionType,
} from '@/lib/content'

type CompactPagePreviewProps = {
  page: ContentPage
  onSelectRelated: (page: ContentPage) => void
  onBack?: () => void
}

type CompactPost = {
  id: string
  date: string
  body: string
}

const readStoredCompactPosts = (storageKey: string): CompactPost[] => {
  if (typeof window === 'undefined') return []

  try {
    const storedPosts = window.localStorage.getItem(storageKey)
    return storedPosts ? JSON.parse(storedPosts) : []
  } catch {
    return []
  }
}

function CompactPagePreview({ page, onSelectRelated, onBack }: CompactPagePreviewProps) {
  const [postBody, setPostBody] = useState('')
  const postsStorageKey = `once-humans-entry-posts:${page.id}`
  const [posts, setPosts] = useState<CompactPost[]>(() => readStoredCompactPosts(postsStorageKey))
  const relatedPages = getRelatedPages(page)

  useEffect(() => {
    window.localStorage.setItem(postsStorageKey, JSON.stringify(posts))
  }, [posts, postsStorageKey])

  const addPost = () => {
    if (!postBody.trim()) return
    setPosts((current) => [
      {
        id: `${Date.now()}`,
        date: new Date().toISOString(),
        body: postBody.trim(),
      },
      ...current,
    ])
    setPostBody('')
  }

  const deletePost = (postId: string) => {
    setPosts((current) => current.filter((post) => post.id !== postId))
  }

  const formatPostDate = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <article className="w-full max-w-full space-y-4 overflow-hidden rounded-[1.25rem] border border-black/10 bg-white/95 p-4 shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:space-y-5 sm:rounded-[2rem] sm:p-6">
      <div className="rounded-[1.25rem] bg-slate-950 p-4 text-white sm:rounded-[1.75rem] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mb-4 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:bg-white/10"
              >
                back
              </button>
            )}
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

      <GalleryMediaSection
        key={page.id}
        seedItems={page.gallery}
        compact
        storageKey={`once-humans-gallery:entry:${page.id}`}
        chatSection={page.section}
        chatHref={`/entry/${page.id}`}
        chatEyebrow={`gallery from ${page.title}`}
      />

      <section className="rounded-[1.25rem] border border-black/10 bg-slate-50 p-4 sm:rounded-[1.5rem] sm:p-5">
        <h3 className="text-xs font-black uppercase tracking-[0.14em] text-black/70">Posts</h3>
        <textarea
          value={postBody}
          onChange={(event) => setPostBody(event.target.value)}
          className="mt-4 w-full resize-none rounded-[1.25rem] border border-black/10 bg-white p-4 text-sm text-black outline-none focus:border-black/25"
          rows={3}
          placeholder="Write a new post..."
        />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={addPost}
            className="rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
          >
            post
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {posts.length === 0 ? (
            <p className="text-sm text-black/50">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="rounded-[1.1rem] border border-black/10 bg-white p-4">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.16em] text-black/40">posted</p>
                  <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.1em] text-black/50">{formatPostDate(post.date)}</p>
                </div>
                <p className="mt-3 text-base leading-7 text-black/85">{post.body}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => deletePost(post.id)}
                    className="rounded-full border border-black/10 bg-white px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-black/60 transition hover:bg-slate-100 hover:text-black"
                  >
                    delete
                  </button>
                  <LiveChatDrawer
                    variant="post"
                    room={{
                      id: `entry:${page.id}:post:${post.id}`,
                      title: post.body.length > 64 ? `${post.body.slice(0, 64)}...` : post.body,
                      section: page.section,
                      eyebrow: `post from ${page.title}`,
                      href: `/entry/${page.id}`,
                    }}
                  />
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {relatedPages.length > 0 && (
        <section className="rounded-[1rem] border border-black/10 bg-slate-50 p-3">
          <h3 className="text-xs font-black uppercase tracking-[0.14em] text-black">Related</h3>
          <div className="mt-1 overflow-x-auto px-1 py-3">
            <div className="flex w-max gap-3">
              {relatedPages.map((relatedPage) => (
                <button
                  key={relatedPage.id}
                  type="button"
                  onClick={() => onSelectRelated(relatedPage)}
                  className="w-44 rounded-[0.9rem] bg-slate-950 p-4 text-left text-white transition hover:-translate-y-0.5 hover:bg-black"
                >
                  <p className="truncate text-[0.6rem] uppercase tracking-[0.12em] text-white/50">{relatedPage.subcategory}</p>
                  <h4 className="mt-1 truncate text-xs font-black uppercase tracking-[0.08em]">{relatedPage.title}</h4>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}

export default function Home() {
  const [openSection, setOpenSection] = useState<SectionType | null>(null)
  const [openCategory, setOpenCategory] = useState('')
  const [openSubcategory, setOpenSubcategory] = useState('')
  const [selectedPageId, setSelectedPageId] = useState('')
  const [selectedPagePlacement, setSelectedPagePlacement] = useState<'rail' | 'content'>('content')
  const [useDesktopCategoryOrder, setUseDesktopCategoryOrder] = useState(false)
  const [promotedCategory, setPromotedCategory] = useState('')
  const [selectedCategoryOffset, setSelectedCategoryOffset] = useState(0)
  const railRef = useRef<HTMLDivElement | null>(null)
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const selectedPage = useMemo(() => findPageById(selectedPageId), [selectedPageId])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      const entry = params.get('entry')
      const page = entry ? findPageById(entry) : undefined
      const sectionParam = params.get('section') as SectionType | null
      const categoryParam = params.get('category')

      if (!page) {
        if ((sectionParam === 'once' || sectionParam === 'humans') && categoryParam) {
          const category = categories[sectionParam].find((candidate) => slugify(candidate.title) === categoryParam)

          if (category) {
            setOpenSection(sectionParam)
            setOpenCategory(category.title)
            setOpenSubcategory('')
            setSelectedPageId('')
            setSelectedPagePlacement('content')
          }
        }

        return
      }

      setOpenSection(page.section)
      setOpenCategory(page.category)
      setOpenSubcategory(page.subcategory)
      setSelectedPageId(page.id)
      setSelectedPagePlacement('content')
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const syncViewport = () => setUseDesktopCategoryOrder(mediaQuery.matches)

    syncViewport()
    mediaQuery.addEventListener('change', syncViewport)

    return () => mediaQuery.removeEventListener('change', syncViewport)
  }, [])

  useEffect(() => {
    let frame = 0

    if (!useDesktopCategoryOrder || !openCategory) {
      frame = window.requestAnimationFrame(() => setSelectedCategoryOffset(0))
      return () => window.cancelAnimationFrame(frame)
    }

    const syncSelectedCategoryOffset = () => {
      const rail = railRef.current
      const categoryElement = categoryRefs.current[openCategory]

      if (!rail || !categoryElement) {
        setSelectedCategoryOffset(0)
        return
      }

      setSelectedCategoryOffset(categoryElement.offsetTop - rail.offsetTop)
    }

    frame = window.requestAnimationFrame(syncSelectedCategoryOffset)
    window.addEventListener('resize', syncSelectedCategoryOffset)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', syncSelectedCategoryOffset)
    }
  }, [openCategory, openSection, useDesktopCategoryOrder])

  const chooseSection = (section: SectionType) => {
    setOpenSection((current) => current === section ? null : section)
    setOpenCategory('')
    setOpenSubcategory('')
    setPromotedCategory('')
    setSelectedPageId('')
    setSelectedPagePlacement('content')
  }

  const chooseCategory = (category: Category) => {
    setOpenCategory((current) => {
      const nextCategory = current === category.title ? '' : category.title
      if (!current) {
        setPromotedCategory(nextCategory)
      }
      return nextCategory
    })
    setOpenSubcategory('')
    setSelectedPageId('')
    setSelectedPagePlacement('content')
  }

  const focusPage = (page: ContentPage) => {
    setOpenSection(page.section)
    setOpenCategory(page.category)
    setOpenSubcategory(page.subcategory)
    setSelectedPageId(page.id)
    setSelectedPagePlacement('content')
  }

  const clearSelectedPage = () => {
    setSelectedPageId('')
    setSelectedPagePlacement('content')
  }

  const openDesktopSubcategory = (subcategory: Subcategory) => {
    setOpenSubcategory(subcategory.title)
    setSelectedPageId('')
    setSelectedPagePlacement('content')
  }

  const getSubcategoryPageCount = (category: Category, subcategory: Subcategory) => {
    if (!openSection) return 0
    return getPagesForSubcategory(openSection, category.title, subcategory.title).length
  }

  const getOrderedSubcategories = (category: Category) => (
    [...category.subcategories].sort((firstSubcategory, secondSubcategory) => {
      const countDifference = getSubcategoryPageCount(category, secondSubcategory) - getSubcategoryPageCount(category, firstSubcategory)
      if (countDifference !== 0) return countDifference
      return firstSubcategory.title.localeCompare(secondSubcategory.title)
    })
  )

  const activeCategories = openSection ? categories[openSection] : []
  const selectedCategory = activeCategories.find((category) => category.title === openCategory)
  const orderedSubcategories = selectedCategory ? getOrderedSubcategories(selectedCategory) : []
  const selectedSubcategory = selectedCategory?.subcategories.find((subcategory) => subcategory.title === openSubcategory)
  const orderedCategories = promotedCategory
    ? [
        ...activeCategories.filter((category) => category.title === promotedCategory),
        ...activeCategories.filter((category) => category.title !== promotedCategory),
      ]
    : activeCategories
  const browseRail = (
    <div ref={railRef} className="w-full min-w-0 space-y-4">
      {orderedCategories.map((category) => {
        return (
          <div
            key={category.title}
            ref={(element) => {
              categoryRefs.current[category.title] = element
            }}
            className="min-w-0 space-y-3"
          >
            <div className="relative">
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
                <div className="absolute right-3 top-3 z-10 lg:hidden">
                  <LiveChatDrawer
                    label="chat"
                    room={{
                      id: `category:${openSection}:${slugify(category.title)}`,
                      title: category.title,
                      section: openSection!,
                      eyebrow: `${openSection} category`,
                      href: `/#${openSection}-${slugify(category.title)}`,
                    }}
                  />
                </div>
              )}
            </div>

            {openCategory === category.title && (
              <div className="hidden rounded-[1.35rem] bg-slate-950 p-4 shadow-[0_15px_35px_rgba(15,23,42,0.12)] lg:block">
                <LiveChatDrawer
                  label={`${category.title} chat`}
                  room={{
                    id: `category:${openSection}:${slugify(category.title)}`,
                    title: category.title,
                    section: openSection!,
                    eyebrow: `${openSection} category`,
                    href: `/#${openSection}-${slugify(category.title)}`,
                  }}
                />
              </div>
            )}

            {openCategory === category.title && (
              <div className="grid max-h-[11.5rem] gap-3 overflow-y-auto overscroll-contain scroll-smooth rounded-[1.35rem] border border-black/10 bg-white/95 p-3 pr-2 shadow-[0_15px_35px_rgba(15,23,42,0.08)] [-webkit-overflow-scrolling:touch] lg:hidden">
                {getOrderedSubcategories(category).map((subcategory) => (
                  <Link
                    key={subcategory.title}
                    href={`/${openSection}/${slugify(category.title)}/${slugify(subcategory.title)}`}
                    className="w-full rounded-[1rem] border border-black/10 bg-slate-50 px-4 py-3 text-left text-black transition hover:-translate-y-0.5"
                  >
                    <h3 className="break-words text-sm font-black uppercase tracking-[0.1em]">{subcategory.title}</h3>
                  </Link>
                ))}
              </div>
            )}

            {openCategory === category.title && selectedPage && selectedPagePlacement === 'rail' && (
              <div className="mt-4 w-full max-w-full lg:hidden">
                <CompactPagePreview key={selectedPage.id} page={selectedPage} onSelectRelated={focusPage} onBack={clearSelectedPage} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  const browseContent = selectedPage ? (
    <CompactPagePreview key={selectedPage.id} page={selectedPage} onSelectRelated={focusPage} onBack={clearSelectedPage} />
  ) : selectedCategory && selectedSubcategory ? (
    <SubcategoryPageSurface
      key={`${openSection}-${selectedCategory.title}-${selectedSubcategory.title}`}
      section={openSection!}
      category={selectedCategory}
      subcategory={selectedSubcategory}
      onBack={() => {
        setOpenSubcategory('')
        setSelectedPageId('')
        setSelectedPagePlacement('content')
      }}
    />
  ) : selectedCategory ? (
    <div className="space-y-4 rounded-[1.5rem] border border-black/10 bg-white/80 p-4 shadow-[0_25px_60px_rgba(15,23,42,0.08)] sm:rounded-[2rem] sm:p-6">
        <div className="flex flex-wrap gap-3">
        {orderedSubcategories.map((subcategory) => {
          return (
            <Link
              key={subcategory.title}
              href={`/${openSection}/${slugify(selectedCategory.title)}/${slugify(subcategory.title)}`}
              onClick={(event) => {
                if (!useDesktopCategoryOrder) return

                event.preventDefault()
                openDesktopSubcategory(subcategory)
              }}
              className={`rounded-[1rem] border px-5 py-4 text-left transition hover:-translate-y-0.5 ${openSubcategory === subcategory.title ? 'border-black bg-black text-white' : 'border-black/10 bg-slate-50 text-black'}`}
            >
              <h3 className="break-words text-base font-black uppercase tracking-[0.08em] sm:text-lg sm:tracking-[0.12em]">{subcategory.title}</h3>
            </Link>
          )
        })}
      </div>
    </div>
  ) : (
    <div className="rounded-[2rem] border border-black/10 bg-white/70 p-8 text-center text-sm text-black/60">
      {seededPages.length} starter pages are ready to discover.
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f4ead4] text-black font-sans">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col items-center px-4 py-8 sm:px-6 sm:py-16">
        <div className="flex w-full max-w-6xl items-stretch justify-center gap-2 sm:items-center sm:gap-6 lg:gap-8">
          <button
            type="button"
            onClick={() => chooseSection('once')}
            className="min-w-0 flex-1 overflow-hidden rounded-[1.25rem] border border-black/20 bg-[#d8c3a5] px-1.5 py-3 text-center text-[clamp(1.35rem,8.8vw,4.25rem)] font-black uppercase leading-none tracking-[0.01em] text-black transition duration-200 hover:bg-[#d2b18c] sm:px-4 sm:py-5 sm:text-[clamp(3.1rem,6.4vw,5.4rem)] sm:tracking-[0.02em] lg:px-5 lg:py-6 lg:text-[clamp(4rem,6.1vw,6rem)]"
          >
            once
          </button>
          <button
            type="button"
            onClick={() => chooseSection('humans')}
            className="min-w-0 flex-1 overflow-hidden rounded-[1.25rem] border border-black/20 bg-[#d8c3a5] px-1.5 py-3 text-center text-[clamp(1.35rem,8.8vw,4.25rem)] font-black uppercase leading-none tracking-[0.01em] text-black transition duration-200 hover:bg-[#d2b18c] sm:px-4 sm:py-5 sm:text-[clamp(3.1rem,6.4vw,5.4rem)] sm:tracking-[0.02em] lg:px-5 lg:py-6 lg:text-[clamp(4rem,6.1vw,6rem)]"
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
                  {openSection === 'once' ? 'during existence' : 'in existence'}
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
                <aside className={`min-w-0 ${openSection === 'humans' ? 'lg:order-2' : ''}`}>
                  {browseRail}
                </aside>

                <div
                  className={`min-w-0 transition-[margin] duration-300 ${openSection === 'humans' ? 'lg:order-1' : ''} ${selectedPage && selectedPagePlacement === 'content' ? 'block' : 'hidden'} lg:block ${selectedPage && selectedPagePlacement === 'rail' ? 'lg:block' : ''}`}
                  style={{ marginTop: selectedPage || selectedSubcategory ? 0 : selectedCategoryOffset }}
                >
                  {browseContent}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
