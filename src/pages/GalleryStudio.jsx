import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../index.css";

export default function GalleryStudio() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [pins, setPins] = useState([]);
  const [currentPin, setCurrentPin] = useState({
    title: '',
    description: '',
    destination: '',
    size: 'medium',
    imageBlob: null
  });
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && /image\/*/.test(file.type)) {
      const reader = new FileReader();
      
      reader.onload = function() {
        setCurrentPin(prev => ({ ...prev, imageBlob: reader.result }));
        setPreviewImage(reader.result);
        setShowModal(true);
      };
      
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  // Create new pin
  const createPin = () => {
    if (!currentPin.imageBlob || !currentPin.title) return;
    
    const newPin = {
      id: Date.now(),
      title: currentPin.title,
      description: currentPin.description,
      destination: currentPin.destination,
      size: currentPin.size,
      imageBlob: currentPin.imageBlob,
      author: currentUser?.displayName || 'Anonymous'
    };
    
    setPins(prev => [...prev, newPin]);
    resetModal();
  };

  // Reset modal
  const resetModal = () => {
    setShowModal(false);
    setPreviewImage(null);
    setCurrentPin({
      title: '',
      description: '',
      destination: '',
      size: 'medium',
      imageBlob: null
    });
  };

  const getSizeClass = (size) => {
    switch(size) {
      case 'small': return 'h-64';
      case 'large': return 'h-96';
      default: return 'h-80';
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Cool Back Navigation */}
      <div className="w-full bg-[#0a0a0a] border-b border-[#2a2a2a] px-4 sm:px-8 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 text-[#666] hover:text-[#FFA500] transition-all duration-300 bg-[#1a1a1a]/60 border border-[#333] hover:border-[#FFA500]/50 px-4 py-2 rounded-lg backdrop-blur-sm"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {/* Lofi Arrow Design */}
            <div className="relative flex items-center">
              {/* Main Arrow */}
              <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">←</span>
              
              {/* Glitch Effect Lines */}
              <div className="absolute -left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-6 h-[1px] bg-[#FFA500] -rotate-12 animate-pulse"></div>
                <div className="w-4 h-[1px] bg-[#FFA500] rotate-12 mt-1 animate-pulse delay-100"></div>
              </div>
            </div>
            
            <span className="text-sm font-bold uppercase tracking-wider">
              back_to_home
            </span>
            
            {/* Terminal Cursor */}
            <div className="w-2 h-4 bg-[#FFA500] opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
          </button>
          
          {/* Breadcrumb */}
          <div className="ml-8 flex items-center gap-2 text-[#666] text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="opacity-50">home</span>
            <span className="text-[#FFA500]">/</span>
            <span className="text-[#FFA500]">gallery-studio</span>
            <div className="ml-2 w-2 h-2 bg-[#FFA500] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Gallery Studio Header */}
      <section className="w-full bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] py-16 px-4 sm:px-8 lg:px-12 border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-[#FFA500]"></div>
            <span className="text-[#FFA500] text-sm uppercase tracking-[0.3em] font-bold px-4 py-2 border border-[#FFA500]/30 bg-[#FFA500]/5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              gallery.studio
            </span>
            <div className="w-12 h-[2px] bg-[#FFA500]"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#cccccc] mb-6 leading-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Create Your
            <br />
            <span className="text-[#FFA500]">Art Gallery</span>
          </h1>
          
          <p className="text-[#888] text-lg max-w-2xl mx-auto mb-8" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Upload your artwork, organize your collection, and share your creative vision with the world.
          </p>

          {/* Enhanced Upload Section */}
          <div className="flex flex-col items-center gap-6">
            {/* Primary Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group relative bg-gradient-to-r from-[#FFA500] to-[#ff8c42] text-[#000] px-10 py-5 border-2 border-[#FFA500] hover:from-[#ff8c42] hover:to-[#FFA500] transition-all duration-300 font-bold text-sm uppercase tracking-wider transform hover:scale-105 rounded-xl overflow-hidden"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {/* Button Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500]/20 to-[#ff8c42]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <span className="flex items-center justify-center gap-4 relative z-10">
                <span className="text-lg">Upload Artwork</span>
                
                {/* Lofi Upload Icon */}
                <div className="relative">
                  <span className="text-2xl group-hover:translate-y-[-3px] transition-transform duration-300">⇪</span>
                  
                  {/* Glitch Lines */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-[#000] animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#000] animate-pulse delay-75"></div>
                  </div>
                </div>
              </span>
            </button>

            {/* Secondary Info */}
            <div className="flex items-center gap-4 text-[#666] text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FFA500] rounded-full animate-pulse"></div>
                <span>drag & drop enabled</span>
              </div>
              <div className="w-px h-4 bg-[#333]"></div>
              <div className="flex items-center gap-2">
                <span className="text-[#FFA500]">◇</span>
                <span>jpg, png, webp supported</span>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="w-full bg-[#1a1a1a] py-16 px-4 sm:px-8 lg:px-12 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          {pins.length === 0 ? (
            /* Enhanced Empty State */
            <div className="text-center py-20 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-[#FFA500] rotate-45 rounded-lg"></div>
                <div className="absolute bottom-1/4 right-1/4 w-20 h-20 border border-[#FFA500] -rotate-12 rounded-full"></div>
                <div className="absolute top-1/2 right-1/3 w-24 h-24 border border-[#FFA500] rotate-12"></div>
              </div>

              {/* Main Empty Icon */}
              <div className="relative inline-block mb-8">
                <div className="w-40 h-40 mx-auto border-2 border-dashed border-[#333] rounded-xl flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden group">
                  {/* Animated Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFA500]/10 via-transparent to-[#ff8c42]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Art Icon */}
                  <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300">🎨</span>
                  
                  {/* Corner Accents */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#FFA500] opacity-40"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#FFA500] opacity-40"></div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FFA500] rounded-full animate-pulse opacity-60"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#ff8c42] rounded-full animate-pulse delay-300 opacity-60"></div>
              </div>

              {/* Text Content */}
              <div className="space-y-4 mb-8">
                <h3 className="text-3xl font-bold text-[#cccccc] mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Your gallery is empty
                </h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-8 h-[1px] bg-[#FFA500]"></div>
                  <span className="text-[#FFA500] text-xs uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    gallery.status
                  </span>
                  <div className="w-8 h-[1px] bg-[#FFA500]"></div>
                </div>
                <p className="text-[#666] text-lg" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Upload your first artwork to get started
                </p>
                
                {/* Terminal-style instructions */}
                <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4 max-w-md mx-auto mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-[#ff5f56] rounded-full"></div>
                    <div className="w-3 h-3 bg-[#ffbd2e] rounded-full"></div>
                    <div className="w-3 h-3 bg-[#27ca3f] rounded-full"></div>
                    <span className="text-[#666] text-xs ml-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      gallery-studio.exe
                    </span>
                  </div>
                  <div className="text-left space-y-1 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    <div className="text-[#FFA500]">$ gallery.init()</div>
                    <div className="text-[#666]">{'>'} preparing upload interface...</div>
                    <div className="text-[#666]">{'>'} ready for artwork upload</div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#FFA500]">$</span>
                      <span className="text-[#cccccc]">_</span>
                      <div className="w-2 h-3 bg-[#FFA500] animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="group relative bg-gradient-to-r from-[#FFA500] to-[#ff8c42] text-[#000] px-8 py-4 rounded-xl font-bold hover:from-[#ff8c42] hover:to-[#FFA500] transition-all duration-300 transform hover:scale-105 overflow-hidden"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500]/30 to-[#ff8c42]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                
                <span className="flex items-center justify-center gap-3 relative z-10">
                  <span className="text-lg font-bold">Upload Now</span>
                  <div className="relative">
                    <span className="text-xl group-hover:translate-y-[-2px] transition-transform duration-300">⇪</span>
                    <div className="absolute inset-0 text-xl text-[#000]/50 group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-transform duration-300">⇪</div>
                  </div>
                </span>
              </button>

              {/* Status Bar */}
              <div className="flex items-center justify-center gap-4 mt-8 text-[#666] text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>0 artworks</span>
                </div>
                <div className="w-px h-4 bg-[#333]"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FFA500] rounded-full animate-pulse delay-150"></div>
                  <span>ready for upload</span>
                </div>
              </div>
            </div>
          ) : (
            /* Gallery Grid */
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {pins.map((pin) => (
                <div 
                  key={pin.id}
                  className={`break-inside-avoid bg-[#242424] rounded-xl border border-[#333] overflow-hidden hover:border-[#FFA500] transition-all duration-300 group ${getSizeClass(pin.size)}`}
                >
                  {/* Pin Image */}
                  <div className="relative h-full">
                    <img 
                      src={pin.imageBlob}
                      alt={pin.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {pin.title}
                        </h3>
                        {pin.description && (
                          <p className="text-[#ccc] text-sm mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {pin.description}
                          </p>
                        )}
                        {pin.destination && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#FFA500] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                              {pin.destination}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upload Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) resetModal();
          }}
        >
          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              
              {/* Image Preview */}
              <div className="lg:w-1/2 p-6 flex items-center justify-center bg-[#0f0f0f]">
                <img 
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-96 object-contain rounded-lg"
                />
              </div>

              {/* Form */}
              <div className="lg:w-1/2 p-6">
                <h3 className="text-2xl font-bold text-[#cccccc] mb-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Add to Gallery
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[#FFA500] text-sm font-bold mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      Title*
                    </label>
                    <input
                      type="text"
                      value={currentPin.title}
                      onChange={(e) => setCurrentPin(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-[#cccccc] focus:border-[#FFA500] focus:outline-none"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      placeholder="Enter artwork title..."
                    />
                  </div>

                  <div>
                    <label className="block text-[#FFA500] text-sm font-bold mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      Description
                    </label>
                    <textarea
                      value={currentPin.description}
                      onChange={(e) => setCurrentPin(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-[#cccccc] focus:border-[#FFA500] focus:outline-none h-24 resize-none"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      placeholder="Describe your artwork..."
                    />
                  </div>

                  <div>
                    <label className="block text-[#FFA500] text-sm font-bold mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      Website/Link
                    </label>
                    <input
                      type="text"
                      value={currentPin.destination}
                      onChange={(e) => setCurrentPin(prev => ({ ...prev, destination: e.target.value }))}
                      className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-[#cccccc] focus:border-[#FFA500] focus:outline-none"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[#FFA500] text-sm font-bold mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      Size
                    </label>
                    <select
                      value={currentPin.size}
                      onChange={(e) => setCurrentPin(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-[#cccccc] focus:border-[#FFA500] focus:outline-none"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={createPin}
                    disabled={!currentPin.title}
                    className="flex-1 bg-[#FFA500] text-[#000] py-3 rounded-lg font-bold hover:bg-[#ff8c42] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Add to Gallery
                  </button>
                  <button
                    onClick={resetModal}
                    className="flex-1 bg-[#333] text-[#cccccc] py-3 rounded-lg font-bold hover:bg-[#444] transition-colors duration-300"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </>
  );
}
