import useFormData from "@/hooks/useFormData.js";
import tuneMateInstance, { tuneMateClient } from "@/service/api/api.js";
import Toast from "@/utils/Toasts/Toast.js";
import { useState } from "react";
import Register from "@/pages/auth/register.jsx";
import useAuthStore from "@/store/use-auth.js";
import ResendMail from "./ResendMail";

// eslint-disable-next-line react/prop-types
const Login = ({ closeModal }) => {
  const [showDetails, setshowDetails] = useState("login");
  const { setAccessToken } = useAuthStore();
  const { handleChange, handleSubmit, isLoading, resetData } = useFormData(
    {
      email: "",
      password: ""
    },
    tuneMateInstance.loginUser
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await handleSubmit();
    if (response.data) {
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        tuneMateClient.defaults.headers[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        closeModal();
      }
      Toast({ type: response.data.type, message: response.data.message });
    }
    resetData();
  };

  return (
    <>
      {showDetails === "login" && (
        <div className={"flex items-center justify-center"}>
          <div className={"flex flex-col"}>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col m-2 ">
                <label>Email</label>
                <input
                  type="email"
                  className={"input-box w-72"}
                  onChange={handleChange}
                  name="email"
                  required={true}
                />
              </div>

              <div className="flex flex-col m-2">
                <label>Password</label>
                <input
                  type="password"
                  className={"input-box w-72"}
                  onChange={handleChange}
                  name="password"
                  required={true}
                />
              </div>

              <div className="flex flex-col m-2">
                <input
                  type="submit"
                  value={isLoading ? "Logining In......." : "Login"}
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
                onClick={() => setshowDetails("register")}
              >
                Not a Member? Register
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetails === "register" && (
        <Register setshowDetails={setshowDetails} />
      )}

      {showDetails === "resendMail" && (
        <ResendMail setshowDetails={setshowDetails} />
      )}
    </>
  );
};

export default Login;
