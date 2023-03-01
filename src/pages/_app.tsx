import ContextProvider from "@/context";
import { persistor, store } from "@/redux/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ContextProvider>
          <Component {...pageProps} />
        </ContextProvider>
      </PersistGate>
    </Provider>
  );
}
