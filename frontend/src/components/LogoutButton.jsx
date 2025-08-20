import { Button } from "@chakra-ui/button";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();

const handleLogout = async () => {
  try {
    console.log("Logout clicked ✅");
    const res = await fetch("/api/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);

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
		<Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout}>
			<FiLogOut size={20} />
		</Button>
	);
};

export default LogoutButton;