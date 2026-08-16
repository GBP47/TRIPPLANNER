import { useTripStore } from '../../store/tripStore.js'
import PlaceCard from './PlaceCard.jsx'

function buildDurationMap(day, route) {
  if (!route?.segmentDurations?.length) return {}

  const geocodedIndices = day.places.map((p, i) => (p.coords ? i : null)).filter((i) => i !== null)

  const map = {}
  route.segmentDurations.forEach((duration, k) => {
    const fromIndex = geocodedIndices[k]
    if (fromIndex !== undefined) map[fromIndex] = duration
  })
  return map
}

export default function PlaceList() {
  const itinerary = useTripStore((s) => s.itinerary)
  const selectedDay = useTripStore((s) => s.selectedDay)
  const route = useTripStore((s) => s.routes[selectedDay])

  const day = itinerary?.days.find((d) => d.day === selectedDay)
  if (!day) return null

  const durationMap = buildDurationMap(day, route)

  return (
    <div className="space-y-1">
      {day.places.map((place, index) => (
        <PlaceCard
          key={place.id}
          day={selectedDay}
          index={index}
          place={place}
          isLast={index === day.places.length - 1}
          travelTimeSeconds={durationMap[index] ?? null}
          routeReady={!!route}
        />
      ))}
    </div>
  )
}
