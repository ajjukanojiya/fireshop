import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import GuestCheckout from "./pages/GuestCheckout";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrders from "./pages/MyOrders";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDetail from "./pages/OrderDetail";
import Header from "./components/Header";


export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/product/:id" element={<Product/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/verify-otp" element={<VerifyOtp/>} />
      <Route path="/guest-checkout" element={<GuestCheckout/>} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      {/* <Route path="/orders" element={<MyOrders />} /> */}
      <Route path="/order/:orderId" element={<OrderConfirmation />} />
      <Route path="/order-success/:orderId" element={<OrderSuccess />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/my-orders/:id" element={<OrderDetail/>} />
      
    </Routes>
  );
}
