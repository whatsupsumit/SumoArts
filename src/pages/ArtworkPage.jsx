import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdAddShoppingCart, MdArrowBack } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default function ArtworkPage() {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, toggleFavorite, isArtworkFavorited, addToCart } =
    useAuth();

  useEffect(() => {
    async function fetchArtwork() {
      try {
        // Always fetch fresh data from Firestore
        const artworksRef = collection(db, "artworks");
        const artworkDoc = await getDoc(doc(artworksRef, id));

        if (artworkDoc.exists()) {
          const artworkData = artworkDoc.data();
          
          // If coming from favorites, use the profile photo from location state
          const userProfileImage = location.state?.fromFavorites 
            ? {
                medium: location.state.user?.profile_image?.medium || artworkData.user?.profile_image?.medium,
                small: location.state.user?.profile_image?.small || artworkData.user?.profile_image?.small,
                large: location.state.user?.profile_image?.large || artworkData.user?.profile_image?.large
            }
            : artworkData.user?.profile_image;

          setArtwork({
            id: artworkDoc.id,
            ...artworkData,
            alt_description: artworkData.title || artworkData.alt_description,
            urls: {
              regular: artworkData.imageUrl || artworkData.urls?.regular,
              small: artworkData.imageUrl || artworkData.urls?.small,
            },
            user: {
              ...artworkData.user,
              profile_image: userProfileImage
            },
            created_at: artworkData.created_at || artworkData.publishedAt,
          });
        } else {
          // If not found in Firestore, try Unsplash
          const response = await fetch(
            `https://api.unsplash.com/photos/${id}`,
            {
              headers: {
                Authorization: `Client-ID ${
                  import.meta.env.VITE_UNSPLASH_ACCESS_KEY
                }`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Artwork not found");
          }
          const data = await response.json();
          setArtwork(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchArtwork();
  }, [id, location.state]);

  const handleFavoriteClick = async () => {
    try {
      if (!currentUser) {
        toast.error("Please sign in to save favourites");
        return;
      }
      const isNowFavorited = await toggleFavorite({
        id: artwork.id,
        alt_description: artwork.alt_description,
        urls: artwork.urls,
        user: artwork.user,
        price: price,
        size: size,
      });
      toast.success(
        isNowFavorited ? "Added to favourites" : "Removed from favourites"
      );
    } catch (error) {
      console.error("Error toggling favourite:", error);
      toast.error(error.message || "Error updating favourites");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!artwork)
    return <div className="text-center mt-10">Artwork not found</div>;

  // Get size and price from location state (from ForArtLoversPage)
  const size = location.state?.size || {
    width: 100, // Default values if not provided
    height: 150,
  };

  const price = location.state?.price || 675; // Default price if not provided

  // Get if we came from favorites
  const fromFavorites = location.state?.fromFavorites;

  return (
    <div className="container mx-auto px-4 py-10 bg-var(--bg) min-h-screen" style={{ backgroundColor: 'var(--bg)', fontFamily: 'var(--font-mono)' }}>
      {/* Back button */}
      <button
        onClick={() => {
          if (fromFavorites) {
            navigate("/favorites");
          } else {
            navigate("/for-art-lovers", {
              state: {
                returnToPosition: location.state?.scrollPosition,
                fromArtwork: true,
              },
            });
          }
        }}
        className="flex items-center gap-2 mb-6 text-var(--text) hover:text-var(--accent) border-2 border-var(--accent) px-4 py-2"
        style={{ color: 'var(--text)', borderColor: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
      >
        <MdArrowBack />
        {fromFavorites ? "Back to Favourites" : "Back to Gallery"}
      </button>

      {/* Artwork details container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full">
          <img
            src={artwork.urls.regular}
            alt={artwork.alt_description || "Untitled Artwork"}
            className="w-full h-full object-cover border-2 border-var(--accent) bg-var(--bg)"
            style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--bg)' }}
          />
          <div className="absolute top-4 right-4 flex gap-3">
            <button
              className="bg-var(--bg) border-2 border-var(--accent) p-3 hover:bg-var(--accent) hover:text-var(--bg) transition-all duration-300"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--accent)', color: 'var(--accent)' }}
              onClick={handleFavoriteClick}
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
              {isArtworkFavorited(artwork.id) ? (
                <FaHeart className="text-xl text-var(--accent)" style={{ color: 'var(--accent)' }} />
              ) : (
                <FaRegHeart className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Artwork title */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-var(--accent)" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
            {artwork.alt_description.charAt(0).toUpperCase() +
              artwork.alt_description.slice(1).toLowerCase() ||
              "Untitled Artwork"}
          </h1>

          {/* Artist info */}
          <div className="flex items-center space-x-4">
            <img
              src={
                artwork.user?.profile_image?.medium ||
                "path/to/default-image.jpg"
              }
              alt={artwork.user?.name || "Unknown Artist"}
              className="w-12 h-12 border-2 border-var(--accent)"
              style={{ borderColor: 'var(--accent)' }}
            />
            <div>
              <h2 className="font-semibold text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                {artwork.user?.name || "Unknown Artist"}
              </h2>
              <p className="text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                {artwork.user?.location || "Unknown Artist Location"}
              </p>
            </div>
          </div>

          {/* Price and size */}
          <div className="space-y-2">
            <p className="text-2xl font-bold text-var(--accent)" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>€{price}</p>
            <p className="text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              W {size.width}cm × H {size.height}cm
            </p>
            <p className="text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              {new Date(artwork.date).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-2 pt-4 text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              <FaRegHeart className="text-lg" />
              {artwork.user.total_likes} likes
            </p>
          </div>

          {/* Add to cart btn */}
          <button
            onClick={() => {
              addToCart({
                id: artwork.id,
                alt_description: artwork.alt_description,
                urls: artwork.urls,
                user: artwork.user,
                price: price,
                size: size,
              });
            }}
            className="w-full md:w-1/3 text-var(--bg) py-3 bg-var(--accent) hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2 border-2 border-var(--accent)"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
          >
            <MdAddShoppingCart className="text-xl" />
            Add to Cart
          </button>
        </div>

        {/* Description */}
        {artwork.description && (
          <div className="">
            <h3 className="font-semibold mb-2 text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>About this artwork</h3>
            <p className="text-var(--text)" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{artwork.description}</p>
          </div>
        )}

        {/* Tags */}
        <div>
          {artwork.tags && (
            <>
              {Array.isArray(artwork.tags)
                ? artwork.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-var(--accent) text-var(--bg) px-3 py-1 border-2 border-var(--accent) text-sm inline-block m-1"
                      style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                    >
                      #{typeof tag === "string" ? tag : tag.title}
                    </span>
                  ))
                : typeof artwork.tags === "string" &&
                  artwork.tags
                    .split(",")
                    .filter(tag => tag.trim()) // Remove empty tags
                    .map((tag, index) => (
                      <span
                        key={index}
                        className="bg-var(--accent) text-var(--bg) px-3 py-1 border-2 border-var(--accent) text-sm inline-block"
                        style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                      >
                        #{tag.trim()}
                      </span>
                    ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
