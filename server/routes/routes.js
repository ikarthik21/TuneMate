import {Router} from 'express';
import authRouter from "./authRoutes.js";
import userMetaRouter from "./userMetaRoutes.js";
import playListRouter from "./playlistRoutes.js";

const router = Router();

router.get('/', (req, res) => {
    console.log("API hit to backend");
});

router.use("/auth", authRouter);
router.use("/meta", userMetaRouter);
router.use("/playlists", playListRouter);


export default router;