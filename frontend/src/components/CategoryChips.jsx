export default function CategoryChips({ categories = [], selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap no-scrollbar scroll-smooth">
      <button
        onClick={() => onSelect(null)}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${!selected ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
      >
        All Products
      </button>
      {categories.map(c => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${selected === c.id ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
        >
          {c.name}
        </button>
      ))}
    </div>
  )
}
