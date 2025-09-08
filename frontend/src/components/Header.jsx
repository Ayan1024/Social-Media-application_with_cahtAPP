import { Flex, Image, Link, Box, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { useColorMode } from "./ui/color-mode";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import Search from "./Search";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);

  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      {user && (
        <Flex
          as="header"
          align="center"
          justify="space-evenly"
          wrap="nowrap"
          gap={{ base: 2, md: 6 }}
          mt={6}
          mb={6}
          px={4}
        >
          {/* Home */}
          <Link as={RouterLink} to="/">
            <AiFillHome size={22} />
          </Link>

          {/* Logo (toggle color mode) */}
          <Image
            cursor="pointer"
            alt="logo"
            w={6}
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
          />

          {/* Profile */}
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={22} />
          </Link>

          {/* Chat */}
          <Link as={RouterLink} to="/chat">
            <BsFillChatQuoteFill size={20} />
          </Link>

          {/* Search toggle */}
          <IconButton
            aria-label="Search"
            icon={showSearch ? <CloseIcon /> : <SearchIcon />}
            size={{ base: "xs", md: "sm" }}
            variant="ghost"
            onClick={() => setShowSearch(!showSearch)}
          />

          {/* Logout */}
          <LogoutButton />
        </Flex>
      )}

      {/* Search box below header */}
      {showSearch && (
        <Box mt={4} w="full">
          <Search />
        </Box>
      )}
    </>
  );
};

export default Header;
