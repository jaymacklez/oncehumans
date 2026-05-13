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

  const navLinkClass = 'whitespace-nowrap text-[0.72rem] uppercase tracking-[0.08em] text-black hover:text-gray-700 sm:text-[0.95rem] sm:tracking-[0.3em]'

  return (
    <header className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-6">
      <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-4">
        {showHomeLink && (
          <Link
            href="/"
            className="whitespace-nowrap text-[0.72rem] font-black uppercase tracking-[0.08em] text-black hover:text-gray-700 sm:text-[0.95rem] sm:tracking-[0.3em]"
          >
            once humans
          </Link>
        )}
        {profilePath && <SubmitPageModal />}
      </div>
      {profilePath ? (
        <nav className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-3 sm:w-auto sm:justify-end sm:gap-x-16">
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
        <nav className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-3 sm:w-auto sm:justify-end sm:gap-x-16">
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
