"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function PillarCard({ pillar, index }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });

  const clipPathLeft = useTransform(
    scrollYProgress,
    [0, 0.5],
    ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );

  const clipPathRight = useTransform(
    scrollYProgress,
    [0, 0.5],
    ["inset(0% 0% 0% 100%)", "inset(0% 0% 0% 0%)"]
  );

  const isReverse = index % 2 !== 0;

  return (
    <div
      ref={ref}
      className="grid md:grid-cols-2 gap-10 items-center"
    >
      {/* Image */}
      <motion.div
        style={{
          clipPath: isReverse ? clipPathRight : clipPathLeft,
        }}
        className={`relative overflow-hidden rounded-2xl shadow-xl ${
          isReverse ? "md:order-2" : ""
        }`}
      >
        <img
          src={pillar.image}
          alt={pillar.title}
          className="w-full h-[340px] object-cover"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-3xl font-bold text-glacier-primary">
          {pillar.title}
        </h3>

        <p className="mt-2 text-xs uppercase tracking-wider text-glacier-dark/60">
          {pillar.subtitle}
        </p>

        <p className="mt-5 text-lg text-glacier-dark/80 leading-relaxed whitespace-pre-line">
          {pillar.content}
        </p>

        <div className="mt-5 w-14 h-1 bg-glacier-primary rounded-full" />
      </motion.div>
    </div>
  );
}

export default function HowWeWorkSection({ title, intro, pillars = [] }) {
  return (
    <section className="relative py-20 px-6 md:px-16 bg-gradient-to-b from-white to-glacier-light overflow-hidden">
      
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-glacier-primary">
          {title}
        </h2>
        {intro && <p className="mt-4 text-lg text-glacier-dark/80">{intro}</p>}
      </div>

      {/* Pillars */}
      <div className="mt-16 space-y-24 max-w-6xl mx-auto">
        {pillars.map((pillar, index) => (
          <PillarCard key={index} pillar={pillar} index={index} />
        ))}
      </div>
    </section>
  );
}