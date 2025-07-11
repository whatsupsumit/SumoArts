// Main authentication context that manages:
// - User authentication state (login, signup, logout)
// - User roles (artist/art lover)
// - Guest access and cart management
// - Role-based permissions (artists can upload art, art lovers can buy art)
// - User profile data in Firestore
// - Shopping cart functionality (add, remove, update quantities)
// - Favorites management
// - Purchase history
// - Artist-specific features (artwork management)
// - Profile management for both artists and art lovers
// - Account settings (password update, account deletion)

// Key Features:
// - Unified signup process with role selection (artist/art lover)
// - Seamless guest to user transition (guest can continue as guest or sign up)
// - Persistent cart state (localStorage for guests, Firestore for users)
// - Comprehensive artwork management for artists
// - Favorite artwork tracking
// - Purchase history tracking
// - Profile management with different fields for artists/art lovers
// - Cart synchronization between guest and user states
// - Real-time updates for artwork changes across favorites and cart

// Data Structure:
// - Users collection in Firestore stores:
//   * Basic profile info (name, email, etc.)
//   * Role information (isArtist)
//   * Cart contents
//   * Favorites list
//   * Purchase history
//   * Artist-specific fields (artworks, sales, profile)

// - Artworks collection in Firestore stores:
//   * Artwork details (title, description, price)
//   * Artist information
//   * Images and metadata
//   * Creation/update timestamps
// import { auth } from "/src/config/firebase.js";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-hot-toast";

