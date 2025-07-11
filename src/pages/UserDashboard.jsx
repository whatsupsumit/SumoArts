import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// *******************************************************************************************
// Profile Settings Component
function ProfileSettings() {
  const { currentUser, updateProfileForArtLovers } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName:
      typeof currentUser?.firstName === "string" ? currentUser.firstName : "",
    lastName:
      typeof currentUser?.lastName === "string" ? currentUser.lastName : "",
  });

  const displayName = () => {
    // Handle legacy data structure
    let firstName = currentUser?.firstName;
    let lastName = currentUser?.lastName;
    // If firstName is an array (legacy data), take first element
    if (Array.isArray(firstName)) {
      firstName = firstName[0];
    }
    // If lastName is an object (legacy data), try to get the firstName property
    if (lastName && typeof lastName === "object") {
      firstName = lastName.firstName || firstName;
      lastName = lastName.lastName;
    }
    // If no valid name exists after cleanup
    if (!firstName && !lastName) {
      return "No name set";
    }
    return `${firstName || ""} ${lastName || ""}`.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfileForArtLovers(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      {!isEditing ? (
        <div className="space-y-1">
          <div>
            <p className="font-bold text-gray-600 mb-1">
              Name: <span className="font-normal">{displayName()}</span>
            </p>
          </div>
          <div>
            <p className="font-bold text-gray-600 mb-1">
              Email:{" "}
              <span className="font-normal">{currentUser?.email || ""}</span>
            </p>
          </div>
          <div>
            <p className="font-bold text-gray-600 mb-1">
              I&apos;m an:{" "}
              <span className="font-normal">
                {currentUser?.isArtist ? "Artist" : "Art Lover"}
              </span>
            </p>
            <p className="font-bold text-gray-600 mb-3">
              Frame member since:{" "}
              <span className="font-normal">
                {new Date(currentUser?.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
          >
            Edit Name
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// *******************************************************************************************
// Purchase History Component
function PurchaseHistory() {
  const { currentUser } = useAuth();
  const purchases = currentUser?.purchases || [];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Purchase History</h2>
      {purchases.length === 0 ? (
        <p className="text-gray-500">No purchases yet</p>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="border rounded p-4">
              <div className="flex gap-4">
                <img
                  src={purchase.imageUrl}
                  alt={purchase.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">
                    {purchase.title.charAt(0).toUpperCase() +
                      purchase.title.slice(1).toLowerCase() ||
                      "Untitled Artwork"}
                  </h3>

                  <p className="text-gray-600">{purchase.artist}</p>
                  <p className="text-gray-600">€{purchase.price}</p>
                  <p className="text-sm text-gray-500">
                    Purchased on{" "}
                    {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// *******************************************************************************************
// Security Settings Component
function SecuritySettings() {
  const { updatePassword } = useAuth();
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords don't match");
      return;
    }
    try {
      await updatePassword(passwords.current, passwords.new);
      setPasswords({ current: "", new: "", confirm: "" });
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <div className="flex">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={passwords.current}
              onChange={(e) =>
                setPasswords((prev) => ({ ...prev, current: e.target.value }))
              }
              className="mt-1 w-full p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-2 top-8 text-gray-600 hover:text-gray-800"
            >
              {showCurrentPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            value={passwords.new}
            onChange={(e) =>
              setPasswords((prev) => ({ ...prev, new: e.target.value }))
            }
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            value={passwords.confirm}
            onChange={(e) =>
              setPasswords((prev) => ({ ...prev, confirm: e.target.value }))
            }
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

// *******************************************************************************************
// Account Management Component
function AccountManagement() {
  const { deleteUserAccount } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete account");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Account Management</h2>
      <div className="bg-red-50 p-4 rounded">
        <h3 className="text-red-800 font-medium">Delete Account</h3>
        <p className="text-sm text-red-600 mt-1">
          Warning: This action cannot be undone. All your data will be
          permanently deleted.
        </p>
        {!showConfirmation ? (
          <button
            onClick={() => setShowConfirmation(true)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
          >
            Delete Account
          </button>
        ) : (
          <div className="mt-4 space-y-4">
            <p className="text-sm font-medium text-red-800">
              Are you sure you want to delete your account?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
              >
                Yes, Delete Account
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// *******************************************************************************************
// *******************************************************************************************
// Main Dashboard Component
export default function UserDashboard() {
  const { currentUser, isArtist } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (isArtist()) {
      navigate("/artist-dashboard");
      toast.error("Artists should use the artist dashboard");
    }
  }, [currentUser, isArtist, navigate]);

  const [activeTab, setActiveTab] = useState("profile");
  const { logout } = useAuth();
  return (
    <div className="container mx-left py-8">
      <h1 className="text-3xl font-bold mb-4">Art Lover Dashboard</h1>

      <button
        onClick={logout}
        data-testid="art-lover-dashboard-logout-button"
        className="w-auto text-left px-4 py-2 mb-12 rounded bg-gray-500 text-white font-bold hover:bg-gray-600 transition-colors duration-300"
      >
        Logout
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "profile"
                ? "bg-green-100 text-green-800 font-bold"
                : "hover:bg-gray-100"
            }`}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab("purchases")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "purchases"
                ? "bg-green-100 text-green-800 font-bold"
                : "hover:bg-gray-100"
            }`}
          >
            Purchase History
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "security"
                ? "bg-green-100 text-green-800 font-bold"
                : "hover:bg-gray-100"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "account"
                ? "bg-green-100 text-green-800 font-bold"
                : "hover:bg-gray-100"
            }`}
          >
            Account Management
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6 max-w-2xl mx-left">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "purchases" && <PurchaseHistory />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "account" && <AccountManagement />}
        </div>
      </div>
    </div>
  );
}
