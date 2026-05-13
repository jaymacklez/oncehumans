'use client'

import { useState } from 'react'

interface CategoryDropdownProps {
  title: string
  categories: string[]
  basePath: string
}

export default function CategoryDropdown({ title, categories, basePath }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-gray-300 px-4 py-2"
      >
        {title}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 bg-white text-black shadow-lg rounded mt-1 z-10">
          {categories.map((category) => (
            <a
              key={category}
              href={`/${basePath}/${category.toLowerCase().replace(' ', '-')}`}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {category}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}