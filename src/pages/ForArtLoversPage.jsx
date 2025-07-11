import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/layout/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export default function ForArtLoversPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, toggleFavorite, isArtworkFavorited, addToCart } =
    useAuth();

  const fetchArtworks = useCallback(async () => {
    try {
      setLoading(true);
      const artworksRef = collection(db, "artworks");
      const q = query(artworksRef, where("isPublished", "==", true));
      const querySnapshot = await getDocs(q);
      const publishedArtworks = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().date,
      }));
      const response = await fetch(
        "https://api.unsplash.com/search/photos?" +
          "query=contemporary+modern+fine+art+painting+exhibition+gallery+-photo+-artist+-camera+-supplies+-brushes+-pencil+-crayons&" +
          "per_page=30&" +
          "orientation=landscape",
        {
          headers: {
            Authorization: `Client-ID ${
              import.meta.env.VITE_UNSPLASH_ACCESS_KEY
            }`,
          },
        }
      );
      const data = await response.json();
      const unsplashArtworks = data.results.map((artwork) => ({
        ...artwork,
        price: (Math.floor(Math.random() * 500) + 1) * 5,
      }));
      const combinedArtworks = [...publishedArtworks, ...unsplashArtworks];
      setArtworks(combinedArtworks);
    } catch (error) {
      console.error("Error fetching artworks:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      sessionStorage.setItem(
        "galleryScrollPosition",
        currentPosition.toString()
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.state?.fromArtwork) {
      const savedPosition =
        parseInt(sessionStorage.getItem("galleryScrollPosition")) || 0;
      window.scrollTo({
        top: savedPosition,
        behavior: "instant",
      });
    }
  }, [location.state]);

  const handleFavoriteClick = async (e, artwork) => {
    e.stopPropagation();
    try {
      if (!currentUser) {
        toast.error("Please login to save favourites");
        return;
      }
      const isNowFavorited = await toggleFavorite({
        id: artwork.id,
        alt_description: artwork.alt_description,
        title: artwork.title,
        urls: artwork.urls,
        user: artwork.user,
        price: artwork.price,
        size: artwork.size,
        created_at: artwork.created_at,
        description: artwork.description,
        tags: artwork.tags,
      });
      toast.success(
        isNowFavorited ? "Added to favourites" : "Removed from favourites"
      );
    } catch (error) {
      console.error("Error toggling favourite:", error);
      toast.error(error.message || "Error updating favourites");
    }
  };

  const handleAddtoCart = async (e, artwork) => {
    e.stopPropagation();
    await addToCart({
      id: artwork.id,
      alt_description: artwork.alt_description,
      title: artwork.title,
      urls: artwork.urls,
      user: artwork.user,
      price: artwork.price,
      size: artwork.size,
    });
  };

  const handleArtworkClick = (artwork) => {
    navigate(`/artwork/${artwork.id}`, {
      state: {
        size: artwork.size,
        price: artwork.price,
        user: artwork.user,
      },
    });
  };

  return (
    <div className="min-h-screen w-screen bg-[var(--bg)] overflow-x-hidden relative" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Subtle grid pattern overlay for lofi aesthetic */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--accent) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      ></div>
      
      <Navbar isArtLoversPage={true} />

      {/* Cool Back Navigation */}
      <div className="w-full bg-[#0a0a0a] border-b border-[var(--accent)] px-4 sm:px-8 lg:px-12 py-4 relative z-10" style={{ borderColor: 'var(--accent)' }}>
        <div className="max-w-7xl mx-auto flex items-center">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 text-[var(--text)] hover:text-[var(--accent)] transition-all duration-300 bg-[var(--bg)]/60 border-2 border-[var(--accent)] hover:border-[var(--accent)]/80 px-4 py-2 backdrop-blur-sm"
            style={{ fontFamily: "var(--font-mono)", color: 'var(--text)', borderColor: 'var(--accent)', backgroundColor: 'var(--bg)' }}
          >
            {/* Lofi Arrow Design */}
            <div className="relative flex items-center">
              {/* Main Arrow */}
              <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">←</span>
              
              {/* Glitch Effect Lines */}
              <div className="absolute -left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-6 h-[1px] bg-[var(--accent)] -rotate-12 animate-pulse" style={{ backgroundColor: 'var(--accent)' }}></div>
                <div className="w-4 h-[1px] bg-[var(--accent)] rotate-12 mt-1 animate-pulse delay-100" style={{ backgroundColor: 'var(--accent)' }}></div>
              </div>
            </div>
            
            <span className="text-sm font-bold uppercase tracking-wider">
              back_to_home
            </span>
            
            {/* Terminal Cursor */}
            <div className="w-2 h-4 bg-[var(--accent)] opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" style={{ backgroundColor: 'var(--accent)' }}></div>
          </button>
          
          {/* Breadcrumb */}
          <div className="ml-8 flex items-center gap-2 text-[var(--text)] text-sm" style={{ fontFamily: "var(--font-mono)", color: 'var(--text)' }}>
            <span className="opacity-50">home</span>
            <span className="text-[var(--accent)]" style={{ color: 'var(--accent)' }}>/</span>
            <span className="text-[var(--accent)]" style={{ color: 'var(--accent)' }}>art-collection</span>
            <div className="ml-2 w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }}></div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="w-screen flex flex-col md:flex-row items-center justify-between py-12 md:py-0 relative z-10">
        {/* Text Section */}
        <div className="flex flex-col w-full md:w-1/2 px-6 mt-12 md:mt-0">
          <div className="flex flex-col items-start w-full pt-16 md:pt-32 pl-4 md:pl-12 xl:pl-20 2xl:pl-32">
            {/* Glitch effect title */}
            <h1
              className="text-[var(--accent)] font-bold text-left text-5xl md:text-6xl lg:text-7xl pb-6 relative"
              style={{ 
                fontFamily: "var(--font-mono)", 
                color: 'var(--accent)',
                textShadow: '2px 0 0 var(--accent)'
              }}
            >
              <span className="block">For Art Lovers</span>
              {/* Glitch lines */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-0 w-3/4 h-0.5 bg-[var(--accent)] opacity-30"></div>
                <div className="absolute bottom-1/3 right-0 w-1/2 h-0.5 bg-[var(--accent)] opacity-20"></div>
              </div>
            </h1>
            
            <div className="space-y-4 mb-8">
              <h2 className="text-[var(--text)] text-2xl text-left lg:text-3xl font-semibold flex items-center gap-3" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                <span className="w-2 h-2 bg-[var(--accent)] animate-pulse"></span>
                Discover unique artworks.
              </h2>
              <h2 className="text-[var(--text)] text-2xl text-left lg:text-3xl font-semibold flex items-center gap-3" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                <span className="w-2 h-2 bg-[var(--accent)] animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                Support independent artists.
              </h2>
            </div>
          </div>
        </div>

        {/* Image Section with CRT effect */}
        <div className="relative w-full md:w-1/2 h-[40vh] md:h-[70vh] overflow-hidden flex items-center justify-center">
          {/* CRT scanlines */}
          <div 
            className="absolute inset-0 z-30 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--accent) 2px, var(--accent) 4px)',
            }}
          ></div>
          
          {/* Vignette effect */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `radial-gradient(circle at center, transparent 30%, var(--bg) 100%)`,
            }}
          />
          
          <img
            src="images/for-art-lovers-hero.jpg"
            alt="Art Exhibition"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.7) contrast(1.1) saturate(0.8)" }}
          />
        </div>
      </div>

      {/* Gallery Section */}
      <section
        id="gallery"
        className="w-screen bg-[var(--bg)] py-24 md:py-32 relative z-10"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        {/* Terminal-style header */}
        <div className="w-full px-4 md:px-12 2xl:px-24 mb-16">
          <div className="border border-[var(--accent)] bg-[var(--bg)] p-4 font-mono text-sm" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--bg)', fontFamily: 'var(--font-mono)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-[var(--accent)] animate-pulse"></div>
              <span className="text-[var(--accent)]" style={{ color: 'var(--accent)' }}>gallery.exe</span>
            </div>
            <div className="text-[var(--text)]" style={{ color: 'var(--text)' }}>
              {'>'} Loading art collection...
              <br />
              {'>'} {!loading && artworks.length} artworks found
              <br />
              {'>'} Status: <span className="text-[var(--accent)]" style={{ color: 'var(--accent)' }}>READY</span>
            </div>
          </div>
        </div>
        
        <div className="w-full px-4 md:px-12 2xl:px-24">
          {/* Loading State */}
          {loading && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-[var(--accent)] animate-pulse"></div>
                <div className="w-2 h-2 bg-[var(--accent)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-[var(--accent)] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-[var(--text)] text-xl font-mono" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                Scanning art database...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center">
              <div className="border border-[var(--accent)] bg-[var(--bg)] p-6 inline-block font-mono" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--bg)', fontFamily: 'var(--font-mono)' }}>
                <div className="text-[var(--accent)] mb-2" style={{ color: 'var(--accent)' }}>ERROR 404</div>
                <div className="text-[var(--text)]" style={{ color: 'var(--text)' }}>{error}</div>
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && !error && artworks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artworks.map((artwork, index) => {
                return (
                  <div
                    key={artwork.id}
                    className="border border-[var(--accent)] overflow-hidden bg-[var(--bg)] hover:border-opacity-60 transition-all duration-200 cursor-pointer group relative"
                    style={{ 
                      borderColor: 'var(--accent)', 
                      backgroundColor: 'var(--bg)',
                      animationDelay: `${index * 0.1}s`
                    }}
                    onClick={() => handleArtworkClick(artwork)}
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-[var(--accent)] opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
                    
                    {/* Image container with overlay */}
                    <div className="relative h-64 bg-[var(--bg)] overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
                      <img
                        src={artwork.urls.regular}
                        alt={artwork.alt_description}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ filter: "brightness(0.9) contrast(1.1)" }}
                      />
                      
                      {/* ASCII-style overlay */}
                      <div className="absolute inset-0 opacity-10 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                        <div 
                          className="w-full h-full"
                          style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, var(--accent) 10px, var(--accent) 11px)',
                          }}
                        ></div>
                      </div>
                      
                      {/* Icons */}
                      <div
                        className="absolute top-0 right-0 p-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="bg-[var(--bg)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] px-2 py-1 text-[var(--accent)] transition-all duration-200 font-mono text-xs font-bold"
                          style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--accent)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                          onClick={(e) => handleFavoriteClick(e, artwork)}
                          aria-label={
                            isArtworkFavorited(artwork.id)
                              ? "Remove from favourites"
                              : "Add to favourites"
                          }
                          title={
                            isArtworkFavorited(artwork.id)
                              ? "Remove from favourites"
                              : "Add to favourites"
                          }
                        >
                          {isArtworkFavorited(artwork.id) ? "★" : "☆"}
                        </button>
                        <button
                          className="bg-[var(--bg)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] px-2 py-1 text-[var(--accent)] transition-all duration-200 font-mono text-xs font-bold"
                          style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--accent)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                          aria-label="Add to cart"
                          title="Add to cart"
                          onClick={(e) => handleAddtoCart(e, artwork)}
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Price tag with glitch effect */}
                      <div className="absolute bottom-0 left-0 m-3 z-10">
                        <div className="bg-[var(--accent)] text-[var(--bg)] px-3 py-1 border border-[var(--accent)] font-mono text-sm font-bold relative overflow-hidden" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                          €{artwork.price ? parseFloat(artwork.price).toFixed(2) : "25.00"}
                          {/* Glitch effect */}
                          <div className="absolute inset-0 bg-[var(--bg)] opacity-20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* Art info container */}
                    <div className="p-4 border-t border-[var(--accent)] relative" style={{ borderColor: 'var(--accent)' }}>
                      {/* Terminal-style info */}
                      <div className="font-mono text-xs text-[var(--accent)] mb-2" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                        {'>'} artwork_{index.toString().padStart(3, '0')}.jpg
                      </div>
                      
                      <h2 className="text-[var(--accent)] font-bold text-lg mb-2 truncate" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                        {artwork.title || artwork.alt_description}
                      </h2>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 border border-[var(--accent)] bg-[var(--accent)] relative overflow-hidden" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--accent)' }}>
                          {/* Pixel art style avatar */}
                          <div 
                            className="absolute inset-0"
                            style={{
                              backgroundImage: 'repeating-conic-gradient(var(--bg) 0deg 90deg, var(--accent) 90deg 180deg)',
                              backgroundSize: '3px 3px'
                            }}
                          ></div>
                        </div>
                        <span className="text-[var(--text)] font-mono text-sm" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                          {artwork.user.name}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-xs text-[var(--text)] font-mono" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                        <span>
                          {artwork.date
                            ? new Date(artwork.date).getFullYear()
                            : artwork.created_at
                            ? new Date(artwork.created_at).getFullYear()
                            : "????"}
                        </span>
                        <span>
                          {artwork.size?.width}×{artwork.size?.height}cm
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
