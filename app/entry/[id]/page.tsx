import { notFound } from 'next/navigation'
import ContentPageSurface from '@/components/ContentPageSurface'
import { findPageById } from '@/lib/content'

type EntryPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EntryPage({ params }: EntryPageProps) {
  const { id } = await params
  const page = findPageById(id)

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f4ead4] px-6 py-10 text-black">
      <main className="mx-auto max-w-6xl">
        <ContentPageSurface page={page} relatedMode="link" />
      </main>
    </div>
  )
}
