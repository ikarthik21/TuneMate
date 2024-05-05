import NavBar from "@/_components/navigation/Navbar/NavBar"
import SideBar from "@/_components/navigation/SideBar/SideBar"

// eslint-disable-next-line react/prop-types
const Wrapper = ({ children }) => {
    return (
        <div className="h-full border flex flex-col">
            <NavBar />
            <SideBar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}

export default Wrapper
