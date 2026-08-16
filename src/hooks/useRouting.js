import { useEffect, useRef } from 'react'
import { useTripStore } from '../store/tripStore.js'
import { getRoute } from '../lib/api.js'
import { getOrsProfile } from '../lib/orsProfiles.js'

export function useRouting() {
  const itinerary = useTripStore((s) => s.itinerary)
  const transport = useTripStore((s) => s.input.transport)
  const setRoute = useTripStore((s) => s.setRoute)
  const requestedRef = useRef({})

  useEffect(() => {
    if (!itinerary) return

    const profile = getOrsProfile(transport)

    itinerary.days.forEach((day) => {
      const allSettled = day.places.every((p) => p.geocodeStatus !== 'pending')
      if (!allSettled) return

      const coords = day.places.filter((p) => p.coords).map((p) => [p.coords.lat, p.coords.lon])
      const signature = `${profile}:${coords.map((c) => c.join(',')).join('|')}`

      if (requestedRef.current[day.day] === signature) return
      requestedRef.current[day.day] = signature

      if (coords.length < 2) {
        setRoute(day.day, { geometry: [], segmentDurations: [] })
        return
      }

      getRoute(coords, profile)
        .then((route) => setRoute(day.day, route))
        .catch(() => setRoute(day.day, { geometry: [], segmentDurations: [], error: true }))
    })
  }, [itinerary, transport, setRoute])
}
