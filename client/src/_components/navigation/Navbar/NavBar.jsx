import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/use-auth.js";
import { LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import useSearchStore from "@/store/use-search.js";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import UserLogo from "@/assets/images/user.png";
import { Link, useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const NavBar = ({ openModal }) => {
  const { isAuthenticated, removeAccessToken, username } = useAuthStore(
    (state) => state
  );
  const { search, setSearch } = useSearchStore();

  const navigate = useNavigate();

  const handleInputFocus = () => {
    navigate("/search");
  };

  return (
    <nav className="flex h-[70px] text-white bg-[#0e0e10] fixed top-0 left-0 p-2 lg:px-4 items-center w-full justify-between z-50">

      <Link to={"/"}>
        <h1 className="black-han-sans-regular text-2xl md:text-3xl ml-2 font-semibold tracking-wide text-[#afaeae]">
          TuneMate
        </h1>
      </Link>

      <div className="flex items-center justify-center bg-[#1e1e1e] rounded-lg relative w-full ml-12">
        <div className="p-3">
          <FiSearch size={20} />
        </div>
        <Input
          className="rounded-full bg-[#1e1e1e]  h-[38px] text-[15px] border-none focus:outline-none focus-visible:ring-0 pr-10"
          placeholder="Search for a Song, Album, or Artist...."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={handleInputFocus}
        />
        {search && (
          <div
            className="absolute right-4 p-3 transform hover:scale-110 cursor-pointer"
            onClick={() => setSearch("")}
          >
            <IoClose size={20} />
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <div className="cursor-pointer flex items-center justify-center p-2 rounded-2xl">
          {/* <img src={UserLogo} alt="user" className="h-10 w-10 mr-2" />
          <h2 className="mr-2 text-[14px]">{username}</h2> */}
          <LogOut size={24} onClick={removeAccessToken} />
        </div>
      ) : (
        <Button variant="outline" onClick={openModal}>
          Login
        </Button>
      )}
    </nav>
  );
};

export default NavBar;
