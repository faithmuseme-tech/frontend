import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart, FiShoppingCart, FiArrowRight, FiArrowLeft,
  FiShare2, FiCheck, FiTruck, FiShield, FiRefreshCw,
  FiChevronLeft, FiChevronRight, FiStar, FiMinus, FiPlus,
  FiMapPin, FiClock, FiPackage,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import Rating from "../../components/Rating/Rating";
import ProductCard from "../../components/ProductCard/ProductCard";
import { formatUGX } from "../../utils/currency";
import api from "../../services/api";
import productService from "../../services/productService";

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://127.0.0.1:8000';
const toAbsolute = (url) => (!url ? '' : url.startsWith('http') ? url : `${API_BASE}${url}`);

const SHIPPING_TIERS = [
  { label: "Kampala", fee: 5000, days: "Same day", icon: <FiMapPin /> },
  { label: "Western Region", fee: 10000, days: "2–3 days", icon: <FiTruck /> },
  { label: "Northern Uganda", fee: 10000, days: "2–3 days", icon: <FiPackage /> },
];

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [copied, setCopied] = useState(false);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");

  // Load product
  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    setRelated([]);
    setReviews([]);
    window.scrollTo({ top: 0, behavior: "smooth" });

    api.get(`/products/${slug}/`)
      .then((res) => {
        const p = res.data;
        setProduct({
          id:            p.id,
          name:          p.name,
          slug:          p.slug,
          description:   p.description || "",
          price:         parseFloat(p.price),
          originalPrice: p.original_price ? parseFloat(p.original_price) : null,
          discount:      p.discount || 0,
          deliveryCharge: p.delivery_charge !== undefined ? parseFloat(p.delivery_charge) : 0,
          inStock:       p.in_stock,
          stock:         p.stock ?? 0,
          badge:         p.badge || "",
          rating:        p.avg_rating || 0,
          reviews:       p.review_count || 0,
          brand:         p.brand?.name ?? p.brand_name ?? "",
          brandSlug:     p.brand?.slug ?? "",
          category:      p.category?.name ?? p.category_name ?? "",
          images:        p.images?.length ? p.images.map(img => ({ ...img, image: toAbsolute(img.image) })) : [],
          specs:         p.specs || null,
        });
        return Promise.all([
          api.get(`/products/${p.slug}/related/`).catch(() => ({ data: [] })),
          productService.getReviews(p.id).catch(() => ({ data: [] })),
        ]);
      })
      .then(([relRes, revRes]) => {
        const relList = relRes.data?.results || relRes.data || [];
        setRelated(relList.map((p) => ({
          id:            p.id,
          name:          p.name,
          slug:          p.slug,
          brand:         p.brand_name || "",
          price:         parseFloat(p.price),
          originalPrice: p.original_price ? parseFloat(p.original_price) : null,
          discount:      p.discount || 0,
          deliveryCharge: p.delivery_charge !== undefined ? parseFloat(p.delivery_charge) : 0,
          image:         toAbsolute(p.primary_image),
          inStock:       p.in_stock,
          badge:         p.badge || "",
          rating:        p.avg_rating || 0,
          reviews:       p.review_count || 0,
        })));
        setReviews(revRes.data?.results || revRes.data || []);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  // Load reviews when tab opened (mock products use product.id)
  useEffect(() => {
    if (activeTab !== "reviews" || !product) return;
    productService.getReviews(product.id)
      .then((res) => setReviews(res.data?.results || res.data || []))
      .catch(() => {});
  }, [activeTab, product]);

  const handleAddToCart = () => {
    if (!product?.inStock && !product?.in_stock) return;
    addItem({ ...product, image: images[0] || "", qty });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product?.inStock && !product?.in_stock) return;
    addItem({ ...product, image: images[0] || "", qty });
    navigate("/cart");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await productService.addReview(product.id, reviewForm);
      setReviewMsg("✅ Review submitted!");
      setReviewForm({ rating: 5, title: "", body: "" });
      const res = await productService.getReviews(product.id);
      setReviews(res.data?.results || res.data || []);
    } catch {
      setReviewMsg("❌ Failed — please sign in first.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setReviewMsg(""), 3000);
    }
  };

  const inStock = product?.inStock ?? false;
  const stock = product?.stock ?? 0;
  const rating = product?.rating ?? 0;
  const reviewCount = product?.reviews ?? 0;
  const brandName = product?.brand ?? "";
  const brandSlug = product?.brandSlug ?? brandName.toLowerCase();
  const images = product?.images?.length
    ? product.images.map((img) => (typeof img === "string" ? img : img.image))
    : [];

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-10 animate-pulse">
          <div className="space-y-3">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl" />)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded w-1/2" />
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-gray-500 mt-2">This product doesn't exist or has been removed.</p>
        <Link to="/shop" className="btn-primary mt-6 flex items-center gap-2">
          <FiArrowLeft /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <FiChevronRight className="text-xs" />
          <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
          <FiChevronRight className="text-xs" />
          <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── Left: Image Gallery ─────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.badge && (
                  <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-accent-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((p) => (p - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow flex items-center justify-center text-gray-700 hover:bg-white transition opacity-0 group-hover:opacity-100"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    onClick={() => setActiveImg((p) => (p + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow flex items-center justify-center text-gray-700 hover:bg-white transition opacity-0 group-hover:opacity-100"
                  >
                    <FiChevronRight />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? "border-primary-500 shadow-md" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Info ─────────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Brand & name */}
            <div>
              <Link
                to={`/brands/${brandSlug}`}
                className="text-sm font-semibold text-primary-600 uppercase tracking-wider hover:text-primary-700"
              >
                {brandName}
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating & stock */}
            <div className="flex items-center gap-3">
              <Rating value={rating} count={reviewCount} size="md" />
              <span className="text-sm text-gray-500">|</span>
              <span className={`text-sm font-semibold ${inStock ? "text-green-600" : "text-red-500"}`}>
                {inStock ? `✓ In Stock (${stock} left)` : "✗ Out of Stock"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 py-3 border-y border-gray-100">
              <span className="text-3xl font-extrabold text-gray-900">{formatUGX(product.price)}</span>
              {product.deliveryCharge > 0 && (
                <span className="text-sm font-semibold text-blue-600">Delivery: {formatUGX(product.deliveryCharge)}</span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 line-through">{formatUGX(product.originalPrice)}</span>
                  <span className="text-xs text-green-600 font-semibold">
                    You save {formatUGX(product.originalPrice - product.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Short description */}
            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{product.description}</p>
            )}

            {/* ── Delivery & Shipping ──────────────────────────────────── */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
                <FiTruck className="text-base" /> Delivery & Shipping
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SHIPPING_TIERS.map((tier) => (
                  <div key={tier.label} className="bg-white rounded-xl p-3 text-center border border-blue-100">
                    <div className="text-blue-500 text-lg flex justify-center mb-1">{tier.icon}</div>
                    <p className="text-xs font-semibold text-gray-800">{tier.label}</p>
                    <p className="text-xs text-green-600 font-bold mt-0.5">
                      {tier.fee === 0 ? "Free" : formatUGX(tier.fee)}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-1 text-gray-400 text-xs">
                      <FiClock className="text-xs" /> {tier.days}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                🕐 Kampala orders placed before <span className="font-semibold text-gray-700">2:00 PM</span> are eligible for same-day dispatch.
              </p>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FiMinus />
                </button>
                <span className="w-12 text-center font-bold text-gray-900">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(stock || 99, q + 1))}
                  disabled={!inStock}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                >
                  <FiPlus />
                </button>
              </div>
              {stock > 0 && stock <= 5 && (
                <span className="text-xs text-accent-600 font-semibold animate-pulse">
                  Only {stock} left!
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  !inStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-primary-600 hover:bg-primary-700 text-white active:scale-95 shadow-md hover:shadow-lg"
                }`}
              >
                {addedToCart ? <FiCheck className="text-lg" /> : <FiShoppingCart className="text-lg" />}
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  !inStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-accent-500 hover:bg-accent-600 text-white active:scale-95 shadow-md hover:shadow-lg"
                }`}
              >
                <FiArrowRight className="text-lg" />
                Buy Now
              </button>

              <button
                onClick={() => toggle(product)}
                aria-label="Toggle wishlist"
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                  isWishlisted(product.id)
                    ? "border-red-400 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-400"
                }`}
              >
                {isWishlisted(product.id) ? <FaHeart className="text-lg" /> : <FiHeart className="text-lg" />}
              </button>

              <button
                onClick={handleShare}
                aria-label="Share product"
                className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-300 hover:text-primary-500 transition-all flex-shrink-0"
              >
                {copied ? <FiCheck className="text-green-500" /> : <FiShare2 />}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: <FiTruck />, label: "Free Delivery", sub: "Orders over UGX 200K" },
                { icon: <FiShield />, label: "Secure Payment", sub: "SSL Encrypted" },
                { icon: <FiRefreshCw />, label: "Easy Returns", sub: "30-day policy" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl gap-1">
                  <span className="text-primary-600 text-lg">{item.icon}</span>
                  <span className="text-xs font-semibold text-gray-800">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <div className="mt-14">
          <div className="flex gap-1 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {["description", "specs", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold capitalize whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab === "reviews" ? `Reviews (${reviews.length || reviewCount})` : tab}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {product.description || "No description available for this product."}
                </p>
              </motion.div>
            )}

            {activeTab === "specs" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
                {product.specs ? (
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                    {Object.entries(product.specs).map(([key, val], i) => (
                      <div key={key} className={`flex px-5 py-3.5 text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                        <span className="w-40 font-semibold text-gray-700 flex-shrink-0">{key}</span>
                        <span className="text-gray-600">{val}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No specifications available.</p>
                )}
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
                {/* Rating summary */}
                <div className="flex items-center gap-6 p-5 bg-primary-50 rounded-2xl">
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-primary-700">{rating}</div>
                    <Rating value={rating} size="md" />
                    <div className="text-xs text-gray-500 mt-1">{reviewCount.toLocaleString()} reviews</div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => r.rating === star).length;
                      const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-3 text-gray-600">{star}</span>
                          <FiStar className="text-yellow-400 text-xs" />
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-6 text-gray-400">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review list */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="border border-gray-100 rounded-2xl p-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-gray-800">{r.user_name || "Anonymous"}</span>
                          <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                        <Rating value={r.rating} size="sm" />
                        {r.title && <p className="text-sm font-semibold text-gray-700">{r.title}</p>}
                        <p className="text-sm text-gray-600">{r.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-2">No reviews yet. Be the first!</p>
                )}

                {/* Write a review */}
                <form onSubmit={handleReviewSubmit} className="border border-gray-200 rounded-2xl p-5 space-y-3">
                  <p className="font-semibold text-gray-800 text-sm">Write a Review</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rating:</span>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewForm((f) => ({ ...f, rating: s }))}
                        className={`text-xl ${s <= reviewForm.rating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Review title (optional)"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Share your experience..."
                    value={reviewForm.body}
                    onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 resize-none"
                  />
                  {reviewMsg && <p className="text-sm">{reviewMsg}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Related Products ──────────────────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-6 pb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">You May Also Like</h2>
              <Link to="/shop" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
