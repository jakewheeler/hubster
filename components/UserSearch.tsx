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
import { SearchedUser } from '../types';
import UserCard from './UserCard';
import { usePaginatedQuery } from 'react-query';
import { fetchSearchResults } from '../api';

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
          description:
            'Could not fetch user list 😔 try again in a few seconds',
          duration: 9000,
          status: 'error',
          title: 'Probably rate-limited',
        }),
      refetchOnWindowFocus: false,
      retry: false,
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
    } else {
      toast({
        description: 'Enter something to search 🤔',
        status: 'info',
        duration: 3000,
        title: 'Search text is required',
      });
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

      {status === 'loading' ? (
        <Spinner />
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
