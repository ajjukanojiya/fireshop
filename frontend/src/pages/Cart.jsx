import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
// Header removed - managed by MainLayout

export default function CartPage() {
  const { items, total, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const inc = async (it) => { await updateCartItem(it.id, it.quantity + 1, it.meta); };
  const dec = async (it) => { if (it.quantity <= 1) return; await updateCartItem(it.id, it.quantity - 1, it.meta); };

  const removeItem = async (it) => {
    // Replaced confirm with direct action + Undo toast (optional, but effectively just toast for now)
    await removeFromCart(it.id);
    addToast('Item removed from cart', 'info');
  };

  const doClear = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;
    await clearCart();
    addToast('Cart cleared', 'info');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Mock Calculations for "Price Details"
  const totalMRP = items.reduce((acc, it) => acc + (Math.floor((it.product?.price || 0) * 1.35) * it.quantity), 0);
  const totalDiscount = totalMRP - total;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Go ahead and explore our top categories.</p>
            <Link to="/" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-red-200">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Cart Items List */}
            <div className="flex-1 space-y-4">
              {items.map((it) => {
                const mrp = Math.floor((it.product?.price || 0) * 1.35);
                return (
                  <div key={it.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 md:gap-6 items-start animate-fade-in-up">
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                      <img src={it.product?.thumbnail_url} alt={it.product?.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-h-[96px] md:min-h-[128px]">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900 text-lg line-clamp-2 md:line-clamp-1">{it.product?.title}</h3>
                          <button onClick={() => removeItem(it)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{it.product?.category?.name || 'General'}</div>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button onClick={() => dec(it)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors" disabled={it.quantity <= 1}>-</button>
                            <div className="w-10 text-center font-semibold text-gray-900 border-x border-gray-200 py-1 text-sm">{it.quantity}</div>
                            <button onClick={() => inc(it)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">+</button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-sm text-gray-400 line-through">₹ {mrp}</span>
                            <span className="text-red-600 text-xs font-bold px-1.5 py-0.5 bg-red-50 rounded">35% OFF</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900">₹ {(it.product?.price || 0).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="flex items-center justify-between pt-4">
                <button onClick={doClear} className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors underline">Clear entire cart</button>
              </div>
            </div>

            {/* Order Summary & Checkout */}
            <div className="lg:w-96 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Price Details</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Price ({items.length} items)</span>
                    <span>₹ {totalMRP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>- ₹ {totalDiscount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200 my-4"></div>

                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-gray-900 text-lg">Total Amount</span>
                  <span className="font-bold text-gray-900 text-xl">₹ {total.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gray-900 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <span>Safe and Secure Payments. 100% Authentic.</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
