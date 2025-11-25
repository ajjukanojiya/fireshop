export default function CategoryChips({categories = [], selected, onSelect}){
    return (
      <div className="flex gap-3 overflow-x-auto py-4 px-4">
        {categories.map(c => (
          <button key={c} onClick={()=>onSelect(c)} className={`whitespace-nowrap px-4 py-2 rounded-full border ${selected===c ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-slate-700'}`}>
            {c}
          </button>
        ))}
      </div>
    )
  }
  