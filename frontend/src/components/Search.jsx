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
				if (data.error) {
					// Handle error if needed
					return;
				}
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
		<Box position="relative">
			<InputGroup>
				<InputLeftElement pointerEvents="none">
					<SearchIcon color="gray.300" />
				</InputLeftElement>
				<Input
					type="text"
					placeholder="Search for a user..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				{search && (
					<InputRightElement>
						<CloseIcon
							cursor="pointer"
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
					p={2}
				>
					{loading && (
						<Flex justifyContent="center" p={2}>
							<Spinner />
						</Flex>
					)}
					{!loading && users.length === 0 && <Text p={2}>No user found</Text>}
					{!loading && users.length > 0 && (
						<VStack align="stretch">
							{users.map((user) => (
								<Link
									as={RouterLink}
									to={`/${user.username}`}
									key={user._id}
									_hover={{ bg: "gray.700", textDecoration: "none" }}
									p={2}
									borderRadius="md"
									// ✅ Add this onClick handler to clear the search on navigation
									onClick={() => {
										setSearch("");
										setUsers([]);
									}}
								>
									<Flex align="center" gap={3}>
										<Avatar size="sm" src={user.profilePic} />
										<Box>
											<Text fontWeight="bold">{user.username}</Text>
											<Text fontSize="sm" color="gray.light">
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