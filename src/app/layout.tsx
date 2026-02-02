import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { Toaster } from "@/components/ui/toaster";
import LayoutShell from "@/components/layout-shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Writer App",
  description:
    "A writing app to organize, write, and export your books and stories.",
  openGraph: {
    title: "Writer App",
    description:
      "A writing app to organize, write, and export your books and stories.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writer App",
    description:
      "A writing app to organize, write, and export your books and stories.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
        <head>
          <link rel="icon" href="/icon.ico" sizes="any" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Writer App" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        </head>
        <body className={inter.className} suppressHydrationWarning>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <LayoutShell header={<Header />} footer={<Footer />}>
                {children}
              </LayoutShell>
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
