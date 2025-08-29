import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

const Comment = ({ reply, lastReply }) => {
	console.log("Reply data:", reply);

	return (
		<>
			<Flex gap={4} py={2} my={2} w={"full"}>
				<Avatar src={reply.userId?.profilePic} size="sm" />
				<Flex gap={1} w={"full"} flexDirection={"column"}>
					<Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
						<Text fontWeight="bold">{reply.userId?.username}</Text>
					</Flex>
					<Text>{reply.text}</Text>
				</Flex>
			</Flex>
			{!lastReply ? <Divider /> : null}
		</>
	);
};

export default Comment;