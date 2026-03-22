import React from 'react';
import { motion } from 'framer-motion';

const StrategicGaps = () => {
  const strategyGaps = [
    {
      title: "Knowledge Fragmentation",
      content: "Bridging the divide between scientific data and indigenous wisdom.",
      icon: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/strategicGaps/book-open-svgrepo-com.svg",
    },
    {
      title: "Legislative Voids",
      content: "Developing legal frameworks that recognize glaciers as entities with rights.",
      icon: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/strategicGaps/file-svgrepo-com.svg",
    },
    {
      title: "Leadership Deficits",
      content: "Empowering climate leaders trained in cryosphere advocacy.",
      icon: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/strategicGaps/file-svgrepo-com.svg",
    },
    {
      title: "Global Disconnect",
      content: "Transforming glacial melting into a localized, urgent call for action.",
      icon: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/strategicGaps/globe-2-svgrepo-com.svg",
    },
  ];

  return (
    <section 
      id="gaps" 
      className="relative w-full min-h-screen overflow-hidden bg-white font-cabin flex flex-col justify-center py-16 px-6 md:px-16"
    >
      {/* Subtle Background Elements - Modified for better mobile visibility */}
      <div className="absolute top-0 right-0 w-full md:w-1/4 h-full bg-glacier-light/10 md:bg-glacier-light/20 -skew-x-0 md:-skew-x-12 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full flex flex-col">
        
        {/* Condensed Header */}
        <header className="mb-10 md:mb-12 flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-3"
          >
            <span className="w-8 h-[2px] bg-glacier-accent" />
            <span className="text-glacier-accent font-bold tracking-widest uppercase text-[9px] md:text-[10px]">Strategic Framework</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-nohemi text-glacier-dark leading-tight max-w-2xl">
            Gaps We <span className="text-glacier-primary italic">Bridge</span>
          </h2>
        </header>

        {/* Bento Grid - Responsive Column Spans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {strategyGaps.map((gap, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-glacier-light/40 md:bg-glacier-light/30 border border-glacier-dark/5 rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[280px] transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-glacier-primary/10"
            >
              <div className="relative z-10">
                {/* Number and Icon Row */}
                <div className="flex justify-between items-start mb-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl shadow-sm flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                    <img src={gap.icon} alt="" className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <span className="font-nohemi text-2xl md:text-3xl text-glacier-soft/30 group-hover:text-glacier-primary/20 transition-colors">
                    0{index + 1}
                  </span>
                </div>

                <h4 className="text-xl md:text-2xl font-nohemi text-glacier-dark mb-4 leading-snug">
                  {gap.title}
                </h4>
              </div>

              <div className="relative z-10">
                <p className="text-glacier-dark/60 text-sm md:text-base leading-relaxed mb-6 group-hover:text-glacier-dark/80 transition-colors">
                  {gap.content}
                </p>
                
                {/* Interactive Indicator - Modified to show slightly on mobile to suggest interaction */}
                <div className="h-1 w-full bg-glacier-dark/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "-70%" }}
                    whileHover={{ x: "0%" }}
                    className="h-full bg-glacier-primary"
                    transition={{ type: "spring", stiffness: 80 }}
                  />
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-glacier-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Utility Text */}
        <footer className="mt-12 flex flex-col md:flex-row gap-4 justify-between items-center text-[9px] md:text-[10px] tracking-widest text-glacier-dark/30 uppercase font-bold border-t border-glacier-dark/5 pt-8">
          <span>Targeting Structural Failures</span>
          <div className="flex gap-6">
            <span className="hover:text-glacier-primary transition-colors cursor-default">Science</span>
            <span className="hover:text-glacier-primary transition-colors cursor-default">Law</span>
            <span className="hover:text-glacier-primary transition-colors cursor-default">Equity</span>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default StrategicGaps;