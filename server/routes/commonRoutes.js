import {Router} from "express";
import ENDPOINTS from "./API_ENDPOINTS.js";
import {PlaylistController} from "../controllers/common/PlaylistController.js";

const commonRouter = Router();


commonRouter.get(ENDPOINTS.recommended, PlaylistController().getRecommended);
commonRouter.post(ENDPOINTS.createRecommended, PlaylistController().createRecommended);
commonRouter.post(ENDPOINTS.addSongToRecommended, PlaylistController().addSongToRecommended);
commonRouter.post(ENDPOINTS.removeSongFromRecommended, PlaylistController().removeSongFromRecommended);
commonRouter.get(ENDPOINTS.recommendedPlaylist, PlaylistController().getRecommendedSongs);

export default commonRouter;