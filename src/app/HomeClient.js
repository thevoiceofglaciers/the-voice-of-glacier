"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import HowWeWorkSection from "@/components/howWeWork";
import { Html } from "@/lib/content";
import { Icon } from "@/lib/icons";

// Rendered by page.js with `content` from WordPress (schema:
// wordpress/mu-plugins/tvgf-core/schemas/pages/home.json).
export default function HomePage({ content }) {

  const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const onScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };
  window.addEventListener("scroll", onScroll);

  const video = document.getElementById("hero-video");
  if (video) {
    video.playbackRate = 0.7;
  }

  // ✅ Auto scroll to hash on page load
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300); // small delay for layout readiness
    }
  }

  return () => window.removeEventListener("scroll", onScroll);
}, []);

  const Button = ({ children, variant = "solid", className = "" }) => {
    const base = "px-8 py-3 rounded-full font-semibold transition duration-300 transform hover:scale-105"; // More prominent buttons
    const styles = {
      solid: "bg-glacier-primary text-white hover:bg-glacier-dark shadow-lg",
      outline:
        "border-2 border-glacier-primary text-glacier-primary hover:bg-glacier-primary hover:text-white shadow-md",
    };
    return (
      <button className={`${base} ${styles[variant]} ${className}`}>
        {children}
      </button>
    );
  };

  const SectionHeader = ({ title, description, isLightBackground = true }) => (
    <div className="text-center mb-16">
      <h2 className={`text-xl md:text-5xl font-nohemi font-bold mb-4 ${isLightBackground ? 'text-glacier-primary' : 'text-white'}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg md:text-xl max-w-3xl mx-auto ${isLightBackground ? 'text-glacier-dark' : 'text-glacier-light'}`}>
          {description}
        </p>
      )}
    </div>
  );

  const ParallaxBackground = ({ imageUrl, children }) => (
    <div
      className="relative bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${imageUrl})`, backgroundAttachment: 'fixed' }}
    >
      <div className="absolute inset-0 bg-glacier-dark/60"></div> {/* Dark overlay for readability */}
      <div className="relative z-10 py-24 px-6 md:px-16 text-white">
        {children}
      </div>
    </div>
  );


  return (
    <div className="bg-glacier-light text-glacier-dark">

      {/* Hero Banner */}
      <HeroSection content={content}/>

      


     {/* Parallax Section 1: Cryosphere Background */}
<section
  id="crisis"
  className="relative py-20 px-6 md:px-16 bg-glacier-dark text-glacier-light overflow-hidden"
>
  {/* 🔷 Decorative clipped image – top right */}
    {content.crisisBackgroundImage && (
    <img
    src={content.crisisBackgroundImage}
    alt=""
    className="absolute inset-0 m-auto w-96 md:w-[32rem] opacity-10 object-cover pointer-events-none"
    style={{
      clipPath: "polygon(20% 0%, 80% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)",
    }}
  />
    )}


  <div className="relative max-w-6xl mx-auto text-center z-10">
    <SectionHeader
      title={content.crisisTitle}
      description={content.crisisIntro}
      isLightBackground={false}
    />

    {/* 🔹 Stats Cards */}
    <div className="grid md:grid-cols-2 gap-6 text-left mt-10 relative">
      {content.crisisStats.map((stat, idx) => (
        <motion.div
          key={idx}
          className="cursor-pointer group flex items-start gap-4 p-5 bg-white/10 backdrop-blur rounded-xl border border-white/20 hover:border-glacier-primary transition"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
          viewport={{ once: true }}
        >
          <div className="text-glacier-primary text-xl md:text-2xl">
            <Icon name={stat.icon} className="text-2xl text-glacier-primary" />
          </div>

          <div>
            <h3 className="text-sm md:text-base font-semibold text-glacier-light mb-1">
              {stat.label}
            </h3>
            <p className="text-xs md:text-sm text-glacier-soft max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-300">
              {stat.description}
            </p>
          </div>
        </motion.div>
      ))}

    </div>

    {/* 🔹 Mid Image Divider */}

    {/* 🔹 Text + Side Image */}
<div className="mt-16 grid md:grid-cols-2 gap-10 items-center">
  {/* Text */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="text-left"
  >
    <Html
      as="p"
      html={content.crisisText}
      className="text-sm md:text-lg leading-relaxed text-glacier-soft mb-6 [&_strong]:text-glacier-light [&_strong]:font-medium"
    />

    {content.crisisQuote && (
    <p className="text-sm md:text-xl leading-relaxed text-glacier-light/80 text-justify">
      <span className="text-2xl">&ldquo;</span>
      {content.crisisQuote}
      <span className="text-2xl">&rdquo;</span>
    </p>
    )}
  </motion.div>

  {/* Image */}
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="flex justify-center md:justify-end"
  >
    {content.crisisImage && (
    <img
      src={content.crisisImage}
      alt="Glacier Detail"
      className="w-64 md:w-80 object-cover shadow-xl"
      style={{
        clipPath: "polygon(10% 0%, 90% 10%, 100% 90%, 20% 100%, 0% 40%)",
      }}
    />
    )}
  </motion.div>
</div>

  </div>
</section>



{/* how we work */}
<HowWeWorkSection title={content.howTitle} intro={content.howIntro} pillars={content.howPillars}/>

{/* Join the Movement CTA */}
<section className="relative py-24 px-6 md:px-16 overflow-hidden text-white">
  
  {/* Background Video */}
  {content.ctaVideo && (
  <video
    key={content.ctaVideo}
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source
      src={content.ctaVideo}
      type="video/mp4"
    />
  </video>
  )}

  {/* Glacier Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-glacier-primary/50 to-glacier-dark/50" />

  {/* Content Container */}
  <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
    
    {/* LEFT – Team Image */}
    <div className="flex flex-col justify-center md:justify-start">
        {content.founderImage && (
        <div className="w-48 h-48 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-glacier-primary shadow-xl mb-3">
          <img
            src={content.founderImage}
            alt={content.founderName}
            className="w-full h-full object-cover"
          />
        </div>
        )}
        <p className="text-xl font-semibold">{content.founderName}</p>
        <p className="text-glacier-soft text-sm italic mb-3">{content.founderRole}</p>
        {content.founderButtonLabel && (
        <Link href={content.founderButtonLink || "/story"}>
          <Button className="hover:bg-glacier-primary hover:text-white transition duration-300">
            {content.founderButtonLabel}
          </Button>
        </Link>
        )}
    </div>

    {/* RIGHT – CTA Content */}
    <div className="text-center md:text-left">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
        {content.ctaTitle}
      </h2>

      {content.ctaText && (
      <p className="text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
        {content.ctaText}
      </p>
      )}

      <div className="flex flex-wrap justify-center md:justify-start gap-6">
        {content.ctaButtons.map((button, i) => (
          <Button key={i} className="bg-glacier-dark font-semibold hover:bg-glacier-soft transition">
            <Link href={button.link || "#"}>{button.label}</Link>
          </Button>
        ))}
      </div>
    </div>

  </div>
</section>
     
 
      

    </div>
  );
}