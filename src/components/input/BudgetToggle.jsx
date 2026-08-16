import { useTripStore } from '../../store/tripStore.js'
import Toggle from '../common/Toggle.jsx'
import { BUDGET_LEVELS } from '../../constants/themeOptions.js'

export default function BudgetToggle() {
  const budget = useTripStore((s) => s.input.budget)
  const setInput = useTripStore((s) => s.setInput)

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">예산</p>
      <Toggle options={BUDGET_LEVELS} value={budget} onChange={(key) => setInput({ budget: key })} />
    </div>
  )
}
