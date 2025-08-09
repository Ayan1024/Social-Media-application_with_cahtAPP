import Actions from "../components/Actions";
import { Avatar, Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import Divider  from "../components/ui/divider";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Comment from "../components/Comment";

const PostPage = ({ postImg, postTitle, likes , replies  }) => {
  const [liked, setLiked] = useState(false);

  // Total likes including this session's "liked" state
  const totalLikes = Number(likes) + (liked ? 1 : 0);
  const totalReplies = Number(replies);

  return (
    <>
      {/* User Info */}
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Flex alignItems={"center"} gap={3}>
          <Avatar.Root shape="full" size="lg">
            <Avatar.Fallback name="Random User" />
            <Avatar.Image src="/zuck-avatar.png" />
          </Avatar.Root>
          <Flex alignItems="center">
            <Text fontSize={"sm"} fontWeight={"bold"}>
              markzuckerberg
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={2} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.300"}>1d</Text>
          <BsThreeDots />
        </Flex>
      </Flex>

      {/* Post Title */}
      <Text my={3}>{postTitle}</Text>

      {/* Post Image */}
      <Box borderRadius={6} overflow="hidden" border="1px solid" borderColor="gray.300">
        <Image src={postImg || "/post1.png"} w={"full"} />
      </Box>

      {/* Actions */}
      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.300"} fontSize={"sm"}>
          238 replies
        </Text>
        <Text color={"gray.300"} fontSize={"sm"}>
          {200 + (liked ? 1 : 0 )} likes
        </Text>

      </Flex>
      <Divider my={4} thickness={"1px"} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.600"}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>
          Get
        </Button>
      </Flex>
       <Divider my={4} thickness={"1px"} />
       <Comment 
       comment="wow, nicee"
createdAt='2d'
likes={4}       
username="ayan100"
userAvatar="/anime.jpg"
       />
       <Comment />
       <Comment />
       <Comment />
       <Comment />
    </>
  );
};

export default PostPage;
