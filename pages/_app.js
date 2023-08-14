import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react"
import {QueryClient, QueryClientProvider} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

function BoxAlc({ Component, pageProps: { session, ...pageProps} }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
          <Component {...pageProps} />
      </SessionProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default BoxAlc;