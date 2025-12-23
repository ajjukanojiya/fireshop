import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useToast } from "../contexts/ToastContext";

export default function CheckoutPage() {
  const { items = [], reload, total } = useCart();
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // razorpay, cod

  // Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // Redirect guests to Guest Checkout
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!userLoading && !user && !token) {
      navigate('/guest-checkout');
    }
  }, [user, userLoading, navigate]);

  // Load saved addresses
  React.useEffect(() => {
    if (user) {
      loadSavedAddresses();
    }
  }, [user]);

  const loadSavedAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      // Fix: API returns { data: [...] }
      const addressList = res.data.data || [];
      setSavedAddresses(addressList);
      // Auto-select default address if exists
      const defaultAddr = addressList.find(a => a.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setAddress({
          name: defaultAddr.name,
          street: defaultAddr.street,
          city: defaultAddr.city,
          zip: defaultAddr.zip,
          phone: defaultAddr.phone
        });
      } else if (addressList.length > 0) {
        // Select first address if no default
        const firstAddr = addressList[0];
        setSelectedAddressId(firstAddr.id);
        setAddress({
          name: firstAddr.name,
          street: firstAddr.street,
          city: firstAddr.city,
          zip: firstAddr.zip,
          phone: firstAddr.phone
        });
      } else {
        // No saved addresses, show form
        setShowNewAddressForm(true);
      }
    } catch (error) {
      console.error('Failed to load addresses', error);
      setShowNewAddressForm(true);
    }
  };

  const handleAddressSelect = (addr) => {
    setSelectedAddressId(addr.id);
    setAddress({
      name: addr.name,
      street: addr.street,
      city: addr.city,
      zip: addr.zip,
      phone: addr.phone
    });
    setShowNewAddressForm(false);
  };

  // Address State
  const [address, setAddress] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    zip: '',
    phone: user?.phone || ''
  });

  // Sync user data to address when user loads
  React.useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        // prioritize user profile data if it exists, else keep what user typed or empty
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
        street: prev.street || user.street || '',
        city: prev.city || user.city || '',
        zip: prev.zip || user.zip || ''
      }));
    }
  }, [user]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleRazorpayPayment = async () => {
    // Validate address
    if (!address.name || !address.street || !address.phone || !address.city || !address.zip) {
      addToast("Please fill in all address details", "error");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create Razorpay Order
      const orderRes = await api.post("/test-payment-config", {
        amount: total,
      });

      const { order_id, amount, currency, key } = orderRes.data;

      // Step 2: Open Razorpay Checkout
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "Fireshop",
        description: "Order Payment",
        // order_id: order_id,
        handler: async function (response) {
          try {
            // Step 3: Verify Payment
            const verifyRes = await api.post("/verify-razorpay-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address: address,
            });

            const order = verifyRes?.data?.order;
            await reload();
            addToast("Payment successful!", "success");
            navigate(`/order/${order.id}`);
          } catch (e) {
            console.error("Verification error:", e);
            const msg = e.response?.data?.message || "Payment verification failed";
            addToast(msg, "error");
          }
        },
        prefill: {
          name: address.name,
          contact: address.phone,
        },
        theme: {
          color: "#dc2626",
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI (GPay/PhonePe)",
                instruments: [
                  {
                    method: "upi"
                  }
                ]
              }
            },
            sequence: ["block.upi"],
            preferences: {
              show_default_blocks: true
            }
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error("Razorpay error:", e);
      addToast(e?.response?.data?.message || "Payment failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    // If Razorpay, use separate flow
    if (paymentMethod === 'razorpay') {
      return handleRazorpayPayment();
    }

    // Validate all fields
    if (!address.name || !address.street || !address.phone || !address.city || !address.zip) {
      addToast("Please fill in all address details (City, Pincode, etc.)", "error");
      return;
    }

    if (paymentMethod === 'upi') {
      if (!upiId) {
        addToast("Please enter your UPI ID", "error");
        return;
      }
      // Basic strict regex for UPI: accepted chars @ accepted chars
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiRegex.test(upiId)) {
        addToast("Invalid UPI ID format. Example: user@oksbi", "error");
        return;
      }
    }

    setLoading(true);

    try {
      // Send structure that matches backend expectation
      const payload = {
        address: address, // sending full object
        payment_method: paymentMethod,
        payment_details: {}
      };

      const res = await api.post("/checkout", payload);

      const order = res?.data?.order ?? res?.data;
      const orderId = order?.id ?? order?.order_id ?? null;

      if (!orderId) {
        addToast(res?.data?.message || "Order placed successfully", "success");
        await reload();
        navigate("/");
        return;
      }

      await reload();
      addToast("Order placed successfully!", "success");
      navigate(`/order/${orderId}`);

    } catch (e) {
      console.error("Checkout error:", e);
      addToast(e?.response?.data?.message || "Checkout failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-white p-6 rounded-full shadow-sm mb-4">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="mt-4 text-red-600 font-medium hover:underline">Start Shopping</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: Forms */}
          <div className="flex-1 space-y-6">

            {/* 1. Address Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Saved Addresses Selection */}
                {savedAddresses.length > 0 && (
                  <div className="md:col-span-2 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-gray-500 uppercase">Select Saved Address</label>
                      <button
                        onClick={() => {
                          setSelectedAddressId(null);
                          setAddress({ name: '', street: '', city: '', zip: '', phone: '' });
                        }}
                        className="text-xs text-red-600 font-bold hover:underline"
                      >
                        + Add New Address
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {savedAddresses.map(addr => (
                        <div
                          key={addr.id}
                          onClick={() => handleAddressSelect(addr)}
                          className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          <div className="flex justify-between">
                            <span className="font-bold text-sm text-gray-800">{addr.label}</span>
                            {selectedAddressId === addr.id && <span className="text-red-600 text-xs font-bold">✓ Selected</span>}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-1">{addr.name}, {addr.phone}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{addr.street}, {addr.city}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
                  <input name="name" value={address.name} onChange={handleAddressChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">Phone Number</label>
                  <input name="phone" value={address.phone} onChange={handleAddressChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all" placeholder="+91 98765 43210" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">Address (House No, Street, Area)</label>
                  <input name="street" value={address.street} onChange={handleAddressChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all" placeholder="Flat 101, Building Name, Street..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">City</label>
                  <input name="city" value={address.city} onChange={handleAddressChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all" placeholder="Mumbai" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">Pincode</label>
                  <input name="zip" value={address.zip} onChange={handleAddressChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all" placeholder="400001" />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Payment Method
              </h2>

              <div className="space-y-3">

                {/* Razorpay Option */}
                <div className={`border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-red-500 bg-red-50/50 ring-1 ring-red-500' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setPaymentMethod('razorpay')}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-red-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'razorpay' && <div className="w-3 h-3 bg-red-600 rounded-full"></div>}
                    </div>
                    <span className="font-bold text-gray-800">Razorpay (UPI, Cards, Wallets)</span>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-auto">Recommended</span>
                  </div>

                  {paymentMethod === 'razorpay' && (
                    <div className="mt-4 pl-8 animate-fade-in text-sm text-gray-600">
                      <p className="mb-2">Pay securely using Credit/Debit Card, Netbanking, or UPI Apps (GPay, PhonePe).</p>
                      <div className="flex items-center gap-2 text-xs text-green-600 font-medium bg-green-50 p-2 rounded border border-green-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Secure Popup will open after clicking "Place Order"
                      </div>
                    </div>
                  )}
                </div>


                {/* COD Option */}
                <div className={`border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-red-500 bg-red-50/50 ring-1 ring-red-500' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setPaymentMethod('cod')}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-red-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'cod' && <div className="w-3 h-3 bg-red-600 rounded-full"></div>}
                    </div>
                    <span className="font-bold text-gray-800">Cash on Delivery</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Order Summary</h3>

              <div className="max-h-60 overflow-y-auto pr-2 space-y-3 mb-6 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex-shrink-0">
                      <img src={item.product?.thumbnail_url} className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 line-clamp-1">{item.product?.title}</div>
                      <div className="text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold">₹ {((item.product?.price || 0) * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹ {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between items-center pt-2 font-bold text-gray-900 text-lg border-t border-dashed">
                  <span>Total Pay</span>
                  <span>₹ {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-red-200 transition-all active:scale-[0.98] disabled:bg-gray-400 disabled:shadow-none"
              >
                {loading ? 'Processing...' : `Place Order • ₹ ${total.toLocaleString()}`}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                By placing order, you agree to our Terms & Conditions.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
