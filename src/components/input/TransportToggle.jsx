import { useTripStore } from '../../store/tripStore.js'
import Toggle from '../common/Toggle.jsx'
import { TRANSPORT_MODES } from '../../constants/themeOptions.js'

export default function TransportToggle() {
  const transport = useTripStore((s) => s.input.transport)
  const setInput = useTripStore((s) => s.setInput)

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">이동수단</p>
      <Toggle options={TRANSPORT_MODES} value={transport} onChange={(key) => setInput({ transport: key })} />
    </div>
  )
}