// Create a context & hook to share auth state across the app
const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("guestCart");
    return savedCart ? JSON.parse(savedCart) : [];
  }); // Add cart state with localStorage initialization

  // ::::::::::::::::
  // :::   CART   :::
  // ::::::::::::::::

  // *******************************************************************************************
  const addToCart = async (artwork) => {
    try {
      const itemToAdd = {
        id: artwork.id,
        title: artwork.title || artwork.alt_description || "Untitled",
        price: artwork.price,
        quantity: 1,
        imageUrl: artwork.urls?.small || artwork.imageUrl,
        urls: {
          regular: artwork.urls?.regular || artwork.imageUrl,
          small: artwork.urls?.small || artwork.imageUrl,
        },
        user: {
          name: artwork.user?.name || "Unknown Artist",
          profile_image: {
            small: artwork.user?.profile_image?.small || "",
          },
        },
        alt_description: artwork.alt_description || "",
        size: artwork.size || null,
      };

      // Check if item is already in cart
      const existingItemIndex = cart.findIndex(
        (item) => item.id === artwork.id
      );

      // Update cart quantity if item is already in cart
      let updatedCart;
      if (existingItemIndex !== -1) {
        updatedCart = cart.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: (item.quantity || 1) + 1,
            };
          }
          return item;
        });
        toast.success("Added one more to cart");
      } else {
        updatedCart = [...cart, itemToAdd];
        toast.success("Added to cart");
      }

      // Update cart in Firestore if user is logged in
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid); // if user exists they are logged in, otherwise they are a guest
        await updateDoc(userRef, { cart: updatedCart }); // updates cart field in user's document with the updatedCart data
      } else {
        localStorage.setItem("guestCart", JSON.stringify(updatedCart)); // updates cart in localStorage if user is a guest
      }
      setCart(updatedCart);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
      return false;
    }
  };

  // *******************************************************************************************
  const updateCartItemQuantity = async (artworkId, newQuantity) => {
    try {
      // Remove item from cart if quantity is less than 1
      if (newQuantity < 1) {
        return removeFromCart(artworkId);
      }

      // Update cart quantity in cart state if quantity ≥ 1
      const updatedCart = cart.map((item) => {
        if (item.id === artworkId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      // Update cart in Firestore if user is logged in (just like in addToCart())
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { cart: updatedCart });
      } else {
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      }
      setCart(updatedCart);
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  // *******************************************************************************************
  const removeFromCart = async (artworkId) => {
    try {
      const updatedCart = cart.filter((item) => item.id !== artworkId);
      if (currentUser) {
        // Update Firebase if user is logged in
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { cart: updatedCart });
      } else {
        // Update localStorage if guest
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      }
      setCart(updatedCart);
    } catch (error) {
      toast.error("Failed to remove from cart");
    }
  };

  // *******************************************************************************************
  const clearCart = async () => {
    try {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid); // get user's document reference
        await updateDoc(userRef, { cart: [] }); // update user's cart in Firestore
      }
      setCart([]); // clear cart state
      localStorage.removeItem("guestCart"); // clear guest cart from localStorage
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // *******************************************************************************************
  // Calculate total price of items in cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return total + price * quantity; // calculate total price of items in cart
    }, 0);
  };

  // ::::::::::::::::::::::::::
  // :::   AUTHENTICATION   :::
  // ::::::::::::::::::::::::::

  // *******************************************************************************************
  async function signup(
    email,
    password,
    firstName,
    lastName,
    isArtist = false
  ) {
    try {
      // Create auth account in Firebase (email and password)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Create user profile document in Firestore database
      const userData = {
        email,
        firstName,
        lastName,
        isArtist,
        createdAt: new Date().toISOString(),
        favorites: [],
        purchases: [],
        artworks: isArtist ? [] : null,
        sales: isArtist ? [] : null,
        artistProfile: isArtist
          ? {
              bio: "",
              statement: "",
              isComplete: false,
            }
          : null,
      };
      await setDoc(doc(db, "users", userCredential.user.uid), userData); // create user's document in Firestore
      setCurrentUser({ ...userCredential.user, ...userData }); // set currentUser to the new user
      return userCredential; // return userCredential to handle any further actions
    } catch (error) {
      throw error;
    }
  }

  // *******************************************************************************************
  async function login(email, password) {
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid)); // fetch user's document from Firestore
      const userData = userDoc.data(); // get user's data from user's document
      if (userDoc.exists()) {
        const fullUserData = { ...userCredential.user, ...userData }; // merge user's data with userCredential
        setCurrentUser(fullUserData);
        return { user: userCredential.user, userData }; // return userCredential and userData
      } else {
        throw new Error("User data not found");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // *******************************************************************************************
  async function logout() {
    try {
      await signOut(auth); // sign out from Firebase
      setCurrentUser(null);
      setCart([]); // Clear cart
      localStorage.removeItem("guestCart"); // Clear guest cart from localStorage
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  }

  // *******************************************************************************************
  // Track if user is a guest
  function continueAsGuest() {
    setCurrentUser({ isGuest: true });
  }

  // *******************************************************************************************
  // Check if user is an artist
  const isArtist = () => {
    if (!currentUser) return false;
    return currentUser.isArtist === true;
  };

  // *******************************************************************************************
  // Check if user can buy art
  const canBuyArt = () => currentUser && !currentUser.isGuest;

  // ::::::::::::::::::::::::::
  // :::   FAVOURITES   :::
  // ::::::::::::::::::::::::::

  // Toggle favorite artwork
  async function toggleFavorite(artworkData) {
    // 1. Check if user is logged in
    if (!currentUser || currentUser.isGuest) {
      throw new Error("Please sign in to save favourites");
    }

    // 2. Get user's favorites from Firestore
    const userRef = doc(db, "users", currentUser.uid); // get user's document reference
    const userDoc = await getDoc(userRef); // get user's document data
    const userData = userDoc.data(); // get user's data from user's document
    const existingFavorites = userData.favorites || []; // get user's favorites from user's data

    // 3. Check if artwork is already in favorites
    const isAlreadyFavorite = existingFavorites.some(
      (fav) => fav.id === artworkData.id
    );

    // 4. Update favorites
    let updatedFavorites;
    if (isAlreadyFavorite) {
      // Remove from favorites
      updatedFavorites = existingFavorites.filter(
        (fav) => fav.id !== artworkData.id
      );
    } else {
      // Add to favorites with only valid data
      const favoriteItem = {
        id: artworkData.id,
        title: artworkData.alt_description || artworkData.title || "Untitled",
        imageUrl: artworkData.urls?.regular || artworkData.imageUrl,
        artist: artworkData.user?.name || "Unknown Artist",
        price: parseFloat(artworkData.price) || 0,
        addedAt: new Date().toISOString(),
      };

      updatedFavorites = [...existingFavorites, favoriteItem]; // add favorite item to favorites
    }

    // 5. Save to Firestore and update state
    await updateDoc(userRef, { favorites: updatedFavorites });
    setCurrentUser((prev) => ({
      ...prev,
      favorites: updatedFavorites,
    }));

    return !isAlreadyFavorite; // returns true if added, false if removed
  }

  // *******************************************************************************************
  function isArtworkFavorited(artworkId) {
    if (!currentUser || !currentUser.favorites) return false;
    return currentUser.favorites.some((fav) => fav.id === artworkId);
  }

  // ::::::::::::::::::::
  // :::   PROFILES   :::
  // ::::::::::::::::::::

  // Update ARTIST profile
  const updateProfile = async (data) => {
    try {
      const userRef = doc(db, "users", currentUser.uid);

      // Prepare profile data
      const profileData = {
        firstName: data.firstName || currentUser.firstName,
        lastName: data.lastName || currentUser.lastName,
        location: data.location || currentUser.location,
        bio: data.bio || currentUser.bio,
        profilePhoto: data.profilePhoto || currentUser.profilePhoto,
      };

      // Update user profile
      await updateDoc(userRef, profileData);

      // Update artworks associated with the artist
      const artworksRef = collection(db, "artworks");
      const q = query(artworksRef, where("artistId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      const updatePromises = querySnapshot.docs.map((doc) => {
        return updateDoc(doc.ref, {
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
        });
      });

      await Promise.all(updatePromises);

      // Update currentUser state
      setCurrentUser((prev) => ({
        ...prev,
        ...profileData,
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // *******************************************************************************************
  // Update ART LOVER profile
  const updateProfileForArtLovers = async (data) => {
    try {
      const userRef = doc(db, "users", currentUser.uid);

      // Prepare profile data for art lovers
      const profileData = {
        firstName: data.firstName || currentUser.firstName,
        lastName: data.lastName || currentUser.lastName,
        location:
          data.location !== undefined ? data.location : currentUser.location, // Check for undefined
        bio: data.bio || currentUser.bio,
        profilePhoto: data.profilePhoto || currentUser.profilePhoto,
      };

      // Filter out any fields that are undefined
      const cleanedData = Object.fromEntries(
        Object.entries(profileData).filter(([_, value]) => value !== undefined)
      );

      // Update user profile for art lovers
      await updateDoc(userRef, cleanedData);

      // Update currentUser state
      setCurrentUser((prev) => ({
        ...prev,
        ...cleanedData,
      }));
    } catch (error) {
      console.error("Error updating profile for art lover:", error);
      throw error;
    }
  };

  // *******************************************************************************************
  const updateUserPassword = async (currentPassword, newPassword) => {
    try {
      if (!auth.currentUser) {
        throw new Error("No user is currently signed in");
      }
      // Create credentials with current password
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      // Reauthenticate
      await reauthenticateWithCredential(auth.currentUser, credential);
      // Update password
      await updatePassword(auth.currentUser, newPassword);
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.code === "auth/wrong-password") {
        toast.error("Current password is incorrect");
      } else {
        toast.error(error.message || "Failed to update password");
      }
      throw error;
    }
  };

  // *******************************************************************************************
  const deleteUserAccount = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error("No user is currently signed in");
      }
      // Delete user data from Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userRef);
      // Delete Firebase auth account
      await deleteUser(auth.currentUser);
      toast.success("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
      throw error;
    }
  };

  // :::::::::::::::::::::::::::
  // :::   ARTIST ARTWORKS   :::
  // :::::::::::::::::::::::::::

  // *******************************************************************************************
  const saveArtwork = async (artworkData) => {
    try {
      if (!currentUser?.uid || !isArtist()) {
        throw new Error("Must be logged in as an artist");
      }
      // Use the existing preview or convert the image
      let imageUrl = artworkData.imagePreview;
      if (artworkData.image && !imageUrl) {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(artworkData.image);
        });
      }
      // Save to Firestore with image and profile photo
      const artworkRef = await addDoc(collection(db, "artworks"), {
        title: artworkData.title,
        description: artworkData.description,
        price: artworkData.price,
        date: artworkData.date,
        tags: artworkData.tags,
        imageUrl, // Store base64 string
        artistId: currentUser.uid,
        createdAt: serverTimestamp(),
        user: {
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          profile_image: {
            medium: currentUser.profilePhoto || "",
            small: currentUser.profilePhoto || "",
            large: currentUser.profilePhoto || "",
          },
        },
      });
      // Update user's artworks array
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        artworks: arrayUnion(artworkRef.id),
      });
      return {
        id: artworkRef.id,
        ...artworkData,
        imageUrl,
      };
    } catch (error) {
      console.error("Error saving artwork:", error);
      throw error;
    }
  };

  // *******************************************************************************************
  const getArtistArtworks = async (artistId = currentUser?.uid) => {
    try {
      // Get artworks from Firestore
      const artworksRef = collection(db, "artworks");
      const q = query(artworksRef, where("artistId", "==", artistId));
      const querySnapshot = await getDocs(q);
      // Map artworks to an array of objects
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching artworks:", error);
      throw error;
    }
  };

  // *******************************************************************************************
  const updateArtwork = async (artworkId, updateData) => {
    if (!currentUser?.uid) throw new Error("No user logged in");
    try {
      // Update artwork in Firestore
      const artworkRef = doc(db, "artworks", artworkId);
      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );
      await updateDoc(artworkRef, cleanedData);

      // Find all users who have this artwork in their favorites or cart
      const usersRef = collection(db, "users");
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);

      // Update each user's favorites and cart
      const updatePromises = querySnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        if (userData.favorites?.some((fav) => fav.id === artworkId)) {
          const updatedFavorites = userData.favorites.map((fav) => {
            if (fav.id === artworkId) {
              return {
                ...fav,
                title:
                  updateData.title || updateData.alt_description || fav.title,
                price: updateData.price || fav.price,
                imageUrl:
                  updateData.urls?.regular ||
                  updateData.imageUrl ||
                  fav.imageUrl,
                artist: updateData.user?.name || fav.artist,
                size: updateData.size || fav.size,
              };
            }
            return fav;
          });
          return updateDoc(doc(db, "users", userDoc.id), {
            favorites: updatedFavorites,
          });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);

      // Update local state if current user has this artwork in favorites
      setCurrentUser((prev) => ({
        ...prev,
        favorites:
          prev.favorites?.map((fav) =>
            fav.id === artworkId
              ? {
                  ...fav,
                  title:
                    updateData.title || updateData.alt_description || fav.title,
                  price: updateData.price || fav.price,
                  imageUrl:
                    updateData.urls?.regular ||
                    updateData.imageUrl ||
                    fav.imageUrl,
                  artist: updateData.user?.name || fav.artist,
                  size: updateData.size || fav.size,
                }
              : fav
          ) || [],
      }));

      // Update cart items if they exist
      const updatedCart = cart.map((item) => {
        if (item.id === artworkId) {
          return {
            ...item,
            alt_description: updateData.title || item.alt_description,
            price: updateData.price || item.price,
            imageUrl:
              updateData.urls?.regular || updateData.imageUrl || item.imageUrl,
            urls: {
              ...item.urls,
              regular:
                updateData.urls?.regular ||
                updateData.imageUrl ||
                item.urls?.regular,
              small:
                updateData.urls?.small ||
                updateData.imageUrl ||
                item.urls?.small,
            },
            user: {
              ...item.user,
              name: updateData.user?.name || item.user?.name,
            },
            size: updateData.size || item.size,
          };
        }
        return item;
      });

      // Update cart state and localStorage
      setCart(updatedCart);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error updating artwork:", error);
      throw error;
    }
  };

  // *******************************************************************************************
  const deleteArtwork = async (artworkId) => {
    try {
      // Delete from Firestore artworks collection
      const artworkRef = doc(db, "artworks", artworkId); // get artwork reference
      await deleteDoc(artworkRef); // delete artwork from Firestore
      // Update user's artworks array
      const userRef = doc(db, "users", currentUser.uid); // get user's document reference
      await updateDoc(userRef, {
        artworks: arrayRemove(artworkId),
      });

      // Find all users who have this artwork in their favorites
      const usersRef = collection(db, "users");
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);

      // Update each user's favorites array
      const updatePromises = querySnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        if (userData.favorites?.some((fav) => fav.id === artworkId)) {
          const updatedFavorites = userData.favorites.filter(
            (fav) => fav.id !== artworkId
          );
          return updateDoc(doc(db, "users", userDoc.id), {
            favorites: updatedFavorites,
          });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);

      // Update local state
      setCurrentUser((prev) => ({
        ...prev,
        artworks: prev.artworks.filter((id) => id !== artworkId),
        favorites: prev.favorites?.filter((fav) => fav.id !== artworkId) || [],
      }));

      // Remove artwork from cart if it exists
      const updatedCart = cart.filter((item) => item.id !== artworkId);
      setCart(updatedCart);

      // Update cart in storage
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { cart: updatedCart });
      } else {
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error("Error deleting artwork:", error);
      toast.error("Failed to delete artwork");
      throw error;
    }
  };

  // :::::::::::::::::::::
  // :::   PURCHASES   :::
  // :::::::::::::::::::::

  const savePurchase = async (purchaseItems) => {
    try {
      // For guest purchases, just clear the cart
      if (!currentUser || currentUser.isGuest) {
        setCart([]); // Clear the cart state
        localStorage.removeItem("guestCart");
        return true;
      }
      // For logged in users, save to Firestore
      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);
      const currentPurchases = userDoc.data()?.purchases || [];
      // Map cart items to purchase items
      const newPurchases = purchaseItems.map((item) => ({
        id: item.id,
        title: item.alt_description || item.title || "Untitled",
        price: parseFloat(item.price),
        quantity: item.quantity || 1,
        imageUrl: item.urls?.small || item.imageUrl,
        purchaseDate: new Date().toISOString(),
      }));
      // Update Firestore with new purchases and clear cart
      await updateDoc(userRef, {
        purchases: [...currentPurchases, ...newPurchases],
        cart: [], // Clear the cart after purchase
      });
      setCart([]);
      localStorage.removeItem("guestCart");
      return true;
    } catch (error) {
      console.error("Error saving purchase:", error);
      toast.error("Failed to complete purchase");
      throw error;
    }
  };

  // ::::::::::::::::::::::
  // :::   USEEFFECTS   :::
  // ::::::::::::::::::::::

  // They're background processes that keep your app's state synchronized (they're not "used" directly).

  // 1)
  // Listens for Firebase auth state changes
  // Updates currentUser and cart when user logs in/out
  // Cleans up localStorage
  // Sets loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setCurrentUser({ ...user, ...userDoc.data() }); // Set currentUser to the user and their data
            setCart(userDoc.data().cart || []); // Set cart from user data
            localStorage.removeItem("guestCart"); // Clear any guest cart
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
        setCart([]);
        localStorage.removeItem("guestCart"); // Clear guest cart from localStorage
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 2)
  // Syncs guest cart from localStorage when there's no user
  // Runs when currentUser changes

  useEffect(() => {
    const savedCart = localStorage.getItem("guestCart"); // get guest cart from localStorage
    const parsedCart = savedCart ? JSON.parse(savedCart) : []; // parse guest cart
    if (!currentUser && JSON.stringify(parsedCart) !== JSON.stringify(cart)) {
      setCart(parsedCart); // update cart state
    }
  }, [currentUser]); // run this effect whenever currentUser changes

  // *******************************************************************************************
  // *******************************************************************************************

  // Value object with all auth functionality for use in child components
  // Can be accessed with useAuth() hook in any component and contains all the functions and state
  const value = {
    currentUser,
    signup,
    login,
    logout,
    continueAsGuest,
    isArtist,
    canBuyArt,
    toggleFavorite,
    isArtworkFavorited,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    calculateTotal,
    updateProfile,
    updateProfileForArtLovers,
    updatePassword: updateUserPassword,
    deleteUserAccount,
    savePurchase,
    saveArtwork,
    getArtistArtworks,
    updateArtwork,
    deleteArtwork,
  };

  // Provide auth context to child components
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
