import {X} from 'lucide-react';

// eslint-disable-next-line react/prop-types
function Modal({children, closeModal, isOpen, modalRef}) {
    return (<>
        {isOpen && (<div
            className="z-50 fixed inset-0 overflow-y-auto flex justify-center items-center  backdrop-blur-sm"
        >
            <div className="z-50  h-full w-full flex items-center justify-center">
                <div className=" w-[40vw] bg-[#18181b] relative rounded-md p-2 border-2 border-[#1b1b20] "
                     ref={modalRef}>
                    <div className="flex flex-col p-2">
                        <div className="flex items-center justify-end">
                            <X
                                onClick={closeModal} color={"white"} cursor={"pointer"}
                            />
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>)}
    </>);
}

export default Modal;