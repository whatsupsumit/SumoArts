import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export default function ForArtistsPage() {
  const { currentUser, isArtist } = useAuth();
  const navigate = useNavigate();

  // Scroll to top on mount (fixes mobile navigation to bottom issue)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleArtistClick = () => {
    if (!currentUser) {
      navigate("/login?type=artist");
    } else if (isArtist()) {
      navigate("/artist-dashboard");
    } else {
      navigate("/become-artist", {
        state: {
          fromArtLover: true,
          userEmail: currentUser.email,
        },
      });
    }
  };

  return (
    <>
      {/* Different burger menu colors in this page only */}
      <Navbar isArtistPage={true} />

      <main className="fixed inset-0 bg-var(--bg) w-screen h-screen flex flex-wrap items-center justify-between md:overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
        {/* Text section (left) */}
        <div className="flex flex-col w-full md:w-6/12 px-6 z-10">
          <div className="flex flex-col items-start w-full items-start pt-24 md:pt-0 xl:pl-10 2xl:pl-40 ">
            <h1
              className="text-var(--accent) font-bold text-left text-6xl pb-6 md:text-7xl lg:text-7xl"
              style={{ fontFamily: "var(--font-mono)", color: 'var(--accent)' }}
            >
              For Artists
            </h1>
            <h2 className="text-var(--text) text-2xl text-left md:text-3xl lg:text-3xl" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              Exhibit your art.
            </h2>
            <h2 className="text-var(--text) text-2xl text-left md:text-3xl lg:text-3xl" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              Connect with art lovers.
            </h2>
            <div className="w-full max-w-[280px] md:max-w-none md:w-5/6 lg:w-4/6 xl:w-1/2 2xl:max-w-[600px] mx-0 md:mx-0">
              <button
                onClick={handleArtistClick}
                data-testid="button-artists-page"
                className="bg-var(--accent) text-var(--bg) text-lg font-bold w-full py-4 mt-12 border-2 border-var(--accent) hover:bg-opacity-80 transition-colors duration-300"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
              >
                {currentUser && isArtist()
                  ? "Manage your art gallery"
                  : "Open your own art gallery"}{" "}
              </button>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative w-full md:w-1/2 h-screen">
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 bg-var(--bg) opacity-50 z-20"
            aria-hidden="true"
            style={{ backgroundColor: 'var(--bg)' }}
          />
          {/* Main Image */}
          <img
            src="images/for-artist-hero.jpg"
            alt="Colourful Paint"
            className="absolute inset-0 w-full h-full object-cover object-center scale-100"
          />
        </div>
      </main>
    </>
  );
}
