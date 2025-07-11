import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useRef } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../index.css";

export default function HomePage() {
  const { currentUser, isArtist } = useAuth();
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  // Dynamic center image highlighting
  useEffect(() => {
    // Add dynamic floating animations CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes animate-float {
        0%, 100% { transform: translateY(0px) rotate(4deg); }
        50% { transform: translateY(-4px) rotate(4deg); }
      }
      @keyframes animate-float-delayed {
        0%, 100% { transform: translateY(0px) rotate(-3deg); }
        50% { transform: translateY(-3px) rotate(-3deg); }
      }
      @keyframes animate-float-slow {
        0%, 100% { transform: translateY(0px) rotate(8deg); }
        50% { transform: translateY(-2px) rotate(8deg); }
      }
      @keyframes animate-float-reverse {
        0%, 100% { transform: translateY(0px) rotate(-6deg); }
        50% { transform: translateY(-5px) rotate(-6deg); }
      }
      .animate-float {
        animation: animate-float 6s ease-in-out infinite;
      }
      .animate-float-delayed {
        animation: animate-float-delayed 7s ease-in-out infinite;
        animation-delay: 1.5s;
      }
      .animate-float-slow {
        animation: animate-float-slow 8s ease-in-out infinite;
        animation-delay: 3s;
      }
      .animate-float-reverse {
        animation: animate-float-reverse 6.5s ease-in-out infinite;
        animation-delay: 0.8s;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Dynamic center image highlighting
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const images = slider.querySelectorAll('img');
      const sliderRect = slider.getBoundingClientRect();
      const sliderCenter = sliderRect.left + sliderRect.width / 2;

      images.forEach((img) => {
        const imgRect = img.getBoundingClientRect();
        const imgCenter = imgRect.left + imgRect.width / 2;
        const distance = Math.abs(sliderCenter - imgCenter);
        const maxDistance = sliderRect.width / 2;
        const proximity = Math.max(0, 1 - distance / maxDistance);

        // Apply dynamic scaling and glow based on center proximity
        const scale = 1 + (proximity * 0.1); // 1.0 to 1.1 scale
        const brightness = 0.9 + (proximity * 0.3); // 0.9 to 1.2 brightness
        const glowIntensity = proximity * 0.3; // 0 to 0.3 glow

        img.style.transform = `scale(${scale})`;
        img.style.filter = `brightness(${brightness})`;
        img.style.boxShadow = `
          0 25px 50px rgba(0, 0, 0, 0.5), 
          0 15px 30px rgba(0, 0, 0, 0.3),
          0 0 ${40 * proximity}px rgba(255, 165, 0, ${glowIntensity})
        `;
      });
    };

    slider.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => slider.removeEventListener('scroll', handleScroll);
  }, []);

  const handleArtistClick = () => {
    if (!currentUser) {
      navigate("/login");
    } else if (isArtist()) {
      navigate("/artist-dashboard");
    } else {
      navigate("/become-artist");
    }
  };

  const handleArtLoverClick = () => {
    navigate("/for-art-lovers");
  };

  return (
    <>
      {/* Navbar */}
      <Navbar isHomePage={true} />

      {/* Clean separator */}
      <div className="w-full h-[2px] bg-[var(--accent)]"></div>

      {/* Spacer between navbar and content */}
      <div className="w-full" style={{ height: "40px" }}></div>

      {/* Hero Section */}
      <section className="min-h-screen w-full bg-[var(--bg)] flex items-center justify-center px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          
          {/* Left Section - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text)] leading-tight tracking-tight" style={{ fontFamily: "var(--font-mono)" }}>
                Digital
                <br />
                <span className="text-[var(--accent)]">Art Gallery</span>
              </h1>
              <div className="w-16 h-0.5 bg-[var(--accent)]"></div>
            </div>

            {/* Subtitle */}
            <p className="text-[var(--text-dim)] text-lg md:text-xl leading-relaxed max-w-md" style={{ fontFamily: "var(--font-mono)" }}>
              Discover extraordinary digital artworks from talented artists worldwide. 
              <span className="text-[var(--accent)]"> Buy, sell, and collect </span>
              unique pieces in our curated marketplace.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleArtistClick}
                className="group bg-[var(--accent)] text-[var(--bg)] px-8 py-4 border-2 border-[var(--accent)] hover:bg-[var(--bg)] hover:text-[var(--accent)] transition-all duration-300 font-bold text-sm uppercase tracking-wider transform hover:scale-105"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span className="flex items-center justify-center gap-2">
                  For Artists
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </button>
              
              <button
                onClick={handleArtLoverClick}
                className="group border-2 border-[var(--border)] text-[var(--text)] px-8 py-4 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 font-bold text-sm uppercase tracking-wider"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span className="flex items-center justify-center gap-2">
                  For Collectors
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </button>
            </div>


          </div>

          {/* 🖼️ Right Section - Dynamic Gallery Experience */}
          <div className="lg:col-span-3 h-full min-h-[600px] relative">
            {/* Immersive Gallery Container */}
            <div className="relative h-full bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] overflow-hidden rounded-2xl border border-[#2a2a2a] shadow-2xl">
              
              {/* Dynamic Header with Pulse */}
              <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-r from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#1a1a1a]/95 backdrop-blur-lg border-b border-[#FFA500]/20 flex items-center justify-between px-8 z-20">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-3 h-3 bg-[#FFA500] rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-[#FFA500] rounded-full animate-ping opacity-30"></div>
                  </div>
                  <span className="text-[#FFA500] text-sm font-bold tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    sumoarts.gallery
                  </span>
                  <div className="hidden md:flex items-center gap-2 ml-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>LIVE</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[#666] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    5 collections
                  </div>
                  <div className="w-6 h-4 border border-[#FFA500]/40 rounded-sm flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#FFA500] rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-20 left-6 z-10 opacity-60">
                <div className="text-[#FFA500] text-xs mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {'// immersive_gallery_v2.0'}
                </div>
                <div className="text-[#666] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {'$ loading featured artworks...'}
                </div>
              </div>

              {/* Creative Gallery Showcase */}
              <div className="absolute top-14 left-0 right-0 bottom-0 p-6">
                
                {/* Background Art Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-[#FFA500] rotate-45 rounded-lg"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-20 h-20 border border-[#FFA500] rotate-12 rounded-full"></div>
                  <div className="absolute top-1/2 right-1/3 w-24 h-24 border border-[#FFA500] -rotate-12"></div>
                </div>

                {/* Dynamic Gallery Showcase - 5 Artworks - Lofi Layout */}
                <div className="flex items-center justify-center h-full pt-4">
                  {/* Balanced Gallery Layout - Lofi Aesthetic */}
                  <div className="relative w-full max-w-6xl h-[520px] overflow-hidden">
                    
                    {/* Center Featured Artwork - Main Hero */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 h-48 group cursor-pointer z-30">
                      <div 
                        className="relative rounded-xl overflow-hidden shadow-2xl transform transition-all duration-700 ease-out"
                        style={{
                          boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 40px rgba(255,165,0,0.4)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-12px) scale(1.04)';
                          e.currentTarget.style.boxShadow = '0 35px 70px rgba(0,0,0,0.9), 0 0 55px rgba(255,165,0,0.6)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                          e.currentTarget.style.boxShadow = '0 25px 60px rgba(0,0,0,0.85), 0 0 40px rgba(255,165,0,0.4)';
                        }}
                      >
                        <img 
                          src="/images/download 5.jfif"
                          alt="Featured Artwork"
                          className="w-full h-full object-cover transition-all duration-700"
                          style={{
                            filter: 'contrast(1.15) brightness(1.05) saturate(1.25)',
                          }}
                          onError={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #FFA500, #ff8c42, #1a1a1a)';
                          }}
                        />
                        
                        {/* Enhanced Featured Badge */}
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#FFA500] to-[#ff8c42] text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-xl transform rotate-12 group-hover:rotate-0 transition-all duration-300">
                          ★ PRIME
                        </div>

                        {/* Subtle Glow Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FFA500]/5 via-transparent to-[#ff8c42]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>

                    {/* Top Left - Compact Portrait */}
                    <div className="absolute top-0 left-8 w-52 h-68 group cursor-pointer z-25 animate-float">
                      <div 
                        className="relative rounded-xl overflow-hidden shadow-xl transform rotate-4 hover:rotate-1 transition-all duration-600"
                        style={{
                          boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 25px rgba(255,165,0,0.2)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'rotate(1deg) translateY(-8px) scale(1.03)';
                          e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255,165,0,0.35)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'rotate(4deg) translateY(0px) scale(1)';
                          e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.7), 0 0 25px rgba(255,165,0,0.2)';
                        }}
                      >
                        <img 
                          src="/images/download 2.jfif"
                          alt="Lofi Artwork 2"
                          className="w-full h-full object-cover transition-all duration-700"
                          style={{ filter: 'contrast(1.15) brightness(1.02) saturate(1.25)' }}
                          onError={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #FFA500, #ff8c42, #1a1a1a)';
                          }}
                        />
                        
                        <div className="absolute bottom-3 left-3 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          FLUX_02
                        </div>
                      </div>
                    </div>

                    {/* Top Right - Balanced Landscape */}
                    <div className="absolute top-0 right-8 w-64 h-48 group cursor-pointer z-25 animate-float-delayed">
                      <div 
                        className="relative rounded-xl overflow-hidden shadow-xl transform -rotate-3 hover:rotate-0 transition-all duration-600"
                        style={{
                          boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 25px rgba(255,165,0,0.2)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'rotate(0deg) translateY(-8px) scale(1.03)';
                          e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255,165,0,0.35)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'rotate(-3deg) translateY(0px) scale(1)';
                          e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.7), 0 0 25px rgba(255,165,0,0.2)';
                        }}
                      >
                        <img 
                          src="/images/download 3.jpeg"
                          alt="Lofi Artwork 3"
                          className="w-full h-full object-cover transition-all duration-700"
                          style={{ filter: 'contrast(1.15) brightness(1.02) saturate(1.25)' }}
                          onError={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #FFA500, #ff8c42, #1a1a1a)';
                          }}
                        />
                        
                        <div className="absolute bottom-3 right-3 text-[#FFA500] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          VOID_03
                        </div>
                      </div>
                    </div>

                    {/* Bottom Left - Perfect Square */}
                    <div className="absolute bottom-12 left-16 w-48 h-48 group cursor-pointer z-20 animate-float-slow">
                      <div 
                        className="relative rounded-xl overflow-hidden shadow-xl transform rotate-8 hover:rotate-4 transition-all duration-600"
                        style={{
                          boxShadow: '0 18px 45px rgba(0,0,0,0.65), 0 0 20px rgba(255,165,0,0.15)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'rotate(4deg) translateY(-6px) scale(1.04)';
                          e.currentTarget.style.boxShadow = '0 25px 55px rgba(0,0,0,0.75), 0 0 35px rgba(255,165,0,0.25)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'rotate(8deg) translateY(0px) scale(1)';
                          e.currentTarget.style.boxShadow = '0 18px 45px rgba(0,0,0,0.65), 0 0 20px rgba(255,165,0,0.15)';
                        }}
                      >
                        <img 
                          src="/images/download 4.jfif"
                          alt="Lofi Artwork 4"
                          className="w-full h-full object-cover transition-all duration-700"
                          style={{ filter: 'contrast(1.15) brightness(1.02) saturate(1.25)' }}
                          onError={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #FFA500, #ff8c42, #1a1a1a)';
                          }}
                        />
                        
                        <div className="absolute bottom-3 left-3 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          NEON_04
                        </div>
                      </div>
                    </div>

                    {/* Bottom Right - Elegant Portrait */}
                    <div className="absolute bottom-8 right-12 w-44 h-60 group cursor-pointer z-20 animate-float-reverse">
                      <div 
                        className="relative rounded-xl overflow-hidden shadow-xl transform -rotate-6 hover:-rotate-2 transition-all duration-600"
                        style={{
                          boxShadow: '0 18px 45px rgba(0,0,0,0.65), 0 0 20px rgba(255,165,0,0.15)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'rotate(-2deg) translateY(-6px) scale(1.04)';
                          e.currentTarget.style.boxShadow = '0 25px 55px rgba(0,0,0,0.75), 0 0 35px rgba(255,165,0,0.25)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'rotate(-6deg) translateY(0px) scale(1)';
                          e.currentTarget.style.boxShadow = '0 18px 45px rgba(0,0,0,0.65), 0 0 20px rgba(255,165,0,0.15)';
                        }}
                      >
                        <img 
                          src="/images/download 6.jpeg"
                          alt="Lofi Artwork 5"
                          className="w-full h-full object-cover transition-all duration-700"
                          style={{ filter: 'contrast(1.15) brightness(1.02) saturate(1.25)' }}
                          onError={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #FFA500, #ff8c42, #1a1a1a)';
                          }}
                        />
                        
                        {/* Subtle Status Badge */}
                        <div className="absolute top-3 right-3 bg-[#FFA500]/90 text-black px-2 py-1 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          FRESH
                        </div>
                        
                        <div className="absolute bottom-3 right-3 text-[#FFA500] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          WAVE_06
                        </div>
                      </div>
                    </div>



                    {/* Subtle Lofi Visual Elements */}
                    
                    {/* Gentle Connection Lines */}
                    <div className="absolute top-32 left-60 w-20 h-[1px] bg-gradient-to-r from-[#FFA500]/30 to-transparent transform rotate-20 opacity-40"></div>
                    <div className="absolute top-56 right-68 w-16 h-[1px] bg-gradient-to-l from-[#FFA500]/25 to-transparent transform -rotate-12 opacity-35"></div>
                    <div className="absolute bottom-48 left-72 w-24 h-[1px] bg-gradient-to-r from-[#FFA500]/28 to-transparent transform rotate-35 opacity-38"></div>
                    
                    {/* Ambient Lofi Particles */}
                    <div className="absolute top-24 left-40 w-1.5 h-1.5 bg-[#FFA500]/40 rounded-full animate-pulse"></div>
                    <div className="absolute top-56 right-32 w-1 h-1 bg-[#FFA500]/35 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-[#FFA500]/30 rounded-full animate-pulse delay-2000"></div>
                    <div className="absolute bottom-56 right-1/3 w-1 h-1 bg-[#FFA500]/45 rounded-full animate-pulse delay-3000"></div>
                    <div className="absolute top-40 left-2/3 w-1.5 h-1.5 bg-[#FFA500]/32 rounded-full animate-pulse delay-1500"></div>
                    <div className="absolute top-68 right-1/4 w-1 h-1 bg-[#ff8c42]/38 rounded-full animate-pulse delay-2500"></div>

                    {/* Clean Code Comments */}
                    <div className="absolute top-4 left-4 opacity-40">
                      <span className="text-[#FFA500] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {'// lofi_gallery.jsx'}
                      </span>
                    </div>
                    
                    <div className="absolute bottom-4 right-4 opacity-40">
                      <span className="text-[#666] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {'/* balanced_layout.css */'}
                      </span>
                    </div>

                    {/* Refined Status Navigation */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                      <div className="flex items-center gap-4 bg-[#1a1a1a]/85 backdrop-blur-md border border-[#333]/50 rounded-2xl px-6 py-3 shadow-lg">
                        <div className="flex gap-2.5">
                          {Array.from({length: 5}).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-2 h-2 bg-[#333] hover:bg-[#FFA500] rounded-full transition-all duration-300 cursor-pointer hover:scale-110"
                              style={{
                                background: i === 0 ? '#FFA500' : '#333'
                              }}
                            ></div>
                          ))}
                        </div>
                        <div className="w-px h-4 bg-[#333]"></div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#FFA500] rounded-full opacity-70"></div>
                          <span className="text-[#666] text-xs font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            gallery.lofi
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Soft Background Ambient Effects */}
                    <div className="absolute inset-0 bg-gradient-radial from-[#FFA500]/6 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                    <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-radial from-[#FFA500]/3 to-transparent rounded-full opacity-30 pointer-events-none blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-radial from-[#ff8c42]/4 to-transparent rounded-full opacity-25 pointer-events-none blur-2xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎨 About Us Section - Refactored */}
      <section className="w-full bg-[#1e1e1e] py-16 px-4 sm:px-8 lg:px-12 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-[#FFA500]"></div>
              <span className="text-[#FFA500] text-sm uppercase tracking-[0.3em] font-bold px-4 py-2 border border-[#FFA500]/30 bg-[#FFA500]/5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                About_SumoArts.txt
              </span>
              <div className="w-12 h-[2px] bg-[#FFA500]"></div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#cccccc] mb-6 leading-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Pure Art.
              <br />
              <span className="text-[#FFA500]">No Gatekeepers.</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FFA500] to-[#ff8c42] mx-auto"></div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Side - Hero Image */}
            <div className="relative group">
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-xl bg-[#242424] border border-[var(--border)]">
                <img 
                  src="/images/download 8.png"
                  alt="SumoArts Gallery Showcase"
                  className="w-full h-[500px] md:h-[600px] object-cover transition-all duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                  style={{
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 165, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                  onError={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #FFA500, #ff8c42, #1e1e1e)';
                    e.target.style.backgroundColor = '#FFA500';
                  }}
                />
                
                {/* Overlay Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Creative Corner Accents */}
                <div className="absolute top-4 left-4">
                  <div className="w-8 h-8 border-l-2 border-t-2 border-[#FFA500] opacity-60"></div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="w-8 h-8 border-r-2 border-b-2 border-[#FFA500] opacity-60"></div>
                </div>
              </div>

              {/* Floating Code Comment */}
              <div className="absolute -top-6 left-0">
                <span className="text-[#FFA500] text-xs opacity-70 bg-[#1e1e1e] px-2 py-1 border border-[#FFA500]/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {'/* gallery_hero.jpg */'}
                </span>
              </div>

              {/* Creative Glow Line */}
              <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-[2px] bg-gradient-to-r from-[#FFA500] to-transparent"></div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-8">
              
              {/* Mission Statement */}
              <div className="bg-[#242424] border border-[var(--border)] p-8 rounded-lg relative overflow-hidden">
                {/* Code Comment Header */}
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-[#cccccc]/60 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {'/* mission_statement.md */'}
                  </span>
                  <div className="w-3 h-3 bg-[#FFA500] animate-pulse"></div>
                </div>
                
                <div className="space-y-6 text-[#cccccc] leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <p className="text-base md:text-lg">
                    <span className="text-[#FFA500] font-bold">SumoArts</span> is a digital-first art gallery built for today&apos;s creators and collectors. 
                    Rooted in <span className="text-[#FFA500]">minimalism</span> and driven by <span className="text-[#FFA500]">community</span>, 
                    SumoArts offers a clean, distraction-free space where emerging and established artists can showcase their work and connect with a global audience.
                  </p>
                  
                  <p className="text-base md:text-lg opacity-90">
                    We celebrate creativity in all its forms—be it hand-drawn illustrations, digital artwork, or photography. 
                    Our curated platform empowers artists to tell their stories and retain ownership, while collectors can explore and support original work directly.
                  </p>
                  
                  <div className="pt-6 border-t border-[var(--border)] relative">
                    <p className="text-lg font-bold text-[#FFA500] mb-4">
                      At SumoArts, there are no gatekeepers. Just pure art.
                    </p>
                    <div className="w-16 h-1 bg-[#FFA500]"></div>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute top-2 right-2 w-4 h-4 border border-[#FFA500]/30 transform rotate-45"></div>
              </div>

              {/* Core Values Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'minimalism', value: 'Clean experience', icon: '◇' },
                  { key: 'community', value: 'Artists united', icon: '◆' },
                  { key: 'ownership', value: 'Creator rights', icon: '◇' },
                  { key: 'accessibility', value: 'Pure art', icon: '◆' }
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="bg-[#242424] border border-[var(--border)] p-4 rounded hover:border-[#FFA500]/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#FFA500] text-xs group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <span className="text-[#FFA500] text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {item.key}
                      </span>
                    </div>
                    <p className="text-[#cccccc] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Stats & CTA Combined */}
              <div className="bg-[#242424] border border-[var(--border)] p-6 rounded-lg">
                <div className="border-t border-[var(--border)] pt-4">
                  <p className="text-[#cccccc] text-sm mb-4 text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Ready to join our creative community?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleArtistClick}
                      className="flex-1 bg-[#FFA500] text-[#1e1e1e] py-2 px-4 hover:bg-[#FFA500]/90 transition-all duration-300 font-bold text-xs uppercase tracking-wider border border-[#FFA500]"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Create →
                    </button>
                    <button
                      onClick={handleArtLoverClick}
                      className="flex-1 border-2 border-[#FFA500] text-[#FFA500] py-2 px-4 hover:bg-[#FFA500] hover:text-[#1e1e1e] transition-all duration-300 font-bold text-xs uppercase tracking-wider bg-[#FFA500]/10"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Collect →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 🎨 Create Your Own Gallery Section */}
      <section className="w-full bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0a0a0a] py-20 px-4 sm:px-8 lg:px-12 border-t border-[#2a2a2a] relative overflow-hidden">
        {/* Background Code Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/6 w-40 h-40 border border-[#FFA500] rotate-12 rounded-lg"></div>
          <div className="absolute bottom-1/3 right-1/5 w-28 h-28 border border-[#FFA500] -rotate-45 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-[#FFA500] rotate-45"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-[#FFA500]"></div>
              <span className="text-[#FFA500] text-sm uppercase tracking-[0.3em] font-bold px-4 py-2 border border-[#FFA500]/30 bg-[#FFA500]/5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                create_gallery.studio
              </span>
              <div className="w-12 h-[2px] bg-[#FFA500]"></div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#cccccc] mb-6 leading-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Build Your
              <br />
              <span className="text-[#FFA500]">Dream Gallery</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FFA500] to-[#ff8c42] mx-auto"></div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            
            {/* Left Side - Content & CTA */}
            <div className="space-y-8">
              
              {/* Creative Studio Info */}
              <div className="bg-gradient-to-br from-[#1a1a1a] via-[#242424] to-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-xl relative overflow-hidden">
                {/* Code Comment Header */}
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-[#cccccc]/60 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {'/* gallery_builder.js */'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>STUDIO</span>
                  </div>
                </div>
                
                <div className="space-y-6 text-[#cccccc] leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <p className="text-lg md:text-xl text-[#FFA500] font-bold mb-4">
                    Transform your vision into reality
                  </p>
                  
                  <p className="text-base md:text-lg">
                    Create your own <span className="text-[#FFA500]">personalized art gallery</span> with our intuitive studio tools. 
                    Upload your masterpieces, organize collections, and share your creative journey with the world.
                  </p>
                  
                  <p className="text-base opacity-90">
                    Whether you&apos;re showcasing digital art, photography, or mixed media - our platform gives you complete creative control 
                    with <span className="text-[#FFA500]">professional presentation</span> and seamless sharing capabilities.
                  </p>
                </div>

                {/* Tech Features Grid */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[
                    { feature: 'drag_drop', desc: 'Easy uploads', icon: '⇪' },
                    { feature: 'auto_resize', desc: 'Smart sizing', icon: '◇' }
                  ].map((item, i) => (
                    <div key={i} className="bg-[#0f0f0f]/60 border border-[#2a2a2a] p-3 rounded hover:border-[#FFA500]/30 transition-all duration-300 group">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#FFA500] text-sm group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </span>
                        <span className="text-[#FFA500] text-xs font-bold uppercase tracking-wider">
                          {item.feature}
                        </span>
                      </div>
                      <p className="text-[#cccccc] text-xs opacity-80">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Decorative Code Element */}
                <div className="absolute top-2 right-2 w-4 h-4 border border-[#FFA500]/30 transform rotate-45"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-[#FFA500]/20"></div>
              </div>

              {/* CTA Section */}
              <div className="bg-[#242424] border border-[#2a2a2a] p-6 rounded-xl relative">
                <div className="mb-4">
                  <span className="text-[#666] text-xs mb-2 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {'// initialize_studio()'}
                  </span>
                  <h3 className="text-xl font-bold text-[#cccccc] mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Ready to create something amazing?
                  </h3>
                  <p className="text-[#888] text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Launch the gallery studio and start building your collection
                  </p>
                </div>
                
                <button
                  onClick={() => navigate('/gallery-studio')}
                  className="group bg-gradient-to-r from-[#FFA500] to-[#ff8c42] text-[#000] px-8 py-4 border-2 border-[#FFA500] hover:from-[#ff8c42] hover:to-[#FFA500] transition-all duration-300 font-bold text-sm uppercase tracking-wider transform hover:scale-105 w-full rounded-lg relative overflow-hidden"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <span className="flex items-center justify-center gap-3 relative z-10">
                    <span>Launch Gallery Studio</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                  
                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500]/20 to-[#ff8c42]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 mt-4 justify-center">
                  <div className="w-2 h-2 bg-[#FFA500] rounded-full animate-pulse"></div>
                  <span className="text-[#666] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    studio.ready = true
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Showcase Images */}
            <div className="relative h-[600px] lg:h-[700px]">
              
              {/* Main Gallery Preview */}
              <div className="absolute top-0 right-0 w-3/4 h-3/5 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#333] overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-700 group">
                {/* Mock Browser Header */}
                <div className="h-8 bg-[#2a2a2a] border-b border-[#333] flex items-center px-4 gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 flex-1 bg-[#1a1a1a] rounded-sm px-3 py-1">
                    <span className="text-[#666] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      sumoarts.gallery/my-studio
                    </span>
                  </div>
                </div>
                
                <img 
                  src="/images/download 9.png"
                  alt="Gallery Studio Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  style={{
                    filter: 'contrast(1.1) brightness(0.9) saturate(1.1)'
                  }}
                  onError={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #FFA500, #ff8c42, #1a1a1a)';
                    e.target.style.backgroundColor = '#FFA500';
                  }}
                />
                
                {/* Floating Upload Indicator */}
                <div className="absolute top-4 right-4 bg-[#FFA500] text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  LIVE
                </div>
              </div>

              {/* Secondary Upload Preview */}
              <div className="absolute bottom-0 left-0 w-3/4 h-2/5 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-xl border border-[#333] overflow-hidden shadow-xl transform -rotate-2 hover:rotate-0 transition-all duration-700 group">
                {/* Upload Interface Mock */}
                <div className="h-6 bg-[#1a1a1a] border-b border-[#333] flex items-center px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FFA500] rounded-full animate-pulse"></div>
                    <span className="text-[#FFA500] text-xs font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      upload.studio
                    </span>
                  </div>
                </div>
                
                <img 
                  src="/images/download 7.png"
                  alt="Upload Interface"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  style={{
                    filter: 'contrast(1.2) brightness(0.8) saturate(1.2) sepia(10%)'
                  }}
                  onError={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #ff8c42, #FFA500, #2a2a2a)';
                    e.target.style.backgroundColor = '#ff8c42';
                  }}
                />
                
                {/* Upload Progress Mock */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#000]/80 backdrop-blur-sm rounded px-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#FFA500] text-xs font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      Uploading...
                    </span>
                    <span className="text-[#666] text-xs">87%</span>
                  </div>
                  <div className="w-full h-1 bg-[#333] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FFA500] to-[#ff8c42] rounded-full w-[87%] transition-all duration-1000"></div>
                  </div>
                </div>
              </div>

              {/* Floating Code Comments */}
              <div className="absolute top-4 left-4 opacity-60">
                <span className="text-[#FFA500] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {'// gallery_preview.jsx'}
                </span>
              </div>
              
              <div className="absolute bottom-4 right-4 opacity-60">
                <span className="text-[#666] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {'/* drag & drop enabled */'}
                </span>
              </div>

              {/* Connecting Line */}
              <div className="absolute top-1/2 left-1/4 w-16 h-[2px] bg-gradient-to-r from-[#FFA500] to-transparent transform -translate-y-1/2 opacity-40"></div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
