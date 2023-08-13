import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react"

function BoxAlc({ Component, pageProps: { session, ...pageProps} }) {
  return (
    <SessionProvider session={session}>
        <Component {...pageProps} />
    </SessionProvider>
  );
}

export default BoxAlc;