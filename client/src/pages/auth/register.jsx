import useFormData from "@/hooks/useFormData.js";
import tuneMateInstance from "@/service/api/api.js";
import Toast from "@/utils/Toasts/Toast.js";

// eslint-disable-next-line react/prop-types
const Register = ({ setshowDetails }) => {
  const { data, handleChange, handleSubmit, isLoading, resetData } =
    useFormData(
      {
        email: "",
        password: "",
        confirmPassword: ""
      },
      tuneMateInstance.registerUser
    );

  const handleRegister = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      console.log("passwords must be same");
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
        <form onSubmit={handleRegister}>
          <div className="flex flex-col m-2 ">
            <label>Email</label>
            <input
              type="email"
              className={"input-box "}
              onChange={handleChange}
              name="email"
              required={true}
            />
          </div>

          <div className="flex flex-col m-2 ">
            <label>Username</label>
            <input
              type="text"
              className={"input-box  "}
              onChange={handleChange}
              name="username"
              required={true}
            />
          </div>

          <div className="flex flex-col m-2">
            <label>Password</label>
            <input
              type="password"
              className={"input-box  "}
              onChange={handleChange}
              name="password"
              required={true}
            />
          </div>
          <div className="flex flex-col m-2">
            <label>Confirm Password</label>
            <input
              type="password"
              className={"input-box  "}
              onChange={handleChange}
              name="confirmPassword"
              required={true}
            />
          </div>
          <div className="flex flex-col m-2">
            <input
              type="submit"
              value={isLoading ? "Registering......." : "Register"}
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

export default Register;
