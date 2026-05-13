'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import SubmitPageModal from '@/components/SubmitPageModal'
import { createClient } from '@/lib/supabase-browser'

const profilePathStorageKey = 'once-humans-profile-path'
const profilePathChangedEvent = 'once-humans-profile-changed'

function subscribeToProfilePath(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange)
  window.addEventListener(profilePathChangedEvent, onStoreChange)

  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener(profilePathChangedEvent, onStoreChange)
  }
}

function getProfilePathSnapshot() {
  return localStorage.getItem(profilePathStorageKey) || ''
}

export default function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const profilePath = useSyncExternalStore(subscribeToProfilePath, getProfilePathSnapshot, () => '')
  const showHomeLink = pathname.startsWith('/humans/user/') || pathname.startsWith('/entry/') || pathname === '/search'

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    localStorage.removeItem(profilePathStorageKey)
    window.dispatchEvent(new Event(profilePathChangedEvent))
    router.push('/')
  }

  return (
    <header className="flex items-center justify-between gap-4 px-8 py-6">
      <div className="flex items-center gap-4">
        {showHomeLink && (
          <Link
            href="/"
            className="text-[0.95rem] font-black uppercase tracking-[0.3em] text-black hover:text-gray-700"
          >
            once humans
          </Link>
        )}
        <SubmitPageModal />
      </div>
      {profilePath ? (
        <nav className="flex items-center gap-16">
          <Link
            href="/search"
            className="text-[0.95rem] uppercase tracking-[0.3em] text-black hover:text-gray-700"
          >
            Search
          </Link>
          <Link
            href={profilePath}
            className="text-[0.95rem] uppercase tracking-[0.3em] text-black hover:text-gray-700"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-[0.95rem] uppercase tracking-[0.3em] text-black hover:text-gray-700"
          >
            Logout
          </button>
        </nav>
      ) : (
        <nav className="flex items-center gap-16">
          <Link
            href="/search"
            className="text-[0.95rem] uppercase tracking-[0.3em] text-black hover:text-gray-700"
          >
            Search
          </Link>
          <Link
            href="/signup"
            className="text-[0.95rem] uppercase tracking-[0.3em] text-black hover:text-gray-700"
          >
            Signup
          </Link>
        </nav>
      )}
    </header>
  )
}
