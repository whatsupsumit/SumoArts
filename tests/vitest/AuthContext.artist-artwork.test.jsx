import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-hot-toast";

// Mock Firebase
vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  arrayUnion: vi.fn(),
  arrayRemove: vi.fn(),
  serverTimestamp: vi.fn(),
}));

// Mock toast
vi.mock("react-hot-toast", () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock FileReader
const mockFileReader = {
  readAsDataURL: vi.fn(),
  onload: null,
  result: "data:image/jpeg;base64,mockImageData",
};
global.FileReader = vi.fn(() => mockFileReader);

// Mock auth context
const mockUseAuth = vi.fn();
vi.mock("../src/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Test data
const TEST_ARTWORK = {
  title: "Test Artwork",
  description: "A beautiful piece",
  price: "100",
  date: "2024-01-01",
  tags: ["test", "art"],
  image: new File([""], "test.jpg", { type: "image/jpeg" }),
};

// *********************
// TESTS
// *********************

describe("Artist Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // *********************
  // saveArtwork
  // *********************

  describe("saveArtwork", () => {
    it("saves new artwork successfully", async () => {
      // Mock document references
      const mockArtworkRef = { id: "artwork123" };
      const mockUserRef = { id: "user123" };

      doc.mockReturnValue(mockUserRef);
      addDoc.mockResolvedValue(mockArtworkRef);
      collection.mockReturnValue("artworks");
      arrayUnion.mockReturnValue(() => {});

      mockUseAuth.mockReturnValue({
        currentUser: {
          uid: "user123",
          firstName: "John",
          lastName: "Doe",
          profilePhoto: "profile.jpg",
        },
        isArtist: () => true,
        saveArtwork: vi.fn().mockImplementation(async (artworkData) => {
          // Simulate FileReader
          setTimeout(() => {
            mockFileReader.onload?.();
          }, 0);

          const savedArtwork = await addDoc(collection(), {
            ...artworkData,
            artistId: "user123",
            createdAt: serverTimestamp(),
          });

          await updateDoc(mockUserRef, {
            artworks: arrayUnion(savedArtwork.id),
          });

          return {
            id: savedArtwork.id,
            ...artworkData,
            imageUrl: mockFileReader.result,
          };
        }),
      });

      const { saveArtwork } = mockUseAuth();
      const result = await saveArtwork(TEST_ARTWORK);

      expect(result.id).toBe("artwork123");
      expect(addDoc).toHaveBeenCalled();
      expect(updateDoc).toHaveBeenCalledWith(mockUserRef, {
        artworks: expect.any(Function),
      });
    });

    it("throws error if not an artist", async () => {
      mockUseAuth.mockReturnValue({
        currentUser: { uid: "user123" },
        isArtist: () => false,
        saveArtwork: vi.fn().mockImplementation(async () => {
          throw new Error("Must be logged in as an artist");
        }),
      });

      const { saveArtwork } = mockUseAuth();
      await expect(saveArtwork(TEST_ARTWORK)).rejects.toThrow(
        "Must be logged in as an artist"
      );
    });
  });

  // *********************
  // getArtistArtworks
  // *********************

  describe("getArtistArtworks", () => {
    it("fetches artworks for an artist", async () => {
      const mockArtworks = [
        { id: "art1", title: "Artwork 1" },
        { id: "art2", title: "Artwork 2" },
      ];

      getDocs.mockResolvedValue({
        docs: mockArtworks.map((artwork) => ({
          id: artwork.id,
          data: () => artwork,
        })),
      });

      mockUseAuth.mockReturnValue({
        currentUser: { uid: "artist123" },
        getArtistArtworks: vi.fn().mockImplementation(async (artistId) => {
          const querySnapshot = await getDocs(query());
          return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }),
      });

      const { getArtistArtworks } = mockUseAuth();
      const artworks = await getArtistArtworks("artist123");

      expect(artworks).toHaveLength(2);
      expect(artworks[0].title).toBe("Artwork 1");
    });
  });

  // *********************
  // updateArtwork
  // *********************

  describe("updateArtwork", () => {
    it("updates artwork and related user data", async () => {
      const mockArtworkRef = { id: "artwork123" };
      const mockUserRef = { id: "user1" };
      const mockUserDocs = [
        {
          id: "user1",
          ref: mockUserRef,
          data: () => ({
            favorites: [{ id: "artwork123", title: "Old Title" }],
          }),
        },
      ];

      doc.mockReturnValue(mockArtworkRef);
      getDocs.mockResolvedValue({ docs: mockUserDocs });

      mockUseAuth.mockReturnValue({
        currentUser: { uid: "artist123" },
        cart: [{ id: "artwork123", title: "Old Title" }],
        setCart: vi.fn(),
        updateArtwork: vi
          .fn()
          .mockImplementation(async (artworkId, updateData) => {
            await updateDoc(doc(), updateData);
            // Update users' favorites
            const querySnapshot = await getDocs(query());
            await Promise.all(
              querySnapshot.docs.map((userDoc) =>
                updateDoc(userDoc.ref, {
                  favorites: [{ id: artworkId, ...updateData }],
                })
              )
            );
          }),
      });

      const { updateArtwork } = mockUseAuth();
      const updates = { title: "New Title", price: "200" };
      await updateArtwork("artwork123", updates);

      expect(updateDoc).toHaveBeenCalledWith(
        mockArtworkRef,
        expect.objectContaining(updates)
      );
    });
  });

  // *********************
  // deleteArtwork
  // *********************

  describe("deleteArtwork", () => {
    it("deletes artwork and updates related data", async () => {
      const mockArtworkRef = { id: "artwork123" };
      const mockUserRef = { id: "user123" };

      doc.mockReturnValue(mockUserRef);
      getDocs.mockResolvedValue({ docs: [] });
      arrayRemove.mockReturnValue(() => {});

      mockUseAuth.mockReturnValue({
        currentUser: { uid: "artist123" },
        cart: [],
        setCart: vi.fn(),
        deleteArtwork: vi.fn().mockImplementation(async (artworkId) => {
          await deleteDoc(mockArtworkRef);
          await updateDoc(mockUserRef, {
            artworks: arrayRemove(artworkId),
          });
          toast.error("Failed to delete artwork");
        }),
      });

      const { deleteArtwork } = mockUseAuth();
      await deleteArtwork("artwork123");

      expect(deleteDoc).toHaveBeenCalled();
      expect(updateDoc).toHaveBeenCalledWith(mockUserRef, {
        artworks: expect.any(Function),
      });
    });

    it("handles deletion errors", async () => {
      mockUseAuth.mockReturnValue({
        currentUser: { uid: "artist123" },
        deleteArtwork: vi.fn().mockImplementation(async () => {
          toast.error("Failed to delete artwork");
          throw new Error("Failed to delete artwork");
        }),
      });

      const { deleteArtwork } = mockUseAuth();
      await expect(deleteArtwork("artwork123")).rejects.toThrow();
      expect(toast.error).toHaveBeenCalledWith("Failed to delete artwork");
    });
  });
});
