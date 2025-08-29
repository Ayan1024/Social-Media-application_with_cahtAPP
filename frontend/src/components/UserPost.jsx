import { Avatar, Box, Flex, Text, Image } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";

export const UserPost = ({ postImg, postTitle, likes, replies }) => {
  const [liked, setLiked] = useState(false);

  return (
    <Link to={"/markzuckerberg/post/1"}>
      <Flex gap={3} mb={4} py={5}>
        {/* Left section: Avatar + line + triangle avatars */}
        <Flex flexDirection={"column"} alignItems={"center"} minW="60px">
          {/* Top Avatar */}
          <Avatar size="lg" name="Random User" src="/zuck-avatar.png" />

          {/* Vertical line */}
          <Box
            w="2px"
            bg="gray.300"
            flexGrow={1}
            my={1}
            position="relative"
            _after={{
              content: '""',
              position: "absolute",
              top: 0,
              bottom: "-45px", // makes the line longer than post
              left: "0",
              width: "2px",
              bg: "gray.300",
            }}
          />

          {/* Triangle Avatars */}
          <Box position="relative" w="50px" h="32px" mt={2} mb={"-20px"}>
            {/* Bottom center avatar */}
            <Avatar
              size="xs"
              name="User 1"
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04"
              position="absolute"
              bottom="0"
              left="50%"
              transform="translateX(-50%)"
            />

            {/* Top left avatar */}
            <Avatar
              size="xs"
              name="User 2"
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04"
              position="absolute"
              top="0"
              left="8px"
            />

            {/* Top right avatar */}
            <Avatar
              size="xs"
              name="User 3"
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04"
              position="absolute"
              top="0"
              right="8px"
            />
          </Box>
        </Flex>

        {/* Right section: Post Content */}
        <Flex flex={1} flexDirection={"column"} gap={2}>
          {/* Top: Username + verified + 1d + dots */}
          <Flex justify="space-between" align="center" w="full">
            {/* Username + verified */}
            <Flex align="center">
              <Text fontSize="sm" fontWeight="bold">
                markzuckerberg
              </Text>
              <Image src="/verified.png" w="16px" h="16px" ml={1} />
            </Flex>

            {/* Time + 3 dots */}
            <Flex alignItems="center" gap={2}>
              <Text fontSize="sm" color="gray.500">
                1d
              </Text>
              <Box fontSize="18px" color="gray.600" cursor="pointer">
                <BsThreeDots />
              </Box>
            </Flex>
          </Flex>

          {/* Post content */}
          <Text fontSize="sm">{postTitle}</Text>

          {postImg && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.500"}
            >
              <Image src={postImg} w={"full"} />
            </Box>
          )}

          {/* Actions (Like, Reply etc.) */}
          <Flex gap={3} my={1}>
            <Actions
              liked={liked}
              setLiked={setLiked}
              likes={likes}
              replies={replies}
            />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};
