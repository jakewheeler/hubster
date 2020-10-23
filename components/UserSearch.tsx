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
  IconButtonProps,
} from '@chakra-ui/core';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { SearchedUser, SearchResults } from '../types';
import UserCard from './UserCard';
import { useQuery } from 'react-query';

export default function UserSearch() {
  let [searchText, setSearchText] = useState('');
  let [currentPage, setCurrentPage] = useState(1);
  let toast = useToast();

  const { isError, isLoading, data: users, refetch } = useQuery<
    SearchedUser[],
    Error
  >(
    ['users', searchText, currentPage],
    () =>
      fetchSearchResults(searchText, currentPage).then(
        (results) => results.items
      ),
    {
      enabled: false,
      onError: () => console.log('my error'),
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnMount: false,
    }
  );

  console.log(isError);

  if (isError) {
    toast({
      description: 'Could not fetch user list 😔',
      duration: 9000,
      isClosable: true,
      position: 'bottom',
      status: 'error',
      title: 'Probably rate-limited',
    });
  }

  function onTextChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchText(e.currentTarget.value);
  }

  async function doSearch() {
    if (searchText !== '') {
      await refetch();
    }
  }

  async function onSearch(e: FormEvent<HTMLDivElement>) {
    e.preventDefault();
    setCurrentPage(1);
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
              <BackPageButton
                aria-label='Go back to last page'
                disabled={currentPage <= 1}
                onClick={goBack}
              />

              <NextPageButton
                aria-label='Go forward to next page'
                disabled={currentPage >= 100}
                onClick={goForward}
              />
            </HStack>
          </VStack>
        </>
      ) : null}
    </VStack>
  );
}

async function fetchSearchResults(
  searchText: string,
  currentPage: number
): Promise<SearchResults> {
  // free tier API only allows 1000 first results from search
  const maxPages = 100;
  const showPerPage = 10;

  const searchUserEndpoint = 'https://api.github.com/search/users?';
  const endpointWithQuery = `${searchUserEndpoint}q=${searchText}+in:login+type:user&page=${currentPage}&per_page=${showPerPage}`;
  const resp = await fetch(endpointWithQuery);

  if (!resp.ok) {
    throw new Error('Rate limit has been exceeded.');
  }

  const searchData: SearchResults = await resp.json();

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

function BackPageButton({ ...props }: IconButtonProps) {
  return (
    <IconButton
      bgColor='gray.600'
      color='gray.50'
      icon={<ArrowLeftIcon />}
      {...props}
    />
  );
}

function NextPageButton({ ...props }: IconButtonProps) {
  return (
    <IconButton
      bgColor='gray.600'
      color='gray.50'
      icon={<ArrowRightIcon />}
      {...props}
    />
  );
}
