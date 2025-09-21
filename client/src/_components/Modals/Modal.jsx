import { motion } from "framer-motion";
import { useEffect } from "react";
import { X } from "lucide-react";
import useModalStore from "@/store/use-modal-store";

function Modal({ children }) {
  const { closeModal, isOpen } = useModalStore();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="z-50 fixed inset-0 flex justify-center items-center backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        className="bg-[#18181b] relative rounded-md p-2 border-2 border-[#1b1b20]"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col p-2">
          <div className="flex items-center justify-end">
            <X onClick={closeModal} color="white" cursor="pointer" />
          </div>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Modal;
