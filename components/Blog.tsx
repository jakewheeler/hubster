import ModalToolTip from './ModalToolTip';
import { Link, HStack } from '@chakra-ui/core';

export default function Blog({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <HStack>
      <ModalToolTip text='Blog'>
        <svg
          style={{ height: 15, width: 15 }}
          fill='none'
          stroke='black'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
          />
        </svg>
      </ModalToolTip>
      <Link href={url} isExternal target='_blank'>
        {url}
      </Link>
    </HStack>
  );
}
