// frontend/src/pages/Product.jsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import ReactPlayer from "react-player";


export default function Test() {
  const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  return (
    <div style={{ maxWidth: 900 }}>
      <h3>Test public video</h3>
      <ReactPlayer url={videoUrl} controls width="100%" />
      <hr />
      <video controls width="640">
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
}

// export default function ProductPage() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const playerRef = useRef(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.get(`/products/${id}`);
//         // If your controller returns product directly: res.data
//         // If wrapped: res.data.data -> adapt accordingly
//         const p = res.data?.data ?? res.data;
//         setProduct(p);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
//   if (!product) return <div style={{ padding: 20 }}>Product not found</div>;

//   const videoUrl = product.video_url ?? (product.videos && product.videos[0]?.url);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>{product.title}</h2>
//       <div style={{ maxWidth: 900 }}>
//         {videoUrl ? (
//           <div style={{ position: "relative", paddingTop: "56.25%" }}>
//             <ReactPlayer
//               ref={playerRef}
//               url={videoUrl}
//               controls
//               width="100%"
//               height="100%"
//               style={{ position: "absolute", top: 0, left: 0 }}
//             />
//           </div>
//         ) : (
//           <img src={product.thumbnail_url || "https://via.placeholder.com/800x450"} alt={product.title} style={{ width: "100%" }} />
//         )}
//         <p style={{ marginTop: 10 }}>{product.description}</p>
//         <p>Price: ₹{product.price}</p>
//       </div>
//     </div>
//   );
// }
