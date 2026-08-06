import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import traderService from "../../../services/traderService";
import { FiPlusCircle, FiEdit2, FiTrash2, FiPackage, FiAlertCircle, FiSearch, FiX } from "react-icons/fi";
import { toAbsolute } from "../../../utils/imageUrl";

const TraderProducts = () => {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback((q = "") => {
    setLoading(true);
    traderService.getProducts(q)
      .then((res) => {
        const raw = res.data;
        const list = raw?.results || (Array.isArray(raw) ? raw : []);
        setProducts(list);
        setTotalCount(raw?.count ?? list.length);
      })
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    load(search);
  };

  const clearSearch = () => {
    setSearch("");
    setQuery("");
    load("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      await traderService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setTotalCount((prev) => (prev !== null ? prev - 1 : null));
    } catch {
      setError("Failed to delete product.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Products</h1>
          {!loading && totalCount !== null && (
            <p className="text-sm text-gray-500 mt-0.5">{totalCount} product{totalCount !== 1 ? "s" : ""} total</p>
          )}
        </div>
        <Link to="/trader/dashboard/add-product" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
          <FiPlusCircle /> Add Product
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, category..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
          {search && (
            <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FiX size={14} />
            </button>
          )}
        </div>
        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
          Search
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          <FiAlertCircle /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FiPackage className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">{query ? `No products found for "${query}"` : "No products yet."}</p>
          {!query && (
            <Link to="/trader/dashboard/add-product" className="inline-flex items-center gap-2 mt-4 bg-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
              <FiPlusCircle /> Add your first product
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 text-xs text-gray-500">
            {totalCount ?? products.length} product{(totalCount ?? products.length) !== 1 ? "s" : ""}{query ? ` matching "${query}"` : " total"}
          </div>
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
                        {p.primary_image && <img src={toAbsolute(p.primary_image)} alt={p.name} className="w-full h-full object-cover" />}
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
