import NavBar from "@/_components/navigation/Navbar/NavBar"
import SideBar from "@/_components/navigation/SideBar/SideBar"
import Modal from "@/_components/Modals/Modal.jsx";
import useModal from "@/hooks/useModal.js";
import Login from "@/pages/auth/login.jsx";

// eslint-disable-next-line react/prop-types
const Wrapper = ({children}) => {
    const {closeModal, openModal, modalRef, isOpen} = useModal();

    return (
        <div className="h-full flex flex-col">
            <div className={"z-10"}>
                <NavBar openModal={openModal}/>
                <SideBar/>
                {children}
            </div>
            <Modal closeModal={closeModal} isOpen={isOpen} modalRef={modalRef}>
                <Login/>
            </Modal>
        </div>
    )
        ;
};

export default Wrapper;
