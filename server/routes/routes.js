import {Router} from 'express';
import ENDPOINTS from "./API_ENDPOINTS.js";
import {UserController} from "../controllers/Auth/UserController.js";
import {UserMetaController} from "../controllers/Auth/UserMetaController.js";

const router = Router();

router.get('/', (req, res) => {
    console.log("API hit to backend");
});

// pure user routes
router.post(ENDPOINTS.register, UserController().register);
router.post(ENDPOINTS.login, UserController().login);

// user meta routes
router.post(ENDPOINTS.ManageSongInFavorites, UserMetaController().manageUserFavorites);
router.get(ENDPOINTS.favorites, UserMetaController().getFavorites);
router.post(ENDPOINTS.updatePlayerState, UserMetaController().updatePlayerState);
router.get(ENDPOINTS.getPlayerState, UserMetaController().getPlayerState);


export default router;