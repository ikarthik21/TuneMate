import {Router} from "express";
import ENDPOINTS from "./API_ENDPOINTS.js";
import {UserMetaController} from "../controllers/Auth/UserMetaController.js";
import {isAuthUser} from "../middlewares/auth.js";

const userMetaRouter = Router();

userMetaRouter.post(ENDPOINTS.ManageSongInFavorites, isAuthUser, UserMetaController().manageUserFavorites);

userMetaRouter.get(ENDPOINTS.favorites, isAuthUser, UserMetaController().getFavorites);

userMetaRouter.post(ENDPOINTS.updatePlayerState, isAuthUser, UserMetaController().updatePlayerState);

userMetaRouter.get(ENDPOINTS.getPlayerState, isAuthUser, UserMetaController().getPlayerState);


export default userMetaRouter;