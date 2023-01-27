import type { AppProps } from 'next/app';

import { globalStyles } from '../styles/global';

// TODO: keep this call out off the main func prevent globalstyle load everytime
globalStyles();

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
