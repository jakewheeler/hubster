import {
  Avatar,
  Box,
  Heading,
  HStack,
  Flex,
  Text,
  Center,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import UserSearch from '../components/UserSearch';
import { SearchedUser } from '../types';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('https://api.github.com/users/octocat');
  const octocat: SearchedUser = await res.json();
  return {
    props: {
      octocat,
    },
  };
};

type HomeProps = {
  octocat: SearchedUser;
};

export default function Home({ octocat }: HomeProps) {
  return (
    <Container headerUser={octocat}>
      <Heading as='h1' color='gray.600' fontSize={{ base: 25, md: 45 }}>
        Search for GitHub users
      </Heading>
      <UserSearch />
    </Container>
  );
}

type HeaderProps = {
  headerUser: SearchedUser;
};

function Header({ headerUser }: HeaderProps) {
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
          <Avatar name='Some dude' src={headerUser.avatar_url} />
          <Text color='gray.50'>{headerUser.login}</Text>
        </HStack>
      </Flex>
    </Flex>
  );
}

type ContainerProps = {
  headerUser: SearchedUser;
  children: React.ReactNode;
};

function Container({ headerUser, children }: ContainerProps) {
  return (
    <Box minH='100vh'>
      <Header headerUser={headerUser} />
      <Center id='container' p={5} as='main'>
        <VStack spacing={4} width='700px'>
          {children}
        </VStack>
      </Center>
    </Box>
  );
}
