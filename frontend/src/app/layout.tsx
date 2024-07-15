import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/provider";
import Isauth from "@/lib/isauth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notiping",
  description: "Notify your buddy",
  icons: {
    icon: "icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Isauth>{children}</Isauth>
        </Providers>
      </body>
    </html>
  );
}
