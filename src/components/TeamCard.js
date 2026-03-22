"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeamCard({ name, role, image }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-[180px] h-[250px] flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. The Background Blue Card - Morphs slightly or stays rectangular */}
      <motion.div
        animate={{
          height: isHovered ? "180px" : "240px",
          borderRadius: isHovered ? "24px" : "12px",
          y: isHovered ? 20 : 0
        }}
        className="absolute inset-0 w-full bg-glacier-primary shadow-lg z-0"
      />

      {/* 2. The Morphing Image Container */}
      <motion.div
        animate={{
          y: isHovered ? -60 : -30, // Pulls the image up on hover
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={{
            borderRadius: isHovered ? "12px" : "50%",
            width: isHovered ? "140px" : "110px",
            height: isHovered ? "140px" : "110px",
            borderWidth: isHovered ? "6px" : "0px",
          }}
          className="relative overflow-hidden border-glacier-light shadow-2xl bg-slate-200"
        >
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* 3. The Text - Morphs position based on hover */}
        <motion.div 
          animate={{
            y: isHovered ? 20 : 10,
            color: isHovered ? "glacier-light" : "#ffffff" // Slate-800 vs White
          }}
          className="text-center  px-2"
        >
          <h3 className="text-sm font-bold leading-tight">{name}</h3>
          <p className="text-[10px] font-medium opacity-80">{role}</p>
        </motion.div>
      </motion.div>


    </div>
  );
}