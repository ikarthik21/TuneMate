import express from "express";
import { HttpController } from "../controllers/httpController.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Welcome to the Tunemate Socket Server</h1>");
});

router.post("/api/addConnection", HttpController().addConnectioninRedis);

export default router;
