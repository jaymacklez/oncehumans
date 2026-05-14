'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import GalleryMediaSection from '@/components/GalleryMediaSection'
import LiveChatDrawer from '@/components/LiveChatDrawer'
import {
  getDefaultHumanSubcategory,
  getHumanCategoryOptions,
  getHumanSubcategoryLabel,
  getHumanSubcategoryOptions,
  getHumanTypeLabel,
  getStoredHumanProfile,
  isHumanUsernameAvailable,
  normalizeHumanCategory,
  upsertHumanProfile,
} from '@/lib/human-profiles'

type Post = {
  id: string
  date: string
  body: string
  comments: string[]
}

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

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '') || 'human'
}

function moveLocalStorageValue(fromKey: string, toKey: string) {
  const value = localStorage.getItem(fromKey)
  if (value === null) return

  localStorage.setItem(toKey, value)
  localStorage.removeItem(fromKey)
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const usernameParam = params?.username
  const username = Array.isArray(usernameParam) ? usernameParam[0] : usernameParam || 'human'
  const typeFromUrl = searchParams?.get('type') || ''

  const [humanType, setHumanType] = useState(() => {
    if (typeof window === 'undefined') return 'Creators'
    return normalizeHumanCategory(getStoredHumanProfile(username)?.type || localStorage.getItem(`once-humans-profile-type:${username}`) || typeFromUrl)
  })
  const [humanCategory, setHumanCategory] = useState(() => {
    if (typeof window === 'undefined') return normalizeHumanCategory(typeFromUrl)
    return normalizeHumanCategory(getStoredHumanProfile(username)?.category || localStorage.getItem(`once-humans-profile-category:${username}`) || typeFromUrl)
  })
  const [humanSubcategory, setHumanSubcategory] = useState(() => {
    if (typeof window === 'undefined') return 'People'
    const category = normalizeHumanCategory(getStoredHumanProfile(username)?.category || localStorage.getItem(`once-humans-profile-category:${username}`) || typeFromUrl)
    return getStoredHumanProfile(username)?.subcategory || localStorage.getItem(`once-humans-profile-subcategory:${username}`) || getDefaultHumanSubcategory(category)
  })
  const descriptionStorageKey = `once-humans-profile-description:${username}`
  const profileImageStorageKey = `once-humans-profile-image:${username}`
  const postsStorageKey = `once-humans-profile-posts:${username}`
  const displayNameStorageKey = `once-humans-profile-name:${username}`

  const [description, setDescription] = useState(() => (
    typeof window === 'undefined' ? defaultDescription : localStorage.getItem(descriptionStorageKey) || defaultDescription
  ))
  const [displayName, setDisplayName] = useState(() => (
    typeof window === 'undefined' ? username : getStoredHumanProfile(username)?.displayName || localStorage.getItem(displayNameStorageKey) || username
  ))
  const [draftDisplayName, setDraftDisplayName] = useState(displayName)
  const [draftUsername, setDraftUsername] = useState(username)
  const [profileMessage, setProfileMessage] = useState('')
  const [editingDescription, setEditingDescription] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
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
    const category = normalizeHumanCategory(humanCategory || humanType)
    const subcategory = humanSubcategory || getDefaultHumanSubcategory(category)
    const profilePath = `/humans/user/${username}?type=${encodeURIComponent(category)}`

    upsertHumanProfile({
      username,
      displayName,
      category,
      subcategory,
      type: category,
      profilePath,
    })
  }, [displayName, humanCategory, humanSubcategory, humanType, username])

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

  const displayType = getHumanTypeLabel(humanCategory || humanType)
  const humanSubcategoryOptions = getHumanSubcategoryOptions(humanCategory)

  const updateHumanCategory = (category: string) => {
    const normalizedCategory = normalizeHumanCategory(category)
    setHumanCategory(normalizedCategory)
    setHumanType(normalizedCategory)
    setHumanSubcategory(getDefaultHumanSubcategory(normalizedCategory))
  }

  const openProfileEditor = () => {
    setDraftDisplayName(displayName)
    setDraftUsername(username)
    setProfileMessage('')
    setEditingProfile(true)
  }

  const saveProfileEdits = () => {
    const nextUsername = normalizeUsername(draftUsername)
    const nextDisplayName = draftDisplayName.trim() || nextUsername
    const usernameChanged = nextUsername !== username

    if (usernameChanged && !isHumanUsernameAvailable(nextUsername)) {
      setProfileMessage('That username is already taken. Try another @ name.')
      return
    }

    const category = normalizeHumanCategory(humanCategory || humanType)
    const subcategory = humanSubcategory || getDefaultHumanSubcategory(category)
    const profilePath = `/humans/user/${nextUsername}?type=${encodeURIComponent(category)}`

    if (usernameChanged) {
      moveLocalStorageValue(`once-humans-profile-description:${username}`, `once-humans-profile-description:${nextUsername}`)
      moveLocalStorageValue(`once-humans-profile-image:${username}`, `once-humans-profile-image:${nextUsername}`)
      moveLocalStorageValue(`once-humans-profile-posts:${username}`, `once-humans-profile-posts:${nextUsername}`)
      moveLocalStorageValue(`once-humans-gallery:profile:${username}`, `once-humans-gallery:profile:${nextUsername}`)
      localStorage.removeItem(`once-humans-profile-name:${username}`)
      localStorage.removeItem(`once-humans-profile-type:${username}`)
      localStorage.removeItem(`once-humans-profile-category:${username}`)
      localStorage.removeItem(`once-humans-profile-subcategory:${username}`)
    }

    if (!usernameChanged) {
      setDisplayName(nextDisplayName)
    }
    localStorage.setItem(`once-humans-profile-name:${nextUsername}`, nextDisplayName)
    upsertHumanProfile({
      username: nextUsername,
      previousUsername: usernameChanged ? username : undefined,
      displayName: nextDisplayName,
      category,
      subcategory,
      type: category,
      profilePath,
    })
    setEditingProfile(false)

    if (usernameChanged) {
      router.replace(profilePath)
    }
  }

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
    <div className="min-h-screen overflow-x-hidden bg-[#f4ead4] px-3 py-6 text-black sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-6xl space-y-5 sm:space-y-8">
        <section className="w-full max-w-full overflow-hidden rounded-[1.25rem] border border-black/10 bg-white/95 p-3 shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:rounded-[2rem] sm:p-8">
          <div className="grid min-w-0 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
            <div className="min-w-0 rounded-[1.25rem] border border-black/10 bg-slate-950 p-4 text-white sm:rounded-[2rem] sm:p-6">
              <div className="flex flex-col items-center gap-5">
                <label
                  className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white text-4xl font-black uppercase tracking-[0.25em] text-slate-950 transition hover:opacity-90"
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
                    displayName.charAt(0) || username.charAt(0) || 'H'
                  )}
                  <input type="file" accept="image/*" onChange={handleProfileImage} className="hidden" />
                </label>
                <div className="min-w-0 max-w-full space-y-1 text-center">
                  <p className="truncate text-xs uppercase tracking-[0.18em] text-white/75 sm:text-sm sm:tracking-[0.35em]">{displayType}</p>
                  <p className="truncate text-[0.62rem] uppercase tracking-[0.12em] text-white/45 sm:tracking-[0.2em]">{getHumanSubcategoryLabel(humanSubcategory)}</p>
                  <p className="truncate text-xs text-white/60">{displayName}</p>
                  <p className="truncate text-xs text-white/45">@{username}</p>
                  <button
                    type="button"
                    onClick={openProfileEditor}
                    className="mt-2 rounded-full border border-white/15 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-white/70 transition hover:bg-white/10"
                  >
                    edit profile
                  </button>
                </div>
              </div>
              <div className="mt-6 flex min-w-0 flex-col gap-3 rounded-[1rem] bg-white/10 p-3 text-sm text-white/90 sm:mt-10 sm:rounded-[1.5rem] sm:p-4">
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

            <div className="relative min-w-0 overflow-hidden rounded-[1.25rem] border border-black/10 bg-slate-950 p-3 text-white sm:rounded-[2rem] sm:p-5">
              <LiveChatDrawer
                key={`profile:${username}`}
                variant="embedded"
                room={{
                  id: `profile:${username}`,
                  title: displayName,
                  section: 'humans',
                  href: `/humans/user/${username}?type=${encodeURIComponent(humanCategory)}`,
                }}
              />
            </div>
          </div>
        </section>

        <GalleryMediaSection
          emptyMessage="Upload photos or videos to populate this gallery."
          storageKey={`once-humans-gallery:profile:${username}`}
          chatSection="humans"
          chatHref={`/humans/user/${username}?type=${encodeURIComponent(humanCategory)}`}
          chatEyebrow={`gallery from ${displayType.toLowerCase()} ${username}`}
        />

        <section className="w-full max-w-full overflow-hidden rounded-[1.25rem] border border-black/10 bg-white/95 p-4 shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:rounded-[2rem] sm:p-8">
          <h2 className="mb-5 text-sm font-black uppercase tracking-[0.16em] text-black/70">Posts</h2>
          <textarea
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            className="w-full resize-none rounded-[1.25rem] border border-black/10 bg-slate-50 p-4 text-base text-black outline-none focus:border-black/20 sm:rounded-[1.75rem] sm:p-6 sm:text-sm"
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
              <article key={post.id} className="w-full max-w-full overflow-hidden rounded-[1.25rem] border border-black/10 bg-white/95 p-4 shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:rounded-[2rem] sm:p-8">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.18em] text-black/45">posted</p>
                  <h3 className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-black/55">{formatPostDate(post.date)}</h3>
                </div>
                <p className="mt-5 break-words text-base leading-7 text-black/85 sm:text-lg sm:leading-8">{post.body}</p>
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
                      id: `profile:${username}:post:${post.id}`,
                      title: post.body.length > 64 ? `${post.body.slice(0, 64)}...` : post.body,
                      section: 'humans',
                      eyebrow: `post from ${displayType.toLowerCase()} ${username}`,
                      href: `/humans/user/${username}?type=${encodeURIComponent(humanCategory)}`,
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
              className={`mx-auto h-56 w-56 touch-none overflow-hidden rounded-full bg-slate-950 ${cropDrag ? 'cursor-grabbing' : 'cursor-grab'}`}
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

      {editingProfile && (
        <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8">
          <div className="w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-6 text-black shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/65 transition hover:bg-slate-100 hover:text-black"
              >
                close
              </button>
            </div>

            <div className="mt-2 space-y-6">
              <label className="mx-auto block w-40 cursor-pointer text-center">
                <span className="relative mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:opacity-90">
                  {profileImage ? (
                    <img
                      src={profileImage.src}
                      alt=""
                      className="pointer-events-none h-full w-full select-none object-cover"
                      draggable={false}
                      style={getProfileImageStyle(profileImage)}
                    />
                  ) : (
                    <span className="text-4xl font-light leading-none">+</span>
                  )}
                  <input type="file" accept="image/*" onChange={handleProfileImage} className="hidden" />
                </span>
                {profileImage && (
                  <span className="mt-3 block text-xs font-black uppercase tracking-[0.16em] text-black/55">
                    change image
                  </span>
                )}
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="block text-xs font-black uppercase tracking-[0.16em] text-black/50">Name</span>
                  <input
                    value={draftDisplayName}
                    onChange={(event) => setDraftDisplayName(event.target.value)}
                    className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-base text-black outline-none focus:border-black/25 sm:text-sm"
                    placeholder="Your name"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-xs font-black uppercase tracking-[0.16em] text-black/50">Username</span>
                  <div className="flex rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-base text-black focus-within:border-black/25 sm:text-sm">
                    <span className="text-black/35">@</span>
                    <input
                      value={draftUsername}
                      onChange={(event) => setDraftUsername(event.target.value)}
                      className="min-w-0 flex-1 bg-transparent pl-1 text-black outline-none"
                      placeholder="username"
                    />
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                <p className="whitespace-nowrap text-center text-[0.68rem] uppercase tracking-[0.08em] text-black/50 sm:text-sm sm:tracking-[0.25em]">
                  what type of human are you?
                </p>
                <select
                  value={humanCategory}
                  onChange={(event) => updateHumanCategory(event.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-black outline-none focus:border-black/25"
                >
                  {getHumanCategoryOptions().map((option) => (
                    <option key={option} value={option}>
                      {getHumanTypeLabel(option)}
                    </option>
                  ))}
                </select>

                <select
                  value={humanSubcategory}
                  onChange={(event) => setHumanSubcategory(event.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-black outline-none focus:border-black/25"
                >
                  {humanSubcategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {getHumanSubcategoryLabel(option)}
                    </option>
                  ))}
                </select>
              </div>

              {profileMessage && (
                <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                  {profileMessage}
                </p>
              )}

              <button
                type="button"
                onClick={saveProfileEdits}
                className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-900"
              >
                save profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
