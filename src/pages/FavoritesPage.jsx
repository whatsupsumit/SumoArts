import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { MdArrowBack } from "react-icons/md";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default function FavoritesPage() {
  const { currentUser, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch fresh artwork data for each favorite
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser?.favorites) {
        setLoading(false);
        return;
      }

      try {
        const freshFavorites = await Promise.all(
          currentUser.favorites.map(async (fav) => {
            const artworkDoc = await getDoc(doc(db, "artworks", fav.id));
            if (artworkDoc.exists()) {
              const artworkData = artworkDoc.data();
              return {
                ...fav,
                artist: artworkData.user.name,
                title: artworkData.title || artworkData.alt_description,
                imageUrl: artworkData.imageUrl || artworkData.urls?.regular,
              };
            }
            return fav;
          })
        );
        setFavorites(freshFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Error loading favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser?.favorites]);

  const handleRemoveFavorite = async (artwork) => {
    try {
      await toggleFavorite(artwork);
    } catch (error) {
      toast.error("Error removing from favourites");
    }
  };

  if (loading) {
    return (
      <div className="pt-12 pb-20 px-4 container mx-auto min-h-screen">
        Loading...
      </div>
    );
  }

  if (!currentUser?.favorites || currentUser.favorites.length === 0) {
    return (
      <div className="pt-12 pb-20 px-4 container mx-auto min-h-screen bg-var(--bg)" style={{ backgroundColor: 'var(--bg)', fontFamily: 'var(--font-mono)' }}>
        <h1 className="text-3xl font-bold mb-8 text-center text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>My Favourites</h1>
        <div className="text-center py-12">
          <p className="text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>No favourites yet</p>
          <button
            onClick={() => navigate("/for-art-lovers")}
            className="mt-4 bg-var(--accent) font-bold text-var(--bg) px-12 py-3 border-2 border-var(--accent) hover:bg-opacity-80 transition-colors duration-300"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
          >
            Explore Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-20 px-4 container mx-auto min-h-screen bg-var(--bg)" style={{ backgroundColor: 'var(--bg)', fontFamily: 'var(--font-mono)' }}>
      <h1 className="text-3xl font-bold mb-8 text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>My Favourites</h1>

      <button
        onClick={() => {
          navigate("/for-art-lovers", {
            state: {
              returnToPosition: location.state?.scrollPosition,
              fromArtwork: true,
            },
          });
        }}
        className="flex items-center gap-2 mb-6 text-var(--text) hover:text-var(--accent) border-2 border-var(--accent) px-4 py-2"
        style={{ color: 'var(--text)', borderColor: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
      >
        <MdArrowBack /> Back to Gallery
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((artwork) => (
          <div
            key={artwork.id}
            className="relative bg-var(--bg) border-2 border-var(--accent) overflow-hidden"
            style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--accent)' }}
          >
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-64 object-cover cursor-pointer border-b-2 border-var(--accent)"
              style={{ borderColor: 'var(--accent)' }}
              onClick={() =>
                navigate(`/artwork/${artwork.id}`, {
                  state: {
                    size: artwork.size,
                    price: artwork.price,
                    fromFavorites: true,
                  },
                })
              }
            />

            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-var(--accent)" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{artwork.title}</h2>
              <p className="text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{artwork.artist}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-var(--accent)" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>€{artwork.price}</span>
                <button
                  onClick={() => handleRemoveFavorite(artwork)}
                  className="text-var(--accent) hover:text-opacity-80 p-2 border-2 border-var(--accent)"
                  style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
                  title="Remove from favorites"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
