import {
  Box,
  SkeletonCircle,
  SkeletonText,
  UseDisclosureProps,
  useToast,
  Modal,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  Skeleton,
  Center,
  ModalFooter,
  ModalContent,
  Button,
  Text,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { User } from '../types';
import UserBio from './UserBio';

function useFetchUser(userUrl: string) {
  return useQuery<User, Error>(['users', userUrl], () =>
    fetch(userUrl).then((resp) => resp.json())
  );
}

function ModalLoadingSkeleton() {
  return (
    <Box padding='6' boxShadow='lg' bg='white' w='100%' h='100%'>
      <SkeletonCircle size='10' />
      <SkeletonText mt='4' noOfLines={4} spacing='4' />
    </Box>
  );
}

type UserModalProps = {
  userUrl: string;
  isOpen: boolean;
  onClose: () => void;
} & UseDisclosureProps;

export default function UserModal({
  userUrl,
  isOpen,
  onClose,
}: UserModalProps) {
  const { isLoading, isError, data: user } = useFetchUser(userUrl);
  const toast = useToast();

  if (isError) {
    toast({
      status: 'error',
      description: `Couldn't fetch user 😢`,
      duration: 9000,
      isClosable: true,
    });
    return null;
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <Skeleton isLoaded={!isLoading}>{user?.login}</Skeleton>{' '}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {isLoading ? (
                <Center>
                  <ModalLoadingSkeleton />
                </Center>
              ) : user ? (
                <UserBio user={user} />
              ) : (
                <Text color='red.500'>Could not load user data 😣</Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                bgColor='gray.700'
                mr={3}
                color='gray.50'
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
