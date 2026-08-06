import React, { Suspense, lazy, Component, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import TraderLayout from "../layouts/TraderLayout";
import usePageTracking from "../hooks/usePageTracking";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, [pathname]);
  return null;
};

const PageTracker = () => { usePageTracking(); return null; };

// Retry lazy import once on ChunkLoadError (stale deploy on GitHub Pages)
const lazyWithRetry = (importFn) =>
  lazy(() =>
    importFn().catch((err) => {
      const isChunkError =
        err?.name === "ChunkLoadError" ||
        /Loading chunk \d+ failed/i.test(err?.message || "");
      if (isChunkError && !sessionStorage.getItem("chunk_reloaded")) {
        sessionStorage.setItem("chunk_reloaded", "1");
        window.location.href = '/frontend/';
        return new Promise(() => {});
      }
      sessionStorage.removeItem("chunk_reloaded");
      throw err;
    })
  );

class ChunkErrorBoundary extends Component {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  componentDidCatch(err) {
    const isChunkError =
      err?.name === "ChunkLoadError" ||
      /Loading chunk \d+ failed/i.test(err?.message || "");
    if (isChunkError && !sessionStorage.getItem("chunk_reloaded")) {
      sessionStorage.setItem("chunk_reloaded", "1");
      window.location.href = '/frontend/';
    }
  }
  render() {
    if (this.state.crashed) return null;
    return this.props.children;
  }
}

const Home               = lazyWithRetry(() => import("../pages/Home/Home"));
const Shop               = lazyWithRetry(() => import("../pages/Shop/Shop"));
const ProductPage        = lazyWithRetry(() => import("../pages/Product/ProductPage"));
const CartPage           = lazyWithRetry(() => import("../pages/Cart/CartPage"));
const CheckoutPage       = lazyWithRetry(() => import("../pages/Checkout/CheckoutPage"));
const LoginPage          = lazyWithRetry(() => import("../pages/Login/LoginPage"));
const RegisterPage       = lazyWithRetry(() => import("../pages/Register/RegisterPage"));
const SuccessPage        = lazyWithRetry(() => import("../pages/Success/SuccessPage"));
const TraderRegisterPage = lazyWithRetry(() => import("../pages/Trader/TraderRegisterPage"));
const TraderOverview     = lazyWithRetry(() => import("../pages/Trader/Dashboard/TraderOverview"));
const TraderProducts     = lazyWithRetry(() => import("../pages/Trader/Dashboard/TraderProducts"));
const TraderProductForm  = lazyWithRetry(() => import("../pages/Trader/Dashboard/TraderProductForm"));
const TraderProfilePage  = lazyWithRetry(() => import("../pages/Trader/Dashboard/TraderProfilePage"));
const TraderFlashDeals   = lazyWithRetry(() => import("../pages/Trader/Dashboard/TraderFlashDeals"));
const TraderOrders       = lazyWithRetry(() => import("../pages/Trader/Dashboard/TraderOrders"));
const TraderChat         = lazyWithRetry(() => import("../pages/Trader/Dashboard/TraderChat"));
const AdminLayout        = lazyWithRetry(() => import("../layouts/AdminLayout"));
const AdminOverview      = lazyWithRetry(() => import("../pages/Admin/Dashboard/AdminOverview"));
const AdminUsers         = lazyWithRetry(() => import("../pages/Admin/Dashboard/AdminUsers"));
const AdminTraders       = lazyWithRetry(() => import("../pages/Admin/Dashboard/AdminTraders"));
const AdminOrders        = lazyWithRetry(() => import("../pages/Admin/Dashboard/AdminOrders"));
const AdminProducts      = lazyWithRetry(() => import("../pages/Admin/Dashboard/AdminProducts"));
const AdminCategories    = lazyWithRetry(() => import("../pages/Admin/Dashboard/AdminCategories"));
const AdminBrands        = lazyWithRetry(() => import("../pages/Admin/Dashboard/AdminBrands"));
const OrdersPage         = lazyWithRetry(() => import("../pages/Orders/OrdersPage"));
const LocationPage       = lazyWithRetry(() => import("../pages/Location/LocationPage"));
const PaymentMethodPage  = lazyWithRetry(() => import("../pages/PaymentMethod/PaymentMethodPage"));
const SearchPage         = lazyWithRetry(() => import("../pages/Search/SearchPage"));
const WishlistPage       = lazyWithRetry(() => import("../pages/Wishlist/WishlistPage"));
const CategoriesPage     = lazyWithRetry(() => import("../pages/Categories/CategoriesPage"));
const CategoryDetailPage = lazyWithRetry(() => import("../pages/Categories/CategoryDetailPage"));
const BrandsPage         = lazyWithRetry(() => import("../pages/Brands/BrandsPage"));
const BrandDetailPage    = lazyWithRetry(() => import("../pages/Brands/BrandDetailPage"));
const InboxPage          = lazyWithRetry(() => import("../pages/Dashboard/InboxPage"));
const ChatPage           = lazyWithRetry(() => import("../pages/Dashboard/ChatPage"));
const AdminAnalytics     = lazyWithRetry(() => import("../pages/Admin/Dashboard/AdminAnalytics"));
const AdminChat          = lazyWithRetry(() => import("../pages/Admin/Dashboard/AdminChat"));
const AdminInquiries     = lazyWithRetry(() => import("../pages/Admin/Dashboard/AdminInquiries"));
const AdminReturns       = lazyWithRetry(() => import("../pages/Admin/Dashboard/AdminReturns"));
const AdminInsights      = lazyWithRetry(() => import("../pages/Admin/Dashboard/AdminInsights"));
const AdminEmployees     = lazyWithRetry(() => import("../pages/Admin/Dashboard/AdminEmployees"));
const ReturnRequestPage  = lazyWithRetry(() => import("../pages/Returns/ReturnRequestPage"));
const MyReturnsPage      = lazyWithRetry(() => import("../pages/Returns/MyReturnsPage"));
const NotFound           = lazyWithRetry(() => import("../pages/NotFound/NotFound"));
const AboutPage          = lazyWithRetry(() => import("../pages/About/AboutPage"));
const ContactPage        = lazyWithRetry(() => import("../pages/Contact/ContactPage"));
const ShippingPage       = lazyWithRetry(() => import("../pages/Shipping/ShippingPage"));
const ReturnsPage        = lazyWithRetry(() => import("../pages/Returns/ReturnsPage"));
const FAQsPage           = lazyWithRetry(() => import("../pages/FAQs/FAQsPage"));
const HowToPayPage       = lazyWithRetry(() => import("../pages/HowToPay/HowToPayPage"));
const PrivacyPage        = lazyWithRetry(() => import("../pages/Privacy/PrivacyPage"));
const TermsPage          = lazyWithRetry(() => import("../pages/Terms/TermsPage"));
const NewArrivalsPage    = lazyWithRetry(() => import("../pages/NewArrivals/NewArrivalsPage"));
const CookiePreferencePage = lazyWithRetry(() => import("../pages/CookiePreferences/CookiePreferencePage"));
const CookieNoticePage     = lazyWithRetry(() => import("../pages/CookieNotice/CookieNoticePage"));
const HelpPage             = lazyWithRetry(() => import("../pages/Help/HelpPage"));
const LoyaltyPage          = lazyWithRetry(() => import("../pages/Loyalty/LoyaltyPage"));
const ProfileSettingsPage  = lazyWithRetry(() => import("../pages/Profile/ProfileSettingsPage"));

