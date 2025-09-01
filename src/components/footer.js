"use client";

import { FaInstagram, FaFacebookF, FaLinkedin } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-glacier-dark text-glacier-light py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Description & Socials */}
        <div className="space-y-4">
          <p className="text-glacier-soft max-w-md">
            Where glaciers speak, communities rise, and the world listens.
          </p>
          <div className="flex space-x-5 mt-4">
            <a
              href="https://www.instagram.com/thevoiceofglaciers/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-glacier-light hover:text-glacier-primary text-xl" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-glacier-light hover:text-glacier-primary text-xl" />
            </a>
            <a
              href="https://www.linkedin.com/company/the-voice-of-glaciers-foundation/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="text-glacier-light hover:text-glacier-primary text-xl" />
            </a>
            <a
              href="https://substack.com/@thevoiceofglaciers"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/substack-icon.webp"
                alt="Substack"
                width={20}
                height={20}
                className="invert hover:invert-0 transition duration-300"
              />
            </a>
          </div>
        </div>

        {/* Right: Logo */}
        <div className="flex justify-center md:justify-end">
          <Image
            src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/comapny-dark-logo.webp"
            alt="The Voice of Glaciers Logo"
            width={160}
            height={60}
            className="object-contain"
          />
        </div>
      </div>

      {/* Founder Info & Copyright */}
      <div className="mt-10 text-center text-sm text-glacier-soft space-y-1">
        <p>
          <span className="font-semibold text-white">Founder: </span>
          Anurag Maloo
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:thevoiceofglaciers@gmail.com"
            className="text-glacier-light underline hover:text-glacier-primary"
          >
            thevoiceofglaciers@gmail.com
          </a>
        </p>
        <p>© {new Date().getFullYear()} The Voice of Glaciers. All rights reserved.</p>
        <p>
          <a
            href="https://www.linkedin.com/in/adarsh-tiwari-5084ab256/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-glacier-primary transition-colors duration-300 underline"
          >
            Created by Adarsh Tiwari with love for glaciers
          </a>
        </p>
      </div>
    </footer>
  );
}
