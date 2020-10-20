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
  IconButton,
  useToast,
  BoxProps,
  Tooltip,
  TooltipProps,
} from '@chakra-ui/core';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
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

async function fetchSearchResults(searchText: string, currentPage: number) {
  // free tier API only allows 1000 first results from search
  const maxPages = 100;
  const showPerPage = 10;

  const searchUserEndpoint = 'https://api.github.com/search/users?';
  const endpointWithQuery = `${searchUserEndpoint}q=${searchText}+in:login+type:user&page=${currentPage}&per_page=${showPerPage}`;
  const searchData: SearchResults = await (
    await fetch(endpointWithQuery)
  ).json();

  return searchData;
}

function UserSearch() {
  let [isLoading, setIsLoading] = useState(false);
  let [searchText, setSearchText] = useState('');
  let [users, setUsers] = useState<SearchedUser[]>([]);
  let [currentPage, setCurrentPage] = useState(1);
  let toast = useToast();

  function onTextChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchText(e.currentTarget.value);
  }

  useEffect(() => {
    doSearch();
  }, [currentPage]);

  async function doSearch() {
    if (searchText !== '') {
      setUsers([]);
      setIsLoading(true);
      try {
        let searchData: SearchResults = await fetchSearchResults(
          searchText,
          currentPage
        );
        setUsers(searchData.items);
      } catch (e) {
        toast({
          description: 'Could not fetch user list 😔',
          duration: 9000,
          isClosable: true,
          position: 'bottom',
          status: 'error',
          title: 'Probably rate-limited',
        });
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function onSearch(e: FormEvent<HTMLDivElement>) {
    e.preventDefault();
    await doSearch();
  }

  async function goForward() {
    if (currentPage < 100) {
      // we can go forward
      setCurrentPage((current) => current + 1);
      await doSearch();
    }
  }

  async function goBack() {
    if (currentPage > 1) {
      // we can navigate back one page
      setCurrentPage((current) => current - 1);
      await doSearch();
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
      {users?.length > 0 ? (
        <>
          <UserResults users={users} />
          <VStack>
            <Text>{currentPage}</Text>
            <HStack>
              <BackPageButton onClick={goBack} />
              <NextPageButton onClick={goForward} />
            </HStack>
          </VStack>
        </>
      ) : null}
    </VStack>
  );
}

type PageButtonProps = {
  onClick: () => void;
};

function BackPageButton({ onClick }: PageButtonProps) {
  return (
    <IconButton
      aria-label='Go to last page'
      onClick={onClick}
      bgColor='gray.600'
      color='gray.50'
      icon={<ArrowLeftIcon />}
    />
  );
}

function NextPageButton({ onClick }: PageButtonProps) {
  return (
    <IconButton
      aria-label='Go to next page'
      onClick={onClick}
      bgColor='gray.600'
      color='gray.50'
      icon={<ArrowRightIcon />}
    />
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
    <ModalToolTip text={'Public repositories'}>
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
            d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
          />
        </svg>
        <Text>{repoCount}</Text>
      </HStack>
    </ModalToolTip>
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData: User = await (await fetch(userUrl)).json();
        setUser(userData);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [userUrl, setUser, setIsLoading]);

  return [user, isLoading] as const;
}

function UserBio({ userUrl }: { userUrl: string }) {
  const [user, isLoading] = useFetchUser(userUrl);

  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  return (
    <VStack spacing={4}>
      <Avatar
        size='2xl'
        name={user.login}
        src={user.avatar_url}
        alignSelf='center'
      />
      <Link href={user.html_url} alignSelf='center'>
        {user.login}
      </Link>
      <Location city={user.location} alignSelf='center' />
      <Center alignSelf='center'>{user.bio}</Center>

      <Divider />
      <Flex flexDir={{ base: 'column', md: 'row' }}>
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
        <VStack
          align='flex-start'
          border='solid'
          borderColor='gray.200'
          borderWidth={1}
          borderRadius={5}
          p={2}
        >
          <Text>Followers: {user.followers}</Text>
          <Text>Followers: {user.following}</Text>
          <Text>Repositories: {user.public_repos}</Text>
          <Text>Number of gists: {user.public_gists}</Text>
        </VStack>
      </Flex>
    </VStack>
  );
}

type ModalToolTipProps = {
  text: string;
} & TooltipProps;

function ModalToolTip({ text, ...props }: ModalToolTipProps) {
  return (
    <Tooltip
      {...props}
      shouldWrapChildren
      label={text}
      aria-label={text}
      zIndex={1401}
    >
      {props.children}
    </Tooltip>
  );
}

function Twitter({ username }: { username: string }) {
  if (!username) return null;
  return (
    <HStack>
      <ModalToolTip text='Twitter'>
        <Image w='15px' h='15px' src='/twitter.svg' />
      </ModalToolTip>
      <Link href={`https://twitter.com/${username}`}>@{username}</Link>
    </HStack>
  );
}

type LocationProps = {
  city: string;
} & BoxProps;

function Location({ city, ...props }: LocationProps) {
  return (
    <Box {...props}>
      <ModalToolTip text={'Location'}>
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
              d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
            />
          </svg>
          <Text>{city}</Text>
        </HStack>
      </ModalToolTip>
    </Box>
  );
}

function Blog({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <HStack>
      <ModalToolTip text={'Blog'}>
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
      </ModalToolTip>
      <Link>{url}</Link>
    </HStack>
  );
}

function Company({ name }: { name: string | null }) {
  return (
    <Box>
      <HStack spacing={2}>
        <ModalToolTip text={'Company'}>
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
        </ModalToolTip>
        <Text color='gray.900'>{!name ? 'Unknown' : name}</Text>
      </HStack>
    </Box>
  );
}

type UserModalProps = {
  userUrl: string;
} & UseDisclosureProps;

function UserModal({ userUrl, isOpen, onClose }: UserModalProps) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              {userUrl.substr(userUrl.lastIndexOf('/') + 1)}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <UserBio userUrl={userUrl} />
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
