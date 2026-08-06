import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart, FiShoppingCart, FiArrowRight, FiArrowLeft,
  FiShare2, FiCheck, FiTruck, FiShield, FiRefreshCw,
  FiChevronLeft, FiChevronRight, FiStar, FiMinus, FiPlus,
  FiMapPin, FiPackage, FiCopy, FiX,
} from "react-icons/fi";
import { FaHeart, FaWhatsapp, FaFacebook, FaTwitter, FaTelegram } from "react-icons/fa";
import { Calendar } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import Rating from "../../components/Rating/Rating";
import ProductCard from "../../components/ProductCard/ProductCard";
import { formatUGX } from "../../utils/currency";
import api from "../../services/api";
import productService from "../../services/productService";
import useBehaviorTracker from "../../hooks/useBehaviorTracker";
import { toAbsolute } from "../../utils/imageUrl";

const SHARE_BASE  = process.env.REACT_APP_API_URL?.replace('/api/v1', '');

// ── Description with Read More ────────────────────────────────────────────────
const DescriptionTab = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const text = description || 'No description available for this product.';
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <p className={`text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line ${
        expanded ? '' : 'line-clamp-3'
      }`}>
        {text}
      </p>
      {text.length > 200 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          {expanded ? 'Show less ▲' : 'Read more ▼'}
        </button>
      )}
    </motion.div>
  );
};

