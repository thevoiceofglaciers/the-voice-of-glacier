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
    { name: "Home", href: "/", sublinks: [
        { label: "Crisis", href: "/#crisis" },
        { label: "Our Approach", href: "/#why-tvgf" },
        { label: "Vision", href: "/#vision" },
        { label: "North Star", href: "/#north-star" },
        { label: "Core Values", href: "/#core-values" },
        { label: "The Gaps", href: "/#the-gaps" },
      ]
    },
    { name: "Our Strategy", href: "/ourStrategy", sublinks: [
        { label: "Cryosphere Crisis", href: "/ourStrategy#cryosphere-crisis" },
        { label: "Strategic Gaps", href: "/ourStrategy#strategic-gaps" },
        { label: "Dual-Force Model", href: "/ourStrategy#dual-force-model" },
        { label: "Solution Pillars", href: "/ourStrategy#solution-pillars" },
        { label: "Theory of Change", href: "/ourStrategy#theory-of-change" },
        { label: "Strategic Roadmap", href: "/ourStrategy#strategic-roadmap" },
      ]
    },
    { name: "Programs", href: "/programs", sublinks: [
        { label: "Our Programs", href: "/programs#glacierx-gatherings" },
        { label: "International Efforts", href: "/programs#ourPrograms" }
      ]
    },
    { name: "Collaborate", href: "/collaborate", sublinks: [
        { label: "Partners", href: "/collaborate#partners" },
        { label: "Join Us", href: "/collaborate#join" },
      ]
    },
    { name: "Learn", href: "/Learn", sublinks: [
        { label: "Introduction", href: "/Learn#introduction" },
        { label: "Explore", href: "/Learn#explore" },
        { label: "Glacier Data", href: "/Learn#glacier-data" },
        { label: "Glossary", href: "/Learn#glossary" },
        { label: "Partners", href: "/Learn#partners" },
        { label: "Join Us", href: "/Learn#join" },
      ]
    },
    { name: "Media", href: "/media", sublinks: [{ label: "Go to media", href: "/media" }] },
    { name: "Glacier Dialogues", href: "/glacierDialgoues", sublinks: [{ label: "Go to Dialgoues", href: "/glacierDialgoues" }] }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY <= lastScrollY || currentScrollY <= 60);
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
      className={`fixed w-full z-50 transition-all  duration-300 font-cabin ${
        showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } 
      /* GLASSMORPHISM CLASSES */
      bg-glacier-primary border-b border-white/10 shadow-lg`}
    >
      {/* WE APPLY mix-blend-difference TO THE INNER WRAPPER 
          This ensures the background glass remains visible while only the 
          content (text/logo) inverts based on the underlying section.
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between h-12 items-center">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 brightness-0 invert">
            <Image
              src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/comapny-dark-logo.webp"
              alt="Company Logo"
              width={120}
              height={32}
              className="h-6 sm:h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:space-x-4 lg:space-x-8 items-center relative h-full" ref={dropdownRef}>
            {structuredLinks.map((link) => (
              <div key={link.name} className="relative flex items-center h-full">
                <button
                  onClick={() => setDesktopDropdown(desktopDropdown === link.name ? null : link.name)}
                  className="flex items-center gap-1 text-white font-semibold text-[10px] lg:text-sm transition-colors hover:text-cyan-300"
                >
                  {link.name}
                  {link.sublinks?.length > 0 && <ChevronDown size={14} />}
                </button>
                
                {link.sublinks?.length > 0 && desktopDropdown === link.name && (
                  <div className="absolute left-0 top-full mt-0 w-48 bg-white/90 backdrop-blur-xl text-black rounded-b-md shadow-2xl z-10 mix-blend-normal border border-black/5">
                    {link.sublinks.map((sublink) => (
                      <a
                        key={sublink.label}
                        href={sublink.href}
                        onClick={(e) => {
                          e.preventDefault();
                          setDesktopDropdown(null);
                          handleSmoothScroll(sublink.href);
                        }}
                        className="block px-4 py-2 text-xs hover:bg-black/10 transition-colors"
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
              onClick={() => { setIsOpen(!isOpen); setMobileDropdown(null); }}
              className="text-white"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Glass Style */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white/90 backdrop-blur-2xl text-black shadow-md border-t border-black/5 mix-blend-normal">
          {structuredLinks.map((link) => (
            <div key={link.name}>
              <button
                onClick={() => setMobileDropdown((prev) => prev === link.name ? null : link.name)}
                className="w-full flex justify-between items-center text-left font-medium text-base py-1.5"
              >
                {link.name}
                {link.sublinks?.length > 0 && <ChevronDown size={14} />}
              </button>

              {mobileDropdown === link.name && link.sublinks?.length > 0 && (
                <div className="ml-4 mt-1 space-y-1">
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
                      className="block text-xs hover:text-cyan-700 transition-colors py-1"
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