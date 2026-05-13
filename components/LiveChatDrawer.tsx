'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'

export type LiveChatSide = 'left' | 'right'

export type LiveChatRoom = {
  id: string
  title: string
  section: 'once' | 'humans'
  side?: LiveChatSide
  href: string
  eyebrow?: string
}

type LiveChatMessage = {
  id: string
  roomId: string
  author: string
  body: string
  createdAt: string
}

type SavedChatRoom = {
  roomId: string
  title: string
  section: 'once' | 'humans'
  side?: LiveChatSide
  href: string
  eyebrow?: string
  savedAt: string
  unreadCount: number
}

type LiveChatDrawerProps = {
  room?: LiveChatRoom
  variant?: 'inline' | 'global' | 'post'
}

type ChatMessagesByRoom = Record<string, LiveChatMessage[]>
type ChatMessagesByUser = Record<string, ChatMessagesByRoom>
type SavedRoomsByUser = Record<string, SavedChatRoom[]>

const messagesStorageKey = 'once-humans-live-chat-messages'
const savedRoomsStorageKey = 'once-humans-saved-chat-rooms'
const profilePathStorageKey = 'once-humans-profile-path'
const profilePathChangedEvent = 'once-humans-profile-changed'
const chatStorageChangedEvent = 'once-humans-chat-storage-changed'
const chatDrawerOpenedEvent = 'once-humans-chat-drawer-opened'

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

function subscribeToChatStorage(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange)
  window.addEventListener(chatStorageChangedEvent, onStoreChange)

  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener(chatStorageChangedEvent, onStoreChange)
  }
}

function getMessagesSnapshot() {
  if (typeof window === 'undefined') return '{}'
  return localStorage.getItem(messagesStorageKey) || '{}'
}

function getSavedRoomsSnapshot() {
  if (typeof window === 'undefined') return '{}'
  return localStorage.getItem(savedRoomsStorageKey) || '{}'
}

function writeStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event(chatStorageChangedEvent))
}

function getUserChatKey(profilePath: string) {
  if (!profilePath) return 'signed-out'

  try {
    const url = new URL(profilePath, window.location.origin)
    return url.pathname
  } catch {
    return profilePath.split('?')[0] || profilePath
  }
}

function redirectToAuth() {
  window.location.href = '/login'
}

