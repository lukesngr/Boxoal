import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react"
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux'
import {store} from "@/redux/store";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import { configureAmplify } from "@/modules/awsConfig";
import { Authenticator } from "@aws-amplify/ui-react";
import { queryClient } from "@/modules/queryClient";
import Head from 'next/head'
import localFont from 'next/font/local'

import dayjs from "dayjs";
var utc = require("dayjs/plugin/utc");
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
dayjs.extend(utc)

configureAmplify();

const Kameron = localFont({src: '../public/KameronRegular.ttf', variable: '--kameron-font'});
const Koulen = localFont({src: '../public/Koulen-Regular.ttf', variable: '--koulen-font'});
const digital = localFont({src: '../public/digital-7.ttf', variable: '--digital-font'});

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
      <meta name="viewport" content="width-device-width,initial-scale=1"></meta>
    </Head>
    <Authenticator.Provider>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <SessionProvider session={session}>
                <div className={`${Kameron.variable} ${Koulen.variable} ${digital.variable}`}>
                  <Component {...pageProps} />
                </div>
            </SessionProvider>
            </Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </Authenticator.Provider>
    </>);
}

export default BoxAlc;