import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border)] py-12 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Logo & About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[var(--accent)] text-[var(--bg)] px-2 py-1 font-mono font-bold text-lg border border-[var(--accent)]">
                S
              </span>
              <span className="text-[var(--text)] font-mono font-bold text-lg tracking-wider">
                umoArts
              </span>
            </div>
            <p className="text-[var(--text-dim)] text-sm mb-4 max-w-md leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
              A minimal, lofi digital art platform connecting creators and collectors worldwide. 
              Built with love for the art community.
            </p>
            <div className="flex items-center gap-4 text-xs text-[var(--text-dim)]" style={{ fontFamily: "var(--font-mono)" }}>
              <span>© 2025 SumoArts</span>
              <span>•</span>
              <span>Open Source</span>
              <span>•</span>
              <span>Community Driven</span>
            </div>
          </div>
          
          {/* Platform Links */}
          <div>
            <h4 className="text-[var(--accent)] font-bold mb-4 text-sm uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
              Platform
            </h4>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Browse Gallery', path: '/for-art-lovers' },
                { name: 'Become Artist', path: '/become-artist' },
                { name: 'For Artists', path: '/for-artists' },
                { name: 'Cart', path: '/cart' }
              ].map((link, i) => (
                <div 
                  key={i} 
                  className="text-[var(--text-dim)] hover:text-[var(--accent)] cursor-pointer transition-colors duration-200" 
                  style={{ fontFamily: "var(--font-mono)" }}
                  onClick={() => navigate(link.path)}
                >
                  {link.name}
                </div>
              ))}
            </div>
          </div>
          
          {/* Status & Info */}
          <div>
            <h4 className="text-[var(--accent)] font-bold mb-4 text-sm uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
              Status
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--accent)] animate-pulse"></div>
                <span className="text-[var(--text)]" style={{ fontFamily: "var(--font-mono)" }}>
                  All Systems Online
                </span>
              </div>
              <div className="text-[var(--text-dim)]" style={{ fontFamily: "var(--font-mono)" }}>
                <div>500+ Active Artists</div>
                <div>2.5K+ Artworks</div>
                <div>1K+ Collectors</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-[var(--border)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-[var(--text-dim)]" style={{ fontFamily: "var(--font-mono)" }}>
            Built with ❤️ by developers who love art
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div className="text-[var(--text-dim)] hover:text-[var(--accent)] cursor-pointer transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
              Privacy Policy
            </div>
            <div className="text-[var(--text-dim)] hover:text-[var(--accent)] cursor-pointer transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
              Terms of Service
            </div>
            <div className="text-[var(--text-dim)] hover:text-[var(--accent)] cursor-pointer transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
              Support
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
