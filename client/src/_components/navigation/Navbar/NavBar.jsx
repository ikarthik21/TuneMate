import {Button} from "@/components/ui/button"
import useAuthStore from "@/store/use-auth.js";
import {LogOut} from "lucide-react";
import {Input} from "@/components/ui/input";
import useSearchStore from "@/store/use-search.js";
import {FiSearch} from "react-icons/fi";

// eslint-disable-next-line react/prop-types
const NavBar = ({openModal}) => {
    const {isAuthenticated, removeAccessToken, username} = useAuthStore((state) => state);
    const {search, setSearch} = useSearchStore();

    return (<nav
        className="flex h-[70px] text-white bg-[#18181b] fixed top-0  left-0 p-2  lg:px-4 items-center w-full justify-between   border-b border-[#2D2E35]">
        <h1 className={"logo_font text-2xl md:text-3xl ml-2 font-semibold tracking-wide text-white "}>TuneMate</h1>

        <div className={"flex items-center justify-center  bg-[#222328] border-[#606064] rounded-full border "}>
            <div className={"p-3 "}>
                <FiSearch size={20}/>
            </div>
            <Input
                className="rounded-full bg-[#222328] lg:w-[400px] h-[38px] text-[15px] border-none focus:outline-none focus-visible:ring-0"
                placeholder="Search for a Song, Album, or Artist...."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

        </div>


        {isAuthenticated ?
            <div className={" cursor-pointer flex items-center justify-center bg-neutral-800 p-2 rounded-2xl"}>
                <img src="./src/assets/images/user.png" alt="user" className={"h-10 w-10  mr-2"}/>
                <h2 className={"mr-2 text-[14px]"}>{username}</h2>
                <LogOut size={24} onClick={removeAccessToken}/>

            </div> : <Button variant="outline" onClick={openModal}>
                Login
            < /Button>}
    </nav>)
}

export default NavBar