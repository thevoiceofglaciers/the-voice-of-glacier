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
      id="dual-force-model" 
      className="relative w-full h-screen overflow-hidden bg-glacier-light font-cabin flex flex-col justify-center px-6 md:px-16"
    >
      <div className="max-w-5xl mx-auto w-full h-[85vh] flex flex-col relative">
        
        {/* Header */}
        <header className="mb-12 text-center flex-shrink-0">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-nohemi text-glacier-dark"
          >
            Dual-Force <span className="text-glacier-primary italic">Action</span>
          </motion.h2>
          <p className="text-glacier-dark/50 uppercase tracking-[0.3em] text-[10px] mt-2 font-bold">
            Synchronized Structural Change
          </p>
        </header>

        {/* The Circuit Container */}
        <div className="relative flex-grow flex flex-col items-center justify-between py-10">
          
          {/* Central Animated Spine */}
          <div className="absolute top-0 bottom-0 w-[2px] bg-glacier-dark/10 overflow-hidden">
            {/* Top-Down Pulse */}
            <motion.div 
              variants={pulseVariants}
              animate="topToBottom"
              className="w-full h-20 bg-gradient-to-b from-transparent via-glacier-primary to-transparent"
            />
            {/* Bottom-Up Pulse */}
            <motion.div 
              variants={pulseVariants}
              animate="bottomToTop"
              className="w-full h-20 bg-gradient-to-t from-transparent via-glacier-accent to-transparent"
            />
          </div>

          {/* TOP-DOWN FORCE */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full"
          >
            <div className="flex-1 flex justify-end">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-glacier-dark/5 max-w-md flex items-center gap-6 group hover:border-glacier-primary/30 transition-colors">
                <div className="w-14 h-14 rounded-full bg-glacier-dark flex items-center justify-center flex-shrink-0">
                  <img src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/dual-force/goverment-building-svgrepo-com.svg" className="w-8 h-8 invert" alt="" />
                </div>
                <div>
                  <h4 className="font-nohemi text-glacier-dark text-lg uppercase tracking-wider">Institutional Force</h4>
                  <p className="text-sm text-glacier-dark/60 leading-relaxed">Partnering with governments to shape global policy and legislative protection.</p>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col items-center">
               <div className="w-24 h-24 rounded-full bg-glacier-dark text-white font-nohemi text-[10px] tracking-tighter flex items-center justify-center text-center p-4 shadow-2xl z-20">
                 TOP<br/>DOWN
               </div>
               <motion.div 
                 animate={{ y: [0, 5, 0] }} 
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute -bottom-6 text-glacier-dark"
               >
                 <svg width="20" height="20" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
               </motion.div>
            </div>
            
            <div className="flex-1 hidden md:block" />
          </motion.div>

          {/* MID-POINT SYNERGY (Visual Connector) */}
          <div className="relative py-4">
             <div className="px-4 py-1 rounded-full bg-white border border-glacier-dark/10 text-[9px] font-bold uppercase tracking-[0.2em] text-glacier-primary shadow-sm z-30 relative">
               Data Exchange Hub
             </div>
          </div>

          {/* BOTTOM-UP FORCE */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative z-10 flex flex-col md:flex-row-reverse items-center gap-8 w-full"
          >
            <div className="flex-1 flex justify-start">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-glacier-dark/5 max-w-md flex items-center gap-6 group hover:border-glacier-accent/30 transition-colors">
                <div className="w-14 h-14 rounded-full bg-glacier-accent flex items-center justify-center flex-shrink-0">
                  <img src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/dual-force/flag.svg" className="w-8 h-8 invert" alt="" />
                </div>
                <div>
                  <h4 className="font-nohemi text-glacier-dark text-lg uppercase tracking-wider">Community Force</h4>
                  <p className="text-sm text-glacier-dark/60 leading-relaxed">Empowering youth and indigenous guardians through grassroots campaigns.</p>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col items-center">
               <motion.div 
                 animate={{ y: [0, -5, 0] }} 
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute -top-6 text-glacier-dark"
               >
                 <svg width="20" height="20" viewBox="0 0 20 20"><path d="M15 12l-5-5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
               </motion.div>
               <div className="w-24 h-24 rounded-full bg-glacier-dark text-white font-nohemi text-[10px] tracking-tighter flex items-center justify-center text-center p-4 shadow-2xl z-20">
                 BOTTOM<br/>UP
               </div>
            </div>
            
            <div className="flex-1 hidden md:block" />
          </motion.div>

        </div>

        {/* Footer Link */}
        <footer className="mt-8 flex justify-center">
          <div className="h-10 px-6 rounded-full border border-glacier-dark/10 flex items-center gap-4 text-[10px] font-bold text-glacier-dark/40 tracking-widest uppercase">
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