function createMessageId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function LiveChatDrawer({ room, variant = 'inline' }: LiveChatDrawerProps) {
  const [drawerId] = useState(() => createMessageId())
  const profilePath = useSyncExternalStore(subscribeToProfilePath, getProfilePathSnapshot, () => '')
  const messagesSnapshot = useSyncExternalStore(subscribeToChatStorage, getMessagesSnapshot, () => '{}')
  const savedRoomsSnapshot = useSyncExternalStore(subscribeToChatStorage, getSavedRoomsSnapshot, () => '{}')
  const signedIn = Boolean(profilePath)
  const userChatKey = getUserChatKey(profilePath)
  const defaultRoom: LiveChatRoom = useMemo(() => ({
    id: `profile:${profilePath || 'human'}`,
    title: 'Chats',
    section: 'humans',
    href: profilePath || '/login',
  }), [profilePath])
  const currentRoom = room || defaultRoom
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'current' | 'saved'>('current')
  const [activeRoom, setActiveRoom] = useState<LiveChatRoom>(currentRoom)
  const [messageBody, setMessageBody] = useState('')

  const messagesByUser = useMemo(() => {
    try {
      return JSON.parse(messagesSnapshot) as ChatMessagesByUser
    } catch {
      return {}
    }
  }, [messagesSnapshot])
  const savedRoomsByUser = useMemo(() => {
    try {
      return JSON.parse(savedRoomsSnapshot) as SavedRoomsByUser
    } catch {
      return {}
    }
  }, [savedRoomsSnapshot])
  const legacyUserChatKey = profilePath && profilePath !== userChatKey ? profilePath : ''
  const messagesByRoom = useMemo(() => messagesByUser[userChatKey] || {}, [messagesByUser, userChatKey])
  const savedRooms = useMemo(() => {
    const roomsById = new Map<string, SavedChatRoom>()

    ;[...(savedRoomsByUser[legacyUserChatKey] || []), ...(savedRoomsByUser[userChatKey] || [])].forEach((savedRoom) => {
      roomsById.set(savedRoom.roomId, savedRoom)
    })

    return Array.from(roomsById.values())
  }, [legacyUserChatKey, savedRoomsByUser, userChatKey])
  const messages = messagesByRoom[activeRoom.id] || []
  const savedCurrentRoom = savedRooms.some((savedRoom) => savedRoom.roomId === activeRoom.id)
  const totalUnreadCount = useMemo(
    () => savedRooms.reduce((total, savedRoom) => total + savedRoom.unreadCount, 0),
    [savedRooms]
  )

  useEffect(() => {
    const closeWhenAnotherDrawerOpens = (event: Event) => {
      const openedDrawerId = (event as CustomEvent<{ drawerId: string }>).detail?.drawerId
      if (openedDrawerId && openedDrawerId !== drawerId) {
        setOpen(false)
      }
    }

    window.addEventListener(chatDrawerOpenedEvent, closeWhenAnotherDrawerOpens)

    return () => {
      window.removeEventListener(chatDrawerOpenedEvent, closeWhenAnotherDrawerOpens)
    }
  }, [drawerId])

  const persistMessages = (nextMessagesByRoom: ChatMessagesByRoom) => {
    const nextMessagesByUser = {
      ...messagesByUser,
      [userChatKey]: nextMessagesByRoom,
    }
    writeStorage(messagesStorageKey, nextMessagesByUser)
  }

  const persistSavedRooms = (nextSavedRooms: SavedChatRoom[]) => {
    const nextSavedRoomsByUser = {
      ...savedRoomsByUser,
      [userChatKey]: nextSavedRooms,
    }
    writeStorage(savedRoomsStorageKey, nextSavedRoomsByUser)
  }

  const addMessage = () => {
    if (!signedIn) {
      redirectToAuth()
      return
    }
    if (!messageBody.trim()) return

    const nextMessage: LiveChatMessage = {
      id: createMessageId(),
      roomId: activeRoom.id,
      author: 'you',
      body: messageBody.trim(),
      createdAt: new Date().toISOString(),
    }
    const nextMessagesByRoom = {
      ...messagesByRoom,
      [activeRoom.id]: [...messages, nextMessage],
    }

    persistMessages(nextMessagesByRoom)
    setMessageBody('')
  }

  const toggleSavedRoom = () => {
    if (!signedIn) {
      redirectToAuth()
      return
    }

    if (savedCurrentRoom) {
      persistSavedRooms(savedRooms.filter((savedRoom) => savedRoom.roomId !== activeRoom.id))
      return
    }

    persistSavedRooms([
      {
        roomId: activeRoom.id,
        title: activeRoom.title,
        section: activeRoom.section,
        eyebrow: activeRoom.eyebrow,
        href: activeRoom.href,
        savedAt: new Date().toISOString(),
        unreadCount: 0,
      },
      ...savedRooms,
    ])
  }

  const openSavedRoom = (savedRoom: SavedChatRoom) => {
    setActiveRoom({
      id: savedRoom.roomId,
      title: savedRoom.title,
      section: savedRoom.section,
      eyebrow: savedRoom.eyebrow,
      href: savedRoom.href,
    })
    setActiveTab('current')
    persistSavedRooms(savedRooms.map((roomToSave) => (
      roomToSave.roomId === savedRoom.roomId ? { ...roomToSave, unreadCount: 0 } : roomToSave
    )))
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!signedIn) {
            redirectToAuth()
            return
          }

          setActiveRoom(currentRoom)
          setActiveTab(variant === 'global' ? 'saved' : 'current')
          window.dispatchEvent(new CustomEvent(chatDrawerOpenedEvent, { detail: { drawerId } }))
          setOpen(true)
        }}
        className={variant === 'global'
          ? 'fixed bottom-3 right-3 z-40 rounded-full border border-black/10 bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_15px_40px_rgba(15,23,42,0.22)] transition hover:bg-black sm:bottom-4 sm:right-4 sm:px-5 sm:py-4 sm:tracking-[0.2em]'
          : variant === 'post'
            ? 'rounded-full border border-black/10 bg-slate-100 px-5 py-3 text-sm uppercase tracking-[0.2em] text-black transition hover:bg-slate-200'
          : 'rounded-full border border-white/20 bg-white/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white/20'}
      >
        {variant === 'global' ? 'chats' : 'chat'}
        {totalUnreadCount > 0 && (
          <span className="ml-3 rounded-full bg-white px-2 py-1 text-xs text-slate-950">{totalUnreadCount}</span>
        )}
      </button>

      <aside
        className={`fixed inset-x-3 bottom-3 z-50 flex h-[min(36rem,calc(100dvh-1.5rem))] w-auto origin-bottom-right flex-col overflow-hidden rounded-[1.25rem] border border-black/10 bg-slate-950 text-white shadow-[0_25px_80px_rgba(0,0,0,0.28)] transition duration-200 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(38rem,calc(100dvh-3rem))] sm:w-[min(24rem,calc(100vw-3rem))] sm:rounded-[1.5rem] ${open ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-4 scale-95 opacity-0'}`}
      >
        <div className="border-b border-white/10 p-4 sm:p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2">
            <p className="min-w-0 break-words text-xs uppercase tracking-[0.18em] text-white/50 sm:tracking-[0.3em]">{activeRoom.eyebrow || activeRoom.section}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="justify-self-end rounded-full border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/75 transition hover:bg-white/10"
            >
              close
            </button>

            <h2 className="min-w-0 break-words text-xl font-black uppercase tracking-[0.1em] sm:text-2xl sm:tracking-[0.18em]">{activeRoom.title}</h2>
            <button
              type="button"
              onClick={toggleSavedRoom}
              className={`justify-self-end rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition sm:px-4 sm:tracking-[0.18em] ${savedCurrentRoom ? 'bg-white text-slate-950' : 'border border-white/15 text-white hover:bg-white/10'}`}
            >
              {savedCurrentRoom ? 'joined' : 'join chat'}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            {(['current', 'saved'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition sm:px-4 sm:tracking-[0.18em] ${activeTab === tab ? 'bg-white text-slate-950' : 'text-white/65 hover:bg-white/10'}`}
              >
                {tab === 'saved' ? 'chats' : tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'current' ? (
          <>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
              {messages.length === 0 ? (
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/60">
                  No chat yet. Start the room.
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">{message.author}</p>
                      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/35">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/85">{message.body}</p>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-white/10 p-4 sm:p-5">
              <div className="flex gap-3">
                <input
                  value={messageBody}
                  onChange={(event) => setMessageBody(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') addMessage()
                  }}
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45"
                  placeholder="Say something"
                />
                <button
                  type="button"
                  onClick={addMessage}
                  className="rounded-2xl bg-white px-3 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-950 sm:px-4 sm:tracking-[0.18em]"
                >
                  send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
            {savedRooms.length === 0 ? (
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/60">
                Joined chats will appear here.
              </div>
            ) : (
              savedRooms.map((savedRoom) => (
                <button
                  key={savedRoom.roomId}
                  type="button"
                  onClick={() => openSavedRoom(savedRoom)}
                  className="w-full rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/45">{savedRoom.eyebrow || savedRoom.section}</p>
                      <h3 className="mt-2 text-base font-black uppercase tracking-[0.15em] text-white">{savedRoom.title}</h3>
                    </div>
                    {savedRoom.unreadCount > 0 && (
                      <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-950">
                        {savedRoom.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </aside>
    </>
  )
}
