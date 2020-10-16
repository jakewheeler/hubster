import Head from 'next/head';
import {
  Avatar,
  Box,
  Heading,
  HStack,
  Flex,
  Text,
  Center,
  Input,
  VStack,
  Button,
  BoxProps,
  Spinner,
} from '@chakra-ui/core';
import { useState, ChangeEvent, useEffect } from 'react';
import { GitHubUser, SearchResults } from './types';

function useFetchOctocat() {
  const [user, setUser] = useState<GitHubUser>(null);

  useEffect(() => {
    async function fetchOctocat() {
      if (!user) {
        const octocat: GitHubUser = await (
          await fetch('https://api.github.com/users/octocat')
        ).json();
        setUser(octocat);
      }
    }
    fetchOctocat();
  }, [user, setUser]);

  return user;
}

function Header() {
  const headerUser = useFetchOctocat();

  return (
    <Flex
      flexDirection='row'
      justifyContent='space-between'
      alignItems='center'
      pl='5em'
      pr='5em'
      bgColor='gray.600'
      minH='5vh'
    >
      <Heading color='gray.300'>Hubster</Heading>
      <HStack spacing={4}>
        {headerUser ? (
          <>
            <Avatar name='Some dude' src={headerUser.avatar_url} />
            <Text color='gray.300'>{headerUser.login}</Text>
          </>
        ) : (
          <Spinner />
        )}
      </HStack>
    </Flex>
  );
}

function UserSearch() {
  let [isLoading, setIsLoading] = useState(false);
  let [searchText, setSearchText] = useState('');
  let [users, setUsers] = useState<GitHubUser[]>([]);
  const searchUserEndpoint = 'https://api.github.com/search/users?';

  function onTextChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchText(e.currentTarget.value);
  }

  async function onSearch() {
    if (searchText !== '') {
      let endpointWithQuery = `${searchUserEndpoint}q=${searchText}+in:login+type:user&per_page=20`;
      setUsers([]);
      setIsLoading(true);
      let searchData: SearchResults = await (
        await fetch(endpointWithQuery)
      ).json();
      setUsers(searchData.items);
      setIsLoading(false);
    }
  }

  console.log(users);

  return (
    <VStack spacing={10} minW='100%'>
      <HStack minW='100%'>
        <Input placeholder='username...' onChange={onTextChange}></Input>
        <Button onClick={onSearch}>Search</Button>
      </HStack>
      {isLoading ? <Spinner /> : null}
      {users.length > 0 ? <UserResults users={users} /> : null}
    </VStack>
  );
}

type UserResultsProps = {
  users: GitHubUser[];
};

function UserResults({ users }: UserResultsProps) {
  return (
    <VStack spacing={4} minW='100%'>
      {users.map((user) => (
        <UserCard user={user} key={user.id} />
      ))}
    </VStack>
  );
}

type UserStarsProps = {
  starCount: number;
};

function UserStars({ starCount }: UserStarsProps) {
  return (
    <HStack spacing={2}>
      <svg
        style={{ height: 10, width: 10 }}
        fill='solid'
        stroke='black'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
        />
      </svg>
      <Text>{starCount}</Text>
    </HStack>
  );
}

function UserCard({ user }: { user: GitHubUser }) {
  return (
    <HStack
      bgColor='gray.400'
      minW='100%'
      minH={20}
      pl={5}
      pr={5}
      justifyContent='space-between'
      _hover={{ bgColor: 'gray.500' }}
    >
      <HStack>
        <Avatar src={user.avatar_url} name={user.login} key={user.id} />
        <Text color='gray.50'>{user.login}</Text>
      </HStack>

      <UserStars starCount={5} />
    </HStack>
  );
}

export default function Home() {
  return (
    <Box minH='100vh' minW='100vh'>
      <Header />
      <Center id='container' pt='5vh'>
        <VStack spacing={4} width='700px'>
          <Heading color='gray.600'>Search for GitHub users</Heading>
          <UserSearch />
        </VStack>
      </Center>
    </Box>
  );
}
