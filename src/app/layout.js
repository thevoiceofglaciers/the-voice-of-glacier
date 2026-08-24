import { Inter, Cabin } from "next/font/google";
import SiteHeader from "@/components/siteHeader";
import Footer from "@/components/footer";
import { getMainMenu, getAnnouncement } from "@/lib/wp";
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

export default async function RootLayout({ children }) {
  // Both fail closed (return null) on any WordPress error — this layout
  // wraps every route, so an outage must degrade gracefully (fallback nav
  // links, no announcement bar) rather than 500ing the whole site.
  const [links, announcement] = await Promise.all([getMainMenu(), getAnnouncement()]);

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
      <body className={`${inter.className} ${cabin.variable}`}>
        <SiteHeader links={links} announcement={announcement} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
