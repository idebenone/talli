import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { JotaiProvider } from "@/components/providers/jotai-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import UserProfile from "@/components/UserProfile";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talli",
  description: "Your ultimate party sidekick",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <JotaiProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <UserProfile />
            {children}
            <Toaster position="bottom-center" closeButton richColors />
          </ThemeProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
