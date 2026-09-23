"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { FaBullseye, FaEye } from "react-icons/fa";
import StrategicGaps from "@/components/strategicGaps";
import EngineModel from "@/components/engingeModal";
import DualForceModel from "@/components/dualForceModal";
import TheoryOfChange from "@/components/theoryOfChange";
import { Html } from "@/lib/content";
import { Icon } from "@/lib/icons";

// Rendered by page.js with `content` from WordPress (schema:
// wordpress/mu-plugins/tvgf-core/schemas/pages/our-strategy.json).
export default function StrategyPage({ content }) {
  useEffect(() => {
  const hash = window.location.hash;
  if (hash) {
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100); // delay ensures DOM has fully rendered
    }
  }
}, []);

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

    const SectionHeader = ({ title, description, isLightBackground = true }) => (
    <div className="text-center mb-16">
      <h2 className={`text-4xl md:text-5xl font-nohemi mb-4 ${isLightBackground ? 'text-glacier-primary' : 'text-white'}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg md:text-xl max-w-3xl mx-auto ${isLightBackground ? 'text-glacier-dark' : 'text-glacier-light'}`}>
          {description}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-white text-glacier-dark min-h-screen">

      {/* Hero Banner */}
      

 {/* Parallax Section 2: Vision & Mission Background */}
      <ParallaxBackground id="vision-mission" imageUrl={content.vmBackground}>
  <div className="max-w-6xl mx-auto" id="vision">
    <SectionHeader
      title={content.vmTitle}
      description={content.vmIntro}
      isLightBackground={false}
    />

    <div className="grid md:grid-cols-2 gap-10 text-center">
      {/* Vision Card */}
      <motion.div
        className="p-8 bg-white/10 backdrop-blur-sm rounded-xl md:text-xl text-sm border border-white/20 shadow-lg flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <FaEye className="text-2xl text-glacier-light" />
          <h3 className="text-2xl font-bold text-white">{content.visionTitle}</h3>
        </div>
        <Html as="p" html={content.visionText} className=" text-white/90 leading-relaxed" />
      </motion.div>

      {/* Mission Card */}
      <motion.div
        className="p-8 bg-white/10 backdrop-blur-sm md:text-xl text-sm rounded-xl border border-white/20 shadow-lg flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true, amount: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <FaBullseye className="text-2xl text-glacier-light" />
          <h3 className="text-2xl font-bold text-white">{content.missionTitle}</h3>
        </div>
        <Html as="p" html={content.missionText} className=" text-white/90 leading-relaxed" />
      </motion.div>
    </div>
  </div>
</ParallaxBackground>


 {/* TVGF’s North Star & Core Values */}
      <section id="north-star" className="py-20 px-6 md:px-16 bg-glacier-light text-glacier-dark rounded-b-lg">

  {/* Main content on top of snow */}
      <div className="relative duration-1000">

  <SectionHeader
    title={content.northStarTitle}
    description={content.northStarIntro}
    isLightBackground={true}
  />

  {/* Two Column Layout */}
  <div className="mt-14 grid md:grid-cols-2 gap-12 items-start">

    {/* LEFT — Goals */}
    <ul className="space-y-8 md:text-lg text-sm">
      {content.goals.map((goal, index) => (
        <li
          key={index}
          className="group relative border-l-4 border-glacier-primary pl-6"
        >
          <div className="font-semibold text-glacier-primary">
            {goal.title}
          </div>

          <motion.div
            className="mt-2 text-glacier-dark/90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            viewport={{ once: true }}
          >
            {goal.description}
          </motion.div>
        </li>
      ))}
    </ul>

    {/* RIGHT — Vision Image */}
    {content.northStarImage && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="relative md:sticky md:top-28 flex justify-center"
      style={{
        clipPath: "polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)",
      }}
    >
      <img
        src={content.northStarImage}
        alt="Glacier mountain landscape"
        className="shadow-lg w-full max-w-md object-cover"
      />

    </motion.div>
    )}

  </div>
</div>


  <div className="relative z-10 max-w-6xl mx-auto">


          {/* Core Values Grid (unchanged) */}
          <div className="mt-0" id="core-values">
            <h3 className="text-3xl font-bold text-glacier-primary mb-8 text-center">
              {content.coreValuesTitle}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {content.coreValues.map((value, idx) => (

                    <motion.div
                      key={idx}
                      className="p-6 bg-glacier-soft rounded-xl shadow-sm text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      viewport={{ once: true, amount: 0.4 }}
                    >
                      <Icon name={value.icon} className="text-3xl text-glacier-primary mb-3 mx-auto" />
                      <h4 className="font-bold text-xl text-glacier-dark mb-2">
                        {value.name}
                      </h4>
                      <p className="text-sm text-glacier-dark/80">{value.description}</p>
                    </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>


      
     


      <StrategicGaps
        eyebrow={content.gapsEyebrow}
        title={content.gapsTitle}
        gaps={content.gaps}
        footerLabel={content.gapsFooterLabel}
        footerTags={content.gapsFooterTags}
      />

     
     <EngineModel
       eyebrow={content.enginesEyebrow}
       title={content.enginesTitle}
       engines={content.engines}
       legend={content.enginesLegend}
     />


     <DualForceModel content={content}/>

      {/* 4. Solution Pillars */}
      <motion.section
        id="solution-pillars"
        className="w-full bg-glacier-dark py-20 transition-colors duration-300"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="w-[95%] max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-nohemi text-glacier-light mb-12">
            {content.pillarsTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.pillars.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-xl p-6 bg-glacier-dark border border-glacier-soft/30 shadow-md text-left transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={item.icon} className="w-6 h-6 text-glacier-light" />
                  <h3 className="text-xl font-semibold text-glacier-light">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-glacier-light/80 leading-relaxed font-cabin">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {content.pillarsOutro && (
            <p className="text-sm md:text-base text-glacier-light/70 max-w-2xl mx-auto mt-12">
              {content.pillarsOutro}
            </p>
          )}
        </div>
      </motion.section>

     <TheoryOfChange
       eyebrow={content.tocEyebrow}
       title={content.tocTitle}
       stages={content.tocStages}
       legendIncremental={content.tocLegendIncremental}
       legendSystemic={content.tocLegendSystemic}
       version={content.tocVersion}
     />

    </div>
  );
}
