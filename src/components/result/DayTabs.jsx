import { useTripStore } from '../../store/tripStore.js'

export default function DayTabs() {
  const itinerary = useTripStore((s) => s.itinerary)
  const selectedDay = useTripStore((s) => s.selectedDay)
  const setSelectedDay = useTripStore((s) => s.setSelectedDay)

  if (!itinerary) return null

  return (
    <div className="mb-4 flex gap-2 border-b border-gray-200">
      {itinerary.days.map((day) => (
        <button
          key={day.day}
          type="button"
          onClick={() => setSelectedDay(day.day)}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
            selectedDay === day.day
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Day {day.day}
        </button>
      ))}
    </div>
  )
}
