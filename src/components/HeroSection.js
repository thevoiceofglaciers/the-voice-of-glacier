"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import QuizModal from "@/components/QuizModal";
import { Button } from "@/components/ui/button"; // Tailwind-based button

export default function HeroSection() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        id="hero-video"
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
        src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacier-hero.mp4"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-glacier-primary/30 flex flex-col items-center justify-center text-center p-4 text-white">
        {/* Logo Animation */}
        <motion.div
          className="w-64 h-auto mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/comapny-hero-logo.webp"
            alt="TVGF Logo"
            width={256}
            height={256}
            className="mx-auto"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-lg md:text-2xl max-w-2xl font-cabin drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          &quot;Where glaciers speak, communities rise, and the world listens.&quot;
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            onClick={() => setIsQuizOpen(true)}
            className="bg-glacier-primary hover:bg-glacier-dark text-white font-cabin text-base px-6 py-2 rounded-md transition"
          >
            Check your Knowledge about glaciers
          </Button>

          <Link href="/story" passHref>
            <Button
              variant="outline"
              className="border-glacier-light bg-glacier-primary font-cabin text-base hover:bg-glacier-dark px-6 py-2 rounded-md transition"
            >
              <span className="text-white">Watch the Story</span>
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Quiz Modal with Animation */}
      <AnimatePresence>
        {isQuizOpen && (
          <QuizModal key="quiz" onClose={() => setIsQuizOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}
