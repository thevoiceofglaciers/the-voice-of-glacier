"use client";

import { motion } from "framer-motion";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function PindariGlacierPage() {
  return (
    <div className="bg-glacier-background text-glacier-foreground min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative w-full h-[600px] md:h-[420px] overflow-hidden">
        <img
          src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/sun-glacier.webp"
          alt="Pindari Glacier in the Kumaon Himalaya"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          sizes="100vw"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-glacier-dark/70 to-glacier-primary/50 flex items-center">
          <div className="px-6 md:px-16 max-w-7xl w-full mx-auto md:pt-10">
            <motion.div
              className="flex items-center gap-2 text-white/90 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FaMapMarkerAlt aria-hidden="true" />
              <span className="text-sm md:text-base font-medium tracking-wide">
                Kumaon Himalaya, Uttarakhand, India
              </span>
            </motion.div>
            <motion.h1
              className="text-2xl lg:text-5xl font-bold text-white drop-shadow-lg text-pretty"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Pindari Glacier
            </motion.h1>
            <motion.p
              className="mt-3 text-base md:text-xl text-white/90 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              A closer look at one of the Himalaya&rsquo;s storied glaciers &mdash; its story, its science, and the
              communities it sustains.
            </motion.p>
          </div>
        </div>
      </div>

      <main id="main-content" className="flex flex-col">
        <motion.section
          className="w-full bg-glacier-light py-20 md:py-28 px-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
              <FaClock className="text-4xl text-glacier-primary" aria-hidden="true" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-glacier-primary text-balance mb-6">
              Coming Soon
            </h2>
            <p className="text-lg md:text-xl text-glacier-foreground leading-relaxed">
              We&rsquo;re putting together the full profile of the Pindari Glacier &mdash; its history, current
              health, and the voices connected to it. Check back soon, or explore our other glacier stories in the
              meantime.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="/glacierDialgoues"
                className="inline-flex items-center gap-2 bg-glacier-primary text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-glacier-dark transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Explore Glacier Dialogues
              </motion.a>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
