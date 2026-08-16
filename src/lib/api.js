async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.error || `요청 실패 (${res.status})`
    throw new Error(message)
  }

  return data
}

export function generateItinerary(input) {
  return postJson('/api/generate-itinerary', { mode: 'generate', input })
}

export function generateReplacement({ input, targetPlace, excludeNames }) {
  return postJson('/api/generate-itinerary', {
    mode: 'replace',
    input,
    targetPlace,
    excludeNames,
  })
}

export function geocodePlace(query) {
  return postJson('/api/geocode', { query })
}

export function getRoute(coordinates, profile) {
  return postJson('/api/route', { coordinates, profile })
}
