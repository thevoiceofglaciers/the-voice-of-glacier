import React from 'react';
import { motion } from 'framer-motion';
import { FiDatabase, FiZap, FiAward, FiGlobe } from 'react-icons/fi';

const TheoryOfChange = () => {
  const theoryData = [
    {
      title: "Inputs",
      content: ["Scientific Data", "Indigenous Wisdom", "Youth Advocacy"],
      icon: <FiDatabase />
    },
    {
      title: "Actions",
      content: ["Policy Drafting", "Cultural Rituals", "Digital Portals"],
      icon: <FiZap />
    },
    {
      title: "Outcomes",
      content: ["Legal Rights", "Increased Literacy", "Global Solidarity"],
      icon: <FiAward />
    },
    {
      title: "Impact",
      content: ["Cryosphere Stability", "Reciprocal Living", "10+ Protected Zones"],
      icon: <FiGlobe />
    }
  ];

  return (
    <section 
      id="theory-of-change" 
      className="relative w-full min-h-screen py-16 md:py-0 overflow-hidden bg-white font-cabin flex flex-col justify-center px-6 md:px-16"
    >
      {/* Background Decor - Scaled for mobile */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <h2 className="text-[15vh] md:text-[30vh] font-nohemi absolute -bottom-10 -right-10 leading-none">PROCESS</h2>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col relative z-10">
        
        {/* Header Section */}
        <header className="mb-10 md:mb-16 flex-shrink-0 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center md:justify-start gap-3 mb-3"
          >
            <span className="w-8 md:w-12 h-[2px] bg-glacier-accent" />
            <span className="text-glacier-accent font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[9px] md:text-[10px]">
              The Logic of Action
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-7xl font-nohemi text-glacier-dark leading-tight md:leading-none">
            Theory of <span className="text-glacier-primary italic">Change</span>
          </h2>
        </header>

        {/* The Evolution Path */}
        <div className="relative flex-grow flex items-center">
          
          {/* Connecting Line (Desktop: Horizontal) */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-glacier-dark/5 -translate-y-1/2 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 w-full relative">
            {theoryData.map((block, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Desktop Connector Line (Horizontal) */}
                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-full items-center">
                  {idx < theoryData.length - 1 && (
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: idx * 0.3 }}
                      className="w-full h-[2px] bg-gradient-to-r from-glacier-primary to-transparent origin-left"
                    />
                  )}
                </div>

                {/* Mobile Connector Line (Vertical) */}
                {idx < theoryData.length - 1 && (
                  <div className="absolute -bottom-10 left-10 w-[2px] h-8 bg-gradient-to-b from-glacier-primary/40 to-transparent md:hidden" />
                )}

                {/* Node Card */}
                <div className="relative z-10 bg-glacier-light/50 backdrop-blur-sm border border-glacier-dark/5 p-6 md:p-8 rounded-3xl group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-glacier-primary/10 transition-all duration-500 md:hover:-translate-y-2">
                  
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-lg md:text-xl text-glacier-primary group-hover:scale-110 transition-transform duration-500">
                      {block.icon}
                    </div>
                    <span className="font-nohemi text-glacier-soft/20 text-2xl md:text-3xl italic">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl lg:text-2xl font-nohemi text-glacier-dark mb-4 group-hover:text-glacier-primary transition-colors">
                    {block.title}
                  </h3>

                  <ul className="space-y-2 md:space-y-3">
                    {block.content.map((line, i) => (
                      <li 
                        key={i} 
                        className="flex items-start gap-2 text-sm lg:text-base text-glacier-dark/60 group-hover:text-glacier-dark/80 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-glacier-primary/40 mt-1.5 md:mt-2 shrink-0" />
                        {line}
                      </li>
                    ))}
                  </ul>

                  {/* Corner Fold Visual */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-glacier-primary/5 rounded-tl-3xl rounded-br-3xl group-hover:bg-glacier-primary/20 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Legend */}
        <footer className="mt-12 md:mt-16 flex flex-col md:flex-row justify-between items-center text-[9px] md:text-[10px] tracking-widest text-glacier-dark/30 uppercase font-bold gap-6 border-t border-glacier-dark/5 pt-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-glacier-primary" />
              <span>Incremental Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-glacier-accent" />
              <span>Systemic Transformation</span>
            </div>
          </div>
          <span className="hidden md:block">Glacier Framework v2.0</span>
        </footer>
      </div>
    </section>
  );
};

export default TheoryOfChange;