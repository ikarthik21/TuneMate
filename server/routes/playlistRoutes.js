import {Router} from "express";
import ENDPOINTS from "./API_ENDPOINTS.js";
import {PlayListController} from "../controllers/Playlists/PlayListController.js";

const playListRouter = Router();


playListRouter.post(ENDPOINTS.createNewPlaylist, PlayListController().createNewPlaylist);

playListRouter.get(ENDPOINTS.getPlaylists, PlayListController().getPlaylists);

playListRouter.post(ENDPOINTS.saveSongInPlaylist, PlayListController().saveSongInPlaylist);

playListRouter.post(ENDPOINTS.removeSongFromPlaylist, PlayListController().removeSongFromPlaylist);

playListRouter.get(ENDPOINTS.playlist, PlayListController().getPlaylistSongs);


export default playListRouter;