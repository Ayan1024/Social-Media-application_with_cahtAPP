import UserHeader from "../components/UserHeader";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const { username } = useParams();   // ✅ get username from URL
  const { user, loading } = useGetUserProfile(username); // ✅ pass it here
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
   
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    if (username) getPosts();
  }, [username, showToast, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user) return <h1>User not found</h1>;
 console.log("username param from useParams:", username, typeof username);


  return (
    <>
      <UserHeader user={user} />

      {!fetchingPosts && posts.length === 0 && (
        <h1>User has no post to show</h1>
      )}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => (
        // <Post key={post._id} post={post} postedBy={post.postedBy.username} />

        <Post key={post._id} post={post} />
      ))}
    </>
  );
};

export default UserPage;
