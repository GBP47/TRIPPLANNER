import { useTripStore } from '../../store/tripStore.js'
import Toggle from '../common/Toggle.jsx'
import { COMPANION_TYPES } from '../../constants/themeOptions.js'

export default function CompanionSelect() {
  const companion = useTripStore((s) => s.input.companion)
  const setInput = useTripStore((s) => s.setInput)

  return <Toggle options={COMPANION_TYPES} value={companion} onChange={(key) => setInput({ companion: key })} />
}
