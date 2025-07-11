import { describe, it, expect, vi, beforeEach } from "vitest";
import { toast } from "react-hot-toast";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock toast notifications
vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock auth context
const mockUseAuth = vi.fn();
vi.mock("../src/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
  AuthContext: { Provider: ({ children }) => children },
}));

// Test artwork data
const TEST_ARTWORK = {
  id: "123",
  title: "Test Artwork",
  price: 100,
  urls: {
    regular: "regular-url",
    small: "small-url",
  },
  user: {
    name: "Test Artist",
    profile_image: {
      small: "profile-url",
    },
  },
  alt_description: "Test description",
  size: "medium",
};

const createMockAuth = (overrides = {}) => ({
  currentUser: null,
  cart: [],
  addToCart: vi.fn(),
  ...overrides,
});

// *********************
// TESTS
// *********************

describe("Cart Functions", () => {
  let mockCart;

  beforeEach(() => {
    mockCart = [];
    vi.clearAllMocks();
    localStorage.clear();
  });

  // *********************
  // addToCart
  // *********************

  describe("addToCart", () => {
    describe("guest user", () => {
      it("adds new item to empty cart", async () => {
        mockUseAuth.mockReturnValue(
          createMockAuth({
            cart: mockCart,
            addToCart: vi.fn().mockImplementation(async (artwork) => {
              const itemToAdd = {
                id: artwork.id,
                title: artwork.title || artwork.alt_description || "Untitled",
                price: artwork.price || 0,
                quantity: 1,
                imageUrl: artwork.urls?.small || artwork.imageUrl,
                urls: {
                  regular: artwork.urls?.regular || artwork.imageUrl,
                  small: artwork.urls?.small || artwork.imageUrl,
                },
                user: {
                  name: artwork.user?.name || "Unknown Artist",
                  profile_image: {
                    small: artwork.user?.profile_image?.small || "",
                  },
                },
                alt_description: artwork.alt_description || "",
                size: artwork.size || null,
              };

              mockCart.push(itemToAdd);
              localStorage.setItem("guestCart", JSON.stringify(mockCart));
              toast.success("Added to cart");
              return true;
            }),
          })
        );

        const { addToCart } = mockUseAuth();
        await addToCart(TEST_ARTWORK);
        const { cart } = mockUseAuth();

        expect(cart).toHaveLength(1);
        expect(cart[0]).toMatchObject({
          id: TEST_ARTWORK.id,
          title: TEST_ARTWORK.title,
          price: TEST_ARTWORK.price,
          quantity: 1,
          urls: TEST_ARTWORK.urls,
          user: TEST_ARTWORK.user,
          alt_description: TEST_ARTWORK.alt_description,
          size: TEST_ARTWORK.size,
        });
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "guestCart",
          JSON.stringify(cart)
        );
        expect(toast.success).toHaveBeenCalledWith("Added to cart");
      });

      it("increases quantity when adding existing item", async () => {
        mockCart = [
          {
            ...TEST_ARTWORK,
            quantity: 1,
          },
        ];

        mockUseAuth.mockReturnValue(
          createMockAuth({
            cart: mockCart,
            addToCart: vi.fn().mockImplementation(async (artwork) => {
              const existingItemIndex = mockCart.findIndex(
                (item) => item.id === artwork.id
              );
              mockCart[existingItemIndex].quantity += 1;
              localStorage.setItem("guestCart", JSON.stringify(mockCart));
              toast.success("Added one more to cart");
              return true;
            }),
          })
        );

        const { addToCart } = mockUseAuth();
        await addToCart(TEST_ARTWORK);
        const { cart } = mockUseAuth();

        expect(cart[0].quantity).toBe(2);
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "guestCart",
          JSON.stringify(cart)
        );
        expect(toast.success).toHaveBeenCalledWith("Added one more to cart");
      });

      it("handles missing artwork properties gracefully", async () => {
        const incompleteArtwork = {
          id: "123",
          // Missing other properties
        };

        mockUseAuth.mockReturnValue(
          createMockAuth({
            cart: mockCart,
            addToCart: vi.fn().mockImplementation(async (artwork) => {
              const itemToAdd = {
                id: artwork.id,
                title: "Untitled",
                price: 0,
                quantity: 1,
                imageUrl: "",
                urls: { regular: "", small: "" },
                user: { name: "Unknown Artist", profile_image: { small: "" } },
                alt_description: "",
                size: null,
              };
              mockCart.push(itemToAdd);
              localStorage.setItem("guestCart", JSON.stringify(mockCart));
              toast.success("Added to cart");
              return true;
            }),
          })
        );

        const { addToCart } = mockUseAuth();
        await addToCart(incompleteArtwork);
        const { cart } = mockUseAuth();

        expect(cart[0].title).toBe("Untitled");
        expect(cart[0].price).toBe(0);
        expect(cart[0].user.name).toBe("Unknown Artist");
      });
    });

    describe("logged in user", () => {
      it("saves to Firestore instead of localStorage", async () => {
        mockUseAuth.mockReturnValue(
          createMockAuth({
            currentUser: { uid: "user123" },
            cart: mockCart,
            addToCart: vi.fn().mockImplementation(async (artwork) => {
              const itemToAdd = {
                id: artwork.id,
                title: artwork.title,
                price: artwork.price,
                quantity: 1,
                imageUrl: artwork.urls.small,
                urls: {
                  regular: artwork.urls.regular,
                  small: artwork.urls.small,
                },
                user: {
                  name: artwork.user.name,
                  profile_image: {
                    small: artwork.user.profile_image.small,
                  },
                },
              };
              mockCart.push(itemToAdd);
              toast.success("Added to cart");
              return true;
            }),
          })
        );

        const { addToCart } = mockUseAuth();
        await addToCart(TEST_ARTWORK);
        const { cart } = mockUseAuth();

        expect(cart).toHaveLength(1);
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith("Added to cart");
      });
    });

    describe("error handling", () => {
      it("handles general errors", async () => {
        mockUseAuth.mockReturnValue(
          createMockAuth({
            addToCart: vi.fn().mockImplementation(async () => {
              toast.error("Failed to add to cart");
              throw new Error("Failed to add to cart");
            }),
          })
        );

        const { addToCart } = mockUseAuth();
        await expect(addToCart(TEST_ARTWORK)).rejects.toThrow(
          "Failed to add to cart"
        );
        expect(toast.error).toHaveBeenCalledWith("Failed to add to cart");
      });

      it("handles invalid input", async () => {
        mockUseAuth.mockReturnValue(
          createMockAuth({
            addToCart: vi.fn().mockImplementation(async (artwork) => {
              if (!artwork || !artwork.id) {
                toast.error("Invalid artwork data");
                throw new Error("Invalid artwork data");
              }
            }),
          })
        );

        const { addToCart } = mockUseAuth();
        await expect(addToCart(null)).rejects.toThrow("Invalid artwork data");
        expect(toast.error).toHaveBeenCalledWith("Invalid artwork data");
      });
    });
  });

  // *********************
  // updateCartItemQuantity
  // *********************

  describe("updateCartItemQuantity", () => {
    describe("guest user", () => {
      it("updates item quantity when new quantity >= 1", async () => {
        mockCart = [
          {
            ...TEST_ARTWORK,
            quantity: 1,
          },
        ];

        mockUseAuth.mockReturnValue(
          createMockAuth({
            cart: mockCart,
            updateCartItemQuantity: vi
              .fn()
              .mockImplementation(async (artworkId, newQuantity) => {
                const itemIndex = mockCart.findIndex(
                  (item) => item.id === artworkId
                );
                mockCart[itemIndex].quantity = newQuantity;
                localStorage.setItem("guestCart", JSON.stringify(mockCart));
              }),
          })
        );

        const { updateCartItemQuantity } = mockUseAuth();
        await updateCartItemQuantity("123", 3);
        const { cart } = mockUseAuth();

        expect(cart[0].quantity).toBe(3);
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "guestCart",
          JSON.stringify(cart)
        );
      });

      it("removes item when new quantity < 1", async () => {
        mockCart = [
          {
            ...TEST_ARTWORK,
            quantity: 1,
          },
        ];

        mockUseAuth.mockReturnValue(
          createMockAuth({
            cart: mockCart,
            updateCartItemQuantity: vi
              .fn()
              .mockImplementation(async (artworkId, newQuantity) => {
                if (newQuantity < 1) {
                  const updatedCart = mockCart.filter(
                    (item) => item.id !== artworkId
                  );
                  mockCart.length = 0; // Clear the original array
                  mockCart.push(...updatedCart); // Update with new items
                  localStorage.setItem("guestCart", JSON.stringify(mockCart));
                }
              }),
          })
        );

        const { updateCartItemQuantity } = mockUseAuth();
        await updateCartItemQuantity("123", 0);
        const { cart } = mockUseAuth();

        expect(cart).toHaveLength(0);
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "guestCart",
          JSON.stringify(cart)
        );
      });
    });

    describe("logged in user", () => {
      it("updates Firestore instead of localStorage", async () => {
        mockCart = [
          {
            ...TEST_ARTWORK,
            quantity: 1,
          },
        ];

        mockUseAuth.mockReturnValue(
          createMockAuth({
            currentUser: { uid: "user123" },
            cart: mockCart,
            updateCartItemQuantity: vi
              .fn()
              .mockImplementation(async (artworkId, newQuantity) => {
                const itemIndex = mockCart.findIndex(
                  (item) => item.id === artworkId
                );
                mockCart[itemIndex].quantity = newQuantity;
              }),
          })
        );

        const { updateCartItemQuantity } = mockUseAuth();
        await updateCartItemQuantity("123", 2);
        const { cart } = mockUseAuth();

        expect(cart[0].quantity).toBe(2);
        expect(localStorage.setItem).not.toHaveBeenCalled();
      });
    });

    describe("error handling", () => {
      it("shows error toast on failure", async () => {
        mockUseAuth.mockReturnValue(
          createMockAuth({
            updateCartItemQuantity: vi.fn().mockImplementation(async () => {
              toast.error("Failed to update quantity");
              throw new Error("Failed to update quantity");
            }),
          })
        );

        const { updateCartItemQuantity } = mockUseAuth();
        await expect(updateCartItemQuantity("123", 2)).rejects.toThrow();
        expect(toast.error).toHaveBeenCalledWith("Failed to update quantity");
      });
    });
  });

  // *********************
  // removeFromCart
  // *********************

  describe("removeFromCart", () => {
    describe("guest user", () => {
      it("removes item from cart and localStorage", async () => {
        mockCart = [
          {
            ...TEST_ARTWORK,
            quantity: 1,
          },
        ];

        mockUseAuth.mockReturnValue(
          createMockAuth({
            cart: mockCart,
            removeFromCart: vi.fn().mockImplementation(async (artworkId) => {
              const updatedCart = mockCart.filter(
                (item) => item.id !== artworkId
              );
              mockCart.length = 0;
              mockCart.push(...updatedCart);
              localStorage.setItem("guestCart", JSON.stringify(mockCart));
            }),
          })
        );

        const { removeFromCart } = mockUseAuth();
        await removeFromCart("123");
        const { cart } = mockUseAuth();

        expect(cart).toHaveLength(0);
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "guestCart",
          JSON.stringify(cart)
        );
      });
    });

    describe("logged in user", () => {
      it("removes item from cart and Firestore", async () => {
        mockCart = [
          {
            ...TEST_ARTWORK,
            quantity: 1,
          },
        ];

        mockUseAuth.mockReturnValue(
          createMockAuth({
            currentUser: { uid: "user123" },
            cart: mockCart,
            removeFromCart: vi.fn().mockImplementation(async (artworkId) => {
              const updatedCart = mockCart.filter(
                (item) => item.id !== artworkId
              );
              mockCart.length = 0;
              mockCart.push(...updatedCart);
            }),
          })
        );

        const { removeFromCart } = mockUseAuth();
        await removeFromCart("123");
        const { cart } = mockUseAuth();

        expect(cart).toHaveLength(0);
        expect(localStorage.setItem).not.toHaveBeenCalled();
      });
    });

    describe("error handling", () => {
      it("shows error toast on failure", async () => {
        mockUseAuth.mockReturnValue(
          createMockAuth({
            removeFromCart: vi.fn().mockImplementation(async () => {
              toast.error("Failed to remove from cart");
              throw new Error("Failed to remove from cart");
            }),
          })
        );

        const { removeFromCart } = mockUseAuth();
        await expect(removeFromCart("123")).rejects.toThrow(
          "Failed to remove from cart"
        );
        expect(toast.error).toHaveBeenCalledWith("Failed to remove from cart");
      });
    });
  });

  // *********************
  // clearCart
  // *********************

  describe("clearCart", () => {
    describe("guest user", () => {
      it("clears cart state and localStorage", async () => {
        mockCart = [
          {
            ...TEST_ARTWORK,
            quantity: 1,
          },
        ];

        mockUseAuth.mockReturnValue(
          createMockAuth({
            cart: mockCart,
            clearCart: vi.fn().mockImplementation(async () => {
              mockCart.length = 0;
              localStorage.removeItem("guestCart");
            }),
          })
        );

        const { clearCart } = mockUseAuth();
        await clearCart();
        const { cart } = mockUseAuth();

        expect(cart).toHaveLength(0);
        expect(localStorage.removeItem).toHaveBeenCalledWith("guestCart");
      });
    });

    describe("logged in user", () => {
      it("clears cart in Firestore, state and localStorage", async () => {
        mockCart = [
          {
            ...TEST_ARTWORK,
            quantity: 1,
          },
        ];

        mockUseAuth.mockReturnValue(
          createMockAuth({
            currentUser: { uid: "user123" },
            cart: mockCart,
            clearCart: vi.fn().mockImplementation(async () => {
              mockCart.length = 0;
              localStorage.removeItem("guestCart");
            }),
          })
        );

        const { clearCart } = mockUseAuth();
        await clearCart();
        const { cart } = mockUseAuth();

        expect(cart).toHaveLength(0);
        expect(localStorage.removeItem).toHaveBeenCalledWith("guestCart");
      });
    });

    describe("error handling", () => {
      it("shows error toast on failure", async () => {
        mockUseAuth.mockReturnValue(
          createMockAuth({
            clearCart: vi.fn().mockImplementation(async () => {
              toast.error("Failed to clear cart");
              throw new Error("Failed to clear cart");
            }),
          })
        );

        const { clearCart } = mockUseAuth();
        await expect(clearCart()).rejects.toThrow("Failed to clear cart");
        expect(toast.error).toHaveBeenCalledWith("Failed to clear cart");
      });
    });
  });

  // *********************
  // calculateTotal
  // *********************

  describe("calculateTotal", () => {
    it("calculates total for cart with valid items", () => {
      mockCart = [
        { ...TEST_ARTWORK, price: 100, quantity: 2 },
        { ...TEST_ARTWORK, id: "456", price: 50, quantity: 1 },
      ];

      mockUseAuth.mockReturnValue(
        createMockAuth({
          cart: mockCart,
          calculateTotal: vi.fn().mockImplementation(() => {
            return mockCart.reduce((total, item) => {
              const price = parseFloat(item.price) || 0;
              const quantity = parseInt(item.quantity) || 1;
              return total + price * quantity;
            }, 0);
          }),
        })
      );

      const { calculateTotal } = mockUseAuth();
      const total = calculateTotal();

      expect(total).toBe(250); // (100 * 2) + (50 * 1)
    });

    it("handles items with missing prices or quantities", () => {
      mockCart = [
        { ...TEST_ARTWORK, price: undefined, quantity: 2 }, // Should use price 0
        { ...TEST_ARTWORK, id: "456", price: 50, quantity: undefined }, // Should use quantity 1
        { ...TEST_ARTWORK, id: "789", price: "invalid", quantity: "invalid" }, // Should use price 0, quantity 1
      ];

      mockUseAuth.mockReturnValue(
        createMockAuth({
          cart: mockCart,
          calculateTotal: vi.fn().mockImplementation(() => {
            return mockCart.reduce((total, item) => {
              const price = parseFloat(item.price) || 0;
              const quantity = parseInt(item.quantity) || 1;
              return total + price * quantity;
            }, 0);
          }),
        })
      );

      const { calculateTotal } = mockUseAuth();
      const total = calculateTotal();

      expect(total).toBe(50); // (0 * 2) + (50 * 1) + (0 * 1)
    });

    it("returns 0 for empty cart", () => {
      mockCart = [];

      mockUseAuth.mockReturnValue(
        createMockAuth({
          cart: mockCart,
          calculateTotal: vi.fn().mockImplementation(() => {
            return mockCart.reduce((total, item) => {
              const price = parseFloat(item.price) || 0;
              const quantity = parseInt(item.quantity) || 1;
              return total + price * quantity;
            }, 0);
          }),
        })
      );

      const { calculateTotal } = mockUseAuth();
      const total = calculateTotal();

      expect(total).toBe(0);
    });
  });
});
