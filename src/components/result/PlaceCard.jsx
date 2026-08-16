import { usePlaceReplacement } from '../../hooks/usePlaceReplacement.js'
import { formatKrw } from '../../lib/budgetEstimator.js'

function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes}분`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}시간 ${m}분` : `${h}시간`
}

export default function PlaceCard({ day, index, place, isLast, travelTimeSeconds, routeReady }) {
  const { replace, loading, error } = usePlaceReplacement(day, index)

  return (
    <div>
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-gray-900/5 transition hover:shadow-md hover:shadow-teal-900/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-xs font-bold text-white shadow-sm shadow-teal-500/40">
              {index + 1}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{place.name}</h3>
              <p className="mt-0.5 text-sm text-gray-500">{place.description}</p>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                <span>체류 {formatMinutes(place.durationMinutes)}</span>
                <span>예상 {formatKrw(place.estimatedCost)}</span>
                {place.geocodeStatus === 'pending' && <span className="text-teal-500">위치 확인 중...</span>}
                {place.geocodeStatus === 'failed' && (
                  <span className="text-amber-600">지도에 표시할 수 없는 장소예요</span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={replace}
            disabled={loading}
            className="shrink-0 rounded-full border border-coral-200 px-2.5 py-1.5 text-xs font-medium text-coral-600 transition hover:bg-coral-50 disabled:opacity-50"
          >
            {loading ? '교체 중...' : '이 장소 교체'}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>

      {!isLast && (
        <div className="flex items-center gap-2 py-2 pl-[15px] text-xs text-gray-400">
          <span className="h-4 w-px border-l-2 border-dotted border-teal-300" />
          <span>
            {travelTimeSeconds != null
              ? `이동 ${formatMinutes(Math.round(travelTimeSeconds / 60))}`
              : routeReady
                ? '이동 정보 없음'
                : '이동시간 계산 중...'}
          </span>
        </div>
      )}
    </div>
  )
}
