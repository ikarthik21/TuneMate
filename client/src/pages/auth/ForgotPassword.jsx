import useFormData from "@/hooks/useFormData.js";
import tuneMateInstance from "@/service/api/api.js";
import Toast from "@/utils/Toasts/Toast.js";

// eslint-disable-next-line react/prop-types
const ForgotPassword = ({ setshowDetails }) => {
  const { data, handleChange, handleSubmit, isLoading, resetData } =
    useFormData(
      {
        email: ""
      },
      tuneMateInstance.forgotPassword
    );

  const handleForgotPassword = async (e) => {
    try {
      e.preventDefault();
      const response = await handleSubmit();
      if (response.data) {
        Toast({ type: response.data.type, message: response.data.message });
      }
    } catch (err) {
      console.error("Error in handleReset:", err);
    } finally {
      resetData();
    }
  };

  return (
    <div className={"flex items-center justify-center"}>
      <div className={"flex flex-col"}>
        <form onSubmit={handleForgotPassword}>
          <div className="flex flex-col m-2 ">
            <label>Email</label>
            <input
              type="email"
              className={"input-box"}
              onChange={handleChange}
              value={data.email}
              name="email"
              required={true}
            />
          </div>

          <div className="flex flex-col m-2">
            <input
              type="submit"
              value={isLoading ? "Sending Mail......." : "Reset Password"}
              className={`button_variant_1 mt-2 ${
                isLoading ? "opacity-60 pointer-events-none" : ""
              }`}
              disabled={isLoading}
            />
          </div>
        </form>

        <div className={"flex items-center justify-center m-2"}>
          <button
            className={"link_button  mr-4"}
            onClick={() => setshowDetails("resendMail")}
          >
            Resend Verification Mail
          </button>
          <button
            className={"link_button"}
            onClick={() => setshowDetails("login")}
          >
            Already a member? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
