import {Router} from "express";
import ENDPOINTS from "./API_ENDPOINTS.js";
import {PlaylistController} from "../controllers/common/PlaylistController.js";

const commonRouter = Router();


commonRouter.get(ENDPOINTS.recommended, PlaylistController().getRecommended);


export default commonRouter;