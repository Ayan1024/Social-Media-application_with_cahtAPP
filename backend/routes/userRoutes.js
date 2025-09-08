import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  folowUnFollowUser,
  updateUser,
  getUserProfile,
  searchUsers,
  freezeAccount,
  getSuggestedUsers,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/follow/:id", protectRoute, folowUnFollowUser);
router.put("/update/:id", protectRoute, updateUser);

router.get("/profile/:query", protectRoute, getUserProfile)
router.get("/search/:query", protectRoute, searchUsers);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.put("/freeze", protectRoute, freezeAccount);
export default router;
