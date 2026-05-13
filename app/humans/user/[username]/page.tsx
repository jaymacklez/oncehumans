'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import GalleryMediaSection from '@/components/GalleryMediaSection'
import LiveChatDrawer from '@/components/LiveChatDrawer'

type Post = {
  id: string
  date: string
  body: string
  comments: string[]
  open: boolean
}

const singularHumanTypes: Record<string, string> = {
  Creators: 'Creator',
  Artists: 'Artist',
  Engineers: 'Engineer',
  Scientists: 'Scientist',
  Writers: 'Writer',
  Performers: 'Performer',
}

const minProfileZoom = 1
const maxProfileZoom = 3
const cropBoxSize = 224

type ProfileCrop = {
  src: string
  zoom: number
  offsetX: number
  offsetY: number
}

type CropDrag = {
  startX: number
  startY: number
  imageOffsetX: number
  imageOffsetY: number
}

const clampProfileZoom = (value: number) => Math.max(minProfileZoom, Math.min(maxProfileZoom, value))
const clampProfileOffset = (value: number, zoom: number) => {
  const maxOffset = (cropBoxSize * (zoom - 1)) / 2
  return Math.max(-maxOffset, Math.min(maxOffset, value))
}

export default function HumanUserPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const usernameParam = params?.username
  const username = Array.isArray(usernameParam) ? usernameParam[0] : usernameParam || 'human'
  const type = searchParams?.get('type') || 'human'
  const displayType = singularHumanTypes[type] || type

  const [description, setDescription] = useState('Share a short bio, a mood, or the work you are bringing into the world.')
  const [editingDescription, setEditingDescription] = useState(false)
  const [profileImage, setProfileImage] = useState<ProfileCrop | null>(null)
  const [pendingProfileImage, setPendingProfileImage] = useState<ProfileCrop | null>(null)
  const [cropDrag, setCropDrag] = useState<CropDrag | null>(null)
  const [postBody, setPostBody] = useState('')
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    if (!pendingProfileImage) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [pendingProfileImage])

  useEffect(() => {
    localStorage.setItem(
      'once-humans-profile-path',
      `/humans/user/${username}?type=${encodeURIComponent(type)}`
    )
    window.dispatchEvent(new Event('once-humans-profile-changed'))
  }, [type, username])

  const handleProfileImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setPendingProfileImage({
      src: URL.createObjectURL(file),
      zoom: 1.35,
      offsetX: 0,
      offsetY: 0,
    })
    event.target.value = ''
  }

  const applyProfileImage = () => {
    if (!pendingProfileImage) return
    setProfileImage(pendingProfileImage)
    setPendingProfileImage(null)
    setCropDrag(null)
  }

  const closeProfileCrop = () => {
    setPendingProfileImage(null)
    setCropDrag(null)
  }

  const startProfileCropDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pendingProfileImage) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setCropDrag({
      startX: event.clientX,
      startY: event.clientY,
      imageOffsetX: pendingProfileImage.offsetX,
      imageOffsetY: pendingProfileImage.offsetY,
    })
  }

  const moveProfileCrop = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!cropDrag) return
    const deltaX = event.clientX - cropDrag.startX
    const deltaY = event.clientY - cropDrag.startY
    setPendingProfileImage((current) => current ? {
      ...current,
      offsetX: clampProfileOffset(cropDrag.imageOffsetX + deltaX, current.zoom),
      offsetY: clampProfileOffset(cropDrag.imageOffsetY + deltaY, current.zoom),
    } : current)
  }

  const stopProfileCropDrag = () => {
    setCropDrag(null)
  }

  const getProfileImageStyle = (image: ProfileCrop): React.CSSProperties => ({
    transform: `translate(${image.offsetX}px, ${image.offsetY}px) scale(${image.zoom})`,
    transformOrigin: 'center',
  })

  const zoomProfileCrop = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    const zoomDelta = event.deltaY > 0 ? -0.08 : 0.08
    setPendingProfileImage((current) => {
      if (!current) return current
      const zoom = clampProfileZoom(current.zoom + zoomDelta)
      return {
        ...current,
        zoom,
        offsetX: clampProfileOffset(current.offsetX, zoom),
        offsetY: clampProfileOffset(current.offsetY, zoom),
      }
    })
  }

  const handlePost = () => {
    if (!postBody.trim()) return
    setPosts((current) => [
      {
        id: `${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        body: postBody.trim(),
        comments: [],
        open: false,
      },
      ...current,
    ])
    setPostBody('')
  }

  const togglePostChat = (id: string) => {
    setPosts((current) => current.map((post) => post.id === id ? { ...post, open: !post.open } : post))
  }

  return (
    <div className="min-h-screen bg-[#f4ead4] px-6 py-10 text-black">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-black/10 bg-white/95 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="rounded-[2rem] border border-black/10 bg-slate-950 p-6 text-white">
              <div className="flex flex-col items-center gap-5">
                <label
                  className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-[1.5rem] bg-white text-4xl font-black uppercase tracking-[0.25em] text-slate-950 transition hover:opacity-90"
                >
                  {profileImage ? (
                    <img
                      src={profileImage.src}
                      alt=""
                      className="pointer-events-none h-full w-full select-none object-cover"
                      draggable={false}
                      style={getProfileImageStyle(profileImage)}
                    />
                  ) : (
                    username.charAt(0) || 'H'
                  )}
                  <input type="file" accept="image/*" onChange={handleProfileImage} className="hidden" />
                </label>
                <div className="space-y-1 text-center">
                  <p className="text-sm uppercase tracking-[0.35em] text-white/75">{displayType}</p>
                  <p className="text-xs text-white/60">@{username}</p>
                </div>
              </div>
              <div className="mt-10 flex flex-col gap-3 rounded-[1.5rem] bg-white/10 p-4 text-sm text-white/90">
                {editingDescription ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[13rem] w-full resize-none rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white outline-none focus:border-white/30"
                  />
                ) : (
                  <p className="leading-7">{description}</p>
                )}
                <button
                  type="button"
                  onClick={() => setEditingDescription(!editingDescription)}
                  className="mt-3 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white/20"
                >
                  {editingDescription ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            <div className="relative rounded-[2rem] border border-black/10 bg-slate-950 p-8 text-white">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-white">{username}</h1>
                <LiveChatDrawer
                  key={`profile:${username}`}
                  room={{
                    id: `profile:${username}`,
                    title: username,
                    section: 'humans',
                    href: `/humans/user/${username}?type=${encodeURIComponent(type)}`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <GalleryMediaSection emptyMessage="Upload photos or videos to populate this gallery." />

        <section className="rounded-[2rem] border border-black/10 bg-white/95 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-black">Posts</h2>
            </div>
            <button
              type="button"
              onClick={handlePost}
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-900"
            >
              post
            </button>
          </div>
          <textarea
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            className="w-full resize-none rounded-[1.75rem] border border-black/10 bg-slate-50 p-6 text-sm text-black outline-none focus:border-black/20"
            rows={4}
            placeholder="Write a new post..."
          />
        </section>

        <section className="space-y-6">
          {posts.length === 0 ? (
            <div className="rounded-[2rem] border border-black/10 bg-white/95 p-10 text-center text-sm text-black/60">
              No posts yet. Your posts will appear here.
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="rounded-[2rem] border border-black/10 bg-white/95 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-black/50">posted</p>
                    <h3 className="text-2xl font-black uppercase tracking-[0.15em] text-black">{post.date}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePostChat(post.id)}
                    className="rounded-full border border-black/10 bg-slate-100 px-5 py-3 text-sm uppercase tracking-[0.2em] text-black"
                  >
                    chat
                  </button>
                </div>
                <p className="mt-6 text-sm leading-7 text-black/80">{post.body}</p>
                {post.open && (
                  <div className="mt-6 space-y-3 rounded-[1.75rem] border border-black/10 bg-slate-50 p-5 text-sm text-black/80">
                    {post.comments.length === 0 ? (
                      <p className="text-black/60">No chat entries yet.</p>
                    ) : (
                      post.comments.map((comment, index) => (
                        <div key={index} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                          {comment}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </section>
      </div>

      {pendingProfileImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/65 px-6 py-10">
          <div className="w-full max-w-md rounded-[2rem] border border-black/10 bg-white p-8 text-black shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-black">Crop</h2>
              <button
                type="button"
                onClick={closeProfileCrop}
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-gray-100"
              >
                close
              </button>
            </div>
            <div
              className={`mx-auto h-56 w-56 touch-none overflow-hidden rounded-[1.5rem] bg-slate-950 ${cropDrag ? 'cursor-grabbing' : 'cursor-grab'}`}
              onPointerDown={startProfileCropDrag}
              onPointerMove={moveProfileCrop}
              onPointerUp={stopProfileCropDrag}
              onPointerCancel={stopProfileCropDrag}
              onPointerLeave={stopProfileCropDrag}
              onWheel={zoomProfileCrop}
            >
              <img
                src={pendingProfileImage.src}
                alt=""
                className="pointer-events-none h-full w-full select-none object-cover"
                draggable={false}
                style={getProfileImageStyle(pendingProfileImage)}
              />
            </div>
            <button
              type="button"
              onClick={applyProfileImage}
              className="mt-8 w-full rounded-2xl bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-900"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
