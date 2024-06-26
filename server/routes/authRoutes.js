import {Router} from "express";
import ENDPOINTS from "./API_ENDPOINTS.js";
import {UserController} from "../controllers/Auth/UserController.js";

const authRouter = Router();

authRouter.post(ENDPOINTS.register, UserController().register);
authRouter.post(ENDPOINTS.login, UserController().login);

export default authRouter;