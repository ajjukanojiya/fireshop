// frontend/src/pages/Home.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/products");
        // API returns paginated object; products are in res.data.data
        const data = res.data?.data ?? res.data;
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading products...</div>;
  if (!products?.length) return <div style={{ padding: 20 }}>No products found.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", padding: 10 }}>
            <img
              src={p.thumbnail_url || "https://via.placeholder.com/300x180"}
              alt={p.title}
              style={{ width: "100%", height: 140, objectFit: "cover" }}
            />
            <h3 style={{ fontSize: 16, margin: "8px 0" }}>{p.title}</h3>
            <p style={{ margin: 0 }}>₹ {p.price}</p>
            <Link to={`/product/${p.id}`} style={{ display: "inline-block", marginTop: 8 }}>
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
