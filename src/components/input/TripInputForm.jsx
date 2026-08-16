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
    <div className="flex min-h-screen items-start justify-center bg-gray-50 px-4 py-10">
      {generating && <LoadingOverlay message="AI가 여행 일정을 만들고 있어요..." />}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <h1 className="mb-1 text-2xl font-semibold text-gray-900">여행 일정 생성기</h1>
          <p className="text-sm text-gray-500">취향을 알려주시면 AI가 맞춤 일정을 만들어드려요.</p>
        </div>

        {error && <ErrorBanner message={error} onRetry={generate} />}

        <BasicInfoFields />

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">여행 스타일</h2>
          <PreferenceSliders />
        </section>

        <section className="flex flex-wrap gap-8">
          <BudgetToggle />
          <TransportToggle />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">테마 비중</h2>
          <ThemeSliders />
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-900">동행</h2>
          <CompanionSelect />
        </section>

        <button
          type="submit"
          disabled={!canSubmit || generating}
          className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {generating ? '생성 중...' : '일정 만들기'}
        </button>
      </form>
    </div>
  )
}
