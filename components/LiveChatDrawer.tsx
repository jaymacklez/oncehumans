'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'

export type LiveChatSide = 'left' | 'right'

export type LiveChatRoom = {
  id: string
  title: string
  section: 'once' | 'humans'
  side?: LiveChatSide
  href: string
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
  savedAt: string
  unreadCount: number
}

type LiveChatDrawerProps = {
  room?: LiveChatRoom
  variant?: 'inline' | 'global'
}

type ChatMessagesByRoom = Record<string, LiveChatMessage[]>
type ChatMessagesByUser = Record<string, ChatMessagesByRoom>
type SavedRoomsByUser = Record<string, SavedChatRoom[]>

const messagesStorageKey = 'once-humans-live-chat-messages'
const savedRoomsStorageKey = 'once-humans-saved-chat-rooms'
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

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    return JSON.parse(localStorage.getItem(key) || '') as T
  } catch {
    return fallback
  }
}

function writeStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getUserChatKey(profilePath: string) {
  return profilePath || 'signed-out'
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
  const profilePath = useSyncExternalStore(subscribeToProfilePath, getProfilePathSnapshot, () => '')
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
  const [messagesByUser, setMessagesByUser] = useState<ChatMessagesByUser>(() => readStorage<ChatMessagesByUser>(messagesStorageKey, {}))
  const [savedRoomsByUser, setSavedRoomsByUser] = useState<SavedRoomsByUser>(() => readStorage<SavedRoomsByUser>(savedRoomsStorageKey, {}))
  const [messageBody, setMessageBody] = useState('')

  const messagesByRoom = useMemo(() => messagesByUser[userChatKey] || {}, [messagesByUser, userChatKey])
  const savedRooms = useMemo(() => savedRoomsByUser[userChatKey] || [], [savedRoomsByUser, userChatKey])
  const messages = messagesByRoom[activeRoom.id] || []
  const savedCurrentRoom = savedRooms.some((savedRoom) => savedRoom.roomId === activeRoom.id)
  const totalUnreadCount = useMemo(
    () => savedRooms.reduce((total, savedRoom) => total + savedRoom.unreadCount, 0),
    [savedRooms]
  )

  const persistMessages = (nextMessagesByRoom: ChatMessagesByRoom) => {
    const nextMessagesByUser = {
      ...messagesByUser,
      [userChatKey]: nextMessagesByRoom,
    }
    setMessagesByUser(nextMessagesByUser)
    writeStorage(messagesStorageKey, nextMessagesByUser)
  }

  const persistSavedRooms = (nextSavedRooms: SavedChatRoom[]) => {
    const nextSavedRoomsByUser = {
      ...savedRoomsByUser,
      [userChatKey]: nextSavedRooms,
    }
    setSavedRoomsByUser(nextSavedRoomsByUser)
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
          setOpen(true)
        }}
        className={variant === 'global'
          ? 'fixed bottom-4 right-4 z-40 rounded-full border border-black/10 bg-slate-950 px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_15px_40px_rgba(15,23,42,0.22)] transition hover:bg-black'
          : 'rounded-full border border-white/20 bg-white/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white/20'}
      >
        {variant === 'global' ? 'chats' : 'chat'}
        {totalUnreadCount > 0 && (
          <span className="ml-3 rounded-full bg-white px-2 py-1 text-xs text-slate-950">{totalUnreadCount}</span>
        )}
      </button>

      <aside
        className={`fixed bottom-6 right-6 z-50 flex h-[min(38rem,calc(100dvh-3rem))] w-[min(24rem,calc(100vw-3rem))] origin-bottom-right flex-col overflow-hidden rounded-[1.5rem] border border-black/10 bg-slate-950 text-white shadow-[0_25px_80px_rgba(0,0,0,0.28)] transition duration-200 ${open ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-4 scale-95 opacity-0'}`}
      >
        <div className="border-b border-white/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">{activeRoom.section}</p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.18em]">{activeRoom.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/75 transition hover:bg-white/10"
            >
              close
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            {(['current', 'saved'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${activeTab === tab ? 'bg-white text-slate-950' : 'text-white/65 hover:bg-white/10'}`}
              >
                {tab === 'saved' ? 'chats' : tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'current' ? (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">general room</p>
              <button
                type="button"
                onClick={toggleSavedRoom}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${savedCurrentRoom ? 'bg-white text-slate-950' : 'border border-white/15 text-white hover:bg-white/10'}`}
              >
                {savedCurrentRoom ? 'joined' : 'join'}
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
              {messages.length === 0 ? (
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/60">
                  No live chat yet. Start the room.
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

            <div className="border-t border-white/10 p-5">
              <div className="flex gap-3">
                <input
                  value={messageBody}
                  onChange={(event) => setMessageBody(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') addMessage()
                  }}
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45"
                  placeholder="Write in live chat"
                />
                <button
                  type="button"
                  onClick={addMessage}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950"
                >
                  send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
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
                      <p className="text-xs uppercase tracking-[0.25em] text-white/45">{savedRoom.section}</p>
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
