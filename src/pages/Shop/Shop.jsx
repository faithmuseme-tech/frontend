import React, { useEffect, useState } from "react";
import api from "../../services/api";
import ProductCard from "../../components/ProductCard/ProductCard";
import { FiPackage } from "react-icons/fi";

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://127.0.0.1:8000';
const toAbsolute = (url) => (!url ? '' : url.startsWith('http') ? url : `${API_BASE}${url}`);

const normalize = (p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  brand: p.brand_name || "",
  category: p.category_name || "",
  price: parseFloat(p.price),
  originalPrice: p.original_price ? parseFloat(p.original_price) : null,
  deliveryCharge: p.delivery_charge !== undefined ? parseFloat(p.delivery_charge) : 0,
  discount: p.discount || 0,
  image: toAbsolute(p.primary_image),
  inStock: p.in_stock,
  badge: p.badge || "",
  rating: p.avg_rating || 0,
  reviews: p.review_count || 0,
});

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get("/products/")
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : (r.data.results ?? []);
        setProducts(list.map(normalize));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="section-title mb-8">All Products</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <FiPackage className="text-5xl mx-auto mb-3 opacity-20" />
          <p className="font-medium text-gray-500">No products available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
