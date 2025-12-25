export default function CategoryChips({ categories = [], selected, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 md:pb-2 md:flex-wrap no-scrollbar scroll-smooth px-1">
      <button
        onClick={() => onSelect(null)}
        className={`whitespace-nowrap px-6 py-2.5 rounded-full border text-sm font-black transition-all duration-300 ${!selected ? 'bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] text-white border-transparent shadow-xl shadow-red-900/20 transform scale-105' : 'bg-white text-slate-500 border-slate-100 hover:border-[#991b1b]/30 hover:text-[#991b1b] shadow-sm'}`}
      >
        All Products
      </button>
      {categories.map(c => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`whitespace-nowrap px-6 py-2.5 rounded-full border text-sm font-black transition-all duration-300 ${selected === c ? 'bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] text-white border-transparent shadow-xl shadow-red-900/20 transform scale-105' : 'bg-white text-slate-500 border-slate-100 hover:border-[#991b1b]/30 hover:text-[#991b1b] shadow-sm'}`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