const Loader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => (
  <ChunkErrorBoundary>
    <Suspense fallback={<Loader />}>
    <ScrollToTop />
    <PageTracker />
    <Routes>
      {/* Main store */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/trader/register" element={<TraderRegisterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:slug" element={<CategoryDetailPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/brands/:slug" element={<BrandDetailPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile/location" element={<LocationPage />} />
        <Route path="/profile/payment" element={<PaymentMethodPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/returns/request" element={<ReturnRequestPage />} />
        <Route path="/returns/my-returns" element={<MyReturnsPage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/how-to-pay" element={<HowToPayPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/cookie-preferences" element={<CookiePreferencePage />} />
        <Route path="/cookie-notice" element={<CookieNoticePage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/loyalty" element={<LoyaltyPage />} />
        <Route path="/profile/settings" element={<ProfileSettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Trader dashboard */}
      <Route path="/trader/dashboard" element={<TraderLayout />}>
        <Route index element={<TraderOverview />} />
        <Route path="products" element={<TraderProducts />} />
        <Route path="add-product" element={<TraderProductForm />} />
        <Route path="products/:id/edit" element={<TraderProductForm />} />
        <Route path="profile" element={<TraderProfilePage />} />
        <Route path="flash-deals" element={<TraderFlashDeals />} />
        <Route path="orders" element={<TraderOrders />} />
        <Route path="chat" element={<TraderChat />} />
      </Route>

      {/* Admin dashboard */}
      <Route path="/admin/dashboard" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="traders" element={<AdminTraders />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="chat" element={<AdminChat />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="returns" element={<AdminReturns />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="insights" element={<AdminInsights />} />
        <Route path="employees" element={<AdminEmployees />} />
      </Route>
    </Routes>
    </Suspense>
  </ChunkErrorBoundary>
);

export default AppRoutes;
