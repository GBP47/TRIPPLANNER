const STORAGE_KEY = 'trip-planner:geocode-cache:v1'

function loadStore() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveStore(store) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // storage full or unavailable — cache is best-effort, ignore
  }
}

export function normalizeKey(placeName, city) {
  return `${placeName.trim().toLowerCase()}|${city.trim().toLowerCase()}`
}

export function getCachedCoords(placeName, city) {
  const store = loadStore()
  return store[normalizeKey(placeName, city)] ?? null
}

export function setCachedCoords(placeName, city, coords) {
  const store = loadStore()
  store[normalizeKey(placeName, city)] = coords
  saveStore(store)
}
