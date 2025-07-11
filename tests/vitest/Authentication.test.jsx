import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "../../src/components/auth/LoginForm";
import ProtectedRoute from "../../src/components/auth/ProtectedRoute";
import ArtistDashboard from "../../src/pages/ArtistDashboard";
import UserDashboard from "../../src/pages/UserDashboard";

// Mock Firebase Auth - replaces the all actual Firebase Auth with a mock object (empty functions)
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

// Mock Navigate - keeps all original functionality (BrowserRouter, Routes, etc.) but replaces the useNavigate function with a mock function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal(); // Get real module
  return {
    ...actual, // Keep all original functionality
    useNavigate: () => mockNavigate, // Override only useNavigate
    Navigate: ({ to }) => {
      mockNavigate(to);
      return null;
    }
  };
});

// Mock auth context - replaces the actual AuthContext with a mock object.
const mockUseAuth = vi.fn();
vi.mock("../src/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
  AuthContext: { Provider: ({ children }) => children },
}));

// Helper function to render the LoginForm - mockAuthReturnValue is an object that simulates what useAuth() would return based on AuthContext
const renderLoginForm = (mockAuthReturnValue) => {
  mockUseAuth.mockReturnValue(mockAuthReturnValue);
  render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );
};

// *********************
// REGISTRATION
// *********************

describe("Registration Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // REGISTRATION AS ART LOVER **************

  it("allows registration as art lover", async () => {
    // 1. Setup mock functions
    const mockSignup = vi.fn().mockResolvedValue({
      userData: { isArtist: false },
    });
    renderLoginForm({
      signup: mockSignup,
      currentUser: null,
      loading: false,
    });

    // 2. Choose to signup
    const signupLink = screen.getByText(/Need an account\? Sign up/i);
    fireEvent.click(signupLink);

    // 3. Select art lover role
    const artLoverButton = screen.getByTestId("purchase-artwork-button");
    const artistButton = screen.getByTestId("open-art-gallery-button");
    fireEvent.click(artLoverButton);
    expect(artLoverButton).toHaveAttribute("aria-checked", "true");
    expect(artistButton).toHaveAttribute("aria-checked", "false");

    // 4. Fill out the form
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    // 5. Submit the form
    const submitButton = screen.getByRole("button", {
      name: /Create Account/i,
    });
    fireEvent.click(submitButton);

    // 5.1. Verify signup was called with correct parameters
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        "john@example.com",
        "password123",
        "John",
        "Doe",
        false // isArtist = false for art lover
      );
    });

    // 6. Verify navigation after successful signup
    expect(mockNavigate).toHaveBeenCalledWith("/for-art-lovers");
  });

  // REGISTRATION AS ARTIST **************

  it("allows registration as artist", async () => {
    // 1. Setup mock functions
    const mockSignup = vi.fn().mockResolvedValue({
      userData: { isArtist: true },
    });
    renderLoginForm({
      signup: mockSignup,
      currentUser: null,
      loading: false,
    });

    // 2. Choose to signup
    const signupLink = screen.getByText(/Need an account\? Sign up/i);
    fireEvent.click(signupLink);

    // 3. Select artist role
    const artLoverButton = screen.getByTestId("purchase-artwork-button");
    const artistButton = screen.getByTestId("open-art-gallery-button");
    fireEvent.click(artistButton);
    expect(artLoverButton).toHaveAttribute("aria-checked", "false");
    expect(artistButton).toHaveAttribute("aria-checked", "true");

    // 4. Fill out the form
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    // 5. Submit the form
    const submitButton = screen.getByRole("button", {
      name: /Create Account/i,
    });
    fireEvent.click(submitButton);

    // 5.1. Verify signup was called with correct parameters
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        "john@example.com",
        "password123",
        "John",
        "Doe",
        true // isArtist = true for artist
      );
    });

    // 6. Verify navigation after successful signup
    expect(mockNavigate).toHaveBeenCalledWith("/for-artists");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalledWith("/for-art-lovers");
    expect(mockNavigate).not.toHaveBeenCalledWith("/");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
  });
});

// *********************
// LOGIN
// *********************

describe("Login Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // LOGIN AS ART LOVER **************

  it("allows login as art lover", async () => {
    // 1. Setup mock functions
    const mockLogin = vi.fn().mockResolvedValue({
      userData: { isArtist: false },
    });
    renderLoginForm({
      login: mockLogin,
      currentUser: null,
      loading: false,
    });

    // 2. Click "Sign up" to get to signup form
    const signupLink = screen.getByText(/Need an account\? Sign up/i);
    fireEvent.click(signupLink);

    // 3. Click "Login" to get back to login form
    const loginLink = screen.getByText(/Already have an account\? Login/i);
    fireEvent.click(loginLink);

    // 4. Fill out the form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    // 5. Submit the form
    const submitButton = screen.getByRole("button", {
      name: /Login/i,
    });
    fireEvent.click(submitButton);

    // 5.1. Verify signup was called with correct parameters
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("john@example.com", "password123");
    });

    // 6. Verify navigation after successful signup
    expect(mockNavigate).toHaveBeenCalledWith("/for-art-lovers");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalledWith("/for-artists");
    expect(mockNavigate).not.toHaveBeenCalledWith("/");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
  });

  // LOGIN AS ARTIST **************

  it("allows login as artist", async () => {
    // 1. Setup mock functions
    const mockLogin = vi.fn().mockResolvedValue({
      userData: { isArtist: true },
    });
    renderLoginForm({
      login: mockLogin,
      currentUser: null,
      loading: false,
    });

    // 2. Click "Sign up" to get to signup form
    const signupLink = screen.getByText(/Need an account\? Sign up/i);
    fireEvent.click(signupLink);

    // 3. Click "Login" to get back to login form
    const loginLink = screen.getByText(/Already have an account\? Login/i);
    fireEvent.click(loginLink);

    // 4. Fill out the form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    // 5. Submit the form
    const submitButton = screen.getByRole("button", {
      name: /Login/i,
    });
    fireEvent.click(submitButton);

    // 5.1. Verify signup was called with correct parameters
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("john@example.com", "password123");
    });

    // 6. Verify navigation after successful signup
    expect(mockNavigate).toHaveBeenCalledWith("/for-artists");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalledWith("/for-art-lovers");
    expect(mockNavigate).not.toHaveBeenCalledWith("/");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
  });
});

// *********************
// PROTECTED ROUTES
// *********************

const renderProtectedRoute = (Component, requiresArtist = false) => {
  render(
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute requiresArtist={requiresArtist}>
              <Component />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

describe("Protected Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to login when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      isArtist: () => false
    });

    renderProtectedRoute(ArtistDashboard);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("redirects to login when user is guest", () => {
    mockUseAuth.mockReturnValue({
      currentUser: { isGuest: true },
      isArtist: () => false
    });

    renderProtectedRoute(ArtistDashboard);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("redirects to home when non-artist tries to access artist route", () => {
    mockUseAuth.mockReturnValue({
      currentUser: { email: "user@test.com" },
      isArtist: () => false
    });

    renderProtectedRoute(ArtistDashboard, true);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("allows artist to access artist dashboard", () => {
    mockUseAuth.mockReturnValue({
      currentUser: { email: "artist@test.com" },
      isArtist: () => true,
      cart: [],
    });

    renderProtectedRoute(ArtistDashboard, true);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("allows authenticated user to access protected routes", () => {
    mockUseAuth.mockReturnValue({
      currentUser: { email: "user@test.com" },
      isArtist: () => false
    });

    renderProtectedRoute(UserDashboard);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});