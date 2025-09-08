import Post from "../components/Post";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        console.log("Feed posts:", data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex
      gap={10}
      alignItems="flex-start"
      w="full"
      justify="center"
      mt={4}
      px={4}
    >
      <Box flex={70}>
        {/* Show message if no posts */}
        {!loading && posts.length === 0 && (
          <Text fontSize="lg" textAlign="center" mt={6}>
            Follow someone to see their posts
          </Text>
        )}

        {/* Loading spinner */}
        {loading && (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="xl" />
          </Flex>
        )}

        {/* Posts list */}
        {!loading &&
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
      </Box>
      <Box
				flex={30}
				display={{
					base: "none",
					md: "block",
				}}
			>
				<SuggestedUsers />
			</Box>
    </Flex>
  );
};

export default HomePage;
