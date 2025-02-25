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
import { useState } from "react";
import dayjs from "dayjs";
var utc = require("dayjs/plugin/utc");
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
dayjs.extend(utc)

configureAmplify();

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#c5c27c',
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
  
  return (
    <Authenticator.Provider>
    <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
      <SessionProvider session={session}>
          <Component {...pageProps} />
      </SessionProvider>
      </Provider>
      <ReactQueryDevtools />
      <ToastContainer />
    </QueryClientProvider>
    </ThemeProvider>
    </Authenticator.Provider>
  );
}

export default BoxAlc;