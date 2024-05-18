import {Button} from "@/components/ui/button"
import useAuthStore from "@/store/use-auth.js";

// eslint-disable-next-line react/prop-types
const NavBar = ({openModal}) => {
    const {isAuthenticated, removeAccessToken} = useAuthStore((state) => state);

    return (<nav
        className="flex h-[70px] text-white bg-[#18181b] fixed top-0  left-0 p-2  lg:px-4 items-center w-full justify-between   border-b border-[#2D2E35]">
        <h1>Navbar</h1>
        {isAuthenticated ? <Button variant="outline" onClick={removeAccessToken}>
            Logout
        < /Button> : <Button variant="outline" onClick={openModal}>
            Login
        </Button>}
    </nav>)
}

export default NavBar