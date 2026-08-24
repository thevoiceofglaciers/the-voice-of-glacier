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
//
// Pinned to weight 400 only (not the default variable range) to match
// production: thevoiceofglaciers.org registers Cabin as a single static
// weight-400 @font-face, so its "font-medium"/500 text measurably renders
// identical to regular weight there (verified via canvas measureText — both
// widths match exactly). Loading the true variable font here made
// font-medium text visibly bolder than production, which read as "the menu
// font changed". Pinning to 400 reproduces the same single-face fallback
// behavior for every font-weight utility combined with font-cabin.
const cabin = Cabin({ subsets: ["latin"], weight: "400", variable: "--font-cabin" });

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
