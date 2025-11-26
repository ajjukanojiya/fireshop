import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import GuestCheckout from "./pages/GuestCheckout";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/CheckoutPage";


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
    </Routes>
  );
}
