import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import FormInputCheckout from "../components/common/FormInputCheckout";
import { toast } from "react-hot-toast";
import { MdArrowBack } from "react-icons/md";

export default function CheckoutPage() {
  const { cart, currentUser, calculateTotal, savePurchase } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Processing payment...", { id: "checkout" });
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      await savePurchase(cart); // Save purchase to Firestore
      toast.success("Order placed successfully!", { id: "checkout" });
      navigate("/checkout/success", {
        state: {
          orderNumber: Math.floor(Math.random() * 1000),
          total: calculateTotal(),
        },
      });
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Failed to complete purchase", { id: "checkout" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-20 px-4">
      {/* Demo Banner */}
      <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded-lg mb-8 max-w-4xl mx-auto">
        <p className="text-center font-medium">
          Demo Mode: This is a simulation. No real payments will be processed.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Back to Cart */}
        <button
          onClick={() => {
            navigate("/cart");
          }}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900"
        >
          <MdArrowBack />
          Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Shipping Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields */}
                <div className="grid grid-cols-2 gap-4">
                  <FormInputCheckout
                    placeholder="First Name"
                    defaultValue={currentUser?.firstName}
                    required
                  />
                  <FormInputCheckout
                    placeholder="Last Name"
                    defaultValue={currentUser?.lastName}
                    required
                  />
                </div>
                <FormInputCheckout
                  type="email"
                  placeholder="Email"
                  defaultValue={currentUser?.email}
                  required
                />
                <FormInputCheckout placeholder="Address" required />
                <div className="grid grid-cols-2 gap-4">
                  <FormInputCheckout placeholder="City" required />
                  <FormInputCheckout placeholder="Postal Code" required />
                </div>
                <FormInputCheckout placeholder="Country" required />

                <h2 className="text-xl font-semibold mb-4 mt-8">
                  Payment Information
                </h2>
                <FormInputCheckout
                  placeholder="Card Number"
                  required
                  maxLength="16"
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInputCheckout
                    placeholder="MM/YY"
                    required
                    maxLength="5"
                  />
                  <FormInputCheckout placeholder="CVV" required maxLength="3" />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 mt-6"
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b">
                  <img
                    src={item.urls?.small || item.imageUrl}
                    alt={item.alt_description || item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {item.alt_description || item.title || "Untitled"}
                    </h3>
                    <p className="text-gray-600">
                      {item.user?.name || "Unknown Artist"}
                    </p>
                    <div className="flex justify-between mt-2">
                      <span>Qty: {item.quantity || 1}</span>
                      <span>
                        €{(item.price * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{calculateTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>€{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
