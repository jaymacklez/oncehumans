import { notFound } from 'next/navigation'

const onceCategories = [
  "Inventions",
  "Art",
  "Music",
  "Literature",
  "Performance",
  "Science",
  "Technology",
  "Philosophy",
  "Architecture",
  "Social Structures"
]

export default function OncePage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/')
  const category = onceCategories.find(cat => cat.toLowerCase().replace(' ', '-') === slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{category}</h1>
      <p className="text-lg mb-8">
        This is the {category} category page. Description and comments will be added here.
      </p>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-2xl font-semibold mb-2">Comments</h2>
        <p>Comments section coming soon...</p>
      </div>
    </div>
  )
}