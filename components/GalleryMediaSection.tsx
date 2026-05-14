'use client'

import { useEffect, useMemo, useState } from 'react'
import LiveChatDrawer, { type LiveChatRoom } from '@/components/LiveChatDrawer'

type UploadedMedia = {
  id: string
  name: string
  caption?: string
  type: string
  url: string
}

type GalleryMediaSectionProps = {
  seedItems?: string[]
  compact?: boolean
  emptyMessage?: string
  storageKey?: string
  chatSection?: 'once' | 'humans'
  chatHref?: string
  chatEyebrow?: string
}

function readUploads(storageKey?: string) {
  if (!storageKey || typeof window === 'undefined') return []

  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]') as UploadedMedia[]
  } catch {
    return []
  }
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(typeof reader.result === 'string' ? reader.result : ''))
    reader.readAsDataURL(file)
  })
}

export default function GalleryMediaSection({
  compact = false,
  emptyMessage = 'Upload a photo or video to add to this gallery.',
  storageKey,
  chatSection = 'humans',
  chatHref = '/',
  chatEyebrow = 'gallery',
}: GalleryMediaSectionProps) {
  const [uploads, setUploads] = useState<UploadedMedia[]>(() => readUploads(storageKey))
  const [activeMediaId, setActiveMediaId] = useState('')
  const activeMedia = useMemo(() => uploads.find((upload) => upload.id === activeMediaId), [activeMediaId, uploads])

  useEffect(() => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(uploads))
  }, [storageKey, uploads])

  useEffect(() => {
    if (!activeMedia) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [activeMedia])

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const nextUploads = await Promise.all(Array.from(files).map(async (file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      name: file.name,
      type: file.type,
      url: await fileToDataUrl(file),
    })))

    setUploads((current) => [...current, ...nextUploads])
    event.target.value = ''
  }

  const deleteMedia = (mediaId: string) => {
    setUploads((current) => current.filter((upload) => upload.id !== mediaId))
    if (activeMediaId === mediaId) setActiveMediaId('')
  }

  const updateCaption = (mediaId: string, caption: string) => {
    setUploads((current) => current.map((upload) => (
      upload.id === mediaId ? { ...upload, caption } : upload
    )))
  }

  const getMediaTitle = (media: UploadedMedia) => media.caption?.trim() || media.name

  const activeRoom: LiveChatRoom | undefined = activeMedia ? {
    id: `gallery:${storageKey || chatHref}:${activeMedia.id}`,
    title: getMediaTitle(activeMedia),
    section: chatSection,
    eyebrow: chatEyebrow,
    href: chatHref,
  } : undefined

  return (
    <section className={`${compact ? 'rounded-[1.5rem] p-5' : 'rounded-[1.25rem] p-4 shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:rounded-[2rem] sm:p-8'} w-full max-w-full overflow-hidden border border-black/10 bg-white/95`}>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
        <h2 className={`${compact ? 'text-xs tracking-[0.14em]' : 'text-sm tracking-[0.16em]'} font-black uppercase text-black/70`}>
          Gallery
        </h2>
        <label className="cursor-pointer rounded-full border border-black/10 bg-black px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-slate-900 sm:px-5 sm:tracking-[0.2em]">
          Add
          <input type="file" multiple accept="image/*,video/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className={`${compact ? 'mt-4' : 'mt-6 sm:mt-8'} max-w-full overflow-x-auto pb-2`}>
        {uploads.length === 0 ? (
          <div className={`${compact ? 'rounded-[1.25rem] p-8' : 'rounded-[1.75rem] p-12'} border border-dashed border-black/20 bg-slate-50 text-center text-sm text-black/60`}>
            {emptyMessage}
          </div>
        ) : (
          <div className="flex w-max gap-3">
            {uploads.map((upload) => (
              <div key={upload.id} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveMediaId(upload.id)}
                  className={`${compact ? 'h-24 w-24 rounded-[1rem]' : 'h-32 w-32 rounded-[1.25rem]'} block overflow-hidden border border-black/10 bg-slate-950 transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.18)]`}
                >
                  {upload.type.startsWith('video/') ? (
                    <video src={upload.url} muted className="h-full w-full object-cover" aria-label={upload.name} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={upload.url} alt={upload.name} className="h-full w-full object-cover" />
                  )}
                </button>
                {upload.caption && (
                  <p className="mt-2 max-w-24 truncate text-xs text-black/60 sm:max-w-32">
                    {upload.caption}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => deleteMedia(upload.id)}
                  className="absolute right-1 top-1 rounded-full bg-black/75 px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur transition hover:bg-black"
                >
                  delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeMedia && activeRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 px-4 py-6 sm:px-6 sm:py-10">
          <div className="w-full max-w-4xl rounded-[2rem] border border-black/10 bg-white p-5 text-black shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">{chatEyebrow}</p>
                <h2 className="mt-2 break-words text-xl font-black uppercase tracking-[0.12em] text-black sm:text-2xl">
                  {getMediaTitle(activeMedia)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveMediaId('')}
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-gray-100"
              >
                close
              </button>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] bg-slate-950">
              {activeMedia.type.startsWith('video/') ? (
                <video src={activeMedia.url} controls className="max-h-[70vh] w-full object-contain" aria-label={activeMedia.name} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activeMedia.url} alt={activeMedia.name} className="max-h-[70vh] w-full object-contain" />
              )}
            </div>

            <label className="mt-5 block space-y-2 text-sm font-semibold uppercase tracking-[0.18em] text-black">
              Caption
              <input
                value={activeMedia.caption || ''}
                onChange={(event) => updateCaption(activeMedia.id, event.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm normal-case tracking-normal text-black outline-none focus:border-black/25"
                placeholder="Give this image or video a caption"
              />
            </label>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => deleteMedia(activeMedia.id)}
                className="rounded-full border border-black/10 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-black/65 transition hover:bg-gray-100 hover:text-black"
              >
                delete
              </button>
              <LiveChatDrawer room={activeRoom} variant="post" />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
