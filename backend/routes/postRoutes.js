import express from "express";

import protectRoute from "../middlewares/protectRoute.js";
import { createPost, deletePost, getFeedPosts, getPost, likeUnlikePost, replyToPost } from "../controllers/postControllers.js";

const router = express.Router()

router.get("/feed", protectRoute, getFeedPosts)
router.get("/:id", protectRoute, getPost)
router.post("/create", protectRoute, createPost)
router.delete("/:id", protectRoute, deletePost)
router.post("/like/:id", protectRoute, likeUnlikePost)
router.post("/reply/:id", protectRoute, replyToPost)
export default router;
