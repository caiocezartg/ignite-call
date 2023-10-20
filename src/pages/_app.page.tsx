import { globalStyle } from "@/styles/globals";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

globalStyle();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <main className={roboto.className}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
