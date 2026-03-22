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
      id="strategic-gaps" 
      className="relative w-full h-screen overflow-hidden bg-white font-cabin flex flex-col justify-center px-6 md:px-16"
    >
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-glacier-light/20 -skew-x-12 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full flex flex-col h-[85vh]">
        
        {/* Condensed Header */}
        <header className="mb-8 flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <span className="w-8 h-[2px] bg-glacier-accent" />
            <span className="text-glacier-accent font-bold tracking-widest uppercase text-[10px]">Strategic Framework</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-nohemi text-glacier-dark leading-tight">
            Gaps We <span className="text-glacier-primary italic">Bridge</span>
          </h2>
        </header>

        {/* Bento Grid - Designed to fill the height */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow">
          {strategyGaps.map((gap, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-glacier-light/30 border border-glacier-dark/5 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-glacier-primary/5"
            >
              <div className="relative z-10">
                {/* Number and Icon Row */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                    <img src={gap.icon} alt="" className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <span className="font-nohemi text-3xl text-glacier-soft/20 group-hover:text-glacier-primary/20 transition-colors">
                    0{index + 1}
                  </span>
                </div>

                <h4 className="text-xl lg:text-2xl font-nohemi text-glacier-dark mb-4 leading-snug">
                  {gap.title}
                </h4>
              </div>

              <div className="relative z-10">
                <p className="text-glacier-dark/60 text-sm md:text-base leading-relaxed mb-6 group-hover:text-glacier-dark/80 transition-colors">
                  {gap.content}
                </p>
                
                {/* Interactive Indicator */}
                <div className="h-1 w-full bg-glacier-dark/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    className="h-full bg-glacier-primary"
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-glacier-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Utility Text */}
        <footer className="mt-8 flex justify-between items-center text-[10px] tracking-widest text-glacier-dark/30 uppercase font-bold">
          <span>Targeting Structural Failures</span>
          <div className="flex gap-4">
            <span>Science</span>
            <span>Law</span>
            <span>Equity</span>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default StrategicGaps;