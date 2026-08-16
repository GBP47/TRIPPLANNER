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
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
              {index + 1}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{place.name}</h3>
              <p className="mt-0.5 text-sm text-gray-500">{place.description}</p>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                <span>체류 {formatMinutes(place.durationMinutes)}</span>
                <span>예상 {formatKrw(place.estimatedCost)}</span>
                {place.geocodeStatus === 'pending' && <span className="text-indigo-500">위치 확인 중...</span>}
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
            className="shrink-0 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? '교체 중...' : '이 장소 교체'}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>

      {!isLast && (
        <div className="flex items-center gap-2 py-2 pl-9 text-xs text-gray-400">
          <span>↓</span>
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
