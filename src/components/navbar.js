"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";

// Used whenever WordPress's menu (Appearance > Menus, "primary" location)
// can't be reached — see getMainMenu() in src/lib/wp.js — so the site still
// has a working nav instead of an empty bar.
const FALLBACK_LINKS = [
    {
      name: "Home",
      href: "/",
      sublinks: [
        { label: "Crisis", href: "/#crisis" },
        { label: "Our Approach", href: "/#why-tvgf" },
        { label: "Vision", href: "/#vision" },
        { label: "North Star", href: "/#north-star" },
        { label: "Core Values", href: "/#core-values" },
        { label: "The Gaps", href: "/#the-gaps" },
      ],
    },
    {
      name: "Why Glaciers Matter",
      href: "/GlacierMatters",
      sublinks: [
        { label: "Cryosphere Crisis", href: "/GlacierMatters#cryosphere-crisis" },
        { label: "The Hindu Kush Himalaya", href: "/GlacierMatters#Kush-Himalaya" },
        { label: "What If Glaciers Disappear", href: "/GlacierMatters#Disappear" }
      ],
    },
    {
      name: "Our Strategy",
      href: "/ourStrategy",
      sublinks: [
        { label: "Vision & Mission", href: "/ourStrategy#vision-mission" },
        { label: "North Star", href: "/ourStrategy#north-star" },
        { label: "Core Values", href: "/ourStrategy#core-values" },
        { label: "Gaps We Bridge", href: "/ourStrategy#gaps" },
        { label: "The Three-Engine Model", href: "/ourStrategy#The-Three-Engine-Model" },
        { label: "Dual-Force Action", href: "/ourStrategy#Dual-Force-Action" },
        
        { label: "Solution Pillars", href: "/ourStrategy#Solution-pillars" },
        
        { label: "Theory of Change", href: "/ourStrategy#Theory-of-Change" },
      ],
    },
    {
      name: "Programs & Initiatives",
      href: "/programs",
      sublinks: [
        { label: "Our Programs", href: "/programs#glacierx-gatherings" },
        { label: "International Efforts", href: "/programs#ourPrograms" }
      ],
    },
    {
      name: "Learn",
      href: "/Learn",
      sublinks: [
        { label: "Introduction", href: "/Learn#introduction" },
        { label: "Explore", href: "/Learn#explore" },
        { label: "Glacier Data", href: "/Learn#glacier-data" },
        { label: "Glossary", href: "/Learn#glossary" },
        { label: "Partners", href: "/Learn#partners" },
        { label: "Join Us", href: "/Learn#join" },
      ],
    },
    {
      name: "Get Involved",
      href: "/collaborate",
      sublinks: [
        { label: "Partners", href: "/collaborate#partners" },
        { label: "Join Us", href: "/collaborate#join" },
      ],
    },
    { name: "Media", href: "/media", sublinks: [] },
    { name: "Glacier Dialogues", href: "/glacier-dialogues", sublinks: [] }
];

export default function Navbar({ links, showNavbar = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const structuredLinks = links?.length ? links : FALLBACK_LINKS;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDesktopDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSmoothScroll = async (rawHref) => {
    // WordPress menu items are hand-typed "Custom Links" — normalize away an
    // accidentally-pasted full URL (e.g. "https://thevoiceofglaciers.org/x")
    // to a relative path before splitting on "#", since router.push() needs
    // an internal path, not an absolute URL with a host.
    let href = rawHref;
    if (typeof window !== "undefined") {
      try {
        const url = new URL(rawHref, window.location.origin);
        href = url.pathname + url.search + url.hash;
      } catch {
        // Leave href as-is if it's not parseable as a URL at all.
      }
    }

    const [path, hash] = href.split("#");

    if (hash) {
      if (pathname !== path) {
        await router.push(path);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      } else {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      router.push(href);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-transform duration-300 font-cabin rounded-b-xl  ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } border-b border-white/20 bg-glacier-primary shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between h-14 items-center">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/comapny-dark-logo.webp"
              alt="Company Logo"
              width={140}
              height={48}
              className="h-8 sm:h-10 w-auto object-contain rounded-lg"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div
            className="hidden md:flex md:space-x-4 lg:space-x-6 items-center relative"
            ref={dropdownRef}
          >
            {structuredLinks.map((link) => {
              const hasChildren = link.sublinks?.length > 0;
              return (
                <div key={link.name} className="relative flex items-center">
                  {hasChildren ? (
                    <button
                      onClick={() =>
                        setDesktopDropdown(
                          desktopDropdown === link.name ? null : link.name
                        )
                      }
                      className="flex items-center gap-1
                                 text-white font-medium
                                 text-xs md:text-[11px] lg:text-sm
                                 hover:text-glacier-dark transition-colors"
                    >
                      {link.name}
                      <ChevronDown size={14} />
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSmoothScroll(link.href);
                      }}
                      className="flex items-center gap-1
                                 text-white font-medium
                                 text-xs md:text-[11px] lg:text-sm
                                 hover:text-glacier-dark transition-colors"
                    >
                      {link.name}
                    </a>
                  )}

                  {hasChildren && desktopDropdown === link.name && (
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white text-black rounded-md shadow-lg z-10">
                      {link.sublinks.map((sublink) => (
                        <a
                          key={sublink.label}
                          href={sublink.href}
                          onClick={(e) => {
                            e.preventDefault();
                            setDesktopDropdown(null);
                            handleSmoothScroll(sublink.href);
                          }}
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          {sublink.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                setMobileDropdown(null);
              }}
              className="text-white"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 space-y-4 backdrop-blur-md shadow-md border-t border-white/20">
          {structuredLinks.map((link) => {
            const hasChildren = link.sublinks?.length > 0;
            return (
            <div key={link.name}>
              {hasChildren ? (
                <button
                  onClick={() =>
                    setMobileDropdown((prev) =>
                      prev === link.name ? null : link.name
                    )
                  }
                  className="w-full flex justify-between items-center text-left text-white font-medium text-base py-2"
                >
                  {link.name}
                  <ChevronDown size={16} />
                </button>
              ) : (
                <a
                  href={link.href}
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    setMobileDropdown(null);
                    await handleSmoothScroll(link.href);
                  }}
                  className="block text-left text-white font-medium text-base py-2"
                >
                  {link.name}
                </a>
              )}

              {mobileDropdown === link.name && link.sublinks?.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  {link.sublinks.map((sublink) => (
                    <a
                      key={sublink.label}
                      href={sublink.href}
                      onClick={async (e) => {
                        e.preventDefault();
                        setIsOpen(false);
                        setMobileDropdown(null);
                        await handleSmoothScroll(sublink.href);
                      }}
                      className="block text-white text-sm hover:text-cyan-300 transition-colors"
                    >
                      {sublink.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}