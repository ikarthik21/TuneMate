import {Router} from "express";
import ENDPOINTS from "./API_ENDPOINTS.js";
import {PlaylistController} from "../controllers/common/PlaylistController.js";
import {isAdmin} from "../middlewares/auth.js";

const commonRouter = Router();


commonRouter.get(ENDPOINTS.recommended, PlaylistController().getRecommended);
commonRouter.post(ENDPOINTS.createRecommended, isAdmin, PlaylistController().createRecommended);
commonRouter.post(ENDPOINTS.addSongToRecommended, isAdmin, PlaylistController().addSongToRecommended);
commonRouter.post(ENDPOINTS.removeSongFromRecommended, isAdmin, PlaylistController().removeSongFromRecommended);
commonRouter.get(ENDPOINTS.recommendedPlaylist, PlaylistController().getRecommendedSongs);

export default commonRouter;