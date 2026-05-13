'use client'

import { useState } from 'react'
import { createClient } from '../../../lib/supabase-browser'
import { useRouter } from 'next/navigation'

function slugifyName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-') || 'human'
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const openProfile = (nameSource: string, type = 'human') => {
    const username = slugifyName(nameSource || email.split('@')[0] || 'human')
    const savedType = localStorage.getItem(`once-humans-profile-type:${username}`) || type
    const profilePath = `/humans/user/${username}?type=${encodeURIComponent(savedType)}`
    localStorage.setItem('once-humans-profile-path', profilePath)
    window.dispatchEvent(new Event('once-humans-profile-changed'))
    router.push(profilePath)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAuthMessage('')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setAuthMessage(error.message)
    } else if (data.user) {
      openProfile(data.user.user_metadata?.name || data.user.email || email)
    }
    setLoading(false)
  }

  const handlePreview = () => {
    setAuthMessage('')
    openProfile(email.split('@')[0] || 'human')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 rounded-[2rem] border border-black/10 bg-white p-10 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Once Humans
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            <button
              type="button"
              onClick={handlePreview}
              className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-100"
            >
              Preview without account
            </button>
            {authMessage && (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                {authMessage}
              </p>
            )}
            <div className="text-center">
              <a href="/signup" className="text-indigo-600 hover:text-indigo-500">
                Don&apos;t have an account? Sign up
              </a>
            </div>
        </form>
      </div>
    </div>
  )
}
