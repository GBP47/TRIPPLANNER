export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      <span className="text-sm">{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 text-sm font-medium text-red-700 underline hover:text-red-800"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}
