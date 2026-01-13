import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '../context/CartContext';
import SEO from '../components/SEO';
import { Toaster } from 'react-hot-toast';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <SEO />
        <Component {...pageProps} />
        <Toaster position="bottom-right" />
      </CartProvider>
    </SessionProvider>
  );
}
