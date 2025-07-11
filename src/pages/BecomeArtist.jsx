import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function BecomeArtist() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();  
  const userEmail = location.state?.userEmail || currentUser?.email;

  return (
    <main className="min-h-screen bg-var(--bg) py-12 px-4" style={{ backgroundColor: 'var(--bg)', fontFamily: 'var(--font-mono)' }}>
      <div className="max-w-3xl mx-auto text-center">
        {currentUser ? (
          <>
            <h1 className="text-4xl font-bold mb-4 text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Upgrade Your Account</h1>
            <h2 className="text-var(--text) text-lg font-semibold my-6" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              You&apos;re currently logged in as an art lover ({userEmail}).
            </h2>
            <p className="text-var(--text) text-lg mb-8" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              We&apos;re working on making it possible for art lovers to become artists.
              Check back soon! Alternatively, you can sign up as an artist with a new email.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-4 text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>Coming Soon</h1>
            <p className="text-var(--text) text-lg mb-8" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              We&apos;re working on making it possible for art lovers to become artists. 
              Check back soon! Alternatively, you can sign up as an artist with a new email.
            </p>
          </>
        )}
        
        <button
          onClick={() => navigate("/")}
          className="bg-var(--accent) text-var(--bg) py-3 px-6 font-bold hover:bg-opacity-80 transition-colors border-2 border-var(--accent)"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          Back to Home
        </button>
      </div>
    </main>
  );
} 