import { useTripStore } from '../../store/tripStore.js'
import { estimateTotalBudget, formatKrw } from '../../lib/budgetEstimator.js'

export default function BudgetSummary() {
  const itinerary = useTripStore((s) => s.itinerary)
  if (!itinerary) return null

  const total = estimateTotalBudget(itinerary.days)

  return (
    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-teal-500 to-coral-500 px-5 py-4 shadow-lg shadow-teal-900/15">
      <span className="text-sm font-medium text-white/90">총 예상 예산 (1인 기준)</span>
      <span className="text-xl font-bold text-white">{formatKrw(total)}</span>
    </div>
  )
}
