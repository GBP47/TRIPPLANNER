import { useState } from 'react'
import { useTripStore } from '../store/tripStore.js'
import { generateReplacement } from '../lib/api.js'
import { trackEvent } from '../lib/analytics.js'

export function usePlaceReplacement(day, index) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const replace = async () => {
    const state = useTripStore.getState()
    const dayData = state.itinerary?.days.find((d) => d.day === day)
    const targetPlace = dayData?.places[index]
    if (!targetPlace) return

    setLoading(true)
    setError(null)

    // Exclude every place already in the trip, not just this one, so Claude
    // never re-suggests a spot used on a different day.
    const excludeNames = state.getAllPlaceNames()

    try {
      const newPlace = await generateReplacement({ input: state.input, targetPlace, excludeNames })
      state.replacePlace(day, index, newPlace)
      trackEvent('replace_place', { day })
    } catch (err) {
      setError(err.message || '장소를 교체하지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return { replace, loading, error }
}
