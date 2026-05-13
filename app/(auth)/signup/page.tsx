'use client'

import { useState } from 'react'
import { createClient } from '../../../lib/supabase-browser'
import { useRouter } from 'next/navigation'

function slugifyName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-') || 'human'
}

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'category'>('form')
  const [userName, setUserName] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const categoryOptions = [
    'Creators',
    'Artists',
    'Engineers',
    'Scientists',
    'Writers',
    'Performers',
  ]

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAuthMessage('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
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
      setUserName(slugifyName(name))
      setStep('category')
    }
    setLoading(false)
  }

  const handlePreview = () => {
    setAuthMessage('')
    setUserName(slugifyName(name))
    setStep('category')
  }

  const handleChooseType = (type: string) => {
    const username = userName || slugifyName(name)
    const profilePath = `/humans/user/${username}?type=${encodeURIComponent(type)}`
    localStorage.setItem('once-humans-profile-path', profilePath)
    window.dispatchEvent(new Event('once-humans-profile-changed'))
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
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:outline-none"
                placeholder="Enter your name"
                required
              />
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
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-gray-500">what type of human are you?</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {categoryOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChooseType(type)}
                  className="rounded-[1.5rem] border border-black/10 bg-slate-950 px-6 py-8 text-left text-white transition hover:-translate-y-0.5 hover:bg-black"
                >
                  <p className="text-xl font-black uppercase tracking-[0.2em]">{type}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
