import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  description: 'Pimega Annotator Documentation',
  title: {
    template: '%s | pianno',
    default: 'pianno',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
