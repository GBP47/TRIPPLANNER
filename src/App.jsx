import { useTripStore } from './store/tripStore.js'
import TripInputForm from './components/input/TripInputForm.jsx'
import ResultLayout from './components/result/ResultLayout.jsx'

export default function App() {
  const screen = useTripStore((s) => s.screen)
  return screen === 'result' ? <ResultLayout /> : <TripInputForm />
}
