import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ForArtistsPage from "./pages/ForArtistsPage";
import Navbar from "./components/layout/Navbar";
import LoginForm from "./components/auth/LoginForm";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/auth/ProtectedRoute";
import ArtistDashboard from "./pages/ArtistDashboard";
import FavoritesPage from "./pages/FavoritesPage";
import ForArtLoversPage from "./pages/ForArtLoversPage";
import BecomeArtist from "./pages/BecomeArtist";
import ArtworkPage from "./pages/ArtworkPage";
import { Toaster } from "react-hot-toast";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import UserDashboard from "./pages/UserDashboard";
import GalleryStudio from "./pages/GalleryStudio";

export default function Routing() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen w-screen bg-var(--bg)" style={{ backgroundColor: 'var(--bg)' }}>
          <Toaster position="top-center" />
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/for-artists" element={<ForArtistsPage />} />
              <Route path="/for-art-lovers" element={<ForArtLoversPage />} />
              <Route path="/artwork/:id" element={<ArtworkPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<LoginForm />} />
              <Route
                path="/artist-dashboard"
                element={
                  <PrivateRoute requiresArtist={true}>
                    <ArtistDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <PrivateRoute>
                    <FavoritesPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <UserDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/become-artist" element={<BecomeArtist />} />
              <Route path="/gallery-studio" element={<GalleryStudio />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/checkout/success"
                element={<CheckoutSuccessPage />}
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
