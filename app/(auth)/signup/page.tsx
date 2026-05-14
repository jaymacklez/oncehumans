'use client'

import { useState } from 'react'
import { createClient } from '../../../lib/supabase-browser'
import { useRouter } from 'next/navigation'
import {
  getDefaultHumanSubcategory,
  getHumanCategoryOptions,
  getHumanSubcategoryLabel,
  getHumanSubcategoryOptions,
  getHumanTypeLabel,
  isHumanUsernameAvailable,
  normalizeHumanCategory,
  upsertHumanProfile,
} from '@/lib/human-profiles'

function slugifyName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-') || 'human'
}

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '') || 'human'
}

function getCompactTitleClass(title: string) {
  if (title.length > 18) return 'text-[0.72rem] sm:text-sm'
  if (title.length > 13) return 'text-sm sm:text-base'
  return 'text-base sm:text-lg'
}

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [usernameInput, setUsernameInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'category' | 'subcategory'>('form')
  const [userName, setUserName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Creators')
  const [authMessage, setAuthMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const categoryOptions = getHumanCategoryOptions()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const username = normalizeUsername(usernameInput)

    if (!isHumanUsernameAvailable(username)) {
      setAuthMessage('That username is already taken. Try another @ name.')
      return
    }

    setLoading(true)
    setAuthMessage('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
        },
      },
    })

    if (error) {
      const isRateLimited = error.message.toLowerCase().includes('rate limit')
      setAuthMessage(
        isRateLimited
          ? 'Supabase is temporarily limiting signup emails. You can still use preview mode below to open your user page without creating an account.'
          : error.message
      )
    } else if (data.user) {
      setUserName(username)
      setStep('category')
    }
    setLoading(false)
  }

  const handlePreview = () => {
    const username = normalizeUsername(usernameInput || name)
    if (!isHumanUsernameAvailable(username)) {
      setAuthMessage('That username is already taken. Try another @ name.')
      return
    }

    setAuthMessage('')
    setUserName(username)
    setStep('category')
  }

  const handleChooseCategory = (type: string) => {
    setSelectedCategory(normalizeHumanCategory(type))
    setStep('subcategory')
  }

  const handleChooseSubcategory = (subcategory: string) => {
    const username = userName || slugifyName(name)
    const category = normalizeHumanCategory(selectedCategory)
    const profilePath = `/humans/user/${username}?type=${encodeURIComponent(category)}`
    upsertHumanProfile({
      username,
      displayName: name.trim() || username,
      category,
      subcategory: subcategory || getDefaultHumanSubcategory(category),
      type: category,
      profilePath,
    })
    router.push(profilePath)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-xl rounded-[2rem] border border-black/10 bg-white p-10 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Sign up to become a human</h2>
          <p className="mt-3 text-sm text-gray-600">Create your account and choose the human section that fits you.</p>
        </div>

        {step === 'form' ? (
          <form className="space-y-6" onSubmit={handleSignup}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:outline-none"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Username</label>
                <div className="flex rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus-within:border-black">
                  <span className="text-gray-400">@</span>
                  <input
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent pl-1 text-sm text-gray-900 outline-none"
                    placeholder="username"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:outline-none"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:outline-none"
                type="password"
                placeholder="Create a password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-900"
            >
              {loading ? 'Creating account...' : 'Continue'}
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="w-full rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-gray-100"
            >
              Preview without account
            </button>
            {authMessage && (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                {authMessage}
              </p>
            )}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-black hover:underline">Sign in</a>
            </p>
          </form>
        ) : step === 'category' ? (
          <div className="space-y-6">
            <div>
              <p className="whitespace-nowrap text-[0.68rem] uppercase tracking-[0.08em] text-gray-500 sm:text-sm sm:tracking-[0.25em]">what type of human are you?</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {categoryOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChooseCategory(type)}
                  className="rounded-[1.5rem] border border-black/10 bg-slate-950 px-6 py-8 text-left text-white transition hover:-translate-y-0.5 hover:bg-black"
                >
                  <p className="text-xl font-black uppercase tracking-[0.2em]">{getHumanTypeLabel(type)}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="whitespace-nowrap text-[0.68rem] uppercase tracking-[0.08em] text-gray-500 sm:text-sm sm:tracking-[0.25em]">where should you appear?</p>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-[0.14em] text-black">{getHumanTypeLabel(selectedCategory)}</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {getHumanSubcategoryOptions(selectedCategory).map((subcategory) => (
                <button
                  key={subcategory}
                  type="button"
                  onClick={() => handleChooseSubcategory(subcategory)}
                  className="rounded-[1.1rem] border border-black/10 bg-slate-950 px-4 py-5 text-white transition hover:-translate-y-0.5 hover:bg-black"
                >
                  <p className={`${getCompactTitleClass(getHumanSubcategoryLabel(subcategory))} truncate whitespace-nowrap text-center font-black uppercase tracking-[0.08em]`}>
                    {getHumanSubcategoryLabel(subcategory)}
                  </p>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep('category')}
              className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black/65 transition hover:bg-slate-100 hover:text-black"
            >
              back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
