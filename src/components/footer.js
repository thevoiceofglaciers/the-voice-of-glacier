"use client";

import { FaInstagram, FaFacebookF, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";

const SOCIAL_ICONS = {
  instagram: { Icon: FaInstagram, label: "Instagram" },
  facebook: { Icon: FaFacebookF, label: "Facebook" },
  linkedin: { Icon: FaLinkedin, label: "LinkedIn" },
  youtube: { Icon: FaYoutube, label: "YouTube" },
  x: { Icon: FaXTwitter, label: "X" },
};

// `settings` comes from WordPress Site Settings (see getSiteSettings() in
// src/lib/wp.js), already merged over the defaults in site-settings.json.
export default function Footer({ settings }) {
  const {
    footerTagline, footerLogo, socialLinks, founderName, contactEmail, copyright,
    creditText, creditUrl, credit2Text, credit2Url, creditSuffix,
  } = settings;

  return (
    <footer className="bg-glacier-dark text-glacier-light py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Description & Socials */}
        <div className="space-y-4">
          {footerTagline && <p className="text-glacier-soft max-w-md">{footerTagline}</p>}
          <div className="flex space-x-5 mt-4">
            {socialLinks
              // "#" was the old placeholder for the unused Facebook link.
              .filter((link) => link.url && link.url !== "#")
              .map((link, i) =>
                link.platform === "substack" ? (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" aria-label="Substack">
                    <Image
                      src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/substack-icon.webp"
                      alt="Substack"
                      width={20}
                      height={20}
                      className="invert hover:invert-0 transition duration-300"
                    />
                  </a>
                ) : (
                  <SocialLink key={i} platform={link.platform} url={link.url} />
                )
              )}
          </div>
        </div>

        {/* Right: Logo */}
        {footerLogo && (
          <div className="flex justify-center md:justify-end">
            <Image
              src={footerLogo}
              alt="The Voice of Glaciers Logo"
              width={160}
              height={60}
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* Founder Info & Copyright */}
      <div className="mt-10 text-center text-sm text-glacier-soft space-y-1">
        {founderName && (
          <p>
            <span className="font-semibold text-white">Founder: </span>
            {founderName}
          </p>
        )}
        {contactEmail && (
          <p>
            Email:{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-glacier-light underline hover:text-glacier-primary"
            >
              {contactEmail}
            </a>
          </p>
        )}
        <p>© {new Date().getFullYear()} {copyright}</p>
        {(creditText || credit2Text) && (
          <p>
            <CreditLink text={creditText} url={creditUrl} />
            {creditText && credit2Text && " and "}
            <CreditLink text={credit2Text} url={credit2Url} />
            {creditSuffix && ` ${creditSuffix}`}
          </p>
        )}
      </div>
    </footer>
  );
}

function CreditLink({ text, url }) {
  if (!text) return null;
  if (!url) return text;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-glacier-primary transition-colors duration-300 underline"
    >
      {text}
    </a>
  );
}

function SocialLink({ platform, url }) {
  const { Icon, label } = SOCIAL_ICONS[platform] || SOCIAL_ICONS.instagram;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
      <Icon className="text-glacier-light hover:text-glacier-primary text-xl" />
    </a>
  );
}
