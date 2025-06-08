import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux'
import {store} from "@/redux/store";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import { configureAmplify } from "@/modules/awsConfig";
import { Authenticator } from "@aws-amplify/ui-react";
import { queryClient } from "@/modules/queryClient";
import Head from 'next/head'
import { useState } from "react";
import localFont from 'next/font/local'

import dayjs from "dayjs";
var utc = require("dayjs/plugin/utc");
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
dayjs.extend(utc)

configureAmplify();

const Kameron = localFont({src: '../public/KameronRegular.ttf', variable: '--kameron-font'});
const Koulen = localFont({src: '../public/Koulen-Regular.ttf', variable: '--koulen-font'});

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#875F9A',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function BoxAlc({ Component, pageProps: { session, ...pageProps} }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  
  return (<>
    <Head>
      <title>Boxoal</title>
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="apple-mobile-web-app-title" content="BoxoalIcon" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
    <Authenticator.Provider>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <SessionProvider session={session}>
                <div className={`${Kameron.className} ${Koulen.className}`}>
                  <Component {...pageProps} />
                </div>
            </SessionProvider>
            </Provider>
          <ToastContainer />
        </QueryClientProvider>
      </ThemeProvider>
    </Authenticator.Provider>
    </>);
}

export default BoxAlc;