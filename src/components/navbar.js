"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [desktopDropdown, setDesktopDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const structuredLinks = [
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
      name: "Our Strategy",
      href: "/ourStrategy",
      sublinks: [
        { label: "Cryosphere Crisis", href: "/ourStrategy#cryosphere-crisis" },
        { label: "Strategic Gaps", href: "/ourStrategy#strategic-gaps" },
        { label: "Dual-Force Model", href: "/ourStrategy#dual-force-model" },
        { label: "Solution Pillars", href: "/ourStrategy#solution-pillars" },
        { label: "Theory of Change", href: "/ourStrategy#theory-of-change" },
        { label: "Strategic Roadmap", href: "/ourStrategy#strategic-roadmap" },
      ],
    },
    {
      name: "Programs",
      href: "/programs",
      sublinks: [
        { label: "Our Programs", href: "/programs#glacierx-gatherings" },
        { label: "International Efforts", href: "/programs#ourPrograms" }
      ],
    },
    {
      name: "Collaborate",
      href: "/collaborate",
      sublinks: [
        { label: "Partners", href: "/collaborate#partners" },
        { label: "Join Us", href: "/collaborate#join" },
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
      name: "Media",
      href: "/media",
      sublinks: [
        { label: "Go to media", href: "/media" }
      ], // no dropdown
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDesktopDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSmoothScroll = async (href) => {
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
  className={`fixed w-full z-50 transition-transform duration-300 font-cabin ${
    showNavbar ? "translate-y-0" : "-translate-y-full"
  } backdrop-blur-sm border-b border-white/20 shadow-sm`}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
      {/* Logo */}
      <Link href="/" className="flex-shrink-0">
        <Image
          src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/comapny-dark-logo.webp"
          alt="Company Logo"
          width={140}
          height={48}
          className="h-8 sm:h-10 md:h-12 w-auto object-contain rounded-lg"
          priority
        />
      </Link>

      {/* Desktop Nav */}
      <div
        className="hidden md:flex md:space-x-6 lg:space-x-10 items-center relative"
        ref={dropdownRef}
      >
        {structuredLinks.map((link) => (
          <div key={link.name} className="relative">
            <button
              onClick={() =>
                setDesktopDropdown(
                  desktopDropdown === link.name ? null : link.name
                )
              }
              className="flex items-center gap-1 
                         text-white font-semibold 
                         text-sm md:text-xs lg:text-base 
                         hover:text-cyan-300 transition-colors"
            >
              {link.name}
              {link.sublinks?.length > 0 && <ChevronDown size={16} />}
            </button>
            {link.sublinks?.length > 0 &&
              desktopDropdown === link.name && (
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
        ))}
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
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  {isOpen && (
    <div className="md:hidden px-4 pt-3 pb-6 space-y-4 backdrop-blur-md shadow-md border-t border-white/20">
      {structuredLinks.map((link) => (
        <div key={link.name}>
          <button
            onClick={() =>
              setMobileDropdown((prev) =>
                prev === link.name ? null : link.name
              )
            }
            className="w-full flex justify-between items-center text-left text-white font-medium text-lg py-2"
          >
            {link.name}
            {link.sublinks?.length > 0 && <ChevronDown size={16} />}
          </button>

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
      ))}
    </div>
  )}
</nav>

  );
}