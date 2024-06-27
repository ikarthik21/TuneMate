import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastImage = ({type, message, duration = 1500, position = "bottom-center", image}) => {
    const options = {
        autoClose: duration, position: position, closeButton: false, hideProgressBar: true, className: "custom-toast",
    };

    // Function to generate the toast message
    const generateToastMessage = () => {
        return (<div className="flex items-center">
            <img
                src={image}
                alt="Song Image" className="mr-2 w-8 h-8 rounded-full"/>
            <p className={"font-medium nunito-sans-bold "}>{message}</p>
        </div>);
    };

    // Show toast based on type
    switch (type) {
        case "success":
            toast.success(generateToastMessage(), options);
            break;
        case "error":
            toast.error(generateToastMessage(), options);
            break;
        case "warning":
            toast.warning(generateToastMessage(), options);
            break;
        default:
            toast.info(generateToastMessage(), options);
    }
};

export default ToastImage;
