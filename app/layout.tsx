"use client";
import "./globals.css";
import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

const roob = localFont({
  src: [
    {
      path: "./fonts/roobert-pro/RoobertPRO-Light.ttf",
      weight: "600",
    },
    {
      path: "./fonts/roobert-pro/RoobertPRO-Regular.ttf",
      weight: "400",
    },
    {
      path: "./fonts/roobert-pro/RoobertPRO-Medium.ttf",
      weight: "500",
    },
    {
      path: "./fonts/roobert-pro/RoobertPRO-Bold.ttf",
      weight: "500",
    },
  ],
  variable: "--font-roob",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const router = useRouter();

  return (
    <html lang="en">
      <body className={`${roob.variable}  antialiased`}>
        <ToastContainer />
        <header>
          {" "}
          <h1
            onClick={() => {
              if (path === "/") {
                router.push("/download");
              } else {
                router.push("/");
              }
            }}
            className={`text-3xl xl:text-4xl font-roob font-medium text-white bg-tertiary absolute px-4 xl:px-6 py-4`}
          >
            SlickCity.io
          </h1>
        </header>
        {children}
      </body>
    </html>
  );
}
