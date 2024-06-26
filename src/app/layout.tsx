import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/global.css";
import { ReduxProvider } from "@/lib/provider";
import Header from '@/components/Header';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  manifest:'/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <Header/>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </main>
      </body>
    </html>
  );
}
