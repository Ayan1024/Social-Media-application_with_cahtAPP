import userAtom from "../atoms/userAtom";
import {
  Box,
  Flex,
  Link,
  Text,
  VStack,
  Avatar,
  useColorMode,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom";

const UserHeader = ({ user }) => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom); // the logged-in user

  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [followersCount, setFollowersCount] = useState(user.followers.length);

  const [updating, setUpdating] = useState(false);

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please login to follow",
        status: "error",
      });
      return;
    }
    if (updating) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
      });

      const data = await res.json();
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          status: "error",
        });
        return;
      }

      if (following) {
        toast({
          title: "Unfollowed",
          description: `You unfollowed ${user.name}`,
          status: "success",
        });
        setFollowersCount((prev) => prev - 1);
      } else {
        toast({
          title: "Followed",
          description: `You followed ${user.name}`,
          status: "success",
        });
        setFollowersCount((prev) => prev + 1);
      }

      setFollowing(!following);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Link copied!",
        description: "Profile URL copied to clipboard.",
        status: "success",
      });
    });
  };

  const sharePROFILE = () => {
    toast({
      title: "Coming Soon",
      description: "Share feature is under development.",
      status: "info",
    });
  };

  return (
    <VStack gap={4} alignItems={"start"} w="full" p={2}>
      <Flex justifyContent={"space-between"} w={"full"} alignItems="center">
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.name || "No Name"}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>@{user?.username || "unknown"}</Text>
            <Text
              fontSize={"xs"}
              bg={colorMode === "dark" ? "gray.700" : "gray.200"}
              color={colorMode === "dark" ? "gray.200" : "gray.700"}
              px={2}
              py={0.5}
              borderRadius={"full"}
            >
              threads.next
            </Text>
          </Flex>
        </Box>

        <Avatar
          size="2xl"
          name={user?.name || user?.username || "User"}
          src={user?.profilePic || ""}
        />
      </Flex>

      {user?.bio && <Text>{user.bio}</Text>}

     	{currentUser?._id === user._id && (
				<Link as={RouterLink} to='/update'>
					<Button size={"sm"}>Update Profile</Button>
				</Link>
			)}
			{currentUser?._id !== user._id && (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}

      <Flex w={"full"} justifyContent={"space-between"} alignItems="center">
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.600"}>{followersCount} followers</Text>
          <Box w={1} h={1} bg={"gray.600"} borderRadius={"full"}></Box>
          <Link color={"gray.600"} href="https://instagram.com" isExternal>
            instagram.com
          </Link>
        </Flex>

        <Flex gap={3} alignItems={"center"}>
          <Box className="rounded-full p-2 w-10 h-10 transition-colors duration-300 hover:bg-[#1e1e1e]">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>

          <Menu>
            <MenuButton
              as={Box}
              borderRadius="full"
              p={2}
              w="40px"
              h="40px"
              transition="background-color 0.3s ease-in-out"
              _hover={{ bg: colorMode === "dark" ? "gray.900" : "gray.200" }}
            >
              <CgMoreO size={24} cursor="pointer" />
            </MenuButton>
            <Portal>
              <MenuList>
                <MenuItem onClick={copyURL}>Copy Link</MenuItem>
                <MenuItem onClick={sharePROFILE}>Share Profile</MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
