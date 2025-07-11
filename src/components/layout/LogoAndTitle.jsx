import { Link } from "react-router-dom";
import { GrVirtualMachine } from "react-icons/gr";

export default function LogoAndTitle({ setIsOpen, isArtLoversPage }) {
  // Hide the logo on art lovers page
  if (isArtLoversPage) {
    return null;
  }

  return (
    <Link
      to="/"
      className="text-xl font-bold flex items-center"
      onClick={() => setIsOpen && setIsOpen(false)}
    >
      <GrVirtualMachine className="w-5 h-5 md:w-6 md:h-6" />
      <span className="leading-none text-left font-medium text-lg ml-2 md:text-2xl md:ml-3">
        SumoArts
      </span>
    </Link>
  );
}
