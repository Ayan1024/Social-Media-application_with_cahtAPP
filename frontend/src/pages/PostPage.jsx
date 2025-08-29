import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
	// ❌ removed: const { user, loading } = useGetUserProfile();  // ✅ not needed here
	const [posts, setPosts] = useRecoilState(postsAtom);
	const showToast = useShowToast();
	const { pid } = useParams();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();

	const currentPost = posts[0]; // ✅ will hold the single post

	useEffect(() => {
		const getPost = async () => {
			setPosts([]);
			try {
				const res = await fetch(`/api/posts/${pid}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts([data]); // ✅ store single post in atom
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};
		getPost();
	}, [showToast, pid, setPosts]);

	const handleDeletePost = async () => {
		try {
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${currentPost._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			navigate(`/${currentPost.postedBy.username}`); // ✅ redirect to post owner profile
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	// ✅ show spinner while fetching
	if (!currentPost) {
		return (
			<Flex justifyContent={"center"} my={20}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	const postUser = currentPost.postedBy; // ✅ use postedBy object from post

	return (
		<>
			<Flex>
				<Flex w={"full"} alignItems={"center"} gap={3}>
					<Avatar src={postUser.profilePic} size={"md"} name={postUser.username} /> {/* ✅ changed user → postUser */}
					<Flex>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{postUser.username} {/* ✅ changed user.username → postUser.username */}
						</Text>
						<Image src='/verified.png' w='4' h={4} ml={4} />
					</Flex>
				</Flex>
				<Flex gap={4} alignItems={"center"}>
					<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
						{formatDistanceToNow(new Date(currentPost.createdAt))} ago
					</Text>

					{currentUser?._id === postUser._id && ( // ✅ changed user._id → postUser._id
						<DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
					)}
				</Flex>
			</Flex>

			<Text my={3}>{currentPost.text}</Text>

			{currentPost.img && (
				<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
					<Image src={currentPost.img} w={"full"} />
				</Box>
			)}

			<Flex gap={3} my={3}>
				<Actions post={currentPost} />
			</Flex>

			<Divider my={4} />

			<Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"gray.light"}>Get the app to like, reply and post.</Text>
				</Flex>
				<Button>Get</Button>
			</Flex>

			<Divider my={4} />
			{currentPost.replies.map((reply) => (
				<Comment
					key={reply._id}
					reply={reply}
					lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
				/>
			))}
		</>
	);
};

export default PostPage;
