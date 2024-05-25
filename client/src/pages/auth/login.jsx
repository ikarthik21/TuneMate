import useFormData from "@/hooks/useFormData.js";
import {loginUser} from "@/service/api/api.js";
import Toast from "@/utils/Toast.js";
import {useState} from "react";
import Register from "@/pages/auth/register.jsx";
import useAuthStore from "@/store/use-auth.js";


// eslint-disable-next-line react/prop-types
const Login = ({closeModal}) => {
    const [showLogin, setShowLogin] = useState(true);
    const {setAccessToken} = useAuthStore();

    const {handleChange, handleSubmit} = useFormData({
        email: '', password: ''
    }, loginUser);

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await handleSubmit();
        if (response.data) {
            if (response.data.accessToken) {
                setAccessToken(response.data.accessToken);
                closeModal();

            }
            Toast({type: response.data.type, message: response.data.message});
        }
    }

    return (<>
        {showLogin ? (<div className={"flex items-center justify-center"}>
            <div className={"flex flex-col"}>

                <form onSubmit={handleLogin}>
                    <div className="flex flex-col m-2 ">
                        <label>
                            Email
                        </label>
                        <input type="email" className={"input-box w-72"} onChange={handleChange} name="email"
                               required={true}/>
                    </div>

                    <div className="flex flex-col m-2">
                        <label>
                            Password
                        </label>
                        <input type="password" className={"input-box w-72"} onChange={handleChange}
                               name="password" required={true}/>
                    </div>

                    <div className="flex flex-col m-2">
                        <input type="submit" value={"Login"} className={"button_variant_1 mt-2"}/>
                    </div>
                </form>

                <div className={"flex items-center justify-center m-2"}>
                    <button className={"link_button"} onClick={() => setShowLogin(false)}>
                        Not a Member? Register
                    </button>
                </div>

            </div>
        </div>) : (<Register setShowLogin={setShowLogin}/>)}
    </>);
};

export default Login;
