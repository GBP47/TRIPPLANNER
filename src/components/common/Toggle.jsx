export default function Toggle({ options, value, onChange }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-full border border-gray-200 bg-gray-50 p-1">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            value === opt.key
              ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/30'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
