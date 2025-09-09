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
import React, { useState, useEffect } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom";

const UserHeader = ({ user }) => {
	const { colorMode } = useColorMode();
	const toast = useToast();
	const currentUser = useRecoilValue(userAtom);

	const [following, setFollowing] = useState(false);
	const [followersCount, setFollowersCount] = useState(0);
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		if (!user) return;
		const followersArr = Array.isArray(user.followers) ? user.followers.map((f) => String(f)) : [];
		setFollowersCount(followersArr.length);
		setFollowing(currentUser ? followersArr.includes(String(currentUser._id)) : false);
	}, [user, currentUser]);

	const handleFollowUnfollow = async () => {
		if (!currentUser) {
			toast({
				title: "Error",
				description: "Please login to follow",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}
		if (updating) return;
		setUpdating(true);
		try {
			const res = await fetch(`/api/users/follow/${user._id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();
			if (!res.ok) {
				toast({
					title: "Error",
					description: data.error || data.message || "Failed to update follow status",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
				return;
			}
			const successMsg = data.message || data.success || "Follow status updated";
			if (following) {
				setFollowersCount((prev) => Math.max(0, prev - 1));
			} else {
				setFollowersCount((prev) => prev + 1);
			}
			setFollowing((prev) => !prev);
			toast({
				title: "Success",
				description: successMsg,
				status: "success",
				duration: 2500,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: error.message || "Network error",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setUpdating(false);
		}
	};

	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Success",
				description: "Profile URL copied.",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		});
	};

	if (!user) return null;

	return (
		<VStack gap={4} alignItems={"start"}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						{user.name}
					</Text>
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"}>@{user.username}</Text>
						<Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"md"}>
							threads.next
						</Text>
					</Flex>
				</Box>
				<Box>
					<Avatar name={user.name} src={user.profilePic} size={"xl"} />
				</Box>
			</Flex>

			<Text>{user.bio}</Text>

			{/* ✅ This block now contains both buttons */}
			{currentUser?._id === user._id && (
				<Flex gap={2}>
					<Link as={RouterLink} to="/update">
						<Button size={"sm"}>Update Profile</Button>
					</Link>
					<Link as={RouterLink} to="/freeze">
						<Button colorScheme="red" size={"sm"}>
							Freeze Account
						</Button>
					</Link>
				</Flex>
			)}

			{currentUser?._id !== user._id && (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}

			<Flex w={"full"} justifyContent={"space-between"}>
				<Text color={"gray.light"}>{followersCount} followers</Text>
				<Flex>
					<Box className="icon-container" mr={3}>
						<BsInstagram size={24} cursor={"pointer"} />
					</Box>
					<Box className="icon-container">
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.dark"} h={"auto"} p={1}>
									<MenuItem bg={"gray.dark"} color={"white"} onClick={copyURL}>
										Copy link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>

			<Flex w={"full"}>
				<Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
					<Text fontWeight={"bold"}> Threads</Text>
				</Flex>
				<Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={"gray.light"} pb="3" cursor={"pointer"}>
					<Text fontWeight={"bold"}> Replies</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;