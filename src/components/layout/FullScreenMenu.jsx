import PropTypes from "prop-types";
FullScreenMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};
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
      className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} bg-gradient-to-br from-[#18120a] via-[#1a1a1a] to-[#18120a] backdrop-blur-xl`}
      style={{ boxShadow: '0 0 80px 10px #FFA50033' }}
    >
      <div className="flex flex-col items-center justify-center h-full px-6 py-10">
        {/* Menu Content */}
        <div className="flex flex-col text-2xl md:text-4xl text-left font-semibold w-full max-w-xs mx-auto">
          {/* Main Menu Links */}
          <div className="flex flex-col space-y-3 mt-4">
            <Link
              to="/"
              className="rounded-lg px-4 py-3 bg-[#232323] text-[#FFA500] font-mono text-xl shadow hover:bg-[#FFA500] hover:text-[#18120a] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/for-artists"
              className="rounded-lg px-4 py-3 bg-[#232323] text-[#FFA500] font-mono text-xl shadow hover:bg-[#FFA500] hover:text-[#18120a] transition-all duration-200"
              data-testid="artists-menu-btn"
              onClick={() => setIsOpen(false)}
            >
              For Artists
            </Link>
            <Link
              to="/for-art-lovers"
              className="rounded-lg px-4 py-3 bg-[#232323] text-[#FFA500] font-mono text-xl shadow hover:bg-[#FFA500] hover:text-[#18120a] transition-all duration-200"
              data-testid="art-lovers-menu-btn"
              onClick={() => setIsOpen(false)}
            >
              For Art Lovers
            </Link>
          </div>

          {/* Login/Logout Link */}
          <div className="mt-10 mb-4">
            {currentUser && !currentUser.isGuest ? (
              <button
                onClick={handleLogout}
                className="w-full rounded-lg px-4 py-3 bg-[#FFA500] text-[#18120a] font-mono text-lg font-bold shadow hover:bg-[#ff8c42] transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <Link
                data-testid="login-button"
                to="/login"
                className="w-full rounded-lg px-4 py-3 bg-[#FFA500] text-[#18120a] font-mono text-lg font-bold shadow hover:bg-[#ff8c42] transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>

          {/* Footer Content */}
          <div className="flex flex-col items-left mt-10 md:mt-16">
            {/* Social Media Icons */}
            <div className="flex space-x-6 text-2xl my-6 md:text-3xl justify-center">
              <SlSocialFacebook className="h-7 w-7 md:h-8 md:w-8 text-[#FFA500] hover:text-blue-600 transition-all duration-300 hover:scale-125" />
              <FaInstagram className="h-7 w-7 md:h-8 md:w-8 text-[#FFA500] hover:text-pink-600 transition-all duration-300 hover:scale-125" />
              <FaXTwitter className="h-7 w-7 md:h-8 md:w-8 text-[#FFA500] hover:text-gray-600 transition-all duration-300 hover:scale-125" />
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap flex-col md:flex-row justify-center mt-8 gap-3 md:gap-6 text-xs md:text-sm text-[#FFA500]">
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
            <div className="text-xs mt-6 text-[#FFA500] text-center">
              © {new Date().getFullYear()} SumoArts. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
