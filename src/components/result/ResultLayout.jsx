import { useRef } from 'react'
import { useTripStore } from '../../store/tripStore.js'
import { useGeocoding } from '../../hooks/useGeocoding.js'
import { useRouting } from '../../hooks/useRouting.js'
import DayTabs from './DayTabs.jsx'
import PlaceList from './PlaceList.jsx'
import TripMap from './TripMap.jsx'
import BudgetSummary from './BudgetSummary.jsx'
import SaveImageButton from './SaveImageButton.jsx'

export default function ResultLayout() {
  useGeocoding()
  useRouting()

  const reset = useTripStore((s) => s.reset)
  const geocoding = useTripStore((s) => s.loading.geocoding)
  const captureRef = useRef(null)

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-teal-50 via-white to-coral-50">
      <header className="relative overflow-hidden border-b border-white bg-white/80 px-4 py-5 backdrop-blur-sm sm:px-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-coral-500" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900">✈️ 여행 일정 결과</h1>
            {geocoding && (
              <p className="mt-0.5 text-xs text-teal-600">
                위치 확인 중... ({geocoding.done}/{geocoding.total})
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={reset}
            className="shrink-0 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
          >
            새 일정 만들기
          </button>
        </div>
      </header>

      <div ref={captureRef} className="flex flex-1 flex-col">
        <div className="px-4 pt-5 sm:px-6">
          <BudgetSummary />
        </div>

        <div className="grid min-h-[600px] flex-1 grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-2 lg:items-start">
          <div className="max-h-[75vh] overflow-y-auto rounded-3xl border border-white bg-white/70 p-3 shadow-lg shadow-teal-900/5 backdrop-blur-sm sm:p-4">
            <DayTabs />
            <PlaceList />
          </div>
          <div className="h-[50vh] overflow-hidden rounded-3xl bg-gradient-to-br from-teal-400 to-coral-400 p-[3px] shadow-xl shadow-teal-900/10 lg:sticky lg:top-6 lg:h-[75vh]">
            <div className="h-full w-full overflow-hidden rounded-[22px]">
              <TripMap />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md px-4 pb-8 sm:px-6">
        <SaveImageButton targetRef={captureRef} />
      </div>
    </div>
  )
}
