import {Router} from 'express';
import authRouter from "./authRoutes.js";
import userMetaRouter from "./userMetaRoutes.js";
import playListRouter from "./playlistRoutes.js";
import commonRouter from "./commonRoutes.js";

const router = Router();

router.get('/', (req, res) => {
    console.log("API hit to backend");
});

router.use("/auth", authRouter);
router.use("/meta", userMetaRouter);
router.use("/playlists", playListRouter);
router.use("/", commonRouter);


export default router;