import { UserPost } from "../components/UserPost";
import UserHeader from "../components/UserHeader";
import React from "react";

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost likes={400} replies={100} postImg="/post1.png" postTitle="Heloo"/>
     {/* <UserPost likes={400} replies={100} postImg="/post1.png" postTitle="Heloo"/> */}
      {/* <UserPost/>
      <UserPost/>  */}
    </>
  );
};

export default UserPage;
