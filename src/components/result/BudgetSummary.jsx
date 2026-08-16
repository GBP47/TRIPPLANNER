import { useTripStore } from '../../store/tripStore.js'
import { estimateTotalBudget, formatKrw } from '../../lib/budgetEstimator.js'

export default function BudgetSummary() {
  const itinerary = useTripStore((s) => s.itinerary)
  if (!itinerary) return null

  const total = estimateTotalBudget(itinerary.days)

  return (
    <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
      <span className="text-sm text-indigo-700">총 예상 예산 (1인 기준)</span>
      <span className="text-lg font-semibold text-indigo-900">{formatKrw(total)}</span>
    </div>
  )
}
