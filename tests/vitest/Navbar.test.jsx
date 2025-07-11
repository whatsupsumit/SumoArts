import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../../src/components/layout/Navbar";

// Mock auth context
const mockUseAuth = vi.fn();
vi.mock("../src/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
  AuthContext: { Provider: ({ children }) => children },
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render the Navbar
const renderNavbar = (mockAuthReturnValue) => {
  mockUseAuth.mockReturnValue(mockAuthReturnValue);
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe("Navbar Favorites, Cart & User Icons Navigation", () => {
  // Reset navigation mocks before each test
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseAuth.mockClear();
  });

  // *********************
  // GUEST REDIRECTS
  // *********************

  it("redirects guest to login when clicking user icon", () => {
    renderNavbar({
      currentUser: null,
      isArtist: () => false,
      cart: [],
    });

    const userButton = screen.getByTestId("user-button");
    fireEvent.click(userButton);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/favorites");
    expect(mockNavigate).not.toHaveBeenCalledWith("/cart");
  });

  it("redirects guest to login when clicking favorites icon", () => {
    renderNavbar({
      currentUser: null,
      isArtist: () => false,
      cart: [],
    });

    const favoritesButton = screen.getByTestId("favorites-button");
    fireEvent.click(favoritesButton);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(mockNavigate).not.toHaveBeenCalledWith("/favorites");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/cart");
  });

  it("redirects guest to cart when clicking cart icon", () => {
    renderNavbar({
      currentUser: null,
      isArtist: () => false,
      cart: [],
    });

    const cartButton = screen.getByTestId("cart-button");
    fireEvent.click(cartButton);
    expect(mockNavigate).toHaveBeenCalledWith("/cart");
    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/favorites");
  });

  // *********************
  // ARTIST REDIRECTS
  // *********************

  it("redirects artist to artist dashboard when clicking user icon", () => {
    renderNavbar({
      currentUser: { email: "artist@test.com" },
      isArtist: () => true,
      cart: [],
    });

    const userButton = screen.getByTestId("user-button");
    fireEvent.click(userButton);
    expect(mockNavigate).toHaveBeenCalledWith("/artist-dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/favorites");
    expect(mockNavigate).not.toHaveBeenCalledWith("/cart");
  });

  it("redirects artist to favorites when clicking favorites icon", () => {
    renderNavbar({
      currentUser: { email: "artist@test.com" },
      isArtist: () => true,
      cart: [],
    });

    const favoritesButton = screen.getByTestId("favorites-button");
    fireEvent.click(favoritesButton);
    expect(mockNavigate).toHaveBeenCalledWith("/favorites");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
    expect(mockNavigate).not.toHaveBeenCalledWith("/cart");
  });

  it("redirects artist to cart when clicking cart icon", () => {
    renderNavbar({
      currentUser: { email: "artist@test.com" },
      isArtist: () => true,
      cart: [],
    });

    const cartButton = screen.getByTestId("cart-button");
    fireEvent.click(cartButton);
    expect(mockNavigate).toHaveBeenCalledWith("/cart");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
    expect(mockNavigate).not.toHaveBeenCalledWith("/favorites");
  });

  // *********************
  // ART LOVER REDIRECTS
  // *********************

  it("redirects art lover to dashboard when clicking user icon", () => {
    renderNavbar({
      currentUser: { email: "artlover@test.com" },
      isArtist: () => false,
      cart: [],
    });

    const userButton = screen.getByTestId("user-button");
    fireEvent.click(userButton);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/favorites");
    expect(mockNavigate).not.toHaveBeenCalledWith("/cart");
    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
  });

  it("redirects art lover to favorites when clicking favorites icon", () => {
    renderNavbar({
      currentUser: { email: "artlover@test.com" },
      isArtist: () => false,
      cart: [],
    });

    const favoritesButton = screen.getByTestId("favorites-button");
    fireEvent.click(favoritesButton);
    expect(mockNavigate).toHaveBeenCalledWith("/favorites");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/cart");
    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
  });

  it("redirects art lover to cart when clicking cart icon", () => {
    renderNavbar({
      currentUser: { email: "artlover@test.com" },
      isArtist: () => false,
      cart: [],
    });

    const cartButton = screen.getByTestId("cart-button");
    fireEvent.click(cartButton);
    expect(mockNavigate).toHaveBeenCalledWith("/cart");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/favorites");
    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
  });
});
