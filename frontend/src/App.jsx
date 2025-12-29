import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import GuestCheckout from "./pages/GuestCheckout";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrders from "./pages/MyOrders";
import MyWallet from "./pages/MyWallet";
import MyAddresses from './pages/MyAddresses';
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDetail from "./pages/OrderDetail";
import Header from "./components/Header";
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminDeliveryBoys from "./pages/admin/DeliveryBoys";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminPayments from "./pages/admin/Payments";
import AdminOnlinePayments from "./pages/admin/OnlinePayments";
import AdminReports from "./pages/admin/Reports";
import AdminRefunds from "./pages/admin/Refunds";
import { ToastProvider } from "./contexts/ToastContext";
import TestPanel from "./pages/TestPanel";
import DeliveryDashboard from "./pages/delivery/Dashboard";


export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/guest-checkout" element={<GuestCheckout />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:orderId" element={<OrderConfirmation />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-wallet" element={<MyWallet />} />
          <Route path="/my-addresses" element={<MyAddresses />} />
          <Route path="/my-orders/:id" element={<OrderDetail />} />
        </Route>

        <Route path="/test-panel" element={<TestPanel />} />
        <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="delivery-boys" element={<AdminDeliveryBoys />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="online-payments" element={<AdminOnlinePayments />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="refunds" element={<AdminRefunds />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}
