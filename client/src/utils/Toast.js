import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = ({type, message, duration = 1500}) => {
    switch (type) {
        case "success":
            toast.success(message, {autoClose: duration});
            break;
        case "error":
            toast.error(message, {autoClose: duration});
            break;
        case "warning":
            toast.warning(message, {autoClose: duration});
            break;
        default:
            toast.info(message, {autoClose: duration});
    }
};

export default Toast;
