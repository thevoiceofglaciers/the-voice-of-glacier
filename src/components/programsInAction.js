"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ProgramsInActionSection() {
  const programs = [
    {
      title: "Glacier Dialogues",
      description:
        "A global conversation platform bringing scientists, youth leaders, policymakers, artists, and frontline communities together.",
      image:
        "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=1600",
      link: "/programs/glacier-dialogues",
    },
    {
      title: "Youth Cryosphere Fellowship",
      description:
        "Empowering next-generation glacier leaders through research, storytelling, and policy immersion.",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600",
      link: "/programs/youth-fellowship",
    },
  ];

  return (
    <section className="relative h-[80vh] flex flex-col justify-center px-6 md:px-16 bg-white overflow-hidden">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-glacier-primary">
          Programs in Action
        </h2>
        <p className="mt-3 text-lg text-glacier-dark/80">
          Turning vision into measurable impact through dialogue and collaboration.
        </p>
      </div>

      {/* Carousel */}
      <div className="mt-12">
        <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="snap-center shrink-0 w-[280px] md:w-[340px] aspect-square"
            >
              <Link href={program.link}>
                <div className="group relative h-full w-full rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  
                  {/* Background Image */}
                  <img
                    src={program.image}
                    alt={program.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition duration-500" />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-bold">
                      {program.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-white/90">
                      {program.description}
                    </p>

                    <div className="mt-4 flex items-center font-semibold">
                      Learn More
                      <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">
                        →
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}