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
  Spinner,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UseDisclosureProps,
  Link,
  Image,
  Divider,
  FormControl,
} from '@chakra-ui/core';
import React, { useState, ChangeEvent, useEffect, FormEvent } from 'react';
import { SearchedUser, SearchResults, User } from './types';

function useFetchOctocat() {
  const [user, setUser] = useState<SearchedUser>(null);

  useEffect(() => {
    async function fetchOctocat() {
      if (!user) {
        const octocat: SearchedUser = await (
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
      p={3}
      bgColor='gray.600'
    >
      <Heading color='gray.50'>Hubster</Heading>
      <HStack spacing={4}>
        {headerUser ? (
          <>
            <Avatar name='Some dude' src={headerUser.avatar_url} />
            <Text color='gray.50'>{headerUser.login}</Text>
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
  let [users, setUsers] = useState<SearchedUser[]>([]);
  const searchUserEndpoint = 'https://api.github.com/search/users?';

  function onTextChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchText(e.currentTarget.value);
  }

  async function onSearch(e: FormEvent<HTMLDivElement>) {
    e.preventDefault();
    if (searchText !== '') {
      let endpointWithQuery = `${searchUserEndpoint}q=${searchText}+in:login+type:user&per_page=10`;
      setUsers([]);
      setIsLoading(true);
      let searchData: SearchResults = await (
        await fetch(endpointWithQuery)
      ).json();
      setUsers(searchData.items);
      setIsLoading(false);
    }
  }

  return (
    <VStack spacing={10} minW='100%'>
      <FormControl as='form' id='search' onSubmit={onSearch}>
        <HStack minW='100%'>
          <Input
            name='search'
            type='text'
            placeholder='username...'
            onChange={onTextChange}
          ></Input>
          <Button type='submit' bgColor='gray.600' color='gray.50'>
            Search
          </Button>
        </HStack>
      </FormControl>

      {isLoading ? <Spinner /> : null}
      {users.length > 0 ? <UserResults users={users} /> : null}
    </VStack>
  );
}

type UserResultsProps = {
  users: SearchedUser[];
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

type PublicRepositoryProps = {
  repoCount: number;
};

function PublicRepositories({ repoCount }: PublicRepositoryProps) {
  return (
    <HStack spacing={2}>
      <svg
        style={{ height: 15, width: 15 }}
        fill='none'
        stroke='white'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
        />
      </svg>
      <Text color='gray.50'>{repoCount}</Text>
    </HStack>
  );
}

function UserCard({ user }: { user: SearchedUser }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {isOpen ? (
        <UserModal userUrl={user.url} isOpen={isOpen} onClose={onClose} />
      ) : null}
      <HStack
        bgColor='gray.600'
        minW='100%'
        minH={20}
        pl={5}
        pr={5}
        justifyContent='space-between'
        _hover={{ bgColor: 'gray.700' }}
        as='button'
        onClick={onOpen}
      >
        <HStack>
          <Avatar src={user.avatar_url} name={user.login} key={user.id} />
          <Text color='gray.50'>{user.login}</Text>
        </HStack>
      </HStack>
    </>
  );
}

function useFetchUser(userUrl: string) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      if (!user) {
        const userData: User = await (await fetch(userUrl)).json();
        setUser(userData);
      }
      setIsLoading(false);
    }
    fetchUser();
  }, [user, setUser]);

  console.log(user);

  return [user, isLoading] as const;
}

function UserBio({ user }: { user: User }) {
  return (
    <VStack align='flex-start' spacing={4}>
      <Avatar
        size='2xl'
        name={user.login}
        src={user.avatar_url}
        alignSelf='center'
      />
      <Link href={user.html_url} alignSelf='center'>
        {user.login}
      </Link>
      <Center alignSelf='center'>{user.bio}</Center>

      <Divider />
      <VStack
        align='flex-start'
        border='solid'
        borderColor='gray.200'
        borderWidth={1}
        borderRadius={5}
        p={2}
      >
        <Text>{user.name}</Text>
        <Company name={user.company} />
        <Twitter username={user.twitter_username} />
        <Blog url={user.blog} />
      </VStack>
    </VStack>
  );
}

function Twitter({ username }: { username: string }) {
  if (!username) return null;
  return (
    <HStack>
      <Image w='24px' h='24px' src='/twitter.svg' />;
      <Link href={`https://twitter.com/${username}`}>@{username}</Link>
    </HStack>
  );
}

function Blog({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <HStack>
      <svg
        style={{ height: 15, width: 15 }}
        fill='none'
        stroke='black'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
        />
      </svg>
      <Link>{url}</Link>
    </HStack>
  );
}

function Company({ name }: { name: string | null }) {
  return (
    <HStack spacing={2}>
      <svg
        style={{ height: 15, width: 15 }}
        fill='none'
        stroke='black'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
        />
      </svg>
      <Text color='gray.900'>{!name ? 'Unknown' : name}</Text>
    </HStack>
  );
}

type UserModalProps = {
  userUrl: string;
} & UseDisclosureProps;

function UserModal({ userUrl, isOpen, onClose }: UserModalProps) {
  const [user, isLoading] = useFetchUser(userUrl);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>{user?.login}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {isLoading ? <Spinner /> : <UserBio user={user} />}
            </ModalBody>
            <ModalFooter>
              <Button
                bgColor='gray.700'
                mr={3}
                color='gray.50'
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

export default function Home() {
  return (
    <Box minH='100vh'>
      <Header />
      <Center id='container' p={5}>
        <VStack spacing={4} width='700px'>
          <Heading color='gray.600'>Search for GitHub users</Heading>
          <UserSearch />
        </VStack>
      </Center>
    </Box>
  );
}
