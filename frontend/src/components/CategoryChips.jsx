export default function CategoryChips({ categories = [], selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 md:flex-col md:overflow-visible no-scrollbar">
      <button
        onClick={() => onSelect(null)}
        className={`whitespace-nowrap px-4 py-2 rounded-lg border text-sm font-medium transition-all text-left ${!selected ? 'bg-red-600 text-white border-red-600 shadow-md transform scale-105' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
      >
        All Products
      </button>
      {categories.map(c => (
        <button key={c} onClick={() => onSelect(c)} className={`whitespace-nowrap px-4 py-2 rounded-lg border text-sm font-medium transition-all text-left ${selected === c ? 'bg-red-600 text-white border-red-600 shadow-md transform scale-105' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
          {c}
        </button>
      ))}
    </div>
  )
}
