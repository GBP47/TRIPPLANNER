import { useTripStore } from '../../store/tripStore.js'
import Slider from '../common/Slider.jsx'
import { THEME_KEYS } from '../../constants/themeOptions.js'

export default function ThemeSliders() {
  const themes = useTripStore((s) => s.input.themes)
  const setTheme = useTripStore((s) => s.setTheme)

  return (
    <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
      {THEME_KEYS.map(({ key, label }) => (
        <Slider key={key} label={label} value={themes[key]} onChange={(v) => setTheme(key, v)} />
      ))}
    </div>
  )
}
