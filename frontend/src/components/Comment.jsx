import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import { Avatar, Divider, Flex, Text, Image } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useRecoilValue } from "recoil";
import useShowToast from "../hooks/useShowToast";

// 1. Accept the new props: postId, setPosts, and showToast
const Comment = ({ reply, lastReply, postId, setPosts }) => {
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const replyOwnerId =
    reply.userId?._id?.toString?.() || reply.userId?.toString?.();

  let timeAgo = "";
  if (reply?.createdAt) {
    try {
      timeAgo = formatDistanceToNow(new Date(reply.createdAt)) + " ago";
    } catch (err) {
      console.warn("Invalid createdAt for reply:", reply, err);
      timeAgo = "";
    }
  }

  // This function will now work correctly
  const handleDeleteReply = async (e) => {
      console.log("Delete button clicked. The postId is:", postId);
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this reply?"))
        return;

      const res = await fetch(`/api/posts/${postId}/reply/${reply._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Reply deleted", "success");

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              replies: post.replies.filter((r) => r._id !== reply._id),
            };
          }
          return post;
        })
      );
    } catch (error) {
      showToast("Error", error.message, "error");
      console.log("error in the handledeletereply function", error)
    }
  };

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"} alignItems={"flex-start"}>
        <Avatar src={reply.userId?.profilePic} size="sm" />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Flex alignItems="center">
              <Text fontWeight="bold">{reply.userId?.username}</Text>
              <Image src="/verified.png" w={3} h={3} ml={1} />
            </Flex>
            {timeAgo && (
              <Text fontSize="xs" color="gray.light">
                {timeAgo}
              </Text>
            )}
          </Flex>

          <Flex justifyContent="space-between" w="full">
            <Text>{reply.text}</Text>
            {/* 2. Fix visibility check: compare with reply's user ID */}
           {currentUser?._id === replyOwnerId && (
              <DeleteIcon
                cursor="pointer"
                _hover={{ color: "red.500" }}
                // 3. Fix onClick handler
                onClick={handleDeleteReply}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
      {!lastReply ? <Divider /> : null}
    </>
  );
};

export default Comment;
