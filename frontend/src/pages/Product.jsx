import React,{useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function Product(){
  const { id } = useParams();
  const [p,setP] = useState(null);
  useEffect(()=> {
    (async ()=> {
      try {
        const res = await api.get(`/products/${id}`);
        setP(res.data);
      } catch(e){ console.error(e); }
    })();
  },[id]);

  if(!p) return <div className="p-6">Loading...</div>;

  const videoUrl = p.videos?.length ? `http://127.0.0.1:8000/stream/${p.videos[0].url}` : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img src={p.thumbnail_url} alt={p.title} className="w-full h-96 object-cover rounded-lg" loading="lazy" />
          {videoUrl && (
            <div className="mt-4">
              <video controls className="w-full rounded-md" crossOrigin="anonymous">
                <source src={videoUrl} type="video/mp4" />
              </video>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{p.title}</h1>
          <p className="mt-2 text-lg text-emerald-600">₹ {p.price}</p>
          <p className="mt-4 text-slate-700">{p.description}</p>
          <button className="mt-6 bg-amber-500 text-white px-4 py-2 rounded-md">Buy Now</button>
        </div>
      </div>
    </div>
  );
}
