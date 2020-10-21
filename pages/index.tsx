import {
  Avatar,
  Box,
  Heading,
  HStack,
  Flex,
  Text,
  Center,
  VStack,
  Spinner,
} from '@chakra-ui/core';
import React, { useState, useEffect } from 'react';
import UserSearch from '../components/UserSearch';
import { SearchedUser } from '../types';

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
