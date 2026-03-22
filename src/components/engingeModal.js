import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEdit3, FiShield } from 'react-icons/fi';

const EngineModel = () => {
  const [activeEngine, setActiveEngine] = useState(0);

  const engines = [
    {
      title: "Knowledge Engine",
      subtitle: "The Foundation",
      desc: "Glacier literacy, open data platforms, citizen science, and curriculum development to democratize glacial intelligence.",
      color: "bg-blue-400",
      icon: <FiSearch />
    },
    {
      title: "Culture Engine",
      subtitle: "The Heart",
      desc: "Storytelling, rituals, and art reframing glaciers as living systems to rekindle human reverence and reciprocity.",
      color: "bg-glacier-primary",
      icon: <FiEdit3 />
    },
    {
      title: "Policy Engine",
      subtitle: "The Shield",
      desc: "Advocacy at COP, UN platforms, and national climate plans to establish legal recognition frameworks for ice.",
      color: "bg-glacier-dark",
      icon: <FiShield />
    }
  ];

  return (
    <section id="The-Three-Engine-Model" className="relative w-full min-h-screen py-16 md:py-0 overflow-hidden bg-glacier-light flex flex-col justify-center px-6 md:px-16 font-cabin">
      
      {/* Background Decor - Hidden on mobile to reduce visual noise */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-glacier-dark/10 -translate-y-1/2 z-0 hidden md:block" />

      <div className="max-w-7xl mx-auto w-full flex flex-col relative z-10">
        
        {/* Header */}
        <header className="mb-8 md:mb-12 text-center md:text-left flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-flex items-center gap-2 mb-4 bg-glacier-primary/10 px-3 py-1 rounded-full"
          >
            <span className="w-2 h-2 bg-glacier-primary rounded-full animate-pulse" />
            <span className="text-glacier-primary font-bold tracking-[0.2em] uppercase text-[9px] md:text-[10px]">
              Strategic Propulsion
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-nohemi text-glacier-dark leading-tight">
            The Three-<span className="text-glacier-primary italic">Engine</span> Model
          </h2>
        </header>

        {/* Engine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 flex-grow items-stretch">
          {engines.map((engine, index) => (
            <motion.div
              key={index}
              // Support both hover (Desktop) and Click (Mobile)
              onMouseEnter={() => setActiveEngine(index)}
              onClick={() => setActiveEngine(index)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-3xl transition-all duration-500 flex flex-col justify-between cursor-pointer border-2 min-h-[350px] md:min-h-0 lg:h-[450px] ${
                activeEngine === index 
                ? 'bg-white border-glacier-primary shadow-2xl scale-[1.02] z-20' 
                : 'bg-white/60 md:bg-white/40 border-transparent md:grayscale md:opacity-70 z-10'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-3xl md:text-4xl text-glacier-primary transition-transform duration-500 ${activeEngine === index ? 'rotate-12 scale-110' : ''}`}>
                    {engine.icon}
                  </span>
                  <span className="font-nohemi text-glacier-soft/30 text-xl md:text-2xl italic">
                    0{index + 1}
                  </span>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-nohemi text-glacier-dark leading-tight mb-2">
                  {engine.title}
                </h3>

                <p className="text-glacier-primary font-bold text-[10px] md:text-xs uppercase tracking-widest mb-6">
                  {engine.subtitle}
                </p>
              </div>

              <div className="space-y-4">
                <p className={`text-sm lg:text-base transition-colors duration-300 ${
                  activeEngine === index 
                    ? 'text-glacier-dark/80' 
                    : 'text-glacier-dark/60 md:text-glacier-dark/40'
                }`}>
                  {engine.desc}
                </p>
                
                {/* Gear Indicator */}
                <div className="pt-4 border-t border-glacier-dark/5 flex items-center gap-3">
                  <div className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                    activeEngine === index 
                      ? `${engine.color} w-10 md:w-12` 
                      : 'bg-glacier-soft/30'
                  }`} />
                  <div className="h-1.5 w-1.5 rounded-full bg-glacier-soft/30" />
                  <div className="h-1.5 w-1.5 rounded-full bg-glacier-soft/30" />
                </div>
              </div>

              {/* Layout Glow - Hidden on mobile to save performance/cleanliness */}
              <AnimatePresence>
                {activeEngine === index && (
                  <motion.div 
                    layoutId="engine-glow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -inset-[1px] md:-inset-[2px] rounded-3xl border-2 border-glacier-primary pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom Legend */}
        <footer className="mt-12 flex flex-wrap justify-center items-center gap-6 md:gap-12 text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] text-glacier-dark/40 uppercase font-bold border-t border-glacier-dark/5 pt-8 md:pt-6">
          <span className={`transition-colors duration-300 ${activeEngine === 0 ? 'text-glacier-primary' : ''}`}>Inquire</span>
          <span className={`transition-colors duration-300 ${activeEngine === 1 ? 'text-glacier-primary' : ''}`}>Inspire</span>
          <span className={`transition-colors duration-300 ${activeEngine === 2 ? 'text-glacier-primary' : ''}`}>Impact</span>
        </footer>
      </div>
    </section>
  );
};

export default EngineModel;