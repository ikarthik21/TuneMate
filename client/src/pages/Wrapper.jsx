import NavBar from "@/_components/navigation/Navbar/NavBar"
import SideBar from "@/_components/navigation/SideBar/SideBar"
import Modal from "@/_components/Modals/Modal.jsx";
import useModal from "@/hooks/useModal.js";
import Login from "@/pages/auth/login.jsx";
import Player from "@/_components/Player/Player.jsx";

// eslint-disable-next-line react/prop-types
const Wrapper = ({children}) => {
    const {closeModal, openModal, modalRef, isOpen} = useModal();

    return (<div className="flex flex-col ml-80">

            <div className={"z-10"}>
                <NavBar openModal={openModal}/>
                <SideBar/>
            </div>
            <div className={"mt-20"}>
                {children}
            </div>

            <Modal closeModal={closeModal} isOpen={isOpen} modalRef={modalRef}>
                <Login closeModal={closeModal}/>
            </Modal>


        </div>);
};

export default Wrapper;
