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
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/core';
import React, { useState, useEffect } from 'react';
import UserSearch from '../components/UserSearch';
import { SearchedUser } from '../types';

function useFetchOctocat() {
  const [user, setUser] = useState<SearchedUser | null>(null);

  // fetch user once
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
  }, [user]);

  return user;
}

function Header() {
  const headerUser = useFetchOctocat();

  return (
    <Flex
      className='header-parent'
      as='header'
      flexDirection='row'
      justifyContent='center'
      alignItems='center'
      p={3}
      bgColor='gray.600'
    >
      <Flex
        className='header-content'
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
        w={1080}
      >
        <Heading color='gray.50'>Hubster</Heading>
        <HStack spacing={4}>
          {headerUser ? (
            <>
              <Avatar name='Some dude' src={headerUser.avatar_url} />
              <Text color='gray.50'>{headerUser.login}</Text>
            </>
          ) : (
            <HStack padding='6' boxShadow='lg' bg='white'>
              <SkeletonCircle size='10' />
              <SkeletonText mt='4' noOfLines={4} spacing='4' />
            </HStack>
          )}
        </HStack>
      </Flex>
    </Flex>
  );
}

export default function Home() {
  return (
    <Container>
      <Heading as='h1' color='gray.600' fontSize={{ base: 25, md: 45 }}>
        Search for GitHub users
      </Heading>
      <UserSearch />
    </Container>
  );
}

type ContainerProps = {
  children: React.ReactNode;
};

function Container({ children }: ContainerProps) {
  return (
    <Box minH='100vh'>
      <Header />
      <Center id='container' p={5} as='main'>
        <VStack spacing={4} width='700px'>
          {children}
        </VStack>
      </Center>
    </Box>
  );
}
