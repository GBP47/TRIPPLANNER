import BasicInfoFields from './BasicInfoFields.jsx'
import PreferenceSliders from './PreferenceSliders.jsx'
import BudgetToggle from './BudgetToggle.jsx'
import TransportToggle from './TransportToggle.jsx'
import ThemeSliders from './ThemeSliders.jsx'
import CompanionSelect from './CompanionSelect.jsx'
import ErrorBanner from '../common/ErrorBanner.jsx'
import LoadingOverlay from '../common/LoadingOverlay.jsx'
import { useTripStore } from '../../store/tripStore.js'
import { useItineraryGeneration } from '../../hooks/useItineraryGeneration.js'

export default function TripInputForm() {
  const input = useTripStore((s) => s.input)
  const generating = useTripStore((s) => s.loading.generating)
  const error = useTripStore((s) => s.error)
  const { generate } = useItineraryGeneration()

  const canSubmit = input.city.trim().length > 0 && input.startDate

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit || generating) return
    generate()
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gradient-to-br from-teal-50 via-white to-coral-50 px-4 py-10 sm:py-16">
      {generating && <LoadingOverlay message="AI가 여행 일정을 만들고 있어요..." />}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-8 rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-teal-900/10 ring-1 ring-teal-900/5 backdrop-blur-sm sm:p-10"
      >
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
            ✈️ AI 여행 플래너
          </span>
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-gray-900">여행 일정 생성기</h1>
          <p className="text-sm text-gray-500">취향을 알려주시면 AI가 맞춤 일정을 만들어드려요.</p>
        </div>

        {error && <ErrorBanner message={error} onRetry={generate} />}

        <BasicInfoFields />

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            여행 스타일
          </h2>
          <PreferenceSliders />
        </section>

        <section className="flex flex-wrap gap-8">
          <BudgetToggle />
          <TransportToggle />
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <span className="h-1.5 w-1.5 rounded-full bg-coral-500" />
            테마 비중
          </h2>
          <ThemeSliders />
        </section>

        <section>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            동행
          </h2>
          <CompanionSelect />
        </section>

        <button
          type="submit"
          disabled={!canSubmit || generating}
          className="w-full rounded-full bg-gradient-to-r from-teal-500 to-coral-500 py-3.5 font-semibold text-white shadow-lg shadow-coral-500/25 transition hover:shadow-xl hover:shadow-coral-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {generating ? '생성 중...' : '일정 만들기'}
        </button>
      </form>
    </div>
  )
}
