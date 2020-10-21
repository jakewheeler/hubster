import { BoxProps, HStack, Box, Text } from '@chakra-ui/core';
import ModalToolTip from './ModalToolTip';

type LocationProps = {
  city: string | null;
} & BoxProps;

export default function Location({ city, ...props }: LocationProps) {
  if (!city) return null;

  return (
    <Box {...props}>
      <ModalToolTip text={'Location'}>
        <HStack>
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
              d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
            />
          </svg>
          <Text>{city}</Text>
        </HStack>
      </ModalToolTip>
    </Box>
  );
}
