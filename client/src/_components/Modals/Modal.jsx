import { X } from "lucide-react";
import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
function Modal({ children, closeModal, isOpen, modalRef }) {
  return (
    <>
      {isOpen && (
        <motion.div
          className="z-50 fixed inset-0 overflow-y-auto flex justify-center items-center backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="z-50 h-full w-full flex items-center justify-center">
            <motion.div
              className="bg-[#18181b] relative rounded-md p-2 border-2 border-[#1b1b20]"
              ref={modalRef}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col p-2">
                <div className="flex items-center justify-end">
                  <X onClick={closeModal} color={"white"} cursor={"pointer"} />
                </div>
                {children}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default Modal;
