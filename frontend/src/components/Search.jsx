import { useState, useEffect } from "react";
import {
	Box,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Spinner,
	Flex,
	Text,
	Avatar,
	VStack,
	Link,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import useDebounce from "../hooks/useDebounce";
import { Link as RouterLink } from "react-router-dom";

const Search = () => {
	const [search, setSearch] = useState("");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const debouncedSearch = useDebounce(search, 300);

	useEffect(() => {
		const getUsers = async () => {
			if (!debouncedSearch) {
				setUsers([]);
				return;
			}
			setLoading(true);
			try {
				const res = await fetch(`/api/users/search/${debouncedSearch}`);
				const data = await res.json();
				if (data.error) return;
				setUsers(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		getUsers();
	}, [debouncedSearch]);

	return (
		<Box position="relative" w={"full"}>
			<InputGroup>
				<InputLeftElement pointerEvents="none">
					<SearchIcon color="gray.300" />
				</InputLeftElement>
				<Input
					type="text"
					placeholder="Search for a user..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					fontSize={{ base: "sm", md: "md" }}
					pr={search ? "2rem" : "0.5rem"}
				/>
				{search && (
					<InputRightElement>
						<CloseIcon
							cursor="pointer"
							boxSize={3}
							onClick={() => {
								setSearch("");
								setUsers([]);
							}}
						/>
					</InputRightElement>
				)}
			</InputGroup>

			{/* Suggestions Box */}
			{debouncedSearch && (
				<Box
					position="absolute"
					top="100%"
					left={0}
					right={0}
					bg="gray.dark"
					mt={2}
					borderRadius="md"
					boxShadow="lg"
					zIndex={10}
					maxH="300px" // ✅ scroll if too many results
					overflowY="auto"
				>
					{loading && (
						<Flex justifyContent="center" p={2}>
							<Spinner />
						</Flex>
					)}
					{!loading && users.length === 0 && (
						<Text p={2} fontSize={{ base: "sm", md: "md" }}>
							No user found
						</Text>
					)}
					{!loading && users.length > 0 && (
						<VStack align="stretch" spacing={1}>
							{users.map((user) => (
								<Link
									as={RouterLink}
									to={`/${user.username}`}
									key={user._id}
									  bg="gray.800" // ✅ solid background
									_hover={{ bg: "gray.700", textDecoration: "none" }}
									p={{ base: 2, md: 3 }}
									borderRadius="md"
									onClick={() => {
										setSearch("");
										setUsers([]);
									}}
								>
									<Flex align="center" gap={3}>
										<Avatar size={{ base: "xs", md: "sm" }} src={user.profilePic} />
										<Box>
											<Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
												{user.username}
											</Text>
											<Text fontSize={{ base: "xs", md: "sm" }} color="gray.light">
												{user.name}
											</Text>
										</Box>
									</Flex>
								</Link>
							))}
						</VStack>
					)}
				</Box>
			)}
		</Box>
	);
};

export default Search;
