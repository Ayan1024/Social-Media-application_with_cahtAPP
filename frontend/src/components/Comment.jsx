import { Avatar, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import Divider from "./ui/divider";

const Comment = ({comment, userAvatar, createdAt, username,likes }) => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar.Root shape="full" size="lg">
          <Avatar.Fallback name="Random User" />
          <Avatar.Image src={userAvatar} />
        </Avatar.Root>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
            <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>{username}</Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"} color={"gray.300"}>{createdAt}</Text>
                    <BsThreeDots/>
                </Flex>
            </Flex>
            <Text>{comment}</Text>
            <Actions liked={liked} setLiked={setLiked} />
            <Text fontSize={"sm"} color={"gray.300"}>
                {likes + (liked ? 1 : 0)} likes
            </Text>
        </Flex>
      </Flex>
      <Divider my={4}/>
    </>
  );
};

export default Comment;
