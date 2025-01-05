import { Link } from "react-router-dom";
import { FaHistory } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";
const MobileNav = () => {
  return (
    <nav className="h-16 w-full fixed bottom-0 left-0 z-50  bg-[#1a1a1a] p-2 ">
      <div className="flex items-center justify-between pl-4 pr-4">
        <Link to={"/"}>
          <div className="flex flex-col  items-center justify-center">
            <AiFillHome size={25} color="#adadad" />
            <p className="text-xs mt-1">Home</p>
          </div>
        </Link>
        <Link to={"/m/search"}>
          <div className="flex flex-col items-center justify-center">
            <FaSearch size={23} color="#adadad" />
            <p className="text-xs mt-1">Search</p>
          </div>
        </Link>
      
        <Link to={"/your-library"}>
          <div className="flex flex-col items-center justify-center">
            <MdLibraryMusic size={25} color="#adadad" />
            <p className="text-xs mt-1">
              Your Library
            </p>
          </div>
        </Link>
        <Link to={"/favorites"}>
          <div className="flex flex-col items-center justify-center">
            <IoMdHeart size={25} color="#adadad" />
            <p className="text-xs mt-1">Favorites</p>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
