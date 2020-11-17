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
  List,
  ListItem,
  useBreakpointValue,
} from '@chakra-ui/react';
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
  let displayTopPageNav = useBreakpointValue({ base: true, md: false });
  let toast = useToast();

  const { status, resolvedData: users, latestData } = usePaginatedQuery<
    SearchedUser[],
    Error
  >(
    [`users/${searchText}`, page],
    async (key: string, page: number) => {
      let results = await fetchSearchResults(searchText, page);
      return results.items;
    },
    {
      enabled: enableSearch,
      onError: () => {
        setPage((value) => value - 1);
        toast({
          description:
            'Could not fetch user list 😔 try again in a few seconds',
          duration: 3000,
          status: 'error',
          title: 'Rate-limited',
          isClosable: true,
        });
      },
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

  function doSearch() {
    if (searchText !== '') {
      setEnableSearch(true);
    } else {
      toast({
        description: 'Enter something to search 🤔',
        status: 'warning',
        duration: 3000,
        title: 'Search text is required',
        isClosable: true,
      });
    }
  }

  function onSearch(e: FormEvent<HTMLDivElement>) {
    e.preventDefault();
    setPage(1);
    doSearch();
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
      {status === 'success' && users && enableSearch ? (
        <>
          {displayTopPageNav ? (
            <PageController
              page={page}
              setPage={setPage}
              setEnableSearch={setEnableSearch}
              latestData={latestData}
              totalCount={users.length}
            />
          ) : null}
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
  latestData: SearchedUser[] | undefined;
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
    <List spacing={2} minW='100%'>
      {users.map((user) => (
        <ListItem key={user.id}>
          <UserCard user={user} key={user.id} />
        </ListItem>
      ))}
    </List>
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
