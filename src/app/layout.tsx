import type { Metadata } from "next";
import { Fredoka, Geist, Geist_Mono, Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Toaster } from "sonner";
import { AntdThemeProvider } from "@/components/admin/antd-theme-provider";
import { ReduxProvider } from "@/redux/ReduxProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Punkies Playhouse Admin",
  description: "Admin panel for Punkies Playhouse Alerts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${fredoka.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AntdRegistry>
          <AntdThemeProvider>
            <ReduxProvider>
              <Toaster position="top-right" richColors />
              {children}
            </ReduxProvider>
          </AntdThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
