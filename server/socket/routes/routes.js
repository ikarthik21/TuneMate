import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Welcome to the Tunemate Socket Server</h1>");
});

export default router;
