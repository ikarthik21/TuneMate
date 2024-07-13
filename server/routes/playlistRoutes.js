import {Router} from "express";
import ENDPOINTS from "./API_ENDPOINTS.js";
import {PlayListController} from "../controllers/Playlists/PlayListController.js";
import {isAuthUser} from "../middlewares/auth.js";

const playListRouter = Router();


playListRouter.post(ENDPOINTS.createNewPlaylist, isAuthUser, PlayListController().createNewPlaylist);

playListRouter.get(ENDPOINTS.getPlaylists, isAuthUser, PlayListController().getPlaylists);

playListRouter.post(ENDPOINTS.saveSongInPlaylist, isAuthUser, PlayListController().saveSongInPlaylist);

playListRouter.post(ENDPOINTS.removeSongFromPlaylist, isAuthUser, PlayListController().removeSongFromPlaylist);

playListRouter.get(ENDPOINTS.playlist, isAuthUser, PlayListController().getPlaylistSongs);


export default playListRouter;