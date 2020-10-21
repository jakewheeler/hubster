import { useDisclosure, HStack, Avatar, Text } from '@chakra-ui/core';
import { SearchedUser } from '../types';
import UserModal from './Modal';
export default function UserCard({ user }: { user: SearchedUser }) {
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
