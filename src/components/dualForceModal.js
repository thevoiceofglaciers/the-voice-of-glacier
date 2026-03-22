import React from 'react';
import { motion } from 'framer-motion';

const DualForceModel = () => {
  // Animation variants for the "Data Pulses"
  const pulseVariants = {
    topToBottom: {
      y: [0, 150, 300],
      opacity: [0, 1, 0],
      transition: { duration: 3, repeat: Infinity, ease: "linear" }
    },
    bottomToTop: {
      y: [300, 150, 0],
      opacity: [0, 1, 0],
      transition: { duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }
    }
  };

  return (
    <section 
      id="Dual-Force-Action" 
      className="relative w-full min-h-screen overflow-hidden bg-glacier-light font-cabin flex flex-col justify-center py-12 px-6 md:px-16"
    >
      <div className="max-w-5xl mx-auto w-full flex flex-col relative">
        
        {/* Header */}
        <header className="mb-8 md:mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-6xl font-nohemi text-glacier-dark"
          >
            Dual-Force <span className="text-glacier-primary italic">Action</span>
          </motion.h2>
          <p className="text-glacier-dark/50 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] mt-2 font-bold">
            Synchronized Structural Change
          </p>
        </header>

        {/* The Circuit Container */}
        <div className="relative flex flex-col items-center gap-12 md:gap-0 md:justify-between py-4 md:py-10">
          
          {/* Central Animated Spine - Hidden on very small screens to avoid clutter */}
          <div className="hidden md:block absolute top-0 bottom-0 w-[2px] bg-glacier-dark/10 overflow-hidden">
            <motion.div 
              variants={pulseVariants}
              animate="topToBottom"
              className="w-full h-20 bg-gradient-to-b from-transparent via-glacier-primary to-transparent"
            />
            <motion.div 
              variants={pulseVariants}
              animate="bottomToTop"
              className="w-full h-20 bg-gradient-to-t from-transparent via-glacier-accent to-transparent"
            />
          </div>

          {/* TOP-DOWN FORCE */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full"
          >
            <div className="flex-1 flex justify-center md:justify-end w-full">
              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-xl border border-glacier-dark/5 max-w-sm md:max-w-md flex items-center gap-4 md:gap-6 group hover:border-glacier-primary/30 transition-colors">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-glacier-dark flex items-center justify-center flex-shrink-0">
                  <img src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/dual-force/goverment-building-svgrepo-com.svg" className="w-6 h-6 md:w-8 md:h-8 invert" alt="" />
                </div>
                <div>
                  <h4 className="font-nohemi text-glacier-dark text-base md:text-lg uppercase tracking-wider">Institutional Force</h4>
                  <p className="text-xs md:text-sm text-glacier-dark/60 leading-relaxed">Partnering with governments to shape global policy and legislative protection.</p>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col items-center order-first md:order-none">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-glacier-dark text-white font-nohemi text-[9px] md:text-[10px] tracking-tighter flex items-center justify-center text-center p-4 shadow-2xl z-20">
                  TOP<br/>DOWN
                </div>
                <motion.div 
                  animate={{ y: [0, 5, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="hidden md:block absolute -bottom-6 text-glacier-dark"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </motion.div>
            </div>
            
            <div className="flex-1 hidden md:block" />
          </motion.div>

          {/* MID-POINT SYNERGY */}
          <div className="relative py-2 md:py-8">
             <div className="px-4 py-1.5 rounded-full bg-white border border-glacier-dark/10 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-glacier-primary shadow-sm z-30 relative">
               Data Exchange Hub
             </div>
          </div>

          {/* BOTTOM-UP FORCE */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col md:flex-row-reverse items-center gap-6 md:gap-8 w-full"
          >
            <div className="flex-1 flex justify-center md:justify-start w-full">
              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-xl border border-glacier-dark/5 max-w-sm md:max-w-md flex items-center gap-4 md:gap-6 group hover:border-glacier-accent/30 transition-colors">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-glacier-accent flex items-center justify-center flex-shrink-0">
                  <img src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/dual-force/flag.svg" className="w-6 h-6 md:w-8 md:h-8 invert" alt="" />
                </div>
                <div>
                  <h4 className="font-nohemi text-glacier-dark text-base md:text-lg uppercase tracking-wider">Community Force</h4>
                  <p className="text-xs md:text-sm text-glacier-dark/60 leading-relaxed">Empowering youth and indigenous guardians through grassroots campaigns.</p>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col items-center order-first md:order-none">
                <motion.div 
                  animate={{ y: [0, -5, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="hidden md:block absolute -top-6 text-glacier-dark"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20"><path d="M15 12l-5-5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </motion.div>
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-glacier-dark text-white font-nohemi text-[9px] md:text-[10px] tracking-tighter flex items-center justify-center text-center p-4 shadow-2xl z-20">
                  BOTTOM<br/>UP
                </div>
            </div>
            
            <div className="flex-1 hidden md:block" />
          </motion.div>

        </div>

        {/* Footer Link */}
        <footer className="mt-12 md:mt-16 flex justify-center">
          <div className="h-10 px-6 rounded-full border border-glacier-dark/10 flex items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-bold text-glacier-dark/40 tracking-widest uppercase">
            <span>Legislation</span>
            <div className="w-1 h-1 bg-glacier-primary rounded-full" />
            <span>Mobilization</span>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default DualForceModel;