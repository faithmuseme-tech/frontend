import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import TraderLayout from "../layouts/TraderLayout";

const Home = lazy(() => import("../pages/Home/Home"));
const Shop = lazy(() => import("../pages/Shop/Shop"));
const ProductPage = lazy(() => import("../pages/Product/ProductPage"));
const CartPage = lazy(() => import("../pages/Cart/CartPage"));
const CheckoutPage = lazy(() => import("../pages/Checkout/CheckoutPage"));
const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Register/RegisterPage"));
const SuccessPage = lazy(() => import("../pages/Success/SuccessPage"));
const TraderRegisterPage = lazy(() => import("../pages/Trader/TraderRegisterPage"));
const TraderOverview = lazy(() => import("../pages/Trader/Dashboard/TraderOverview"));
const TraderProducts = lazy(() => import("../pages/Trader/Dashboard/TraderProducts"));
const TraderProductForm = lazy(() => import("../pages/Trader/Dashboard/TraderProductForm"));
const TraderProfilePage = lazy(() => import("../pages/Trader/Dashboard/TraderProfilePage"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminOverview = lazy(() => import("../pages/Admin/Dashboard/AdminOverview"));
const AdminUsers = lazy(() => import("../pages/Admin/Dashboard/AdminUsers"));
const AdminTraders = lazy(() => import("../pages/Admin/Dashboard/AdminTraders"));
const AdminOrders = lazy(() => import("../pages/Admin/Dashboard/AdminOrders"));
const AdminProducts = lazy(() => import("../pages/Admin/Dashboard/AdminProducts"));
const AdminCategories = lazy(() => import("../pages/Admin/Dashboard/AdminCategories"));
const OrdersPage = lazy(() => import("../pages/Orders/OrdersPage"));
const LocationPage = lazy(() => import("../pages/Location/LocationPage"));
const PaymentMethodPage = lazy(() => import("../pages/PaymentMethod/PaymentMethodPage"));
const SearchPage = lazy(() => import("../pages/Search/SearchPage"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

const Loader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<Loader />}>
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
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile/location" element={<LocationPage />} />
        <Route path="/profile/payment" element={<PaymentMethodPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Trader dashboard */}
      <Route path="/trader/dashboard" element={<TraderLayout />}>
        <Route index element={<TraderOverview />} />
        <Route path="products" element={<TraderProducts />} />
        <Route path="add-product" element={<TraderProductForm />} />
        <Route path="products/:id/edit" element={<TraderProductForm />} />
        <Route path="profile" element={<TraderProfilePage />} />
      </Route>

      {/* Admin dashboard */}
      <Route path="/admin/dashboard" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="traders" element={<AdminTraders />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
