import useFormData from "@/hooks/useFormData.js";
import {registerUser} from '@/service/api/api.js';
import Toast from "@/utils/Toast.js";


const Login = () => {
    const {data, handleChange, handleSubmit} = useFormData({
        email: '', password: '', confirmPassword: '',
    }, registerUser);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (data.password !== data.confirmPassword) {
            console.log("passwords must be same");
            return;
        }
        const response = await handleSubmit();
        if (response.data) {
            console.log(response)
            Toast({type: response.data.type, message: response.data.message});
        }
    }

    return (<div className={"flex items-center justify-center"}>
        <div className={"flex flex-col"}>

            <form onSubmit={handleRegister}>
                <div className="flex flex-col m-2 ">
                    <label>
                        Email
                    </label>
                    <input type="email" className={"input-box w-72"} onChange={handleChange} name="email"
                           required={true}/>
                </div>

                <div className="flex flex-col m-2 ">
                    <label>
                        Username
                    </label>
                    <input type="text" className={"input-box w-72"} onChange={handleChange} name="username"
                           required={true}/>
                </div>

                <div className="flex flex-col m-2">
                    <label>
                        Password
                    </label>
                    <input type="password" className={"input-box w-72"} onChange={handleChange} name="password"
                           required={true}/>
                </div>
                <div className="flex flex-col m-2">
                    <label>
                        Confirm Password
                    </label>
                    <input type="password" className={"input-box w-72"} onChange={handleChange} name="confirmPassword"
                           required={true}/>
                </div>
                <div className="flex flex-col m-2">
                    <input type="submit" className={"button_variant_1 mt-2"}/>
                </div>
            </form>

            <div className={"flex items-center justify-center"}>
                <p>Already a memeber ? Login</p>
            </div>
        </div>

    </div>);
};

export default Login;
