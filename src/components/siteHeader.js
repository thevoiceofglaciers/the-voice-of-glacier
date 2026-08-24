"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import AnnouncementBar from "@/components/announcementBar";

// Owns the scroll-driven show/hide state for the navbar and shares it with
// the announcement bar, so the bar can slide up to take the navbar's spot
// (top-0) instead of staying pinned below a navbar that's no longer there.
export default function SiteHeader({ links, announcement }) {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <>
      <Navbar links={links} showNavbar={showNavbar} />
      <AnnouncementBar announcement={announcement} navbarVisible={showNavbar} />
    </>
  );
}
