import { ChakraProvider } from "@chakra-ui/react"
import { Layout } from '@partials/Layout/Layout'
import { theme } from '@theme/theme'
import type { AppProps } from 'next/app'
import Head from "next/head"
import './global.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <title>Embedded-Systems-H4</title>
      </Head>

      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </>
  )
}
