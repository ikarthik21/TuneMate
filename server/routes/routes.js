import {Router} from 'express';
import {LOGIN, REGISTER} from "./API_ENDPOINTS.js";
import {UserController} from "../controllers/Auth/UserController.js";

const router = Router();

router.get('/', (req, res) => {
    console.log("API hit to backend");
});

router.post(REGISTER, UserController().register)
router.post(LOGIN, UserController().login)


export default router;