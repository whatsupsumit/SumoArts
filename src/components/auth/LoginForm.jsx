import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

export default function LoginForm() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== "/signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const typeFromUrl = searchParams.get("type");
  const [isArtist, setIsArtist] = useState(typeFromUrl === "artist");

  // Update isLogin state when route changes
  useEffect(() => {
    setIsLogin(location.pathname !== "/signup");
  }, [location.pathname]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const response = await login(email, password);
        if (response && response.userData) {
          if (response.userData.isArtist) {
            navigate("/for-artists");
          } else {
            navigate("/for-art-lovers");
          }
        }
      } else {
        await signup(email, password, firstName, lastName, isArtist);
        navigate(isArtist ? "/for-artists" : "/for-art-lovers");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Map Firebase error codes to user-friendly messages
      const errorMessage = {
        'auth/invalid-credential': 'Invalid email or password',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'An account with this email already exists',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/invalid-email': 'Please enter a valid email address'
      }[error.code] || 'An error occurred during login/signup';
      
      setError(errorMessage);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen w-full pt-20 pb-8 px-4 bg-[var(--bg)] flex items-center justify-center" style={{ fontFamily: "var(--font-mono)" }}>
      <div className="w-full max-w-md mx-auto p-8 border-2 border-[var(--accent)] bg-[var(--bg)]" style={{ borderRadius: 0 }}>
        <h2 className="text-2xl font-bold mb-8 text-[var(--accent)] text-center uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
          {isLogin ? "/* login */" : "/* register */"}
        </h2>

        {error && (
          <div className="bg-[var(--bg)] border-2 border-red-500 text-red-500 px-4 py-3 mb-6 text-center text-sm" style={{ borderRadius: 0, fontFamily: "var(--font-mono)" }}>
            {error}
          </div>
        )}

        {!isLogin && (
          <div className="mb-6">
            <label className="block text-[var(--accent)] mb-2 font-bold text-sm uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
              Account Type:
            </label>
            <div className="space-y-2">
              <button
                type="button"
                data-testid="open-art-gallery-button"
                onClick={() => setIsArtist(true)}
                className={`w-full p-3 border-2 transition-colors font-bold text-sm uppercase tracking-wide ${
                  isArtist
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]"
                    : "border-[var(--accent)] bg-[var(--bg)] text-[var(--accent)]"
                }`}
                style={{ borderRadius: 0, fontFamily: "var(--font-mono)" }}
              >
                &gt; Artist
              </button>
              <button
                type="button"
                data-testid="purchase-artwork-button"
                onClick={() => setIsArtist(false)}
                className={`w-full p-3 border-2 transition-colors font-bold text-sm uppercase tracking-wide ${
                  !isArtist
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]"
                    : "border-[var(--accent)] bg-[var(--bg)] text-[var(--accent)]"
                }`}
                style={{ borderRadius: 0, fontFamily: "var(--font-mono)" }}
              >
                &gt; Collector
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-[var(--accent)] mb-2 font-bold text-sm uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
                  First Name:
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full p-3 border-2 border-[var(--accent)] bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text)] placeholder-opacity-60 focus:border-opacity-80 focus:outline-none transition-colors"
                  style={{ borderRadius: 0, fontFamily: "var(--font-mono)" }}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                  placeholder="/* enter first name */"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-[var(--accent)] mb-2 font-bold text-sm uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
                  Last Name:
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full p-3 border-2 border-[var(--accent)] bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text)] placeholder-opacity-60 focus:border-opacity-80 focus:outline-none transition-colors"
                  style={{ borderRadius: 0, fontFamily: "var(--font-mono)" }}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                  placeholder="/* enter last name */"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-[var(--accent)] mb-2 font-bold text-sm uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
              Email:
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 border-2 border-[var(--accent)] bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text)] placeholder-opacity-60 focus:border-opacity-80 focus:outline-none transition-colors"
              style={{ borderRadius: 0, fontFamily: "var(--font-mono)" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="/* your@email.com */"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-[var(--accent)] mb-2 font-bold text-sm uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
              Password:
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-3 border-2 border-[var(--accent)] bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text)] placeholder-opacity-60 focus:border-opacity-80 focus:outline-none transition-colors"
              style={{ borderRadius: 0, fontFamily: "var(--font-mono)" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="/* secure password */"
            />
          </div>

          {/* Login/Signup Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-[var(--accent)] text-[var(--bg)] font-bold transition-all duration-200 border-2 border-[var(--accent)] hover:bg-[var(--bg)] hover:text-[var(--accent)] disabled:opacity-50 uppercase tracking-wider"
            style={{ borderRadius: 0, fontFamily: "var(--font-mono)" }}
            disabled={loading}
          >
            {loading ? "/* processing... */" : (isLogin ? "/* login */" : "/* create account */")}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <button
          className="w-full text-center mt-6 text-[var(--text)] hover:text-[var(--accent)] transition-colors font-bold text-sm uppercase tracking-wide"
          style={{ fontFamily: "var(--font-mono)" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "/* need account? signup */"
            : "/* have account? login */"}
        </button>

        {/* Continue as Guest */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-[var(--text)] hover:text-[var(--accent)] transition-colors text-xs font-bold uppercase tracking-wide opacity-60 hover:opacity-100"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {/* continue as guest */}
          </button>
        </div>
      </div>
    </main>
  );
}
