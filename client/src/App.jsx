import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routesConfig from "@/utils/routesConfig";
import Player from "@/_components/Player/Player.jsx";
import NavBar from "@/_components/navigation/Navbar/NavBar.jsx";
import SideBar from "@/_components/navigation/SideBar/SideBar.jsx";
import Login from "@/pages/auth/login.jsx";
import { SkeletonTheme } from "react-loading-skeleton";
import { useMediaQuery } from "usehooks-ts";
import MobileNav from "@/_components/navigation/MobileNav/MobileNav";
import EditPlayList from "./_components/PlaylistComponents/EditPlayList";
import useModalStore from "@/store/use-modal-store.js";
import ResetPassword from "./pages/auth/ResetPassword";

function App() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { component } = useModalStore();
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <Router>
        <div className="z-50">
          <NavBar />
          {isMobile ? <MobileNav /> : <SideBar />}
        </div>
        <Routes>
          {routesConfig.map((route) => (
            <Route
              key={route.path}
              exact
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
        {component === "LOGIN" && <Login />}
        {component === "EDIT_PLAYLIST" && <EditPlayList />}
        {component === "RESET_PASSWORD" && <ResetPassword />}
      </Router>
      <Player />
    </SkeletonTheme>
  );
}

export default App;
