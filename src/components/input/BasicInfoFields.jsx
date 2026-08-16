import { useTripStore } from '../../store/tripStore.js'

export default function BasicInfoFields() {
  const { city, days, startDate } = useTripStore((s) => s.input)
  const setInput = useTripStore((s) => s.setInput)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
        도시
        <input
          type="text"
          value={city}
          onChange={(e) => setInput({ city: e.target.value })}
          placeholder="예: 도쿄, 서울, 방콕"
          className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/40"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
        여행 일수
        <select
          value={days}
          onChange={(e) => setInput({ days: Number(e.target.value) })}
          className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/40"
        >
          {[1, 2, 3, 4, 5].map((d) => (
            <option key={d} value={d}>
              {d}일
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
        시작일
        <input
          type="date"
          value={startDate}
          onChange={(e) => setInput({ startDate: e.target.value })}
          className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/40"
        />
      </label>
    </div>
  )
}
