"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Rendered by page.js with `content` from WordPress (schema:
// wordpress/mu-plugins/tvgf-core/schemas/pages/story.json).
export default function AnuraagStoryPage({ content }) {
  const slides = content.slides;
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    if (index < slides.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  return (
    <main className="w-full bg-glacier-light text-glacier-dark min-h-screen">

      {/* 📽️ Story Section with Background Video */}
      <section
        className="relative w-full h-screen flex items-center justify-center overflow-hidden cursor-pointer px-4 sm:px-8"
        onClick={nextSlide}
      >
        {/* 🔹 Background Video */}
        <video
          key={content.backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          {content.backgroundVideo && <source src={content.backgroundVideo} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>

        {/* 🔹 Overlay Color Filter */}
        <div className="absolute top-0 left-0 w-full h-full bg-glacier-soft/70 z-10" />

        {slides.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className={`relative z-20 flex flex-col md:flex-row items-center justify-between gap-10 w-full max-w-6xl ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            <div className="flex-1 w-full md:w-1/2 text-lg md:text-xl leading-relaxed">
              {index === 0 && (
                <h1 className="text-3xl md:text-4xl font-bold text-glacier-primary mb-4 text-center md:text-left">
                  {content.title}
                </h1>
              )}
              <p className="text-glacier-dark md:text-2xl text-xs whitespace-pre-line">{slides[index].text}</p>
            </div>

            {slides[index].image && (
            <div className="flex-1 w-full md:w-1/2 flex justify-center">
              <div className="w-full max-w-md sm:max-w-lg aspect-video">
                <img
                  src={slides[index].image}
                  alt={slides[index].imageAlt || ""}
                  className="w-full h-full object-cover rounded-xl shadow-xl"
                />
              </div>
            </div>
            )}
          </motion.div>
        </AnimatePresence>
        )}

        {/* 🔸 Slide Counter Prompt */}
        <div className="absolute bottom-10 w-full flex justify-center z-30">
          <p className="text-white font-semibold px-4 py-2 rounded-md bg-black/70 animate-pulse text-sm md:text-base">
            {content.continuePrompt} ({index + 1}/{slides.length})
          </p>
        </div>
      </section>

      {/* 📺 YouTube Section */}
      {content.video && (
      <section className="w-full bg-glacier-light py-16 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-glacier-dark mb-6 text-center">
          {content.videoTitle}
        </h2>
        <div className="w-full max-w-sm aspect-[9/16] shadow-xl rounded-lg overflow-hidden">
          <video
            src={content.video}
            controls
            className="w-full h-full object-cover"
            playsInline
          ></video>
        </div>
      </section>
      )}


    </main>
  );
}