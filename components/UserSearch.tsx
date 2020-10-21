import {
  useToast,
  VStack,
  FormControl,
  Button,
  Spinner,
  Input,
  HStack,
  Text,
  IconButton,
} from '@chakra-ui/core';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { SearchedUser, SearchResults } from '../types';
import UserCard from './UserCard';

export default function UserSearch() {
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
        console.log(searchData);
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

async function fetchSearchResults(searchText: string, currentPage: number) {
  // free tier API only allows 1000 first results from search
  const maxPages = 100;
  const showPerPage = 10;

  const searchUserEndpoint = 'https://api.github.com/search/users?';
  const endpointWithQuery = `${searchUserEndpoint}q=${searchText}+in:login+type:user&page=${currentPage}&per_page=${showPerPage}`;
  const resp = await fetch(endpointWithQuery);
  const searchData = await resp.json();

  return searchData;
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
