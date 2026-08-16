import { useTripStore } from '../../store/tripStore.js'
import Slider from '../common/Slider.jsx'

export default function PreferenceSliders() {
  const { density, touristVsLocal } = useTripStore((s) => s.input)
  const setInput = useTripStore((s) => s.setInput)

  return (
    <div>
      <Slider
        label="일정 밀도"
        leftLabel="여유"
        rightLabel="빡빡"
        value={density}
        onChange={(v) => setInput({ density: v })}
      />
      <Slider
        label="관광지 vs 로컬"
        leftLabel="관광지"
        rightLabel="로컬"
        value={touristVsLocal}
        onChange={(v) => setInput({ touristVsLocal: v })}
      />
    </div>
  )
}
