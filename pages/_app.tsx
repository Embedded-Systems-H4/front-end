import { ChakraProvider } from "@chakra-ui/react"
import { Layout } from '@partials/Layout/Layout'
import { theme } from '@theme/theme'
import type { AppProps } from 'next/app'
import Head from "next/head"
import './global.css'
import { SessionProvider } from "next-auth/react"
import { Navbar } from "@components/Navbar/Navbar"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <title>Embedded-Systems-H4</title>
      </Head>

      <ChakraProvider theme={theme}>
        <Layout>
          <Navbar />
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </SessionProvider >
  )
}
