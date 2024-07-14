import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import routesConfig from "@/utils/routesConfig";
import Player from "@/_components/Player/Player.jsx";
import NavBar from "@/_components/navigation/Navbar/NavBar.jsx";
import useModal from "@/hooks/useModal.js";
import SideBar from "@/_components/navigation/SideBar/SideBar.jsx";
import Modal from "@/_components/Modals/Modal.jsx";
import Login from "@/pages/auth/login.jsx";
import {SkeletonTheme} from 'react-loading-skeleton';

function App() {
    const {closeModal, openModal, modalRef, isOpen} = useModal();

    return (<SkeletonTheme baseColor="#202020" highlightColor="#444">
        <Router>
            <div className="z-50">
                <NavBar openModal={openModal}/>
                <SideBar/>
            </div>
            <Routes>
                {routesConfig.map((route) => (<Route
                    key={route.path}
                    exact
                    path={route.path}
                    element={route.element}
                />))}
            </Routes>
            <Modal closeModal={closeModal} isOpen={isOpen} modalRef={modalRef}>
                <Login closeModal={closeModal}/>
            </Modal>
        </Router>
        <Player/>
    </SkeletonTheme>);
}

export default App;
