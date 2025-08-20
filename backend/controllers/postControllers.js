import User from "../models/userModel.js";
import Post from "../models/postModel.js";

//create post
const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;

    if (!postedBy || !text) {
      return res.status(400).json({ message: "please write a post" });
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ message: "USer not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: "Unauthorized to create post" });
    }

    const maxlength = 500;
    if (text.length > maxlength) {
      return res
        .status(400)
        .json({ message: `text must be less than ${maxlength} characters` });
    }

    const newPost = new Post({ postedBy, text, img });

    await newPost.save();
    res.status(201).json({ message: "Post created sucessfully", newPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(
      "Error in createPost function in postcontroller.js",
      err.message
    );
  }
};

//get a post by id
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    } else {
      res.status(200).json({ post });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(
      "Error in the getPost function in the Postcontroller.js",
      err.message
    );
  }
};

//delete a post by owner of the post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(500).json({ message: "Post not fpound" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized to delete the post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted sucessfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(
      "Error in the deletePost function of postController.js",
      err.message
    );
  }
};

//like and unlike any post
const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked sucessfully" });
    } else {
      //like post
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked sucessfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(
      "Error in likeUnlikePost function of postController.js",
      err.message
    );
  }
};

//reply on any post
const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ message: "Text field is required" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reply = { userId, text, userProfilePic, username };

    post.replies.push(reply);
    await post.save();

    res.status(200).json({ message: "Reply added sucessfully", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(
      "Error in replyToPost funtion in postControllers.js",
      err.message
    );
  }
};


//get feed function
const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
if (!user) {
  return res.status(404).json({message:"User not found"})
}

const following = user.following

const feedPosts = await Post.find({postedBy:{$in:following}}).sort({createdAt: -1})

res.status(200).json({message:"Feed post"})

  } catch (err) {
    res.status(500).json({message:err.message})
    console.log("Error in getFeedPosts function in postcontrollers.js", err.message)
  }
}


export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts };
