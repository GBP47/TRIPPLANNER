import { useEffect, useRef } from 'react'
import { useTripStore } from '../store/tripStore.js'
import { geocodePlace } from '../lib/api.js'
import { getCachedCoords, setCachedCoords } from '../lib/geocodeCache.js'

const REQUEST_INTERVAL_MS = 1000

export function useGeocoding() {
  const itinerary = useTripStore((s) => s.itinerary)
  const city = useTripStore((s) => s.input.city)
  const updatePlaceGeocode = useTripStore((s) => s.updatePlaceGeocode)
  const setLoading = useTripStore((s) => s.setLoading)
  const runIdRef = useRef(0)

  // Place ids only change on a fresh itinerary or a replaced place, never on a
  // geocode result write-back — keying the effect on this (not on `itinerary`
  // itself) stops each write-back from restarting the paced request loop.
  const idsKey = itinerary ? itinerary.days.flatMap((d) => d.places.map((p) => p.id)).join('|') : ''

  useEffect(() => {
    if (!itinerary) return

    const targets = []
    itinerary.days.forEach((day) => {
      day.places.forEach((place, index) => {
        if (place.geocodeStatus === 'pending') {
          targets.push({ day: day.day, index, nameLocal: place.name_local })
        }
      })
    })

    if (targets.length === 0) return

    const runId = ++runIdRef.current
    let cancelled = false

    const run = async () => {
      let done = 0
      setLoading({ geocoding: { done, total: targets.length } })

      for (let i = 0; i < targets.length; i += 1) {
        if (cancelled || runIdRef.current !== runId) return
        const target = targets[i]

        const cached = getCachedCoords(target.nameLocal, city)
        if (cached) {
          updatePlaceGeocode(target.day, target.index, cached.found ? { lat: cached.lat, lon: cached.lon } : null)
          done += 1
          setLoading({ geocoding: { done, total: targets.length } })
          continue
        }

        try {
          const result = await geocodePlace(`${target.nameLocal}, ${city}`)
          setCachedCoords(target.nameLocal, city, result)
          if (!cancelled && runIdRef.current === runId) {
            updatePlaceGeocode(target.day, target.index, result.found ? { lat: result.lat, lon: result.lon } : null)
          }
        } catch {
          if (!cancelled && runIdRef.current === runId) {
            updatePlaceGeocode(target.day, target.index, null)
          }
        }

        done += 1
        setLoading({ geocoding: { done, total: targets.length } })

        if (i < targets.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL_MS))
        }
      }

      if (!cancelled && runIdRef.current === runId) {
        setLoading({ geocoding: null })
      }
    }

    run()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, city, updatePlaceGeocode, setLoading])
}
