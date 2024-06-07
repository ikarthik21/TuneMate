import {Router} from 'express';
import ENDPOINTS from "./API_ENDPOINTS.js";
import {UserController} from "../controllers/Auth/UserController.js";

const router = Router();

router.get('/', (req, res) => {
    console.log("API hit to backend");
});

router.post(ENDPOINTS.register, UserController().register);
router.post(ENDPOINTS.login, UserController().login);
router.post(ENDPOINTS.ManageSongInFavorites, UserController().manageUserFavorites);
router.get(ENDPOINTS.favorites, UserController().getFavorites);

router.post(ENDPOINTS.checkinfavorites, UserController().checkInFavorites);


export default router;