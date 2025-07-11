import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    currentUser,
    cart,
    removeFromCart,
    updateCartItemQuantity,
    calculateTotal,
  } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch fresh artwork data for each cart item
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!cart.length) {
        setLoading(false);
        return;
      }

      try {
        const freshCartItems = await Promise.all(
          cart.map(async (item) => {
            const artworkDoc = await getDoc(doc(db, "artworks", item.id));
            if (artworkDoc.exists()) {
              const artworkData = artworkDoc.data();
              return {
                ...item,
                user: artworkData.user,
                title: artworkData.title || artworkData.alt_description,
                imageUrl: artworkData.imageUrl || artworkData.urls?.regular,
              };
            }
            return item;
          })
        );
        setCartItems(freshCartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Error loading cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [cart]);

  // Handle checkout process
  const handleCheckout = () => {
    if (!currentUser) {
      const wantsToSignIn = window.confirm(
        "Would you like to sign in? Click OK to sign in or Cancel to continue as guest."
      );
      if (wantsToSignIn) {
        navigate("/login", {
          state: {
            returnTo: "/cart",
            message: "Sign in to complete your purchase",
          },
        });
        return;
      }
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="pt-12 pb-20 px-4 container mx-auto min-h-screen">
        Loading...
      </div>
    );
  }

  // Show empty cart state
  if (cart.length === 0) {
    return (
      <div className="pt-12 pb-20 px-4 container mx-auto min-h-screen bg-var(--bg)" style={{ backgroundColor: 'var(--bg)', fontFamily: 'var(--font-mono)' }}>
        <h1 className="text-3xl font-bold text-center mb-8 text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Your cart is empty</p>
          <button
            onClick={() => navigate("/for-art-lovers")}
            className="mt-4 bg-var(--accent) font-bold text-var(--bg) px-12 py-3 border-2 border-var(--accent) hover:bg-opacity-80 transition-colors duration-300"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
          >
            Explore Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-20 px-4 container mx-auto min-h-screen bg-var(--bg)" style={{ backgroundColor: 'var(--bg)', fontFamily: 'var(--font-mono)' }}>
      <h1 className="text-3xl font-bold mb-8 text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Shopping Cart</h1>

      {/* Back button */}
      <button
        onClick={() => navigate("/for-art-lovers")}
        className="flex items-center gap-2 mb-6 text-var(--text) hover:text-var(--accent) border-2 border-var(--accent) px-4 py-2"
        style={{ color: 'var(--text)', borderColor: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
      >
        <MdArrowBack /> Continue Shopping
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 bg-var(--bg) border-2 border-var(--accent) p-4"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--accent)' }}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full sm:w-32 h-48 sm:h-32 object-cover border-2 border-var(--accent)"
                style={{ borderColor: 'var(--accent)' }}
              />
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                    {item.title.charAt(0).toUpperCase() +
                      item.title.slice(1).toLowerCase()}
                  </h3>
                  <p className="text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                    {item.user?.name || "Unknown Artist"}
                  </p>
                  <span className="font-bold text-lg text-var(--accent)" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                    €{parseFloat(item.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col items-right gap-4 pt-2">
                  <div className="flex justify-between sm:justify-end items-center flex-1 gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateCartItemQuantity(
                            item.id,
                            (item.quantity || 1) - 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center bg-var(--bg) border-2 border-var(--accent) hover:bg-var(--accent) hover:text-var(--bg) text-var(--accent)"
                        style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--accent)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() =>
                          updateCartItemQuantity(
                            item.id,
                            (item.quantity || 1) + 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center bg-var(--bg) border-2 border-var(--accent) hover:bg-var(--accent) hover:text-var(--bg) text-var(--accent)"
                        style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--accent)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-var(--accent) hover:text-opacity-80 border-2 border-var(--accent) p-2"
                      style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  {(item.quantity || 1) > 1 && (
                    <p className="text-sm text-var(--text) sm:text-right" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                      Subtotal: €
                      {(parseFloat(item.price) * (item.quantity || 1)).toFixed(
                        2
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-var(--bg) border-2 border-var(--accent) p-6 h-fit" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--accent)' }}>
          <h2 className="text-xl font-bold mb-4 text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              <span>Subtotal</span>
              <span>€{calculateTotal()}</span>
            </div>
            <div className="flex justify-between text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t-2 border-var(--accent) pt-2 mt-2" style={{ borderColor: 'var(--accent)' }}>
              <div className="flex justify-between font-bold text-var(--accent)" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                <span>Total</span>
                <span>€{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            className="w-full bg-var(--accent) text-var(--bg) py-3 border-2 border-var(--accent) hover:bg-opacity-80"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
            onClick={handleCheckout}
          >
            {currentUser ? "Proceed to Checkout" : "Checkout as Guest"}
          </button>

          {/* Sign in prompt for guests */}
          {!currentUser && (
            <p className="text-sm text-var(--text) mt-2 text-center" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              Have an account?{" "}
              <button
                onClick={() =>
                  navigate("/login", {
                    state: { returnTo: "/cart" },
                  })
                }
                className="text-var(--accent) hover:underline"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
