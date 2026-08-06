import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import Hero from "../../components/Hero/Hero";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import ProductCard from "../../components/ProductCard/ProductCard";
import FlashDeals from "../../components/Banner/FlashDeals";
import BrandCard from "../../components/ProductCard/BrandCard";
import TestimonialCard from "../../components/ProductCard/TestimonialCard";
import Newsletter from "../../components/Banner/Newsletter";
import PromoBanner from "../../components/Banner/PromoBanner";
import AdvertisementBanner from "../../components/Banner/AdvertisementBanner";

import productService from "../../services/productService";
import { toAbsolute } from "../../utils/imageUrl";
import {
  categories as mockCategories,
  featuredProducts as mockFeatured,
  brands as mockBrands,
} from "../../utils/data";

const ProductSkeleton = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-t-2xl" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-8 bg-gray-200 rounded-xl mt-2" />
    </div>
  </div>
);

const Section = ({ title, subtitle, to, toLabel = "View All", children, dark = false }) => (
  <section className={`py-14 ${dark ? "bg-gray-50" : "bg-white"}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {to && (
          <Link to={to} className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            {toLabel} <FiArrowRight />
          </Link>
        )}
      </div>
      {children}
      {to && (
        <div className="sm:hidden text-center mt-6">
          <Link to={to} className="btn-outline text-sm">
            {toLabel} <FiArrowRight className="inline ml-1" />
          </Link>
        </div>
      )}
    </div>
  </section>
);

const FALLBACK_AVATAR = "https://ui-avatars.com/api/?background=random&size=80&name=";

const TESTIMONIAL_INTERVAL = 4000;
const VISIBLE_DESKTOP = 4;

const TestimonialsSection = () => {
  const [idx, setIdx] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/reviews/recent/?limit=8`)
      .then((r) => r.json())
      .then((data) => {
        const items = (Array.isArray(data) ? data : data.results || []).map((r) => ({
          id: r.id,
          name: r.user_name,
          avatar: r.user_avatar || `${FALLBACK_AVATAR}${encodeURIComponent(r.user_name)}`,
          rating: r.rating,
          text: r.body,
          productName: r.product_name,
          productImage: r.product_image,
          productSlug: r.product_slug,
        }));
        if (items.length) setReviews(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (reviews.length < 2) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % reviews.length), TESTIMONIAL_INTERVAL);
    return () => clearInterval(t);
  }, [reviews.length, resetKey]);

  const goTo = (i) => { setIdx(i); setResetKey((k) => k + 1); };
  const prev = () => goTo((idx - 1 + reviews.length) % reviews.length);
  const next = () => goTo((idx + 1) % reviews.length);

  if (loading || !reviews.length) return null;

  // Desktop: show VISIBLE_DESKTOP cards starting from idx (wrapping)
  const desktopCards = Array.from({ length: Math.min(VISIBLE_DESKTOP, reviews.length) }, (_, i) =>
    reviews[(idx + i) % reviews.length]
  );

  return (
    <section className="py-14 bg-gradient-to-br from-primary-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real reviews from our verified buyers</p>
        </div>

        {/* Desktop carousel */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {desktopCards.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <TestimonialCard testimonial={t} />
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={prev} className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <FiChevronLeft />
            </button>
            <div className="flex gap-1.5">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} className={`w-2 h-2 rounded-full transition-colors ${i === idx ? "bg-primary-600" : "bg-gray-300"}`} />
              ))}
            </div>
            <button onClick={next} className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <motion.div key={reviews[idx].id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
            <TestimonialCard testimonial={reviews[idx]} />
          </motion.div>
          <div className="flex items-center justify-center gap-4 mt-5">
            <button onClick={prev} className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <FiChevronLeft />
            </button>
            <div className="flex gap-1.5">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} className={`w-2 h-2 rounded-full transition-colors ${i === idx ? "bg-primary-600" : "bg-gray-300"}`} />
              ))}
            </div>
            <button onClick={next} className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const normalizeProduct = (p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  brand: p.brand_name || p.brand?.name || "",
  category: p.category_name || p.category?.name || "",
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

const useApiData = (fetchFn, fallback, normalize = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const onStockUpdate = () => setRefreshKey((k) => k + 1);
    window.addEventListener('product-stock-updated', onStockUpdate);
    return () => window.removeEventListener('product-stock-updated', onStockUpdate);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchFn()
      .then((res) => {
        const list = res.data.results || res.data;
        setData(Array.isArray(list) ? (normalize ? list.map(normalizeProduct) : list) : list);
      })
      .catch(() => setData(fallback))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return { data: data || fallback, loading };
};

// Clothing keywords — these products are excluded from "Latest Products"
const CLOTHES_KEYWORDS = ["cloth", "fashion", "wear", "shirt", "dress", "trouser", "jean", "shoe", "sneaker", "boot", "jacket", "skirt", "blouse", "apparel", "outfit"];
const isClothing = (p) => CLOTHES_KEYWORDS.some((k) =>
  (p.category || "").toLowerCase().includes(k) || (p.name || "").toLowerCase().includes(k)
);

const dedup = (pool, usedIds) => pool.filter((p) => !usedIds.has(p.id));

const Home = () => {
  const { data: categories,  loading: catLoading }    = useApiData(productService.getCategories, mockCategories, false);
  const { data: featured,    loading: featLoading }   = useApiData(productService.getFeatured, mockFeatured);
  const { data: newArrivals, loading: newLoading }    = useApiData(productService.getDiverseNewArrivals, mockFeatured.slice(0, 8));
  const { data: bestSellers, loading: bsLoading }     = useApiData(productService.getBestSellers, [...mockFeatured].reverse().slice(0, 4));
  const { data: brands,      loading: brandsLoading } = useApiData(productService.getBrands, mockBrands, false);
  const { data: recommended, loading: recLoading }    = useApiData(productService.getRecommended, mockFeatured.slice(0, 8));

  // ── Deduplicated sections ──────────────────────────────────────────────────
  const usedIds = new Set();

  // Global pool for padding — all unique products across all fetched lists
  const allProducts = [...newArrivals, ...featured, ...recommended, ...bestSellers]
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);

  const fill = (section, size = 8) => {
    const base = dedup(section, usedIds).slice(0, size);
    base.forEach((p) => usedIds.add(p.id));
    if (base.length >= size) return base;
    const pad = dedup(allProducts, usedIds).slice(0, size - base.length);
    pad.forEach((p) => usedIds.add(p.id));
    return [...base, ...pad];
  };

  // 1. Latest Products — no clothing
  const latest = fill(newArrivals.filter((p) => !isClothing(p)));

  // 2. Featured
  const featuredSection = fill(featured);

  // 3. New Arrivals — clothing allowed
  const newArrivalsSection = fill(newArrivals);

  // 4. Recommended
  const recommendedSection = fill(recommended);

  // 5. Best Sellers
  const bestSellersSection = fill([...bestSellers, ...allProducts]);

  const renderGrid = (items, loading, eager = false) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {loading
        ? Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
        : items.map((p, i) => <ProductCard key={p.id} product={p} eager={eager && i < 4} />)
      }
    </div>
  );

  return (
    <>
      {/* Latest Products — no clothing */}
      <Section title="Latest Products" subtitle="Fresh arrivals you don't want to miss" to="/new-arrivals">
        {renderGrid(latest, newLoading, true)}
      </Section>

      <AdvertisementBanner />

      {/* Categories */}
      <Section title="Shop by Category" subtitle="Browse our wide selection of categories" to="/categories" dark>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
          {catLoading
            ? Array(12).fill(0).map((_, i) => <div key={i} className="card p-5 aspect-square animate-pulse bg-gray-100" />)
            : categories.filter((cat) => (cat.product_count ?? 0) > 0).map((cat) => <CategoryCard key={cat.id} category={cat} />)
          }
        </div>
      </Section>

      {/* Featured Products */}
      <Section title="Featured Products" subtitle="Handpicked top products just for you" to="/shop">
        {renderGrid(featuredSection, featLoading)}
      </Section>

      <FlashDeals />

      {/* New Arrivals — grid, clothing included */}
      <Section title="New Arrivals" subtitle="The freshest items just landed" to="/new-arrivals" dark>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {newLoading
            ? Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            : newArrivalsSection.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </Section>

      {/* Recommended for You */}
      <Section title="Recommended for You" subtitle="Based on your browsing" to="/shop">
        {renderGrid(recommendedSection, recLoading)}
      </Section>

      {/* Best Sellers */}
      <Section title="Best Sellers" subtitle="Most loved by our customers" to="/shop?sort=best-selling" dark>
        {renderGrid(bestSellersSection, bsLoading)}
      </Section>

      <PromoBanner />
      <Hero />

      {/* Popular Brands */}
      <Section title="Popular Brands" subtitle="Shop from the world's most trusted brands" to="/brands" dark>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {brandsLoading
            ? Array(10).fill(0).map((_, i) => <div key={i} className="card h-20 animate-pulse bg-gray-100" />)
            : brands.map((brand) => <BrandCard key={brand.id} brand={brand} />)
          }
        </div>
      </Section>

      <TestimonialsSection />
      <Newsletter />
    </>
  );
};

export default Home;
