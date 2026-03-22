"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* =======================
    SUB-COMPONENT (To fix Hook error)
======================= */
function GapCard({ gap, idx, scrollYProgress }) {
  // Define hooks at the top level of this component
  const start = 0.18 + idx * 0.08;
  const end = start + 0.12;

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [60, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [0.92, 1]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl"
    >
      <h3 className="text-xl font-bold text-white mb-3">
        {gap.title}
      </h3>
      <p className="text-base text-white/85 leading-relaxed">
        {gap.missing}
      </p>
    </motion.div>
  );
}

export default function GapsSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* =======================
      BACKGROUND & HEADER TRANSFORMS
  ======================= */
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["40vh", "-30vh"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Header specific transforms
  const headerOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.12], [40, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh] bg-black overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Background */}
        <motion.div
          style={{ scale: bgScale, y: bgY }}
          className="absolute inset-0 -z-10"
        >
          <img
            src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img1.webp"
            alt="Glacier Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        {/* Moving Content */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative"
        >
          <div className="max-w-6xl mx-auto px-6 pt-[20vh]">

            {/* Header */}
            <motion.div
              style={{ opacity: headerOpacity, y: headerY }}
              className="mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                The Gaps We&#39;re Addressing
              </h2>
              <p className="text-lg text-white/90 max-w-3xl">
                The Voice of Glaciers Foundation was born from a simple truth:
                Glaciers are dying. Quietly. Quickly. Irreversibly.
              </p>
            </motion.div>

            {/* Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gaps.map((gap, idx) => (
                <GapCard 
                  key={idx} 
                  gap={gap} 
                  idx={idx} 
                  scrollYProgress={scrollYProgress} 
                />
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}

const gaps = [
  {
    title: "Public Imagination",
    missing: "Glaciers are seen as distant and abstract, not personal and relatable.",
  },
  {
    title: "Cultural Voice",
    missing: "Indigenous wisdom, mountain community stories, and sacred rituals are often ignored.",
  },
  {
    title: "Interdisciplinary Collaboration",
    missing: "Science, art, and spirituality operate in isolated silos.",
  },
  {
    title: "Policy Integration",
    missing: "Glaciers and the broader Cryosphere are frequently excluded from national and international climate plans.",
  },
  {
    title: "Open Data Access",
    missing: "Glacier data, especially from the Global South, is limited, fragmented, or inaccessible.",
  },
  {
    title: "Glacier Pedagogy",
    missing: "No integrated, cryosphere-specific educational curriculum framework exists across schools and universities.",
  },
];