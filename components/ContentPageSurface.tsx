'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import GalleryMediaSection from '@/components/GalleryMediaSection'
import LiveChatDrawer from '@/components/LiveChatDrawer'
import { getRelatedPages, type ContentPage } from '@/lib/content'

type Post = {
  id: string
  date: string
  body: string
}

const readStoredPosts = (storageKey: string): Post[] => {
  if (typeof window === 'undefined') return []

  try {
    const storedPosts = window.localStorage.getItem(storageKey)
    return storedPosts ? JSON.parse(storedPosts) : []
  } catch {
    return []
  }
}

type ContentPageSurfaceProps = {
  page: ContentPage
  onSelectRelated?: (page: ContentPage) => void
  relatedMode?: 'inline' | 'link'
  onBack?: () => void
}

export default function ContentPageSurface({ page, onSelectRelated, relatedMode = 'inline', onBack }: ContentPageSurfaceProps) {
  const [postBody, setPostBody] = useState('')
  const postsStorageKey = `once-humans-entry-posts:${page.id}`
  const [posts, setPosts] = useState<Post[]>(() => readStoredPosts(postsStorageKey))

  useEffect(() => {
    window.localStorage.setItem(postsStorageKey, JSON.stringify(posts))
  }, [posts, postsStorageKey])

  const handlePost = () => {
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

  const relatedPages = getRelatedPages(page)

  return (
    <div className="browse-rise-in space-y-8">
      <section className="relative rounded-[2rem] border border-black/10 bg-white/95 p-6 pt-16 shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:p-8 sm:pt-16">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-lg font-black leading-none text-black/70 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition hover:bg-slate-100 hover:text-black sm:left-5 sm:top-5"
          >
            &lt;
          </button>
        )}
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-black/10 bg-slate-950 p-6 text-white">
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-white text-4xl font-black uppercase tracking-[0.25em] text-slate-950">
                {page.title.charAt(0)}
              </div>
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-[0.35em] text-white/75">{page.subcategory}</p>
                <p className="text-xs text-white/60">{page.category}</p>
              </div>
            </div>
            <div className="mt-10 rounded-[1.5rem] bg-white/10 p-4 text-sm leading-7 text-white/90">
              {page.description}
            </div>
          </aside>

          <div className="rounded-[2rem] border border-black/10 bg-slate-950 p-4 text-white sm:p-5">
            <LiveChatDrawer
              key={`entry:${page.id}`}
              variant="embedded"
              room={{
                id: `entry:${page.id}`,
                title: page.title,
                section: page.section,
                href: `/entry/${page.id}`,
              }}
            />
          </div>
        </div>
      </section>

      <GalleryMediaSection
        key={page.id}
        seedItems={page.gallery}
        storageKey={`once-humans-gallery:entry:${page.id}`}
        chatSection={page.section}
        chatHref={`/entry/${page.id}`}
        chatEyebrow={`gallery from ${page.title}`}
      />

      <section className="rounded-[2rem] border border-black/10 bg-white/95 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
        <h2 className="mb-5 text-sm font-black uppercase tracking-[0.16em] text-black/70">Posts</h2>
        <textarea
          value={postBody}
          onChange={(event) => setPostBody(event.target.value)}
          className="w-full resize-none rounded-[1.75rem] border border-black/10 bg-slate-50 p-6 text-sm text-black outline-none focus:border-black/20"
          rows={4}
          placeholder="Write a new post..."
        />
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handlePost}
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-900"
          >
            post
          </button>
        </div>
      </section>

      <section className="space-y-6">
        {posts.length === 0 ? (
          <div className="rounded-[2rem] border border-black/10 bg-white/95 p-10 text-center text-sm text-black/60">
            No posts yet. Posts will appear here.
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="rounded-[2rem] border border-black/10 bg-white/95 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-black/45">posted</p>
                <h3 className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-black/55">{formatPostDate(post.date)}</h3>
              </div>
              <p className="mt-5 text-lg leading-8 text-black/85">{post.body}</p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => deletePost(post.id)}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-black/65 transition hover:bg-slate-100 hover:text-black"
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
      </section>

      {relatedPages.length > 0 && (
        <section className="rounded-[1rem] border border-black/10 bg-white/95 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <h2 className="text-xs font-black uppercase tracking-[0.14em] text-black">Related</h2>
          <div className="mt-1 overflow-x-auto px-1 py-3">
            <div className="flex w-max gap-3">
              {relatedPages.map((relatedPage) => {
                const content = (
                  <>
                    <p className="truncate text-[0.6rem] uppercase tracking-[0.16em] text-white/55">
                      {relatedPage.section} / {relatedPage.subcategory}
                    </p>
                    <h3 className="mt-1 truncate text-xs font-black uppercase tracking-[0.1em] text-white">
                      {relatedPage.title}
                    </h3>
                  </>
                )
                const className =
                  'w-48 rounded-[0.9rem] border border-black/10 bg-slate-950 p-4 text-left text-white transition hover:-translate-y-0.5 hover:bg-black'

                if (relatedMode === 'link') {
                  return (
                    <Link key={relatedPage.id} href={`/entry/${relatedPage.id}`} className={className}>
                      {content}
                    </Link>
                  )
                }

                return (
                  <button
                    key={relatedPage.id}
                    type="button"
                    onClick={() => onSelectRelated?.(relatedPage)}
                    className={className}
                  >
                    {content}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
