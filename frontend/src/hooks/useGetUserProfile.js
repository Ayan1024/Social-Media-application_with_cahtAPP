import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";

const useGetUserProfile = (username) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        console.log("Error fetching user:", error);
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    if (username) getUser();
  }, [username, showToast]);

  return { loading, user };
};

export default useGetUserProfile;
