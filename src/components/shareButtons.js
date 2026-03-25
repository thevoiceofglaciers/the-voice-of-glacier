"use client";

import { useEffect, useState, useRef } from "react";
import { FaFacebook, FaLinkedin, FaLink, FaShareAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Current X branding
import { motion, AnimatePresence } from "framer-motion";

export default function ShareButtons({ title, url, compact = false }) {
  const [currentUrl, setCurrentUrl] = useState(url || "");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [url]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shareLinks = [
    {
      name: "X",
      icon: <FaXTwitter />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
      color: "hover:bg-black",
    },
    {
      name: "Facebook",
      icon: <FaFacebook />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      color: "hover:bg-[#1877F2]",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      color: "hover:bg-[#0077b5]",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setIsOpen(false);
    // Simple toast could be added here, but sticking to basics for reliability
    alert("Link copied to clipboard!");
  };

  if (!compact) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4 py-8 border-t border-b border-glacier-primary/10 my-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <span className="text-xs font-bold text-glacier-dark/60 dark:text-glacier-soft/60 uppercase tracking-widest">Share this Story</span>
        <div className="flex gap-3">
          {shareLinks.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full bg-glacier-dark dark:bg-glacier-primary/20 text-white transition-all duration-300 transform hover:scale-110 shadow-lg ${platform.color}`}
              aria-label={`Share on ${platform.name}`}
            >
              <span className="text-xl">{platform.icon}</span>
            </a>
          ))}
          <button
            onClick={copyToClipboard}
            className="p-3 rounded-full bg-glacier-dark dark:bg-glacier-primary/20 text-white transition-all duration-300 transform hover:scale-110 hover:bg-glacier-primary shadow-lg"
            aria-label="Copy link"
          >
            <span className="text-xl"><FaLink /></span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Toggle Button for Cards */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
          isOpen 
            ? "bg-glacier-primary text-white scale-110 shadow-glacier-primary/40" 
            : "bg-white dark:bg-glacier-dark/80 text-glacier-primary dark:text-glacier-light hover:scale-110 border border-glacier-primary/10"
        } cursor-pointer pointer-events-auto`}
        aria-label="Share"
      >
        <FaShareAlt className={isOpen ? "rotate-45 transition-transform" : ""} />
      </button>

      {/* Floating Menu - Icons Only Horizontal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute z-[100] right-0 bottom-full mb-4 p-2 bg-white/95 dark:bg-glacier-dark/95 backdrop-blur-xl border border-glacier-primary/20 rounded-full shadow-2xl min-w-max pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              {shareLinks.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className={`p-3 rounded-full transition-all duration-300 text-glacier-dark dark:text-glacier-light ${platform.color} hover:text-white group`}
                  title={`Share on ${platform.name}`}
                >
                  <span className="text-xl group-hover:scale-120 transition-transform">{platform.icon}</span>
                </a>
              ))}
              <div className="w-[1px] h-6 bg-glacier-primary/10 mx-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard();
                }}
                className="p-3 rounded-full transition-all duration-300 text-glacier-dark dark:text-glacier-light hover:bg-glacier-primary hover:text-white group"
                title="Copy Link"
              >
                <span className="text-xl group-hover:scale-120 transition-transform"><FaLink /></span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}





