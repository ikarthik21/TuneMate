import useSearchStore from "@/store/use-search.js";
import Wrapper from "@/pages/Wrapper.jsx";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { IoClose } from "react-icons/io5";
import MobileResults from "./MobileResults";

const MobileSearch = () => {
  const { search, setSearch } = useSearchStore();

  return (
    <Wrapper>
      <div className="sticky top-20 left-0">
        <div className="flex items-center flex-1 justify-center bg-[#1e1e1e] border-[#adadad] border rounded-lg relative m-3 ">
          <div className="p-3">
            <FiSearch size={20} />
          </div>
          <Input
            className="rounded-full bg-[#1e1e1e]  h-[38px] text-[15px] border-none focus:outline-none focus-visible:ring-0 pr-10"
            placeholder="Search for a Song, Album, or Artist...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
      </div>

      <MobileResults />
    </Wrapper>
  );
};

export default MobileSearch;
