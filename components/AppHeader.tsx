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

  const navLinkClass = 'text-xs uppercase tracking-[0.16em] text-black hover:text-gray-700 sm:text-[0.95rem] sm:tracking-[0.3em]'

  return (
    <header className="flex flex-wrap items-start justify-between gap-4 px-4 py-4 sm:items-center sm:px-8 sm:py-6">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {showHomeLink && (
          <Link
            href="/"
            className="text-xs font-black uppercase tracking-[0.16em] text-black hover:text-gray-700 sm:text-[0.95rem] sm:tracking-[0.3em]"
          >
            once humans
          </Link>
        )}
        {profilePath && <SubmitPageModal />}
      </div>
      {profilePath ? (
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-3 sm:gap-x-16">
          <Link
            href="/search"
            className={navLinkClass}
          >
            Search
          </Link>
          <Link
            href={profilePath}
            className={navLinkClass}
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={navLinkClass}
          >
            Logout
          </button>
        </nav>
      ) : (
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-3 sm:gap-x-16">
          <Link
            href="/search"
            className={navLinkClass}
          >
            Search
          </Link>
          <Link
            href="/signup"
            className={navLinkClass}
          >
            Signup
          </Link>
        </nav>
      )}
    </header>
  )
}
