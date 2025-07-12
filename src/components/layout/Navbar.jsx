import { useState } from "react";
import FullScreenMenu from "./FullScreenMenu";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, cart, isArtist } = useAuth();
  const navigate = useNavigate();

  const handleFavoritesClick = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    navigate("/favorites");
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] border-b border-[#2a2a2a] backdrop-blur-md"
        style={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 165, 0, 0.1)",
        }}
      >
        {/* Terminal-style status bar */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#FFA500] to-transparent opacity-60"></div>
        
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-8 lg:px-12 h-[60px] relative">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-5" style={{ 
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, #FFA500 50px, #FFA500 51px)',
          }}></div>

          {/* Logo - Original Simple Style */}
          <div
            className="flex items-center cursor-pointer group relative z-10"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center gap-1">
              <span className="bg-[#FFA500] text-[#000] px-2 py-1 font-mono font-bold text-lg border border-[#FFA500]">
                S
              </span>
              <span className="text-[#cccccc] font-mono font-bold text-lg tracking-wider">
                umoArts
              </span>
            </div>
          </div>

          {/* Desktop Navigation - Enhanced Lofi Style */}
          <div className="flex justify-end items-center gap-6 hidden sm:flex relative z-10">
            {/* Navigation Items */}
            <div className="flex items-center gap-2">
              {/* Favorites - Terminal Style */}
              <button
                title="Favorites"
                onClick={handleFavoritesClick}
                className="group relative bg-[#1a1a1a]/80 border border-[#333] hover:border-[#FFA500] text-[#888] hover:text-[#FFA500] font-mono text-sm uppercase tracking-wider px-4 py-2 transition-all duration-300 backdrop-blur-sm overflow-hidden"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {/* Background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500]/10 to-[#ff8c42]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-[#FFA500] group-hover:animate-pulse">♥</span>
                  favorites
                </span>
                
                {/* Terminal lines */}
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#FFA500] group-hover:w-full transition-all duration-300"></div>
                <div className="absolute top-0 right-0 w-0 h-[1px] bg-[#FFA500] group-hover:w-full transition-all duration-300 delay-75"></div>
              </button>

              {/* Cart - Enhanced */}
              <button
                title="Cart"
                onClick={() => navigate("/cart")}
                className="group relative bg-[#1a1a1a]/80 border border-[#333] hover:border-[#FFA500] text-[#888] hover:text-[#FFA500] font-mono text-sm uppercase tracking-wider px-4 py-2 transition-all duration-300 backdrop-blur-sm overflow-hidden"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {/* Background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500]/10 to-[#ff8c42]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-[#FFA500] group-hover:animate-pulse">⊞</span>
                  cart
                </span>
                
                {/* Cart badge - Enhanced */}
                {cart.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FFA500] to-[#ff8c42] text-[#000] text-xs px-2 py-1 font-mono font-bold min-w-[24px] h-6 flex items-center justify-center border-2 border-[#FFA500] animate-pulse">
                    {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
                  </div>
                )}
                
                {/* Terminal lines */}
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#FFA500] group-hover:w-full transition-all duration-300"></div>
                <div className="absolute top-0 right-0 w-0 h-[1px] bg-[#FFA500] group-hover:w-full transition-all duration-300 delay-75"></div>
              </button>
            </div>

            {/* Authentication Section - Lofi Enhanced */}
            <div className="flex items-center gap-3 ml-4">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  {/* Welcome message with terminal style */}
                  <div className="bg-[#0f0f0f] border border-[#333] px-3 py-1 rounded">
                    <span className="text-[#666] font-mono text-xs">
                      {'>'} user: <span className="text-[#FFA500]">{currentUser.email?.split('@')[0] || 'anonymous'}</span>
                    </span>
                  </div>
                  
                  <button
                    title="Dashboard"
                    onClick={() => {
                      if (isArtist()) {
                        navigate("/artist-dashboard");
                      } else {
                        navigate("/dashboard");
                      }
                    }}
                    className="group relative bg-gradient-to-r from-[#FFA500] to-[#ff8c42] text-[#000] font-mono text-sm font-bold px-6 py-2 border-2 border-[#FFA500] hover:from-[#ff8c42] hover:to-[#FFA500] transition-all duration-300 uppercase tracking-wider transform hover:scale-105 overflow-hidden"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500]/30 to-[#ff8c42]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                    
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="text-xs">⚡</span>
                      {isArtist() ? "artist_panel" : "dashboard"}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Login Button - Terminal Style */}
                  <button
                    onClick={() => navigate("/login")}
                    className="group relative bg-[#1a1a1a]/80 border border-[#333] hover:border-[#FFA500] text-[#888] hover:text-[#FFA500] font-mono text-sm font-medium px-5 py-2 transition-all duration-300 uppercase tracking-wider backdrop-blur-sm overflow-hidden"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {/* Background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500]/5 to-[#ff8c42]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="text-[#FFA500] text-xs">$</span>
                      login
                    </span>
                  </button>
                  
                  {/* Terminal Divider */}
                  <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#FFA500] to-transparent opacity-60"></div>
                  
                  {/* Sign Up Button - Enhanced */}
                  <button
                    onClick={() => navigate("/signup")}
                    className="group relative bg-gradient-to-r from-[#FFA500] to-[#ff8c42] text-[#000] font-mono text-sm font-bold px-6 py-2 border-2 border-[#FFA500] hover:from-[#ff8c42] hover:to-[#FFA500] transition-all duration-300 uppercase tracking-wider transform hover:scale-105 overflow-hidden"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500]/30 to-[#ff8c42]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                    
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="text-xs">+</span>
                      sign_up
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu - Enhanced & Sticky Bottom Bar */}
          <div className="sm:hidden fixed bottom-0 left-0 w-full z-50 bg-gradient-to-r from-[#18120a] via-[#1a1a1a] to-[#18120a] border-t border-[#FFA500]/40 flex items-center justify-between px-4 py-2 shadow-2xl backdrop-blur-md">
            {/* Logo */}
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/') }>
              <span className="bg-[#FFA500] text-[#000] px-2 py-1 font-mono font-bold text-base border border-[#FFA500] rounded">S</span>
              <span className="text-[#FFA500] font-mono font-bold text-base tracking-wider">umo</span>
            </div>
            {/* Nav Icons */}
            <div className="flex items-center gap-4">
              <button title="Favorites" onClick={handleFavoritesClick} className="p-2 rounded-full bg-[#232323] border border-[#FFA500]/40 text-[#FFA500] shadow hover:bg-[#FFA500] hover:text-[#18120a] transition-all duration-200">
                <span className="text-lg">♥</span>
              </button>
              <button title="Cart" onClick={() => navigate('/cart')} className="p-2 rounded-full bg-[#232323] border border-[#FFA500]/40 text-[#FFA500] shadow hover:bg-[#FFA500] hover:text-[#18120a] transition-all duration-200 relative">
                <span className="text-lg">⊞</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FFA500] text-[#000] text-xs px-1.5 py-0.5 rounded-full border border-[#FFA500] animate-pulse">{cart.reduce((total, item) => total + (item.quantity || 1), 0)}</span>
                )}
              </button>
              <button title="Menu" onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full bg-[#232323] border border-[#FFA500]/40 text-[#FFA500] shadow hover:bg-[#FFA500] hover:text-[#18120a] transition-all duration-200">
                <span className="text-xl">≡</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom terminal line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FFA500]/30 to-transparent"></div>
      </nav>

      <FullScreenMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

// PropTypes validation
// No propTypes needed; all props removed for cleanliness

