import "./global.css";
import { Provider } from "@/components/providers";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  description: "Pimega Annotator Documentation",
  title: {
    template: "%s | pianno",
    default: "pianno",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
