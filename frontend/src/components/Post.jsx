import { Avatar, Image, Box, Flex, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import Comment from "./Comment"; // ✅ add this import
import { useParams } from "react-router-dom";

// const Post = ({ post, postedBy }) => {
const Post = ({ post }) => {
  // const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  const { id: postId } = useParams(); // will only exist inside /post/:id route
  if (!post) return null;
   const user = post.postedBy;

  // const sortedReplies = [...(post.replies || [])].sort((a, b) => {
  //   const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  //   const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  //   return bTime - aTime; // ✅ newest first
  // });

  const sortedReplies = [...(post.replies || [])].sort(
		(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
	);

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       let query = postedBy;

  //       // If postedBy is an object, use username or _id
  //       if (typeof postedBy === "object" && postedBy !== null) {
  //         query = postedBy.username || postedBy._id;
  //       }

  //       if (!query) return; // safety check

  //       const res = await fetch("/api/users/profile/" + query);
  //       const data = await res.json();

  //       if (data.error) {
  //         showToast("Error", data.error, "error");
  //         return;
  //       }
  //       setUser(data);
  //     } catch (error) {
  //       showToast("Error", error.message, "error");
  //       setUser(null);
  //     }
  //   };

  //   getUser();
  // }, [postedBy, showToast]);


  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id)); // ✅ remove post from UI
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  // if (!user) return null;
  // console.log("Post received postedBy:", postedBy);
  console.log("Replies for post", post._id, post.replies);
  console.log("Likes for post:", post._id, post.likes);
  console.log("Post component is using this data:", post);

  return (
    <>
       {/* <h1 style={{ color: "red", fontSize: "40px", textAlign: "center" }}>
                THIS IS Post.jsx
            </h1> */}
      <Link to={`/${user.username}/post/${post._id}`}>
        <Flex gap={3} mb={4} py={5}>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar
              size="md"
              name={user.name}
              src={user?.profilePic} // ✅ fixed: show main post owner profile pic
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            />
            <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
            <Box position={"relative"} w={"full"}>
              {post.replies.length === 0 && (
                <Text textAlign={"center"}>🥱</Text>
              )}

              {/* ✅ fixed all reply avatars to use reply.profilePic */}
              {post.likes[0] && (
                <Avatar
                  size="xs"
                  name={post.likes[0].username}
                  src={post.likes[0].profilePic}
                  position={"absolute"}
                  top={"0px"}
                  left="15px"
                  padding={"2px"}
                />
              )}

              {post.likes[1] && (
                <Avatar
                  size="xs"
                  name={post.likes[1].username}
                  src={post.likes[1].profilePic}
                  position={"absolute"}
                  bottom={"0px"}
                  right="-5px"
                  padding={"2px"}
                />
              )}

              {post.likes[2] && (
                <Avatar
                  size="xs"
                  name={post.likes[2].username}
                  src={post.likes[2].profilePic}
                  position={"absolute"}
                  bottom={"0px"}
                  left="4px"
                  padding={"2px"}
                />
              )}
            </Box>
          </Flex>
          <Flex flex={1} flexDirection={"column"} gap={2}>
            <Flex justifyContent={"space-between"} w={"full"}>
              <Flex w={"full"} alignItems={"center"}>
                <Text
                  fontSize={"sm"}
                  fontWeight={"bold"}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${user.username}`);
                  }}
                >
                  {user?.username}
                </Text>
                <Image src="/verified.png" w={4} h={4} ml={1} />
              </Flex>
              <Flex gap={4} alignItems={"center"}>
                <Text
                  fontSize={"xs"}
                  width={36}
                  textAlign={"right"}
                  color={"gray.light"}
                >
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </Text>

                {currentUser?._id === user._id && (
                  <DeleteIcon size={20} onClick={handleDeletePost} />
                )}
              </Flex>
            </Flex>

            <Text fontSize={"sm"}>{post.text}</Text>
            {post.img && (
              <Box
                borderRadius={6}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"gray.light"}
              >
                <Image src={post.img} w={"full"} />
              </Box>
            )}

            <Flex gap={3} my={1}>
              <Actions post={post} />
            </Flex>
            {/* ✅ Replies list */}
            {postId === post._id && (
              <Box mt={2}>
                {sortedReplies.map((reply) => {
                  // <-- Use a curly brace here

                  // This log will now work correctly
                  console.log(
                    "Inside Post.jsx, mapping over replies. The parent 'post' prop is:",
                    post
                  );

                
                    // <-- Add the explicit return statement
                    <Comment
                      key={reply._id}
                      reply={reply}
                      // lastReply={idx === sortedReplies.length - 1}
                      postId={post._id}
                      setPosts={setPosts}
                      showToast={showToast}
                    />
                  
                })}
                {/* <-- Closing curly brace */}
              </Box>
            )}
          </Flex>
        </Flex>
      </Link>
    </>
  );
};

export default Post;
