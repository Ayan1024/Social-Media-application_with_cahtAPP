// controllers/userController.js
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

//signup function "/api/users/signup"
const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    console.log("Request Body:", req.body); // Check if req.body is parsed correctly

    const user = await User.findOne({ $or: [{ email }, { username }] });
    console.log(
      "User findOne result:",
      user ? "User exists" : "User not found"
    );

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    console.log("Salt generated.");
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed.");

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    console.log("New User instance created.");

    await newUser.save();
    console.log("New User saved to DB.");

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data provided" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Error in signupUser in userController.js:", err.message);
  }
};

//login function "/api/users/login"
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(
      "error in the loginUser function in the userController.js",
      err.message
    );
  }
};
//
//logout function "api/users/logout"
const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "logout sucessfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(
      "error in logoutuser function in the userController.js",
      err.message
    );
  }
};

//follow unfollow function "api/users/follow/:id"
const folowUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow self-follow
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });
    }

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      return res.status(200).json({ error: "User unfollowed successfully" });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      return res.status(200).json({ error: "User followed successfully" });
    }
  } catch (err) {
    console.error("Error in folowUnFollowUser:", err.message);
    res.status(500).json({ error: err.message });
  }
};

//Profile update function "api/users/update/:id"
const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (req.params.id !== userId.toString()) {
      return res
        .status(400)
        .json({ error: "You can not update other's profile " });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "err.message" });
    console.log(
      "Error in the updateUser function in the usercontroller.js",
      err.message
    );
  }
};

//getUserProfile function "api/users/profile/:id"
const getUserProfile = async (req, res) => {
  // it's help to find the user by their id or username

  const { query } = req.params; //query can be either username or password

  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt"); // when the query is userId
    } else {
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt"); //when the query is username
    }

    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(
      "Error in the getUserProfile function in the controller.js",
      err.message
    );
  }
};
export {
  signupUser,
  loginUser,
  logoutUser,
  folowUnFollowUser,
  updateUser,
  getUserProfile,
};
