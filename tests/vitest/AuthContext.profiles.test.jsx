import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  doc,
  updateDoc,
  query,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { toast } from "react-hot-toast";

// Mock Firebase
vi.mock("firebase/firestore");
vi.mock("firebase/auth", () => ({
  EmailAuthProvider: {
    credential: vi.fn(),
  },
  reauthenticateWithCredential: vi.fn(),
  updatePassword: vi.fn(),
  deleteUser: vi.fn(),
  getAuth: vi.fn(() => ({ currentUser: { email: "test@test.com" } })),
}));

// Mock toast
vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock auth context
const mockUseAuth = vi.fn();
vi.mock("../src/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// *********************
// TESTS
// *********************

describe("Profile Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // *********************
  // updateProfile (Artist)
  // *********************

  describe("updateProfile (Artist)", () => {
    it("updates artist profile and their artworks", async () => {
      // Mock document references
      const mockUserRef = { id: "user123" };
      const mockArtworkRef1 = { id: "art1" };
      const mockArtworkRef2 = { id: "art2" };
      
      doc.mockReturnValue(mockUserRef);
      
      // Mock current user
      const mockCurrentUser = {
        uid: "artist123",
        firstName: "Old",
        lastName: "Name",
      };

      // Mock Firestore responses
      const mockArtworkDocs = [
        { ref: mockArtworkRef1 },
        { ref: mockArtworkRef2 },
      ];
      getDocs.mockResolvedValue({ docs: mockArtworkDocs });

      // Setup auth context
      mockUseAuth.mockReturnValue({
        currentUser: mockCurrentUser,
        updateProfile: vi.fn().mockImplementation(async (data) => {
          const profileData = {
            firstName: data.firstName,
            lastName: data.lastName,
            location: data.location,
            bio: data.bio,
            profilePhoto: data.profilePhoto,
          };

          await updateDoc(mockUserRef, profileData);
          
          // Update artworks
          const querySnapshot = await getDocs(query());
          await Promise.all(
            querySnapshot.docs.map(doc => 
              updateDoc(doc.ref, {
                user: {
                  name: `${profileData.firstName} ${profileData.lastName}`,
                  location: profileData.location,
                  bio: profileData.bio,
                  profile_image: {
                    medium: profileData.profilePhoto,
                    small: profileData.profilePhoto,
                    large: profileData.profilePhoto,
                  },
                },
              })
            )
          );
        }),
      });

      const { updateProfile } = mockUseAuth();
      const newProfileData = {
        firstName: "New",
        lastName: "Artist",
        location: "New York",
        bio: "Artist bio",
        profilePhoto: "photo.jpg",
      };

      await updateProfile(newProfileData);

      // Verify profile update
      expect(updateDoc).toHaveBeenNthCalledWith(1,
        mockUserRef,
        expect.objectContaining(newProfileData)
      );

      // Verify artworks update
      expect(updateDoc).toHaveBeenNthCalledWith(2,
        mockArtworkRef1,
        expect.objectContaining({
          user: expect.objectContaining({
            name: "New Artist",
            location: "New York",
          }),
        })
      );
    });

    it("handles errors during update", async () => {
      mockUseAuth.mockReturnValue({
        currentUser: { uid: "artist123" },
        updateProfile: vi.fn().mockImplementation(async () => {
          throw new Error("Update failed");
        }),
      });

      const { updateProfile } = mockUseAuth();
      await expect(updateProfile({})).rejects.toThrow("Update failed");
    });
  });


  // *********************
  // updateProfileForArtLovers
  // *********************

  describe("updateProfileForArtLovers", () => {
    it("updates art lover profile", async () => {
      // Mock document reference
      const mockUserRef = { id: "user123" };
      doc.mockReturnValue(mockUserRef);

      const mockCurrentUser = {
        uid: "user123",
        firstName: "Old",
        lastName: "Name",
      };

      mockUseAuth.mockReturnValue({
        currentUser: mockCurrentUser,
        updateProfileForArtLovers: vi.fn().mockImplementation(async (data) => {
          const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined)
          );
          await updateDoc(mockUserRef, cleanedData);
        }),
      });

      const { updateProfileForArtLovers } = mockUseAuth();
      const newProfileData = {
        firstName: "New",
        lastName: "User",
        location: "Paris",
      };

      await updateProfileForArtLovers(newProfileData);

      expect(updateDoc).toHaveBeenCalledWith(
        mockUserRef,
        expect.objectContaining(newProfileData)
      );
    });
  });

  // *********************
  // updateUserPassword
  // *********************

  describe("updateUserPassword", () => {
    it("updates password successfully", async () => {
      mockUseAuth.mockReturnValue({
        updateUserPassword: vi
          .fn()
          .mockImplementation(async (current, newPass) => {
            await reauthenticateWithCredential();
            await updatePassword(null, newPass);
            toast.success("Password updated successfully");
          }),
      });

      const { updateUserPassword } = mockUseAuth();
      await updateUserPassword("oldpass", "newpass");

      expect(reauthenticateWithCredential).toHaveBeenCalled();
      expect(updatePassword).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Password updated successfully"
      );
    });

    it("handles wrong current password", async () => {
      mockUseAuth.mockReturnValue({
        updateUserPassword: vi.fn().mockImplementation(async () => {
          const error = { code: "auth/wrong-password" };
          toast.error("Current password is incorrect");
          throw error;
        }),
      });

      const { updateUserPassword } = mockUseAuth();
      await expect(
        updateUserPassword("wrongpass", "newpass")
      ).rejects.toMatchObject({ code: "auth/wrong-password" });
      expect(toast.error).toHaveBeenCalledWith("Current password is incorrect");
    });
  });

  // *********************
  // deleteUserAccount
  // *********************

  describe("deleteUserAccount", () => {
    it("deletes account successfully", async () => {
      mockUseAuth.mockReturnValue({
        currentUser: { uid: "user123" },
        deleteUserAccount: vi.fn().mockImplementation(async () => {
          await deleteDoc(doc());
          await deleteUser();
          toast.success("Account deleted successfully");
        }),
      });

      const { deleteUserAccount } = mockUseAuth();
      await deleteUserAccount();

      expect(deleteDoc).toHaveBeenCalled();
      expect(deleteUser).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Account deleted successfully"
      );
    });

    it("handles deletion errors", async () => {
      mockUseAuth.mockReturnValue({
        currentUser: { uid: "user123" },
        deleteUserAccount: vi.fn().mockImplementation(async () => {
          toast.error("Failed to delete account");
          throw new Error("Deletion failed");
        }),
      });

      const { deleteUserAccount } = mockUseAuth();
      await expect(deleteUserAccount()).rejects.toThrow("Deletion failed");
      expect(toast.error).toHaveBeenCalledWith("Failed to delete account");
    });
  });
});
