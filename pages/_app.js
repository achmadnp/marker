import { SessionProvider } from "next-auth/react";
import "../styles/index.scss";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            border: "1px solid #713200",
            padding: "16px",
            background: "rgba(163, 163, 163, 0.3)",
          },
        }}
      />
    </SessionProvider>
  );
}

export default MyApp;
