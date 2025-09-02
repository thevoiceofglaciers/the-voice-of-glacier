import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "The Voice Of Glaciers Foundation",
  description: "The Voice Of Glaciers Foundation website",
  icons: {
    icon: "/favicon.ico", // relative to /public
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          body {
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
        `}</style>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
