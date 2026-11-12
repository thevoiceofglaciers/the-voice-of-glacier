"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import AnnouncementBar from "@/components/announcementBar";

// Owns the scroll-driven show/hide state for the navbar and shares it with
// the announcement bar, so the bar can slide up to take the navbar's spot
// (top-0) instead of staying pinned below a navbar that's no longer there.
export default function SiteHeader({ links, announcement }) {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [barHeight, setBarHeight] = useState(0);
  const barRef = useRef(null);

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

  // The announcement bar wraps to 2-3 lines on narrow screens, so its height
  // isn't a fixed number — pages that assumed only the navbar's height (all
  // of them; the bar didn't exist when their spacing was tuned) end up with
  // the bar's extra height covering their content. Measuring it live and
  // reserving that much space in normal flow fixes every page at once,
  // without touching each page's own nav-clearance spacing. Height is 0
  // (and this effect is a no-op) whenever there's no active announcement.
  useEffect(() => {
    if (!announcement || !barRef.current) {
      setBarHeight(0);
      return;
    }
    const el = barRef.current;
    const observer = new ResizeObserver((entries) => {
      setBarHeight(entries[0].contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [announcement]);

  return (
    <>
      <Navbar links={links} showNavbar={showNavbar} />
      <AnnouncementBar ref={barRef} announcement={announcement} navbarVisible={showNavbar} />
      <div style={{ height: barHeight }} aria-hidden="true" />
    </>
  );
}
