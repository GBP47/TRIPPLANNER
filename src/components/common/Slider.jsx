export default function Slider({ label, leftLabel, rightLabel, value, onChange }) {
  return (
    <div className="mb-5">
      <div className="mb-1.5 flex justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-teal-500"
      />
      {(leftLabel || rightLabel) && (
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  )
}
