import { ChakraProvider } from '@chakra-ui/core';
import { theme, Theme } from '@chakra-ui/theme';
import { merge } from '@chakra-ui/utils';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
