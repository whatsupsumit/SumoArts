import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAVhGINmxHX2UCM1KroXNHqRp_LZRC45o",
  authDomain: "virtual-art-gallery-6d5f3.firebaseapp.com",
  projectId: "virtual-art-gallery-6d5f3",
  storageBucket: "virtual-art-gallery-6d5f3.firebasestorage.app",
  messagingSenderId: "237110446889",
  appId: "1:237110446889:web:74848c8d91c85872c50538"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
