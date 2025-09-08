import { IconButton } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("Error", data.error || "Logout failed", "error");
        return;
      }

      showToast("Success", data.message || "Logged out", "success");
      localStorage.removeItem("user-threads");
      setUser(null);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <IconButton
      aria-label="Logout"
      icon={<FiLogOut size={20} />}
      size={{ base: "xs", md: "sm" }}
      variant="ghost"
      onClick={handleLogout}
    />
  );
};

export default LogoutButton;
