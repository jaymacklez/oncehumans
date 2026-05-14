'use client'

import { type ReactNode, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

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
  parentId?: string
  score?: number
  userVote?: 'like' | 'dislike'
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
  variant?: 'inline' | 'global' | 'post' | 'embedded'
  label?: string
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

function ThumbIcon({ filled, direction }: { filled: boolean; direction: 'up' | 'down' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${direction === 'down' ? 'rotate-180' : ''}`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M7 21H4.8a1.8 1.8 0 0 1-1.8-1.8v-7.4A1.8 1.8 0 0 1 4.8 10H7v11Z" />
      <path d="M7 10l3.6-6.1a2 2 0 0 1 3.7 1.2L14 9h4.8a2.2 2.2 0 0 1 2.1 2.7l-1.6 6.8A3.2 3.2 0 0 1 16.2 21H7V10Z" />
    </svg>
  )
}

export default function LiveChatDrawer({ room, variant = 'inline', label }: LiveChatDrawerProps) {
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
  const [replyingTo, setReplyingTo] = useState<LiveChatMessage | null>(null)
  const composerRef = useRef<HTMLInputElement | null>(null)
  const [isMobileChat, setIsMobileChat] = useState(false)
  const visibleRoom = variant === 'embedded' ? currentRoom : activeRoom

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
  const messages = useMemo(() => messagesByRoom[visibleRoom.id] || [], [messagesByRoom, visibleRoom.id])
  const savedCurrentRoom = savedRooms.some((savedRoom) => savedRoom.roomId === visibleRoom.id)
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

  useEffect(() => {
    const closeAfterPageRestore = () => setOpen(false)

    window.addEventListener('pageshow', closeAfterPageRestore)

    return () => {
      window.removeEventListener('pageshow', closeAfterPageRestore)
    }
  }, [])

  useEffect(() => {
    if (!replyingTo) return
    composerRef.current?.focus()
  }, [replyingTo])

  useEffect(() => {
    if (!open || activeTab !== 'current') return
    requestAnimationFrame(() => composerRef.current?.focus())
  }, [activeTab, open, visibleRoom.id])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const syncMobileChat = () => setIsMobileChat(mediaQuery.matches)

    syncMobileChat()
    mediaQuery.addEventListener('change', syncMobileChat)

    return () => {
      mediaQuery.removeEventListener('change', syncMobileChat)
    }
  }, [])

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
      roomId: visibleRoom.id,
      author: 'you',
      body: messageBody.trim(),
      createdAt: new Date().toISOString(),
      parentId: replyingTo?.id,
      score: 0,
    }
    const nextMessagesByRoom = {
      ...messagesByRoom,
      [visibleRoom.id]: [...messages, nextMessage],
    }

    persistMessages(nextMessagesByRoom)
    setMessageBody('')
    setReplyingTo(null)
  }

  const voteMessage = (messageId: string, vote: 'like' | 'dislike') => {
    if (!signedIn) {
      redirectToAuth()
      return
    }

    const nextMessagesByRoom = {
      ...messagesByRoom,
      [visibleRoom.id]: messages.map((message) => {
        if (message.id !== messageId) return message

        const previousVote = message.userVote
        const nextVote = previousVote === vote ? undefined : vote
        const previousScore = previousVote === 'like' ? 1 : previousVote === 'dislike' ? -1 : 0
        const nextScore = nextVote === 'like' ? 1 : nextVote === 'dislike' ? -1 : 0

        return {
          ...message,
          userVote: nextVote,
          score: (message.score || 0) - previousScore + nextScore,
        }
      }),
    }

    persistMessages(nextMessagesByRoom)
  }

  const toggleSavedRoom = () => {
    if (!signedIn) {
      redirectToAuth()
      return
    }

    if (savedCurrentRoom) {
      persistSavedRooms(savedRooms.filter((savedRoom) => savedRoom.roomId !== visibleRoom.id))
      return
    }

    persistSavedRooms([
      {
        roomId: visibleRoom.id,
        title: visibleRoom.title,
        section: visibleRoom.section,
        eyebrow: visibleRoom.eyebrow,
        href: visibleRoom.href,
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

  const openDrawerForRoom = (nextRoom = currentRoom, nextTab: 'current' | 'saved' = 'current') => {
    if (!signedIn) {
      redirectToAuth()
      return
    }

    setActiveRoom(nextRoom)
    setActiveTab(nextTab)
    window.dispatchEvent(new CustomEvent(chatDrawerOpenedEvent, { detail: { drawerId } }))
    setOpen(true)
  }

  const sortedMessages = useMemo(() => {
    return [...messages].sort((firstMessage, secondMessage) => {
      const scoreDifference = (secondMessage.score || 0) - (firstMessage.score || 0)
      if (scoreDifference !== 0) return scoreDifference

      return new Date(secondMessage.createdAt).getTime() - new Date(firstMessage.createdAt).getTime()
    })
  }, [messages])

  const topLevelMessages = sortedMessages.filter((message) => !message.parentId)

  const renderTabSwitcher = () => (
    <div className="relative mt-4 grid h-11 w-full grid-cols-2 overflow-hidden rounded-full border border-white/10 bg-white/5 p-1">
      <span
        aria-hidden="true"
        className={`absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-[0_8px_20px_rgba(255,255,255,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          activeTab === 'saved' ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      {(['current', 'saved'] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          className={`relative z-10 flex h-full min-w-0 items-center justify-center rounded-full px-3 text-center text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 sm:px-4 sm:tracking-[0.18em] ${
            activeTab === tab ? 'text-slate-950' : 'text-white/65 hover:text-white'
          }`}
        >
          {tab === 'saved' ? 'chats' : tab}
        </button>
      ))}
    </div>
  )

  const renderMessageThread = (message: LiveChatMessage, depth = 0) => {
    const replies = sortedMessages.filter((reply) => reply.parentId === message.id)

    return (
      <div key={message.id} className={depth > 0 ? 'ml-4 border-l border-white/15 pl-3 sm:ml-6 sm:pl-4' : ''}>
        <article className="border-b border-white/10 py-3 last:border-b-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/50">{message.author}</p>
            <p className="text-[0.62rem] uppercase tracking-[0.14em] text-white/35">
              {new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </p>
          </div>
          <p className="mt-2 text-sm leading-6 text-white/88">{message.body}</p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setReplyingTo(message)
                requestAnimationFrame(() => composerRef.current?.focus())
              }}
              className="px-1 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/55 transition hover:text-white"
            >
              reply
            </button>
            <button
              type="button"
              onClick={() => voteMessage(message.id, 'like')}
              aria-label="Like"
              className={`px-2 py-1 transition hover:text-white ${message.userVote === 'like' ? 'text-white' : 'text-white/55'}`}
            >
              <ThumbIcon filled={message.userVote === 'like'} direction="up" />
            </button>
            <button
              type="button"
              onClick={() => voteMessage(message.id, 'dislike')}
              aria-label="Dislike"
              className={`px-2 py-1 transition hover:text-white ${message.userVote === 'dislike' ? 'text-white' : 'text-white/55'}`}
            >
              <ThumbIcon filled={message.userVote === 'dislike'} direction="down" />
            </button>
          </div>
        </article>
        {replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {replies.map((reply) => renderMessageThread(reply, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const chatPanel = (embedded = false) => (
    <div className={embedded ? 'flex h-[30rem] max-h-[70dvh] min-h-[24rem] flex-col overflow-hidden' : 'contents'}>
      <div className={embedded ? 'border-b border-white/10 pb-4' : 'relative border-b border-white/10 p-4 sm:p-5'}>
        {embedded ? (
          <div className="flex min-w-0 items-center gap-3">
            <h2 className="max-w-[calc(100%-7rem)] truncate whitespace-nowrap text-xl font-black uppercase tracking-[0.1em] sm:text-2xl sm:tracking-[0.18em]">{visibleRoom.title}</h2>
            <button
              type="button"
              onClick={toggleSavedRoom}
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition sm:px-4 sm:tracking-[0.18em] ${savedCurrentRoom ? 'bg-white text-slate-950' : 'border border-white/15 text-white hover:bg-white/10'}`}
            >
              join chat
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/75 transition hover:bg-white/10 sm:right-5 sm:top-5"
            >
              close
            </button>
            <div className="pr-24 sm:pr-28">
              <div className="flex min-w-0 items-center">
                <button
                  type="button"
                  onClick={toggleSavedRoom}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition sm:px-4 sm:tracking-[0.18em] ${savedCurrentRoom ? 'bg-white text-slate-950' : 'border border-white/15 text-white hover:bg-white/10'}`}
                >
                  {savedCurrentRoom ? 'joined' : 'join chat'}
                </button>
              </div>
              <h2 className="mt-2 min-w-0 truncate whitespace-nowrap text-xl font-black uppercase tracking-[0.1em] sm:text-2xl sm:tracking-[0.18em]">{visibleRoom.title}</h2>
            </div>
          </>
        )}

        {!embedded && (
          renderTabSwitcher()
        )}
      </div>

      <div className={embedded ? 'min-h-0 flex-1 space-y-1 overflow-y-auto py-3 pr-1' : 'min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-5'}>
        {!embedded && activeTab === 'saved' ? (
          savedRooms.length === 0 ? (
            <div className="flex min-h-40 items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/5 p-5 text-center text-sm leading-6 text-white/60">
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
          )
        ) : topLevelMessages.length === 0 ? (
          <div className="flex min-h-40 items-center justify-center px-4 py-6 text-center text-sm leading-6 text-white/60">
            No chat yet. Start the room.
          </div>
        ) : (
          topLevelMessages.map((message) => renderMessageThread(message))
        )}
      </div>

      {(embedded || activeTab === 'current') && (
      <div className={embedded ? 'mt-auto border-t border-white/10 pt-4' : 'border-t border-white/10 p-4 sm:p-5'}>
        {replyingTo && (
          <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60">
            <span className="min-w-0 truncate">Replying to {replyingTo.author}: {replyingTo.body}</span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="shrink-0 font-black uppercase tracking-[0.12em] text-white/70 hover:text-white"
            >
              clear
            </button>
          </div>
        )}
        {embedded && isMobileChat ? (
          <button
            type="button"
            onClick={() => openDrawerForRoom(currentRoom)}
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950"
          >
            chat
          </button>
        ) : (
          <div className="flex gap-3">
            <input
              ref={composerRef}
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') addMessage()
              }}
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none placeholder:text-white/45 sm:text-sm"
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
        )}
      </div>
      )}
    </div>
  )

  if (variant === 'embedded') {
    return (
      <>
        {chatPanel(true)}
        {isMobileChat && (
          <ChatDrawerShell open={open}>
            {chatPanel(false)}
          </ChatDrawerShell>
        )}
      </>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          openDrawerForRoom(currentRoom, variant === 'global' ? 'saved' : 'current')
        }}
        className={`${open ? 'pointer-events-none scale-90 opacity-0' : 'scale-100 opacity-100'} ${variant === 'global'
          ? 'fixed bottom-3 right-3 z-40 inline-flex items-center justify-center rounded-full border border-black/10 bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_15px_40px_rgba(15,23,42,0.22)] transition-all duration-200 hover:bg-black sm:bottom-4 sm:right-4 sm:px-5 sm:py-4 sm:tracking-[0.2em]'
          : variant === 'post'
            ? 'inline-flex items-center justify-center rounded-full border border-black/10 bg-slate-100 px-5 py-3 text-sm uppercase tracking-[0.2em] text-black transition-all duration-200 hover:bg-slate-200'
          : 'inline-flex w-full items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 px-2 py-2.5 text-[0.6rem] uppercase tracking-[0.05em] text-white transition-all duration-200 hover:bg-white/20 sm:w-auto sm:px-4 sm:py-3 sm:text-xs sm:tracking-[0.2em]'}`}
      >
        <span className="block truncate whitespace-nowrap">{label || (variant === 'global' ? 'chats' : 'join chat')}</span>
        {totalUnreadCount > 0 && (
          <span className="ml-3 rounded-full bg-white px-2 py-1 text-xs text-slate-950">{totalUnreadCount}</span>
        )}
      </button>

      <ChatDrawerShell open={open}>
        {chatPanel(false)}
      </ChatDrawerShell>
    </>
  )
}

function ChatDrawerShell({ children, open }: { children: ReactNode; open: boolean }) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <aside
      className={`fixed left-3 right-3 bottom-3 z-[100] mx-auto flex h-[min(34rem,calc(100dvh-1.5rem))] max-w-[calc(100vw-1.5rem)] origin-bottom flex-col overflow-hidden rounded-[1.25rem] border border-black/10 bg-slate-950 text-white shadow-[0_25px_80px_rgba(0,0,0,0.28)] transition-all duration-300 ease-out sm:left-auto sm:right-6 sm:bottom-6 sm:mx-0 sm:h-[min(38rem,calc(100dvh-3rem))] sm:w-[min(24rem,calc(100vw-3rem))] sm:origin-bottom-right sm:rounded-[1.5rem] ${open ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-8 scale-95 opacity-0'}`}
    >
      {children}
    </aside>,
    document.body
  )
}
