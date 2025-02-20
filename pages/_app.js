import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux'
import store from "@/redux/store";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import { configureAmplify } from "@/modules/awsConfig";

export const queryClient = new QueryClient();
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
  );
}

export default BoxAlc;