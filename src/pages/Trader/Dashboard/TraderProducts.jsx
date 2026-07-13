import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import traderService from "../../../services/traderService";
import { FiPlusCircle, FiEdit2, FiTrash2, FiPackage, FiAlertCircle } from "react-icons/fi";

const TraderProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    traderService.getProducts()
      .then((res) => setProducts(res.data?.results || res.data || []))
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      await traderService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Failed to delete product.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">My Products</h1>
        <Link to="/trader/dashboard/add-product" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
          <FiPlusCircle /> Add Product
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          <FiAlertCircle /> {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FiPackage className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No products yet.</p>
          <Link to="/trader/dashboard/add-product" className="inline-flex items-center gap-2 mt-4 bg-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
            <FiPlusCircle /> Add your first product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Price</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Stock</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {p.primary_image && <img src={p.primary_image} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                      <span className="font-semibold text-gray-800 line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-gray-700 font-medium">
                    UGX {Number(p.price).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-600">{p.stock ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {p.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link to={`/trader/dashboard/products/${p.id}/edit`} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <FiEdit2 />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TraderProducts;
