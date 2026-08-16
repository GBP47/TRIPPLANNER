export default function Toggle({ options, value, onChange }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`px-3 py-1.5 text-sm rounded-md transition ${
            value === opt.key ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
