import useFormData from "@/hooks/useFormData.js";
import tuneMateInstance from "@/service/api/api.js";
import Toast from "@/utils/Toasts/Toast.js";

const ResendMail = ({ setshowDetails }) => {
  const { data, handleChange, handleSubmit, isLoading, resetData } =
    useFormData(
      {
        email: ""
      },
      tuneMateInstance.resendVerificationMail
    );

  const handleResend = async (e) => {
    e.preventDefault();
    if (data.email === "") {
      Toast({ type: "error", message: "Please enter email" });
      return;
    }

    const response = await handleSubmit();
    if (response.data) {
      Toast({ type: response.data.type, message: response.data.message });
    }

    resetData();
  };

  return (
    <div className={"flex items-center justify-center"}>
      <div className={"flex flex-col"}>
        <form onSubmit={handleResend}>
          <div className="flex flex-col m-2 ">
            <label>Email</label>
            <input
              type="email"
              className={"input-box w-72"}
              onChange={handleChange}
              name="email"
              value={data.email}
              required={true}
            />
          </div>

          <div className="flex flex-col m-2">
            <input
              type="submit"
              value={isLoading ? "Resending......" : "Resend"}
              className={`button_variant_1 mt-2 ${
                isLoading ? "opacity-60 pointer-events-none" : ""
              }`}
              disabled={isLoading}
            />
          </div>
        </form>

        <div className={"flex items-center justify-center m-2"}>
          <button
            className={"link_button"}
            onClick={() => setshowDetails("login")}
          >
            Already a Member? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResendMail;
