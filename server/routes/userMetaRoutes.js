import {Router} from "express";
import ENDPOINTS from "./API_ENDPOINTS.js";
import {UserMetaController} from "../controllers/Auth/UserMetaController.js";

const userMetaRouter = Router();

userMetaRouter.post(ENDPOINTS.ManageSongInFavorites, UserMetaController().manageUserFavorites);

userMetaRouter.get(ENDPOINTS.favorites, UserMetaController().getFavorites);

userMetaRouter.post(ENDPOINTS.updatePlayerState, UserMetaController().updatePlayerState);

userMetaRouter.get(ENDPOINTS.getPlayerState, UserMetaController().getPlayerState);


export default userMetaRouter;