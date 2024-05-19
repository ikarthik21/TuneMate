import {Button} from "@/components/ui/button"
import useAuthStore from "@/store/use-auth.js";
import {LogOut} from "lucide-react";

// eslint-disable-next-line react/prop-types
const NavBar = ({openModal}) => {
    const {isAuthenticated, removeAccessToken, username} = useAuthStore((state) => state);


    return (<nav
        className="flex h-[70px] text-white bg-[#18181b] fixed top-0  left-0 p-2  lg:px-4 items-center w-full justify-between   border-b border-[#2D2E35]">
        <h1 className={"logo_font text-2xl md:text-3xl ml-2 font-semibold tracking-wide text-white "}>TuneMate</h1>
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