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
} from '@chakra-ui/core';
import { useEffect, useState } from 'react';
import { User } from '../types';
import UserBio from './UserBio';

function useFetchUser(userUrl: string) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData: User = await (await fetch(userUrl)).json();
        setUser(userData);
        setIsLoading(false);
        setIsError(false);
      } catch (e) {
        console.error(e);
        setUser(null);
        setIsLoading(false);
        setIsError(true);
      }
    }
    fetchUser();
  }, [userUrl, setUser, setIsLoading]);

  return [user, isLoading, isError] as const;
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
} & UseDisclosureProps;

export default function UserModal({
  userUrl,
  isOpen,
  onClose,
}: UserModalProps) {
  const [user, isLoading, isError] = useFetchUser(userUrl);
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
              ) : (
                <UserBio user={user} />
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
