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

      {/* Spacer between navbar and content (reduced for higher hero section) */}
      <div className="w-full" style={{ height: "10px" }}></div>

      {/* Hero Section - centered for lofi balance */}
      <section className="min-h-screen w-full bg-[var(--bg)] flex items-center justify-center px-4 sm:px-8 lg:px-12 py-8 md:py-16">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          
          {/* Left Section - Content */}
          <div className="lg:col-span-2 space-y-8 flex flex-col justify-start">
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
          <div className="lg:col-span-3 h-full min-h-[600px] relative flex flex-col justify-start">
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
                    6 collections
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

                {/* Main Gallery Grid */}
                <div className="flex items-center justify-center h-full pt-8">
                  <div 
                    ref={sliderRef}
                    id="gallery-slider"
                    className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide py-8"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      scrollBehavior: 'smooth'
                    }}
                  >
                    {/* Dynamic Art Cards */}
                    {[
                      '/images/download 1.jpg',
                      '/images/download 2.jfif', 
                      '/images/download 3.jpeg',
                      '/images/download 4.jfif',
                      '/images/download 5.jfif',
                      '/images/download 6.jpeg'
                    ].map((imgSrc, index) => (
                      <div 
                        key={index}
                        className="flex-none snap-center group cursor-pointer relative"
                        style={{
                          transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'}) translateZ(0)`,
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {/* Enhanced Art Frame */}
                        <div 
                          className="relative bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-xl border border-[#333] overflow-hidden transition-all duration-700 ease-out"
                          style={{
                            boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(255,165,0,0.1)',
                            transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) translateY(-12px) translateZ(20px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.7), 0 0 30px rgba(255,165,0,0.2), inset 0 0 10px rgba(255,165,0,0.05)';
                            e.currentTarget.style.borderColor = '#FFA500';
                            e.currentTarget.style.zIndex = '100';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'}) translateY(0px) translateZ(0px) scale(1)`;
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(255,165,0,0.1)';
                            e.currentTarget.style.borderColor = '#333';
                            e.currentTarget.style.zIndex = 'auto';
                          }}
                        >
                          {/* Corner Tech Elements */}
                          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#FFA500] opacity-40"></div>
                          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#FFA500] opacity-40"></div>
                          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#FFA500] opacity-40"></div>
                          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#FFA500] opacity-40"></div>

                          {/* Art Image with Better Sizing */}
                          <div className="relative p-3">
                            <img 
                              src={imgSrc}
                              alt={`Artwork ${index + 1}`}
                              className="w-[300px] h-[400px] object-cover rounded-lg transition-all duration-700"
                              style={{
                                filter: 'contrast(1.1) brightness(0.9) saturate(1.1)',
                                transition: 'all 0.7s ease-out'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.filter = 'contrast(1.2) brightness(1.05) saturate(1.2) hue-rotate(3deg)';
                                e.target.style.transform = 'scale(1.01)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.filter = 'contrast(1.1) brightness(0.9) saturate(1.1)';
                                e.target.style.transform = 'scale(1)';
                              }}
                              onError={(e) => {
                                e.target.style.background = 'linear-gradient(135deg, #FFA500, #ff8c42, #1a1a1a)';
                                e.target.style.backgroundColor = '#FFA500';
                              }}
                            />
                            
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#FFA500]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none"></div>
                          </div>

                          {/* Enhanced Info Panel */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="text-white text-sm font-bold mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                  {['GENESIS', 'FLUX', 'VOID', 'NEON', 'CYBER', 'AURA'][index]}_{String(index + 1).padStart(2, '0')}
                                </div>
                                <div className="text-[#FFA500] text-xs opacity-90" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                  {['abstract.minimal', 'surreal.flow', 'digital.dreams', 'neon.symphony', 'cyber.essence', 'lofi.vibes'][index]}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <div className="w-2 h-2 bg-[#FFA500] rounded-full animate-pulse"></div>
                                <div className="text-[#666] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                  ${(Math.random() * 5 + 1).toFixed(1)}K
                                </div>
                              </div>
                            </div>
                            
                            {/* Status Bar */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 h-1 bg-[#333] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#FFA500] to-[#ff8c42] rounded-full" style={{ width: `${60 + index * 10}%` }}></div>
                              </div>
                              <span className="text-[#FFA500] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                {60 + index * 10}%
                              </span>
                            </div>
                          </div>

                          {/* Floating Action Button */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
                            <div className="w-8 h-8 bg-[#FFA500] rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12l-4-4h8l-4 4z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Navigation */}
                <button 
                  onClick={() => {
                    const slider = document.getElementById('gallery-slider');
                    slider.scrollBy({ left: -320, behavior: 'smooth' });
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-[#333] rounded-full text-[#666] hover:text-[#FFA500] hover:border-[#FFA500] hover:shadow-lg hover:shadow-[#FFA500]/20 transition-all duration-300 flex items-center justify-center group backdrop-blur-lg"
                >
                  <span className="group-hover:-translate-x-1 transition-transform duration-300 text-lg">←</span>
                </button>
                
                <button 
                  onClick={() => {
                    const slider = document.getElementById('gallery-slider');
                    slider.scrollBy({ left: 320, behavior: 'smooth' });
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border border-[#333] rounded-full text-[#666] hover:text-[#FFA500] hover:border-[#FFA500] hover:shadow-lg hover:shadow-[#FFA500]/20 transition-all duration-300 flex items-center justify-center group backdrop-blur-lg"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300 text-lg">→</span>
                </button>

                {/* Interactive Progress Bar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-3 bg-[#1a1a1a]/80 backdrop-blur-lg border border-[#333] rounded-full px-4 py-2">
                    <div className="flex gap-2">
                      {Array.from({length: 6}).map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-[#333] hover:bg-[#FFA500] rounded-full transition-colors duration-300 cursor-pointer"></div>
                      ))}
                    </div>
                    <div className="w-px h-4 bg-[#333]"></div>
                    <span className="text-[#666] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      scroll
                    </span>
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
                      className="flex-1 border border-[#FFA500] text-[#FFA500] py-2 px-4 hover:bg-[#FFA500]/10 transition-all duration-300 font-bold text-xs uppercase tracking-wider"
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
