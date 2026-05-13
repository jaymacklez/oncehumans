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
}

const singularHumanTypes: Record<string, string> = {
  Creators: 'Creator',
  Artists: 'Artist',
  Engineers: 'Engineer',
  Scientists: 'Scientist',
  Writers: 'Writer',
  Performers: 'Performer',
  human: 'human',
}

const humanTypeOptions = [
  'Creators',
  'Artists',
  'Engineers',
  'Scientists',
  'Writers',
  'Performers',
]

const minProfileZoom = 1
const maxProfileZoom = 3
const cropBoxSize = 224
const defaultDescription = 'Share a short bio, a mood, or the work you are bringing into the world.'

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

function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

function formatPostDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    const fallbackDate = new Date(`${value}T00:00:00`)
    if (Number.isNaN(fallbackDate.getTime())) return value

    return fallbackDate.toLocaleDateString([], {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return `${date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })} ${date.toLocaleDateString([], {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })}`
}

export default function HumanUserPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const usernameParam = params?.username
  const username = Array.isArray(usernameParam) ? usernameParam[0] : usernameParam || 'human'
  const typeFromUrl = searchParams?.get('type') || ''

  const [humanType, setHumanType] = useState(() => {
    if (typeFromUrl) return typeFromUrl
    if (typeof window === 'undefined') return 'human'
    return localStorage.getItem(`once-humans-profile-type:${username}`) || 'human'
  })
  const descriptionStorageKey = `once-humans-profile-description:${username}`
  const profileImageStorageKey = `once-humans-profile-image:${username}`
  const postsStorageKey = `once-humans-profile-posts:${username}`

  const [description, setDescription] = useState(() => (
    typeof window === 'undefined' ? defaultDescription : localStorage.getItem(descriptionStorageKey) || defaultDescription
  ))
  const [editingDescription, setEditingDescription] = useState(false)
  const [editingHumanType, setEditingHumanType] = useState(false)
  const [profileImage, setProfileImage] = useState<ProfileCrop | null>(() => readLocalStorage<ProfileCrop | null>(profileImageStorageKey, null))
  const [pendingProfileImage, setPendingProfileImage] = useState<ProfileCrop | null>(null)
  const [cropDrag, setCropDrag] = useState<CropDrag | null>(null)
  const [postBody, setPostBody] = useState('')
  const [posts, setPosts] = useState<Post[]>(() => readLocalStorage<Post[]>(postsStorageKey, []))

  useEffect(() => {
    if (!pendingProfileImage) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [pendingProfileImage])

  useEffect(() => {
    localStorage.setItem(`once-humans-profile-type:${username}`, humanType)
    localStorage.setItem(
      'once-humans-profile-path',
      `/humans/user/${username}?type=${encodeURIComponent(humanType)}`
    )
    window.dispatchEvent(new Event('once-humans-profile-changed'))
  }, [humanType, username])

  useEffect(() => {
    localStorage.setItem(descriptionStorageKey, description)
  }, [description, descriptionStorageKey])

  useEffect(() => {
    if (profileImage) {
      localStorage.setItem(profileImageStorageKey, JSON.stringify(profileImage))
      return
    }

    localStorage.removeItem(profileImageStorageKey)
  }, [profileImage, profileImageStorageKey])

  useEffect(() => {
    localStorage.setItem(postsStorageKey, JSON.stringify(posts))
  }, [posts, postsStorageKey])

  const displayType = singularHumanTypes[humanType] || humanType

  const handleProfileImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') return
      setPendingProfileImage({
        src: reader.result,
        zoom: 1.35,
        offsetX: 0,
        offsetY: 0,
      })
    })
    reader.readAsDataURL(file)
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
        date: new Date().toISOString(),
        body: postBody.trim(),
        comments: [],
      },
      ...current,
    ])
    setPostBody('')
  }

  const deletePost = (postId: string) => {
    setPosts((current) => current.filter((post) => post.id !== postId))
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
                  {editingHumanType ? (
                    <select
                      value={humanType}
                      onChange={(event) => setHumanType(event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-center text-xs uppercase tracking-[0.12em] text-white outline-none"
                    >
                      <option value="human" className="text-black">Human</option>
                      {humanTypeOptions.map((option) => (
                        <option key={option} value={option} className="text-black">
                          {singularHumanTypes[option]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm uppercase tracking-[0.35em] text-white/75">{displayType}</p>
                  )}
                  <p className="text-xs text-white/60">@{username}</p>
                  <button
                    type="button"
                    onClick={() => setEditingHumanType((current) => !current)}
                    className="mt-2 rounded-full border border-white/15 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-white/70 transition hover:bg-white/10"
                  >
                    {editingHumanType ? 'save type' : 'edit type'}
                  </button>
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
                    href: `/humans/user/${username}?type=${encodeURIComponent(humanType)}`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <GalleryMediaSection
          emptyMessage="Upload photos or videos to populate this gallery."
          storageKey={`once-humans-gallery:profile:${username}`}
          chatSection="humans"
          chatHref={`/humans/user/${username}?type=${encodeURIComponent(humanType)}`}
          chatEyebrow={`gallery from ${displayType.toLowerCase()} ${username}`}
        />

        <section className="rounded-[2rem] border border-black/10 bg-white/95 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
          <h2 className="mb-6 text-3xl font-black uppercase tracking-[0.2em] text-black">Posts</h2>
          <textarea
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
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
              No posts yet. Your posts will appear here.
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="rounded-[2rem] border border-black/10 bg-white/95 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-black/50">posted</p>
                  <h3 className="text-2xl font-black uppercase tracking-[0.15em] text-black">{formatPostDate(post.date)}</h3>
                </div>
                <p className="mt-6 text-sm leading-7 text-black/80">{post.body}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => deletePost(post.id)}
                    className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm uppercase tracking-[0.2em] text-black transition hover:bg-slate-100"
                  >
                    delete
                  </button>
                  <LiveChatDrawer
                    variant="post"
                    room={{
                      id: `profile:${username}:post:${post.id}`,
                      title: post.body.length > 64 ? `${post.body.slice(0, 64)}...` : post.body,
                      section: 'humans',
                      eyebrow: `post from ${displayType.toLowerCase()} ${username}`,
                      href: `/humans/user/${username}?type=${encodeURIComponent(humanType)}`,
                    }}
                  />
                </div>
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
