import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import confetti from "canvas-confetti";

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useAuth();

  const orderNumber = location.state?.orderNumber;
  const total = location.state?.total;

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    clearCart();
  }, []);

  if (!orderNumber) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-20 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your order #{orderNumber} has been placed successfully.
          </p>

          <div className="text-left bg-gray-50 p-4 rounded mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order Total:</span>
              <span className="font-semibold">€{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-500 font-semibold">Confirmed</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/for-art-lovers")}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
