import { SessionProvider } from "next-auth/react";
import "../styles/index.scss";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";

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
            background: "white",
          },
        }}
      />
    </SessionProvider>
  );
}

export default MyApp;
