import { Inter, Cabin } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
// The site's own font-cabin utility (tailwind.config.js) expects this custom
// property — public/font/Cabin-VariableFont.ttf referenced in globals.css
// never actually existed, so this replaces that broken @font-face with the
// real Google Font of the same name (no file to host ourselves).
const cabin = Cabin({ subsets: ["latin"], variable: "--font-cabin" });

export const metadata = {
  title: "The Voice Of Glaciers",
  description: "The Voice Of Glaciers website",
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
      <body className={`${inter.className} ${cabin.variable}`}>{children}</body>
    </html>
  );
}
