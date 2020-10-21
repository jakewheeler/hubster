import { User } from '../types';
import {
  VStack,
  Avatar,
  Link,
  Text,
  Divider,
  Flex,
  Center,
} from '@chakra-ui/core';
import Company from './Company';
import Blog from './Blog';
import Location from './Location';
import Twitter from './Twitter';

export default function UserBio({ user }: { user: User }) {
  return (
    <VStack spacing={4} borderColor='gray.600' borderWidth={1} borderRadius={5}>
      <Avatar
        size='2xl'
        name={user.login}
        src={user.avatar_url}
        alignSelf='center'
        mt={2}
      />
      <Link href={user.html_url} alignSelf='center'>
        {user.login}
      </Link>
      <Location city={user.location} alignSelf='center' />
      <Center alignSelf='center' p={5}>
        {user.bio}
      </Center>

      <Divider />
      <Flex flexDir={{ base: 'column', md: 'row' }} flexWrap='wrap'>
        <VStack align='flex-start' p={5}>
          <Text>{user.name}</Text>
          <Company name={user.company} />
          <Twitter username={user.twitter_username} />
          <Blog url={user.blog} />
        </VStack>
        <VStack align='flex-start' p={5}>
          <Text>Followers: {user.followers}</Text>
          <Text>Following: {user.following}</Text>
          <Text>Repositories: {user.public_repos}</Text>
          <Text>Number of gists: {user.public_gists}</Text>
        </VStack>
      </Flex>
    </VStack>
  );
}
