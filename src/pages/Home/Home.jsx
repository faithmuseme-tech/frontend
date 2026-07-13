import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import Hero from "../../components/Hero/Hero";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import ProductCard from "../../components/ProductCard/ProductCard";
import FlashDeals from "../../components/Banner/FlashDeals";
import BrandCard from "../../components/ProductCard/BrandCard";
import FeatureCard from "../../components/ProductCard/FeatureCard";
import TestimonialCard from "../../components/ProductCard/TestimonialCard";
import Newsletter from "../../components/Banner/Newsletter";
import PromoBanner from "../../components/Banner/PromoBanner";

import productService from "../../services/productService";
import {
  categories as mockCategories,
  featuredProducts as mockFeatured,
  brands as mockBrands,
  features,
} from "../../utils/data";

// Skeleton loader for product grids
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

// Section wrapper
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

// Testimonials carousel
const FALLBACK_AVATAR = "https://ui-avatars.com/api/?background=random&size=80&name=";

const TestimonialsSection = () => {
  const [idx, setIdx] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/reviews/recent/?limit=8`)
      .then((r) => r.json())
      .then((data) => {
        const items = (Array.isArray(data) ? data : data.results || []).map((r) => ({
          id: r.id,
          name: r.user_name,
          role: r.product_name,
          avatar: r.user_avatar || `${FALLBACK_AVATAR}${encodeURIComponent(r.user_name)}`,
          rating: r.rating,
          text: r.body,
        }));
        if (items.length) setReviews(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !reviews.length) return null;

  return (
    <section className="py-14 bg-gradient-to-br from-primary-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real reviews from our verified buyers</p>
        </div>
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <TestimonialCard testimonial={t} />
            </motion.div>
          ))}
        </div>
        <div className="md:hidden">
          <TestimonialCard testimonial={reviews[idx]} />
          <div className="flex items-center justify-center gap-4 mt-5">
            <button onClick={() => setIdx((p) => Math.max(0, p - 1))} disabled={idx === 0} className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 disabled:opacity-30 hover:bg-gray-100 transition-colors">
              <FiChevronLeft />
            </button>
            <div className="flex gap-1.5">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === idx ? "bg-primary-600" : "bg-gray-300"}`} />
              ))}
            </div>
            <button onClick={() => setIdx((p) => Math.min(reviews.length - 1, p + 1))} disabled={idx === reviews.length - 1} className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 disabled:opacity-30 hover:bg-gray-100 transition-colors">
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Hook to fetch with fallback
const useApiData = (fetchFn, fallback) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFn()
      .then((res) => setData(res.data.results || res.data))
      .catch(() => setData(fallback))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data: data || fallback, loading };
};

const Home = () => {
  const { data: categories, loading: catLoading } = useApiData(productService.getCategories, mockCategories);
  const { data: featured, loading: featLoading } = useApiData(productService.getFeatured, mockFeatured);
  const { data: newArrivals, loading: newLoading } = useApiData(productService.getNewArrivals, mockFeatured.slice(0, 6));
  const { data: bestSellers, loading: bsLoading } = useApiData(productService.getBestSellers, [...mockFeatured].reverse().slice(0, 4));
  const { data: brands, loading: brandsLoading } = useApiData(productService.getBrands, mockBrands);

  const renderProductGrid = (items, loading, cols = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4") => (
    <div className={`grid ${cols} gap-4 md:gap-5`}>
      {loading
        ? Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
        : items.map((p) => <ProductCard key={p.id} product={p} />)
      }
    </div>
  );

  return (
    <>
      <Hero />

      {/* Categories */}
      <Section title="Shop by Category" subtitle="Browse our wide selection of electronics categories" to="/categories" dark>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
          {catLoading
            ? Array(12).fill(0).map((_, i) => <div key={i} className="card p-5 aspect-square animate-pulse bg-gray-100" />)
            : categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)
          }
        </div>
      </Section>

      {/* Featured Products */}
      <Section title="Featured Products" subtitle="Handpicked top electronics just for you" to="/shop">
        {renderProductGrid(featured, featLoading)}
      </Section>

      {/* Flash Deals */}
      <FlashDeals />

      {/* New Arrivals */}
      <Section title="New Arrivals" subtitle="The freshest tech just landed" to="/new-arrivals" dark>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {newLoading
            ? Array(6).fill(0).map((_, i) => <div key={i} className="flex-shrink-0 w-56 sm:w-64"><ProductSkeleton /></div>)
            : newArrivals.map((p) => (
                <div key={p.id} className="flex-shrink-0 w-56 sm:w-64">
                  <ProductCard product={p} />
                </div>
              ))
          }
        </div>
      </Section>

      {/* Best Sellers */}
      <Section title="Best Sellers" subtitle="Most loved by our customers" to="/shop?sort=best-selling">
        {renderProductGrid(bestSellers, bsLoading, "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")}
      </Section>

      {/* Promo Banners */}
      <PromoBanner />

      {/* Popular Brands */}
      <Section title="Popular Brands" subtitle="Shop from the world's most trusted electronics brands" to="/brands" dark>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {brandsLoading
            ? Array(10).fill(0).map((_, i) => <div key={i} className="card h-20 animate-pulse bg-gray-100" />)
            : brands.map((brand) => <BrandCard key={brand.id} brand={brand} />)
          }
        </div>
      </Section>

      {/* Why Shop With Us */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title">Why Shop With Us?</h2>
            <p className="section-subtitle">We're committed to giving you the best shopping experience</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => <FeatureCard key={feature.title} feature={feature} index={i} />)}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <Newsletter />
    </>
  );
};

export default Home;
