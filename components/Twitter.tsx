import { HStack, Link, Image } from '@chakra-ui/core';
import ModalToolTip from './ModalToolTip';

export default function Twitter({ username }: { username: string }) {
  if (!username) return null;
  return (
    <HStack>
      <ModalToolTip text='Twitter'>
        <Image w='15px' h='15px' src='/twitter.svg' />
      </ModalToolTip>
      <Link href={`https://twitter.com/${username}`}>@{username}</Link>
    </HStack>
  );
}
