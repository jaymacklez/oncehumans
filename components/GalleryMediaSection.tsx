'use client'

import { useEffect, useRef, useState } from 'react'

type UploadedMedia = {
  id: string
  name: string
  type: string
  url: string
}

type GalleryMediaSectionProps = {
  seedItems?: string[]
  compact?: boolean
  emptyMessage?: string
}

export default function GalleryMediaSection({
  compact = false,
  emptyMessage = 'Upload a photo or video to add to this gallery.',
}: GalleryMediaSectionProps) {
  const [uploads, setUploads] = useState<UploadedMedia[]>([])
  const uploadsRef = useRef<UploadedMedia[]>([])

  useEffect(() => {
    uploadsRef.current = uploads
  }, [uploads])

  useEffect(() => {
    return () => {
      uploadsRef.current.forEach((upload) => URL.revokeObjectURL(upload.url))
    }
  }, [])

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const nextUploads = Array.from(files).map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }))

    setUploads((current) => [...current, ...nextUploads])
    event.target.value = ''
  }

  return (
    <section className={`${compact ? 'rounded-[1.5rem] p-5' : 'rounded-[2rem] p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)]'} border border-black/10 bg-white/95`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className={`${compact ? 'text-sm tracking-[0.25em]' : 'text-3xl tracking-[0.2em]'} font-black uppercase text-black`}>
          Gallery
        </h2>
        <label className="cursor-pointer rounded-full border border-black/10 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-900">
          Add
          <input type="file" multiple accept="image/*,video/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className={`${compact ? 'mt-4 gap-3' : 'mt-8 gap-4'} grid sm:grid-cols-3`}>
        {uploads.map((upload) => (
          <div
            key={upload.id}
            className={`${compact ? 'h-28 rounded-[1.25rem]' : 'h-40 rounded-[1.75rem]'} overflow-hidden border border-black/10 bg-slate-950`}
          >
            {upload.type.startsWith('video/') ? (
              <video src={upload.url} controls className="h-full w-full object-cover" aria-label={upload.name} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={upload.url} alt={upload.name} className="h-full w-full object-cover" />
            )}
          </div>
        ))}

        {uploads.length === 0 && (
          <div className={`${compact ? 'rounded-[1.25rem] p-8' : 'rounded-[1.75rem] p-12'} col-span-full border border-dashed border-black/20 bg-slate-50 text-center text-sm text-black/60`}>
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  )
}
