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
  BoxProps,
} from '@chakra-ui/core';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { ChangeEvent, FormEvent, SetStateAction, useState } from 'react';
import { RateLimitResponse, SearchedUser, SearchResults } from '../types';
import UserCard from './UserCard';
import { usePaginatedQuery } from 'react-query';

export default function UserSearch() {
  let [searchText, setSearchText] = useState('');
  let [enableSearch, setEnableSearch] = useState(false);
  let [page, setPage] = useState(1);
  let toast = useToast();

  const { status, resolvedData: users, latestData } = usePaginatedQuery<
    SearchedUser[],
    Error
  >(
    [`users/${searchText}`, page],
    async (key: string, page: number) => {
      // console.log(key, page);
      let results = await fetchSearchResults(searchText, page);
      return results.items;
    },
    {
      enabled: enableSearch,
      onError: () =>
        toast({
          description: 'Could not fetch user list 😔',
          duration: 9000,
          isClosable: true,
          position: 'bottom',
          status: 'error',
          title: 'Probably rate-limited',
        }),
      refetchOnWindowFocus: false,
      retry: 3,
      refetchOnMount: false,
      staleTime: 600000,
    }
  );

  function onTextChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchText(e.currentTarget.value);
    setEnableSearch(false);
    setPage(1);
  }

  async function doSearch() {
    if (searchText !== '') {
      // await refetch();
      setEnableSearch(true);
    }
  }

  async function onSearch(e: FormEvent<HTMLDivElement>) {
    e.preventDefault();
    setPage(1);
    await doSearch();
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

      {status === 'loading' ? <Spinner /> : null}
      {status === 'error' ? (
        <Text color='red.500'>An error has occurred</Text>
      ) : null}
      {status === 'success' && enableSearch ? (
        <>
          <PageController
            page={page}
            setPage={setPage}
            setEnableSearch={setEnableSearch}
            latestData={latestData}
            totalCount={users.length}
            display={{ base: 'block', md: 'none' }}
          />
          <UserResults users={users} />
          <PageController
            page={page}
            setPage={setPage}
            setEnableSearch={setEnableSearch}
            totalCount={users.length}
            latestData={latestData}
          />
        </>
      ) : null}
    </VStack>
  );
}

type PageControllerProps = {
  setEnableSearch: (value: SetStateAction<boolean>) => void;
  setPage: (value: SetStateAction<number>) => void;
  page: number;
  latestData: SearchedUser[];
  totalCount: number;
} & BoxProps;

function PageController({
  setEnableSearch,
  setPage,
  page,
  latestData,
  totalCount,
  ...props
}: PageControllerProps) {
  return (
    <VStack {...props}>
      <Text align='center'>{page}</Text>
      <HStack>
        <BackPageButton
          aria-label='Go back to last page'
          disabled={page === 1}
          onClick={() => {
            setEnableSearch(true);
            setPage((prevState) => Math.max(prevState - 1, 1));
          }}
        />

        <NextPageButton
          aria-label='Go forward to next page'
          disabled={page === 100 || totalCount < 10}
          onClick={() => {
            setEnableSearch(true);
            setPage((prevState) =>
              !latestData ? prevState : Math.min(prevState + 1, 100)
            );
          }}
        />
      </HStack>
    </VStack>
  );
}

async function isSearchRateLimited(): Promise<boolean> {
  const url = 'https://api.github.com/rate_limit';
  try {
    const resp = await fetch(url);
    const data: RateLimitResponse = await resp.json();
    return data.resources.search.remaining <= 0;
  } catch (e) {
    console.error('Could not check rate limit status.');
  }
  return true;
}

class RateLimitedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitedError';
  }
}

async function fetchSearchResults(
  searchText: string,
  currentPage: number
): Promise<SearchResults> {
  // free tier API only allows 1000 first results from search
  const maxPages = 100;
  const showPerPage = 10;

  // check if we're rate limited before doing anything
  const isRateLimited = await isSearchRateLimited();
  if (isRateLimited) {
    throw new RateLimitedError('Rate limited');
  }

  const searchUserEndpoint = 'https://api.github.com/search/users?';
  const endpointWithQuery = `${searchUserEndpoint}q=${searchText}+in:login+type:user&page=${currentPage}&per_page=${showPerPage}`;
  const resp = await fetch(endpointWithQuery);

  if (!resp.ok) {
    throw new Error('Something went wrong.');
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
