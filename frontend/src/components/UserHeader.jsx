import { Box, Flex, Link, Text, VStack, Portal, Menu, Avatar } from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";
import { useAppToast } from "./ui/toaster";
import React from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

const UserHeader = () => {
  const { colorMode } = useColorMode();
  const { showToast } = useAppToast();

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast({
        title: "Link copied!",
        description: "Profile URL copied to clipboard.",
        status: "success",
      });
    });
  };

  const sharePROFILE = () => {
    showToast({
      title: "Coming Soon",
      description: "Share feature is under development.",
      status: "info",
    });
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            Mark Zukerberg
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>markZukerbarg</Text>
            <Text
              fontSize={"xs"}
              bg={colorMode === "dark" ? "gray.700" : "gray.600"}
              color={colorMode === "dark" ? "gray.600" : "gray.700"}
              p={1}
              borderRadius={"full"}
            >
              threads.next
            </Text>
          </Flex>
        </Box>

        <Avatar.Root shape="full" size="2xl">
          <Avatar.Fallback name="Random User" />
          <Avatar.Image src="/zuck-avatar.png" />
        </Avatar.Root>
      </Flex>

      <Text>Co-founder, executive chairman and CEO of Meta platform</Text>

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.600"}>3.2k followers</Text>
          <Box w={1} h={1} bg={"gray.600"} borderRadius={"full"}></Box>
          <Link color={"gray.600"}>instagram.com</Link>
        </Flex>

        <Flex gap={3} justifyContent={"center"} alignItems={"center"}>
          <Box className="rounded-full p-2 w-10 h-10 transition-colors duration-300 hover:bg-[#1e1e1e]">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Box
                borderRadius="full"
                p={2}
                w="40px"
                h="40px"
                transition="background-color 0.3s ease-in-out"
                _hover={{ bg: "#1e1e1e" }}
              >
                <CgMoreO size={24} cursor="pointer" />
              </Box>
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item onClick={copyURL} value="copy">
                    Copy Link
                  </Menu.Item>
                  <Menu.Item onClick={sharePROFILE} value="share">
                    Share Profile
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          color={"gray.300"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
