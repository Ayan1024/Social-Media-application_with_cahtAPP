import express from "express";

import protectRoute from "../middlewares/protectRoute.js";
import  { createPost, deletePost, getFeedPosts, getPost, getUserPosts, likeUnlikePost, replyToPost,  deleteReply} from "../controllers/postControllers.js";

const router = express.Router()

router.get("/feed", protectRoute, getFeedPosts)
router.get("/:id", protectRoute, getPost)
router.get("/user/:username", getUserPosts)
router.post("/create", protectRoute, createPost)
router.delete("/:id", protectRoute, deletePost)
router.delete("/:postId/reply/:replyId", protectRoute, deleteReply);
router.put("/like/:id", protectRoute, likeUnlikePost)
router.put("/reply/:id", protectRoute, replyToPost)

export default router;
