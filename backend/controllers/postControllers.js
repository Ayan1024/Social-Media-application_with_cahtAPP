import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "Postedby and text fields are required" });
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({ path: "postedBy", select: "username profilePic" })
      .populate({ path: "likes", select: "username profilePic" })
      .populate({ path: "replies.userId", select: "username profilePic" });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Newest-first replies (Twitter-style)
    post.replies.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json(post);
  } catch (err) {
    console.error("getPost error:", err);
    res.status(500).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully",likes: post.likes, });
    } else {
      // Like post
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked successfully", likes: post.likes, });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const user = await User.findById(req.user._id).select(
      "username profilePic"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Push reply
    post.replies.push({
      userId: user._id,
      text,
      userProfilePic: user.profilePic,
      username: user.username,
    });

    await post.save();

    // ✅ Grab the last reply (with createdAt)
    const newReply = post.replies[post.replies.length - 1];

    res.status(200).json(newReply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } })
      .sort({ createdAt: -1 })
      .populate("postedBy", "username profilePic")
      .populate("replies.userId", "username profilePic")
      .populate("likes", "username profilePic");

    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ postedBy: user._id })
      .sort({ createdAt: -1 })
      .populate("postedBy", "username profilePic")
      .populate("replies.userId", "username profilePic")
      .populate("likes", "username profilePic"); // ✅ add this too

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReply = async (req, res) => {
  try {
    // 1. Destructure post and reply IDs from request parameters
    const { postId, replyId } = req.params;
    const userId = req.user._id; // ID of the currently logged-in user

    // 2. Find the post that contains the reply
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 3. Find the specific reply within the post's replies array
    const reply = post.replies.find((r) => r._id.toString() === replyId);
    if (!reply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    // 4. Authorization check: Ensure the user deleting the reply is the one who created it
    if (reply.userId.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ error: "Unauthorized to delete this reply" });
    }

    // 5. Use $pull operator to remove the reply from the array
    await Post.updateOne(
      { _id: postId },
      { $pull: { replies: { _id: replyId } } }
    );

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in deleteReply: ", err.message);
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
  deleteReply,
};
