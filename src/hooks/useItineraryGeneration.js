import { useTripStore } from '../store/tripStore.js'
import { generateItinerary } from '../lib/api.js'
import { trackEvent } from '../lib/analytics.js'

export function useItineraryGeneration() {
  const setLoading = useTripStore((s) => s.setLoading)
  const setError = useTripStore((s) => s.setError)
  const setItinerary = useTripStore((s) => s.setItinerary)
  const setScreen = useTripStore((s) => s.setScreen)

  const generate = async () => {
    const input = useTripStore.getState().input
    setError(null)
    setLoading({ generating: true })

    try {
      const data = await generateItinerary(input)
      setItinerary(data.days)
      setScreen('result')
      trackEvent('generate_itinerary', { city: input.city, days: input.days })
    } catch (err) {
      setError(err.message || '일정을 생성하지 못했습니다. 다시 시도해주세요.')
    } finally {
      setLoading({ generating: false })
    }
  }

  return { generate }
}
