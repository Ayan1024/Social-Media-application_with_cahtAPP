import {
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { useEffect, useState, useCallback } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

const SuggestedUsers = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const showToast = useShowToast();

  const getSuggestedUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/suggested");
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setSuggestedUsers(data);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    getSuggestedUsers();
  }, [getSuggestedUsers]);

  return (
    <>
      {/* Header with Refresh Icon */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontWeight="bold">Suggested Users</Text>
        <IconButton
          aria-label="Refresh suggestions"
          icon={<RepeatIcon />}
          size="sm"
          variant="ghost"
          onClick={getSuggestedUsers}
          isLoading={loading}
        />
      </Flex>

      {/* User list */}
      <Flex direction="column" gap={4}>
        {!loading &&
          suggestedUsers.map((user) => (
            <SuggestedUser key={user._id} user={user} />
          ))}

        {loading &&
          [0, 1, 2, 3, 4].map((_, idx) => (
            <Flex
              key={idx}
              gap={2}
              alignItems="center"
              p="1"
              borderRadius="md"
            >
              {/* avatar skeleton */}
              <Box>
                <SkeletonCircle size="10" />
              </Box>
              {/* username and fullname skeleton */}
              <Flex w="full" flexDirection="column" gap={2}>
                <Skeleton h="8px" w="80px" />
                <Skeleton h="8px" w="90px" />
              </Flex>
              {/* follow button skeleton */}
              <Flex>
                <Skeleton h="20px" w="60px" />
              </Flex>
            </Flex>
          ))}
      </Flex>
    </>
  );
};

export default SuggestedUsers;
