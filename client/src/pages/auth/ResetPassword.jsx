import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "@/_components/Modals/Modal";
import useFormData from "@/hooks/useFormData";
import tuneMateInstance from "@/service/api/api";
import Toast from "@/utils/Toasts/Toast";
import useModalStore from "@/store/use-modal-store";

const ResetPassword = () => {
  const { id: token } = useParams();
  const { closeModal, openModal, isOpen } = useModalStore();
  const navigate = useNavigate();

  useEffect(() => {
    openModal("RESET_PASSWORD");
  }, []);

  const { data, handleChange, handleSubmit, isLoading, resetData } =
    useFormData(
      {
        password: "",
        confirmPassword: "",
        token
      },
      tuneMateInstance.resetPassword
    );

  const handleResetPassword = async (e) => {
    try {
      e.preventDefault();
      if (data.password !== data.confirmPassword) {
        Toast({ type: "error", message: "Passwords must be the same" });
        resetData();
        return;
      }
      const response = await handleSubmit();

      if (response.data) {
        Toast({ type: response.data.type, message: response.data.message });
        setTimeout(() => {
          navigate("/");
        }, 2000);
        closeModal();
      }
    } catch (error) {
      console.error("Error in handleResetPassword:", error);
      Toast({
        type: "error",
        message: "An error occurred while resetting password"
      });
    } finally {
      resetData();
    }
  };

  return (
    <Modal>
      <div className={"flex items-center justify-center"}>
        <div className={"flex flex-col"}>
          <form onSubmit={handleResetPassword}>
            <div className="flex flex-col m-2">
              <label>New Password</label>
              <input
                type="password"
                className={"input-box  w-72"}
                onChange={handleChange}
                name="password"
                required={true}
              />
            </div>

            <div className="flex flex-col m-2">
              <label>Confirm New Password</label>
              <input
                type="password"
                className={"input-box w-72"}
                onChange={handleChange}
                name="confirmPassword"
                required={true}
              />
            </div>

            <div className="flex flex-col m-2">
              <input
                type="submit"
                value={isLoading ? "Reseting......." : "Reset Password"}
                className={`button_variant_1 mt-2 ${
                  isLoading ? "opacity-60 pointer-events-none" : ""
                }`}
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ResetPassword;