// ── Specs Table ───────────────────────────────────────────────────────────────
const SpecsTab = ({ specs }) => {
  if (!specs || Object.keys(specs).length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-gray-500 text-sm">No specifications available.</p>
      </motion.div>
    );
  }
  const entries = Object.entries(specs);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <table className="w-full border border-gray-200 rounded-2xl overflow-hidden text-sm">
        <thead>
          <tr className="bg-primary-600 text-white">
            <th className="text-left px-5 py-3 font-semibold w-2/5">Specification</th>
            <th className="text-left px-5 py-3 font-semibold">Value</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, val], i) => (
            <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-5 py-3 font-semibold text-gray-700 border-t border-gray-100">{key}</td>
              <td className="px-5 py-3 text-gray-600 border-t border-gray-100">{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

// ── Delivery date helper ─────────────────────────────────────────────────────
const getDeliveryDate = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  let daysAhead = (day === 6 && hour >= 12) ? 3 : 2;
  const d = new Date(now);
  d.setDate(d.getDate() + daysAhead);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return d.toLocaleDateString('en-UG', { weekday: 'long', month: 'short', day: 'numeric' });
};

const SHIPPING_TIERS = [
  { label: "Kampala",          fee: 5000,  icon: <FiMapPin /> },
  { label: "Central Uganda",   fee: 8000,  icon: <FiTruck /> },
  { label: "Eastern Uganda",   fee: 10000, icon: <FiPackage /> },
  { label: "Western / Northern", fee: 10000, icon: <FiTruck /> },
];

const ProductPage = () => {
  const { slug } = useParams();
  useBehaviorTracker(slug);
  const navigate = useNavigate();
  const { addItem, items: cartItems } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const activeImgRef = useRef(0);
  const [qty, setQty] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // "cart" | "buy"
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef(null);
  const touchStartX = useRef(0);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");
  const [canReview, setCanReview] = useState(null); // null=loading, {can_review, already_reviewed, reason}

  // Load product
  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    setSelectedOptions({});
    setSizeModalOpen(false);
    setModalAction(null);
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

  // Refresh product data on stock-update event or every 60s
  useEffect(() => {
    if (!slug) return;
    const refresh = () => {
      api.get(`/products/${slug}/`)
        .then((res) => {
          const p = res.data;
          setProduct((prev) => prev ? {
            ...prev,
            inStock: p.in_stock,
            stock:   p.stock ?? 0,
          } : prev);
        })
        .catch(() => {});
    };
    window.addEventListener('product-stock-updated', refresh);
    const interval = setInterval(refresh, 60000);
    return () => {
      window.removeEventListener('product-stock-updated', refresh);
      clearInterval(interval);
    };
  }, [slug]);

  // Load reviews when tab opened
  useEffect(() => {
    if (activeTab !== "reviews" || !product) return;
    productService.getReviews(product.id)
      .then((res) => setReviews(res.data?.results || res.data || []))
      .catch(() => {});
    // Check if user can review
    api.get(`/reviews/can-review/${product.id}/`)
      .then((res) => setCanReview(res.data))
      .catch(() => setCanReview(null));
  }, [activeTab, product]);

  // Derived from product — declared early so all handlers and effects can use them
  const inStock     = product?.inStock ?? false;
  const stock       = product?.stock ?? 0;
  const rating      = product?.rating ?? 0;
  const reviewCount = product?.reviews ?? 0;
  const brandName   = product?.brand ?? '';
  const brandSlug   = product?.brandSlug ?? brandName.toLowerCase();
  const images = useMemo(
    () => product?.images?.length
      ? product.images.map((img) => (typeof img === 'string' ? img : img.image))
      : [],
    [product]
  );

  // Keep ref in sync so confirmSelection always reads the live index
  useEffect(() => { activeImgRef.current = activeImg; }, [activeImg]);

  // Keyboard arrow navigation for images
  useEffect(() => {
    if (images.length <= 1) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") setActiveImg((p) => (p + 1) % images.length);
      else if (e.key === "ArrowLeft") setActiveImg((p) => (p - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [images.length]);

  const getCategoryType = (name) => {
    if (!name) return null;
    const n = name.toLowerCase();
    if (/shoe|boot|sandal|sneaker|heel|loafer|slipper|footwear|trainer/.test(n)) return 'shoes';
    if (/cloth|fashion|wear|shirt|dress|trouser|jean|apparel|outfit|jacket|coat|suit|skirt|blouse|underwear|sock/.test(n)) return 'clothing';
    return null;
  };

  const catType = getCategoryType(product?.category) || getCategoryType(product?.category_name);

  const handleAddToCart = () => {
    if (!inStock) return;
    if (catType) {
      setSelectedOptions({});
      setModalAction("cart");
      setSizeModalOpen(true);
      return;
    }
    addItem({ ...product, image: images[activeImgRef.current] || images[0] || "", qty, selected_options: {} });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    if (catType) {
      setSelectedOptions({});
      setModalAction("buy");
      setSizeModalOpen(true);
      return;
    }
    addItem({ ...product, image: images[activeImgRef.current] || images[0] || "", qty, selected_options: {} });
    navigate("/cart");
  };

  const confirmSelection = () => {
    const specs = product?.specs || {};
    const sizes = specs.sizes ? specs.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (sizes.length > 0 && !selectedOptions.size) return;
    setSizeModalOpen(false);
    const finalColor = selectedOptions.color === '__other__'
      ? (selectedOptions.customColor || '')
      : (selectedOptions.color || '');
    const opts = { ...selectedOptions };
    delete opts.customColor;
    if (finalColor) opts.color = finalColor; else delete opts.color;
    const activeImage = images[activeImgRef.current] || images[0] || "";
    if (modalAction === "cart") {
      addItem({ ...product, image: activeImage, qty, selected_options: opts });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } else {
      addItem({ ...product, image: activeImage, qty, selected_options: opts });
      navigate("/cart");
    }
  };
  const handleShare = () => {
    const shareUrl = SHARE_BASE ? `${SHARE_BASE}/api/v1/products/share/${product?.slug}/` : window.location.href;
    const price    = formatUGX(product?.price);
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text:  `${product?.name} — ${price}`,
        url:   shareUrl,
      }).catch(() => {});
    } else {
      setShareOpen((v) => !v);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamically update OG meta tags so WhatsApp/Telegram preview the product image
  useEffect(() => {
    if (!product) return;
    const img = images[0] || "https://res.cloudinary.com/d5qqtsou/image/upload/v1784128380/My%20Brand/CartPulse_logo_vlz5xr.png";
    const price = formatUGX(product.price);
    const setMeta = (sel, attr, val) => {
      let el = document.querySelector(sel);
      if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
      el.setAttribute(attr, val);
    };
    document.title = `${product.name} — ${price} | CartPulse`;
    setMeta('meta[property="og:title"]',       "content", `${product.name} — ${price}`);
    setMeta('meta[property="og:description"]', "content", product.description?.slice(0, 160) || `Buy ${product.name} at ${price} on CartPulse`);
    setMeta('meta[property="og:image"]',       "content", img);
    setMeta('meta[property="og:image:width"]', "content", "800");
    setMeta('meta[property="og:image:height"]',"content", "800");
    setMeta('meta[property="og:url"]',         "content", window.location.href);
    setMeta('meta[name="twitter:card"]',       "name",    "summary_large_image");
    setMeta('meta[name="twitter:title"]',      "content", `${product.name} — ${price}`);
    setMeta('meta[name="twitter:description"]',"content", product.description?.slice(0, 160) || `Buy ${product.name} at ${price} on CartPulse`);
    setMeta('meta[name="twitter:image"]',      "content", img);
    return () => {
      document.title = "CartPulse — Shop Premium Electronics";
      setMeta('meta[property="og:image"]', "content", "https://res.cloudinary.com/d5qqtsou/image/upload/v1784128380/My%20Brand/CartPulse_logo_vlz5xr.png");
    };
  }, [product, images]);

  // Close share popover on outside click
  useEffect(() => {
    const handler = (e) => { if (shareRef.current && !shareRef.current.contains(e.target)) setShareOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await productService.addReview(product.id, reviewForm);
      setReviewMsg("Review submitted!");
      setReviewForm({ rating: 5, title: "", body: "" });
      const res = await productService.getReviews(product.id);
      setReviews(res.data?.results || res.data || []);
      setCanReview({ can_review: false, already_reviewed: true, reason: 'already_reviewed' });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to submit review.";
      setReviewMsg(msg);
    } finally {
      setSubmitting(false);
      setTimeout(() => setReviewMsg(""), 4000);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/delete/${reviewId}/`);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setCanReview({ can_review: true, already_reviewed: false, reason: null });
    } catch {
      // silently fail
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────────────────────────────────────
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
        <FiPackage className="text-6xl text-gray-300 mb-4" />
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
          <div className="space-y-3 min-w-0">
            <div
              className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group"
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                const diff = touchStartX.current - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) {
                  if (diff > 0) setActiveImg((p) => (p + 1) % images.length);
                  else setActiveImg((p) => (p - 1 + images.length) % images.length);
                }
              }}
            >
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
              <div className="relative overflow-x-auto scrollbar-hide w-full">
                <div className="flex gap-2">
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
                {images.length > 4 && (
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none rounded-r-xl" />
                )}
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
                {inStock ? `In Stock (${stock} left)` : "Out of Stock"}
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
              <DescriptionTab description={product.description} />
            )}

            {/* ── Delivery & Shipping ──────────────────────────────────── */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
                  <FiTruck className="text-base" /> Delivery & Shipping
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Calendar size={11} /> Order today, delivered by {getDeliveryDate()}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {SHIPPING_TIERS.map((tier) => (
                  <div key={tier.label} className="bg-white rounded-xl p-3 text-center border border-blue-100">
                    <div className="text-blue-500 text-lg flex justify-center mb-1">{tier.icon}</div>
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{tier.label}</p>
                    <p className="text-xs text-green-600 font-bold mt-1">{formatUGX(tier.fee)}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Buying multiple items? <span className="font-semibold text-blue-700">Save on delivery!</span>
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
            <div className="space-y-3">
              {/* Row 1: Add to Cart + Buy Now */}
              <div className="flex gap-3">
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
                  {addedToCart ? "Added!" : "Add to Cart"}
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
              </div>

              {/* Row 2: Wishlist + Share */}
              <div className="flex gap-3">
                <button
                  onClick={() => toggle(product, cartItems)}
                  aria-label="Toggle wishlist"
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                    isWishlisted(product.id)
                      ? "border-red-400 bg-red-50 text-red-500"
                      : "border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-400"
                  }`}
                >
                  {isWishlisted(product.id) ? <FaHeart className="text-base" /> : <FiHeart className="text-base" />}
                  {isWishlisted(product.id) ? "Wishlisted" : "Wishlist"}
                </button>

                {/* Share button + popover */}
                <div className="relative flex-1" ref={shareRef}>
                  <button
                    onClick={handleShare}
                    aria-label="Share product"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-500 hover:border-primary-300 hover:text-primary-500 transition-all"
                  >
                    <FiShare2 className="text-base" /> Share
                  </button>

                  <AnimatePresence>
                    {shareOpen && (() => {
                      const shareUrl = SHARE_BASE ? `${SHARE_BASE}/api/v1/products/share/${product.slug}/` : window.location.href;
                      const imgUrl   = images[0] || '';
                      const price    = formatUGX(product.price);
                      const origLine = product.originalPrice ? ` (was ${formatUGX(product.originalPrice)})` : '';
                      const waMsg    = `*${product.name}*\nPrice: ${price}${origLine}\n\n${shareUrl}`;
                      const tgMsg    = `${product.name}\nPrice: ${price}${origLine}`;
                      const enc      = encodeURIComponent(shareUrl);
                      const socials  = [
                        {
                          label: 'WhatsApp', icon: <FaWhatsapp className="text-lg" />, color: 'hover:bg-green-50 hover:text-green-600 hover:border-green-200',
                          href: `https://wa.me/?text=${encodeURIComponent(waMsg)}`,
                        },
                        {
                          label: 'Facebook', icon: <FaFacebook className="text-lg" />, color: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200',
                          href: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
                        },
                        {
                          label: 'Twitter', icon: <FaTwitter className="text-lg" />, color: 'hover:bg-sky-50 hover:text-sky-500 hover:border-sky-200',
                          href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${product.name} — ${price}`)}&url=${enc}`,
                        },
                        {
                          label: 'Telegram', icon: <FaTelegram className="text-lg" />, color: 'hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200',
                          href: `https://t.me/share/url?url=${enc}&text=${encodeURIComponent(tgMsg)}`,
                        },
                      ];
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-full mb-2 right-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-30"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Share this product</p>
                            <button onClick={() => setShareOpen(false)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
                          </div>

                          {/* Product preview */}
                          <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl mb-3">
                            {imgUrl && (
                              <img src={imgUrl} alt={product.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-200" />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug">{product.name}</p>
                              <p className="text-sm text-primary-600 font-extrabold mt-0.5">{price}</p>
                              {product.originalPrice && (
                                <p className="text-[10px] text-gray-400 line-through">{formatUGX(product.originalPrice)}</p>
                              )}
                            </div>
                          </div>

                          {/* Social buttons */}
                          <div className="grid grid-cols-4 gap-2 mb-3">
                            {socials.map((s) => (
                              <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={s.label}
                                className={`flex flex-col items-center gap-1 p-2 rounded-xl border border-gray-100 text-gray-500 transition-all ${s.color}`}
                              >
                                {s.icon}
                                <span className="text-[10px] font-semibold">{s.label}</span>
                              </a>
                            ))}
                          </div>

                          {/* Copy link */}
                          <button
                            onClick={copyLink}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
                            {copied ? 'Link Copied!' : 'Copy Link'}
                          </button>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: <FiTruck />, label: "Pick-up Delivery", sub: "Nearest station near you" },
                { icon: <FiShield />, label: "Verified Traders", sub: "Genuine products only" },
                { icon: <FiRefreshCw />, label: "Easy Returns", sub: "Faulty items only" },
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

        <div className="py-8 mx-1">
            {activeTab === "description" && (
              <DescriptionTab description={product.description} />
            )}

            {activeTab === "specs" && (
              <SpecsTab specs={product.specs} />
            )}

            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
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
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                            {user && r.user_email === user.email && (
                              <button
                                onClick={() => handleDeleteReview(r.id)}
                                className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </div>
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
                {!canReview ? (
                  // not logged in or still loading
                  <div className="border border-gray-200 rounded-2xl p-5 text-center text-sm text-gray-400">
                    <p>Sign in to leave a review.</p>
                  </div>
                ) : canReview.already_reviewed ? (
                  <div className="border border-green-100 bg-green-50 rounded-2xl p-5 text-center">
                    <p className="text-sm font-semibold text-green-700">You have already reviewed this product.</p>
                  </div>
                ) : !canReview.can_review ? (
                  <div className="border border-amber-100 bg-amber-50 rounded-2xl p-5 text-center space-y-1">
                    <p className="text-sm font-semibold text-amber-700">Purchase required to review</p>
                    <p className="text-xs text-amber-600">Only customers who have received a delivered order of this product can leave a review.</p>
                  </div>
                ) : (
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
                )}
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
      {/* ── Size / Color Selection Modal ── */}
      <AnimatePresence>
        {sizeModalOpen && (() => {
          const specs     = product?.specs || {};
          const sizes     = specs.sizes    ? specs.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
          const ukSizes   = specs.uk_sizes ? specs.uk_sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
          const colors    = specs.colors   ? specs.colors.split(',').map(s => s.trim()).filter(Boolean) : [];
          // Combine EU+UK into paired pills: [{ eu: '40', uk: '6' }, ...]
          const sizePairs = sizes.map((eu, i) => ({ eu, uk: ukSizes[i] || null }));
          const needsSize = sizePairs.length > 0;
          const hasColors = colors.length > 0;
          const isOtherColor = selectedOptions.color === '__other__';
          const steps = [
            ...(needsSize ? ['size'] : []),
            'color',
          ];
          const doneCount = steps.filter(k => {
            if (k === 'color') return !!(selectedOptions.color && selectedOptions.color !== '__other__') || !!(isOtherColor && selectedOptions.customColor);
            return !!selectedOptions[k];
          }).length;
          const allRequired = needsSize ? !!selectedOptions.size : true;
          return (
            <>
              {/* Full-screen flex overlay — guarantees centering */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-4"
                onClick={() => setSizeModalOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.93, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.93, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-[61]"
                  style={{ maxHeight: '90vh' }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 px-5 py-4 bg-gray-50 border-b border-gray-100">
                    {images[activeImg] && (
                      <img src={images[activeImg]} alt={product?.name} className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 font-medium mb-0.5 flex items-center gap-1">
                        {modalAction === 'buy'
                          ? <><FiArrowRight size={11} /> Quick Buy</>
                          : <><FiShoppingCart size={11} /> Add to Cart</>}
                      </p>
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">{product?.name}</p>
                      <p className="text-base font-extrabold text-primary-600">{formatUGX(product?.price)}</p>
                    </div>
                    <button onClick={() => setSizeModalOpen(false)} className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1">
                      <FiX size={20} />
                    </button>
                  </div>

                  {/* Progress bar */}
                  {steps.length > 0 && (
                    <div className="px-5 pt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-500">
                          {doneCount === steps.length ? <><FiCheck className="inline mr-1 text-green-500" />All set!</> : `Step ${doneCount + 1} of ${steps.length}`}
                        </span>
                        <span className="text-xs text-gray-400">{Math.round((doneCount / steps.length) * 100)}% complete</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-300"
                          style={{ width: `${(doneCount / steps.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="px-5 py-4 space-y-5 overflow-y-auto flex-1">

                    {/* Size — combined EU/UK pills */}
                    {sizePairs.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            selectedOptions.size ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {selectedOptions.size ? <FiCheck size={11} /> : '1'}
                          </span>
                          <label className="text-sm font-bold text-gray-800">
                            Size <span className="text-red-500 ml-0.5">*</span>
                          </label>
                          {selectedOptions.size && (
                            <span className="ml-auto text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                              {selectedOptions.size}{selectedOptions.uk_size ? ` / UK ${selectedOptions.uk_size}` : ''}
                            </span>
                          )}
                        </div>
                        {!selectedOptions.size && (
                          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-1.5 mb-2 flex items-center gap-1.5">
                            <FiArrowRight size={12} /> Please select a size to continue
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {sizePairs.map(({ eu, uk }) => (
                            <button key={eu} type="button"
                              onClick={() => setSelectedOptions(o => ({ ...o, size: eu, ...(uk ? { uk_size: uk } : {}) }))}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                selectedOptions.size === eu
                                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'
                              }`}
                            >
                              {catType === 'shoes' ? `EU ${eu}${uk ? ` / UK ${uk}` : ''}` : eu}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          (selectedOptions.color && selectedOptions.color !== '__other__') || (isOtherColor && selectedOptions.customColor)
                            ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {(selectedOptions.color && selectedOptions.color !== '__other__') || (isOtherColor && selectedOptions.customColor)
                            ? <FiCheck size={11} /> : needsSize ? '2' : '1'}
                        </span>
                        <label className="text-sm font-bold text-gray-800">Color <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                        {selectedOptions.color && selectedOptions.color !== '__other__' && (
                          <span className="ml-auto text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                            {selectedOptions.color}
                          </span>
                        )}
                      </div>
                      {hasColors ? (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {colors.map(c => (
                              <button key={c} type="button"
                                onClick={() => setSelectedOptions(o => ({ ...o, color: c, customColor: '' }))}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                  selectedOptions.color === c
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'
                                }`}
                              >{c}</button>
                            ))}
                            <button type="button"
                              onClick={() => setSelectedOptions(o => ({ ...o, color: '__other__', customColor: '' }))}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                isOtherColor ? 'bg-gray-700 text-white border-gray-700' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                              }`}
                            >Other...</button>
                          </div>
                          {isOtherColor && (
                            <input type="text" placeholder="Type your color..."
                              value={selectedOptions.customColor || ''}
                              onChange={e => setSelectedOptions(o => ({ ...o, customColor: e.target.value }))}
                              className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"
                              autoFocus
                            />
                          )}
                        </>
                      ) : (
                        <input type="text" placeholder="e.g. Black, Red, Navy..."
                          value={selectedOptions.color || ''}
                          onChange={e => setSelectedOptions(o => ({ ...o, color: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"
                        />
                      )}
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="px-5 pb-5 pt-3 border-t border-gray-100 space-y-2">
                    {!allRequired && (
                      <p className="text-xs text-center text-red-500 font-medium">Please select a size to continue</p>
                    )}
                    <button
                      onClick={confirmSelection}
                      disabled={!allRequired}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                        !allRequired
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : modalAction === 'buy'
                            ? 'bg-accent-500 hover:bg-accent-600 text-white active:scale-95 shadow-md'
                            : 'bg-primary-600 hover:bg-primary-700 text-white active:scale-95 shadow-md'
                      }`}
                    >
                      {!allRequired
                        ? 'Select a size to continue'
                        : modalAction === 'buy'
                          ? `Buy Now — ${formatUGX(product?.price)}`
                          : `Add to Cart — ${formatUGX(product?.price)}`}
                    </button>
                    <button
                      onClick={() => setSizeModalOpen(false)}
                      className="w-full py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                </motion.div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>

    </div>
  );
};

export default ProductPage;
