import { notFound } from 'next/navigation'
import SubcategoryPageSurface from '@/components/SubcategoryPageSurface'
import { getSubcategoryBySlug } from '@/lib/content'

type OncePageProps = {
  params: Promise<{
    slug: string[]
  }>
}

export default async function OncePage({ params }: OncePageProps) {
  const { slug } = await params
  const [categorySlug, subcategorySlug] = slug

  if (!categorySlug || !subcategorySlug) {
    notFound()
  }

  const result = getSubcategoryBySlug('once', categorySlug, subcategorySlug)

  if (!result) {
    notFound()
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f4ead4] px-4 py-8 text-black sm:px-6 sm:py-10">
      <main className="mx-auto max-w-7xl">
        <SubcategoryPageSurface section="once" category={result.category} subcategory={result.subcategory} backHref={`/?section=once&category=${categorySlug}`} />
      </main>
    </div>
  )
}
