import { useTripStore } from '../../store/tripStore.js'

export default function DayTabs() {
  const itinerary = useTripStore((s) => s.itinerary)
  const selectedDay = useTripStore((s) => s.selectedDay)
  const setSelectedDay = useTripStore((s) => s.setSelectedDay)

  if (!itinerary) return null

  return (
    <div className="mb-4 flex flex-wrap gap-1.5 rounded-full bg-teal-50/70 p-1.5">
      {itinerary.days.map((day) => (
        <button
          key={day.day}
          type="button"
          onClick={() => setSelectedDay(day.day)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            selectedDay === day.day
              ? 'bg-white text-teal-700 shadow-sm shadow-teal-900/10'
              : 'text-gray-500 hover:text-teal-700'
          }`}
        >
          Day {day.day}
        </button>
      ))}
    </div>
  )
}
