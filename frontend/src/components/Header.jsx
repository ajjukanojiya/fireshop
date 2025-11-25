import { Link } from "react-router-dom";

export default function Header(){
  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-slate-900">FireShop</Link>

        <div className="flex-1 mx-6">
          <div className="relative">
            <input placeholder="Search fireworks, videos, packs..." className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"/>
            <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-teal-500 text-white px-3 py-1 rounded-md">Search</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-slate-700">Sign in</Link>
          <Link to="/guest-checkout" className="bg-slate-900 text-white px-3 py-2 rounded-md">Cart <span className="ml-2 bg-white text-slate-900 px-2 py-0.5 rounded-full">0</span></Link>
        </div>
      </div>
    </header>
  )
}
