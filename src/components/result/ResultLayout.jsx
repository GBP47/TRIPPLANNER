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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">여행 일정 결과</h1>
          {geocoding && (
            <p className="mt-0.5 text-xs text-gray-400">
              위치 확인 중... ({geocoding.done}/{geocoding.total})
            </p>
          )}
        </div>
        <button type="button" onClick={reset} className="text-sm text-gray-500 hover:text-gray-700">
          새 일정 만들기
        </button>
      </header>

      <div ref={captureRef} className="flex flex-1 flex-col bg-gray-50">
        <div className="px-4 pt-4 sm:px-6">
          <BudgetSummary />
        </div>

        <div className="grid min-h-[600px] flex-1 grid-cols-1 gap-4 p-4 sm:p-6 lg:grid-cols-2">
          <div className="max-h-[75vh] overflow-y-auto pr-1">
            <DayTabs />
            <PlaceList />
          </div>
          <div className="h-[50vh] overflow-hidden rounded-xl border border-gray-200 lg:h-auto">
            <TripMap />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md px-4 pb-6 sm:px-6">
        <SaveImageButton targetRef={captureRef} />
      </div>
    </div>
  )
}
