export default function LoadingOverlay({ message }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/85 backdrop-blur-sm">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-100 border-t-coral-500" />
      <p className="font-medium text-gray-700">{message}</p>
    </div>
  )
}
