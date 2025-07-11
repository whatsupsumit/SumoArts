import { describe, it, expect, vi, beforeEach } from "vitest";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Mock Firestore
vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
}));

// Mock auth context
const mockUseAuth = vi.fn();
vi.mock("../src/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Test artwork data
const TEST_ARTWORK = {
  id: "123",
  title: "Test Artwork",
  alt_description: "A beautiful artwork",
  urls: {
    regular: "image-url.jpg",
  },
  user: {
    name: "Test Artist",
  },
  price: 100,
};

// *********************
// TESTS
// *********************

describe("Favorites Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // *********************
  // toggleFavorite
  // *********************

  describe("toggleFavorite", () => {
    it("adds artwork to favorites when not favorited", async () => {
      // Mock Firestore document reference
      const mockDocRef = { id: "user123" };
      doc.mockReturnValue(mockDocRef);

      // Mock existing user data
      const mockUserDoc = {
        exists: () => true,
        data: () => ({
          favorites: [],
        }),
      };
      getDoc.mockResolvedValue(mockUserDoc);

      mockUseAuth.mockReturnValue({
        currentUser: { uid: "user123", favorites: [] },
        toggleFavorite: vi.fn().mockImplementation(async (artworkData) => {
          const favoriteItem = {
            id: artworkData.id,
            title:
              artworkData.alt_description || artworkData.title || "Untitled",
            imageUrl: artworkData.urls?.regular || artworkData.imageUrl,
            artist: artworkData.user?.name || "Unknown Artist",
            price: parseFloat(artworkData.price) || 0,
            addedAt: expect.any(String),
          };

          const updatedFavorites = [favoriteItem];
          await updateDoc(mockDocRef, { favorites: updatedFavorites });
          return true;
        }),
      });

      const { toggleFavorite } = mockUseAuth();
      const result = await toggleFavorite(TEST_ARTWORK);

      expect(result).toBe(true);
      expect(updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          favorites: expect.arrayContaining([
            expect.objectContaining({
              id: TEST_ARTWORK.id,
              title: TEST_ARTWORK.alt_description,
              imageUrl: TEST_ARTWORK.urls.regular,
              artist: TEST_ARTWORK.user.name,
              price: TEST_ARTWORK.price,
            }),
          ]),
        })
      );
    });

    it("removes artwork from favorites when already favorited", async () => {
      // Mock Firestore document reference
      const mockDocRef = { id: "user123" };
      doc.mockReturnValue(mockDocRef);

      const mockUserDoc = {
        exists: () => true,
        data: () => ({
          favorites: [{ id: TEST_ARTWORK.id, title: TEST_ARTWORK.title }],
        }),
      };
      getDoc.mockResolvedValue(mockUserDoc);

      mockUseAuth.mockReturnValue({
        currentUser: {
          uid: "user123",
          favorites: [{ id: TEST_ARTWORK.id, title: TEST_ARTWORK.title }],
        },
        toggleFavorite: vi.fn().mockImplementation(async (artworkData) => {
          const updatedFavorites = [];
          await updateDoc(mockDocRef, { favorites: updatedFavorites });
          return false;
        }),
      });

      const { toggleFavorite } = mockUseAuth();
      const result = await toggleFavorite(TEST_ARTWORK);

      expect(result).toBe(false);
      expect(updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          favorites: [],
        })
      );
    });

    it("throws error for guest users", async () => {
      mockUseAuth.mockReturnValue({
        currentUser: { isGuest: true },
        toggleFavorite: vi.fn().mockImplementation(async () => {
          throw new Error("Please sign in to save favourites");
        }),
      });

      const { toggleFavorite } = mockUseAuth();
      await expect(toggleFavorite(TEST_ARTWORK)).rejects.toThrow(
        "Please sign in to save favourites"
      );
    });
  });

  // *********************
  // isArtworkFavorited
  // *********************

  describe("isArtworkFavorited", () => {
    it("returns true when artwork is in favorites", () => {
      mockUseAuth.mockReturnValue({
        currentUser: {
          favorites: [{ id: TEST_ARTWORK.id }],
        },
        isArtworkFavorited: vi.fn().mockImplementation((artworkId) => {
          return true;
        }),
      });

      const { isArtworkFavorited } = mockUseAuth();
      expect(isArtworkFavorited(TEST_ARTWORK.id)).toBe(true);
    });

    it("returns false when artwork is not in favorites", () => {
      mockUseAuth.mockReturnValue({
        currentUser: {
          favorites: [],
        },
        isArtworkFavorited: vi.fn().mockImplementation((artworkId) => {
          return false;
        }),
      });

      const { isArtworkFavorited } = mockUseAuth();
      expect(isArtworkFavorited(TEST_ARTWORK.id)).toBe(false);
    });

    it("returns false when user has no favorites", () => {
      mockUseAuth.mockReturnValue({
        currentUser: {
          favorites: null,
        },
        isArtworkFavorited: vi.fn().mockImplementation((artworkId) => {
          return false;
        }),
      });

      const { isArtworkFavorited } = mockUseAuth();
      expect(isArtworkFavorited(TEST_ARTWORK.id)).toBe(false);
    });

    it("returns false when no user is logged in", () => {
      mockUseAuth.mockReturnValue({
        currentUser: null,
        isArtworkFavorited: vi.fn().mockImplementation((artworkId) => {
          return false;
        }),
      });

      const { isArtworkFavorited } = mockUseAuth();
      expect(isArtworkFavorited(TEST_ARTWORK.id)).toBe(false);
    });
  });
});
