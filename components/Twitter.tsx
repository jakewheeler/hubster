import { HStack, Link, Image } from '@chakra-ui/react';
import ModalToolTip from './ModalToolTip';

export default function Twitter({ username }: { username: string }) {
  if (!username) return null;
  return (
    <HStack>
      <ModalToolTip text='Twitter'>
        <Image w='15px' h='15px' src='/twitter.svg' />
      </ModalToolTip>
      <Link href={`https://twitter.com/${username}`} isExternal target='_blank'>
        @{username}
      </Link>
    </HStack>
  );
}
