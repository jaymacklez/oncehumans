import { categories, slugify } from '@/lib/content'

export type HumanProfileListing = {
  username: string
  displayName?: string
  category: string
  subcategory: string
  type: string
  profilePath: string
  updatedAt: string
}

export const humanProfileDirectoryStorageKey = 'once-humans-human-profile-directory'
export const humanProfileDirectoryChangedEvent = 'once-humans-human-profile-directory-changed'

export function normalizeHumanCategory(value: string) {
  if (!value || value === 'human' || value === 'Human') return 'Creators'
  return value
}

export function getHumanCategoryOptions() {
  return categories.humans.map((category) => category.title)
}

export function getHumanSubcategoryOptions(categoryTitle: string) {
  const normalizedCategory = normalizeHumanCategory(categoryTitle)
  return categories.humans.find((category) => category.title === normalizedCategory)?.subcategories.map((subcategory) => subcategory.title) || ['People']
}

export function getDefaultHumanSubcategory(categoryTitle: string) {
  return getHumanSubcategoryOptions(categoryTitle)[0] || 'People'
}

export function getHumanTypeLabel(type: string) {
  const labels: Record<string, string> = {
    Creators: 'Creator',
    Artists: 'Artist',
    Engineers: 'Engineer',
    Scientists: 'Scientist',
    Writers: 'Writer',
    Performers: 'Performer',
  }

  return labels[type] || type
}

export function getHumanSubcategoryLabel(subcategory: string) {
  const labels: Record<string, string> = {
    Inventors: 'Inventor',
    Makers: 'Maker',
    Visionaries: 'Visionary',
    Pioneers: 'Pioneer',
    Entrepreneurs: 'Entrepreneur',
    Explorers: 'Explorer',
    Reformers: 'Reformer',
    Painters: 'Painter',
    Sculptors: 'Sculptor',
    Designers: 'Designer',
    Photographers: 'Photographer',
    Architects: 'Architect',
    Illustrators: 'Illustrator',
    Machines: 'Machine Builder',
    Structures: 'Structure Builder',
    Playwrights: 'Playwright',
    Novelists: 'Novelist',
    Poets: 'Poet',
    Essayists: 'Essayist',
    Journalists: 'Journalist',
    Philosophers: 'Philosopher',
    Historians: 'Historian',
    Actors: 'Actor',
    Dancers: 'Dancer',
    Musicians: 'Musician',
    Directors: 'Director',
    Comedians: 'Comedian',
    Athletes: 'Athlete',
    Singers: 'Singer',
  }

  return labels[subcategory] || subcategory
}

export function readHumanProfileDirectory() {
  if (typeof window === 'undefined') return []

  try {
    return JSON.parse(localStorage.getItem(humanProfileDirectoryStorageKey) || '[]') as HumanProfileListing[]
  } catch {
    return []
  }
}

export function getStoredHumanProfile(username: string) {
  return readHumanProfileDirectory().find((profile) => profile.username === username)
}

export function isHumanUsernameAvailable(username: string) {
  const normalizedUsername = username.trim().toLowerCase()
  if (!normalizedUsername) return false

  return !readHumanProfileDirectory().some((profile) => profile.username.toLowerCase() === normalizedUsername)
}

export function getHumanProfilesForSubcategory(category: string, subcategory: string) {
  return readHumanProfileDirectory().filter((profile) => (
    profile.category === category &&
    profile.subcategory === subcategory
  ))
}

export function upsertHumanProfile(profile: Omit<HumanProfileListing, 'updatedAt' | 'profilePath'> & { profilePath?: string }) {
  if (typeof window === 'undefined') return

  const normalizedCategory = normalizeHumanCategory(profile.category)
  const normalizedSubcategory = profile.subcategory || getDefaultHumanSubcategory(normalizedCategory)
  const profilePath = profile.profilePath || `/humans/user/${profile.username}?type=${encodeURIComponent(profile.type)}`
  const nextProfile: HumanProfileListing = {
    ...profile,
    category: normalizedCategory,
    subcategory: normalizedSubcategory,
    profilePath,
    updatedAt: new Date().toISOString(),
  }
  const nextDirectory = [
    nextProfile,
    ...readHumanProfileDirectory().filter((existingProfile) => existingProfile.username !== profile.username),
  ]

  localStorage.setItem(humanProfileDirectoryStorageKey, JSON.stringify(nextDirectory))
  localStorage.setItem(`once-humans-profile-type:${profile.username}`, profile.type)
  if (profile.displayName) {
    localStorage.setItem(`once-humans-profile-name:${profile.username}`, profile.displayName)
  }
  localStorage.setItem(`once-humans-profile-category:${profile.username}`, normalizedCategory)
  localStorage.setItem(`once-humans-profile-subcategory:${profile.username}`, normalizedSubcategory)
  localStorage.setItem('once-humans-profile-path', profilePath)
  window.dispatchEvent(new Event(humanProfileDirectoryChangedEvent))
  window.dispatchEvent(new Event('once-humans-profile-changed'))
}

export function getHumanProfileSlug(username: string) {
  return slugify(username) || 'human'
}
