'use client'

import { useState } from 'react'
import Link from 'next/link'
import GalleryMediaSection from '@/components/GalleryMediaSection'
import LiveChatDrawer from '@/components/LiveChatDrawer'
import { getRelatedPages, type ContentPage } from '@/lib/content'

type Post = {
  id: string
  date: string
  body: string
  comments: string[]
}

type ContentPageSurfaceProps = {
  page: ContentPage
  onSelectRelated?: (page: ContentPage) => void
  relatedMode?: 'inline' | 'link'
}

export default function ContentPageSurface({ page, onSelectRelated, relatedMode = 'inline' }: ContentPageSurfaceProps) {
  const [postBody, setPostBody] = useState('')
  const [posts, setPosts] = useState<Post[]>([])

  const handlePost = () => {
    if (!postBody.trim()) return
    setPosts((current) => [
      {
        id: `${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        body: postBody.trim(),
        comments: [],
      },
      ...current,
    ])
    setPostBody('')
  }

  const relatedPages = getRelatedPages(page)

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-black/10 bg-white/95 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
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

          <div className="rounded-[2rem] border border-black/10 bg-slate-950 p-8 text-white">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/60">{page.section}</p>
                <h1 className="mt-3 text-3xl font-black uppercase tracking-[0.2em] text-white">{page.title}</h1>
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

      {relatedPages.length > 0 && (
        <section className="rounded-[2rem] border border-black/10 bg-white/95 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
          <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-black">Related</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {relatedPages.map((relatedPage) => {
              const content = (
                <>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/55">
                    {relatedPage.section} / {relatedPage.subcategory}
                  </p>
                  <h3 className="mt-3 text-xl font-black uppercase tracking-[0.15em]">{relatedPage.title}</h3>
                </>
              )

              if (relatedMode === 'link') {
                return (
                  <Link
                    key={relatedPage.id}
                    href={`/entry/${relatedPage.id}`}
                    className="rounded-[1.75rem] border border-black/10 bg-slate-950 p-5 text-left text-white transition hover:-translate-y-0.5 hover:bg-black"
                  >
                    {content}
                  </Link>
                )
              }

              return (
                <button
                  key={relatedPage.id}
                  type="button"
                  onClick={() => onSelectRelated?.(relatedPage)}
                  className="rounded-[1.75rem] border border-black/10 bg-slate-950 p-5 text-left text-white transition hover:-translate-y-0.5 hover:bg-black"
                >
                  {content}
                </button>
              )
            })}
          </div>
        </section>
      )}

      <section className="rounded-[2rem] border border-black/10 bg-white/95 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
        <h2 className="mb-6 text-3xl font-black uppercase tracking-[0.2em] text-black">Posts</h2>
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
                <p className="text-sm uppercase tracking-[0.35em] text-black/50">posted</p>
                <h3 className="text-2xl font-black uppercase tracking-[0.15em] text-black">{post.date}</h3>
              </div>
              <p className="mt-6 text-sm leading-7 text-black/80">{post.body}</p>
              <div className="mt-6 flex justify-end">
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
    </div>
  )
}
