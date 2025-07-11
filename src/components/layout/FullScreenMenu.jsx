import { Link } from "react-router-dom";
import { SlSocialFacebook } from "react-icons/sl";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useAuth } from "../../contexts/AuthContext";

export default function FullScreenMenu({ isOpen, setIsOpen }) {
  // isOpen and setIsOpen are passed in from Navbar and used to toggle the menu

  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col items-center justify-center h-full px-8">
        {/* Menu Content */}
        <div className="flex flex-col text-2xl md:text-4xl text-left font-semibold">
          {/* Main Menu Links */}
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              className="hover:text-gray-600 text-left transform transition-all duration-200 hover:translate-x-3"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/for-artists"
              className="hover:text-gray-600 text-left transform transition-all duration-200 hover:translate-x-3"
              data-testid="artists-menu-btn"
              onClick={() => setIsOpen(false)}
            >
              For Artists
            </Link>
            <Link
              to="/for-art-lovers"
              className="hover:text-gray-600 text-left transform transition-all duration-200 hover:translate-x-3"
              data-testid="art-lovers-menu-btn"
              onClick={() => setIsOpen(false)}
            >
              For Art Lovers
            </Link>
          </div>

          {/* Login/Logout Link */}
          <div className="mt-8 mb-4">
            {currentUser && !currentUser.isGuest ? (
              <button
                onClick={handleLogout}
                className="hover:text-gray-600 text-left text-lg md:text-xl relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-black hover:after:w-full after:transition-all after:duration-300"
              >
                Logout
              </button>
            ) : (
              <Link
                data-testid="login-button"
                to="/login"
                className="hover:text-gray-600 text-left text-lg md:text-xl relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-black hover:after:w-full after:transition-all after:duration-300"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>

          {/* Footer Content */}
          <div className="flex flex-col items-left mt-8 md:mt-16">
            {/* Social Media Icons */}
            <div className="flex space-x-4 text-base my-4 md:text-xl">
              <SlSocialFacebook className="h-5 w-5 md:h-6 md:w-6 transform transition-all duration-300 hover:scale-125 hover:text-blue-600" />
              <FaInstagram className="h-5 w-5 md:h-6 md:w-6 transform transition-all duration-300 hover:scale-125 hover:text-pink-600" />
              <FaXTwitter className="h-5 w-5 md:h-6 md:w-6 transform transition-all duration-300 hover:scale-125 hover:text-gray-600" />
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap  flex-col md:flex-row justify-center mt-8 gap-3 md:gap-6 text-xs md:text-sm text-gray-600">
              <span className="cursor-pointer hover:text-black transition-colors duration-200">
                Privacy Policy
              </span>
              <span className="cursor-pointer hover:text-black transition-colors duration-200">
                Terms of Service
              </span>
              <span className="cursor-pointer hover:text-black transition-colors duration-200">
                Contact Us
              </span>
            </div>

            {/* Copyright */}
            <div className="text-xs mt-6 text-gray-500">
              © {new Date().getFullYear()} The Frame. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
