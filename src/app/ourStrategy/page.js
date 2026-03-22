"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useEffect } from "react";
import { FaDatabase, FaBookOpen, FaUsers, FaMicrophoneAlt, FaGavel  , FaBullseye , FaEye ,   FaHandsHelping,
  FaBalanceScale,
  FaPeopleArrows,
  FaPaintBrush,
  FaMountain, FaMagic , FaLeaf } from "react-icons/fa";
import StrategicGaps from "@/components/strategicGaps";
import EngineModel from "@/components/engingeModal";
import DualForceModel from "@/components/dualForceModal";
import TheoryOfChange from "@/components/theoryOfChange";
// the crises , our approach (why tvgf),  , vision and mission , tvgf goals , story , remove vission and mission 

// add the gaps after the crises 
const roadmap = [
  {
    phase: "2025-26",
    focus:
      "Build narrative capital: storytelling, visibility, co-creation model, launch GlacierX, core team, digital channels",
  },
  {
    phase: "2026-27",
    focus:
      "Deploy Education + Activation tools, fellowships, residencies, glacier curriculum pilots, early policy pilots & policy white paper",
  },
  {
    phase: "2027-29 Goal",
    focus:
      "Ensure glaciers have policy protection, cultural visibility, and community stewardship in at least 10 countries",
  },
];

const longTermGoal = [
  "Ensure glaciers have policy protection, cultural visibility, and community stewardship in at least 10 countries.",
  "Global Glacier Guardians Network visualized.",
  "Policy change realized."
]

const theoryData = [
  {
    title: "Inputs",
    content: [
      "Programs",
      "Networks",
      "Media",
      "Advocacy",
      "Funding",
      "Partners"
    ]
  },
  {
    title: "Activities",
    content: [
      "GlacierX",
      "Fellowships",
      "Curricula",
      "Storytelling",
      "Campaigns"
    ]
  },
  {
    title: "Outputs",
    content: [
      "Events",
      "Curriculum",
      "Declarations",
      "Toolkits",
      "Policy briefs",
      "Art",
      "Community pledges"
    ]
  },
  {
    title: "Outcomes",
    content: [
      "Policy recognition",
      "Influence, local stewardship",
      "Youth/community engagement",
      "Digital activation"
    ]
  },
  {
    title: "Impact",
    content: ["Systemic glacier protection", "Cryosphere justice"]
  }
];

const strategyGaps = [
  {
    title: "Lack of Glacier Education",
    content:
      "Most communities and schools lack awareness of the Cryosphere`s role in climate systems, leading to weak advocacy and action.",
  },
  {
    title: "Disconnected Global-Local Policy",
    content:
      "Policies are often created globally without accounting for local realities or involving local voices from glacier regions.",
  },
  {
    title: "Missing Open Cryo Data",
    content:
      "Data on glacial retreat, GLOFs, and melt patterns are often siloed, outdated, or inaccessible to the public and researchers.",
  },
  {
    title: "Under-leveraged Youth Movements",
    content:
      "Young leaders from glacier regions lack platforms to scale their activism or connect with global policy and climate networks.",
  },
];


  const goals = [
  {
    title: "A Cryosphere Justice Framework",
    desc: "Glaciers legally and culturally protected in 10+ countries.",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img3.webp",
  },
  {
    title: "Cryosphere Pedagogy & Education",
    desc: "Embedded in school systems worldwide.",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img3.jpg",
  },
  {
    title: "Real-time Glacier Monitoring",
    desc: "Publicly accessible data for all.",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img3.jpg",
  },
  {
    title: "Global Glacier Guardians Network",
    desc: "Mobilizing 100,000+ individuals across continents.",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img3.jpg",
  },
  {
    title: "Glaciers Resacralized",
    desc: "Through art, ritual, memory, and community initiatives.",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img3.jpg",
  },
  {
    title: "Humanity & Glaciers",
    desc: "A relationship built on reverence and reciprocity.",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img3.jpg",
  },
];

const pillars = [
  {
    title: "Glacier Literacy",
    content: "Building cryo-education programs",
  },
  {
    title: "Community Engagement",
    content: "Grassroots movements & training",
  },
  {
    title: "Creative Comms",
    content: "Art, films, storytelling for awareness",
  },
  {
    title: "Open Data",
    content: "Accessible cryosphere data platforms",
  },
  {
    title: "Policy Advocacy",
    content: "Influencing national & global decisions",
  },
];

export default function StrategyPage() {
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
      <Navbar />

      {/* Hero Banner */}
      

 {/* Parallax Section 2: Vision & Mission Background */}
      <ParallaxBackground id="vision-mission" imageUrl="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img2.webp">
  <div className="max-w-6xl mx-auto" id="vision">
    <SectionHeader
      title="Our Vision & Mission"
      description="Guided by our North Star Goals for 2035, we empower communities, protect glaciers, and advance climate resilience."
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
          <h3 className="text-2xl font-bold text-white">Vision</h3>
        </div>
        <p className=" text-white/90 leading-relaxed">
          To spark a global movement that unites science, storytelling, and community action to protect glaciers and reimagine humanity&#39;s bond with the cryosphere.
        </p>
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
          <h3 className="text-2xl font-bold text-white">Mission</h3>
        </div>
        <p className=" text-white/90 leading-relaxed">
          To activate global and local ecosystems for glacier preservation by weaving <b>science, storytelling, spirituality, and stewardship</b> into transformative experiences that inspire policy, protect ecosystems, and reshape human relationships with the cryosphere.
        </p>
      </motion.div>
    </div>
  </div>
</ParallaxBackground>


 {/* TVGF’s North Star & Core Values */}
      <section id="north-star" className="py-20 px-6 md:px-16 bg-glacier-light text-glacier-dark rounded-b-lg">

  {/* Main content on top of snow */}
      <div className="relative duration-1000">

  <SectionHeader
    title="TVGF's North Star: Goals by 2035"
    description="By 2035, we envision a world transformed in its relationship with glaciers."
    isLightBackground={true}
  />

  {/* Two Column Layout */}
  <div className="mt-14 grid md:grid-cols-2 gap-12 items-start">

    {/* LEFT — Goals */}
    <ul className="space-y-8 md:text-lg text-sm">
      {goals.map((goal, index) => (
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
            {goal.desc}
          </motion.div>
        </li>
      ))}
    </ul>

    {/* RIGHT — Vision Image */}
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
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200"
        alt="Glacier mountain landscape"
        className="shadow-lg w-full max-w-md object-cover"
      />

    </motion.div>

  </div>
</div>


  <div className="relative z-10 max-w-6xl mx-auto">


          {/* Core Values Grid (unchanged) */}
          <div className="mt-0" id="core-values">
            <h3 className="text-3xl font-bold text-glacier-primary mb-8 text-center">
              Our Core Values
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {(() => {
                const coreValues = [
                  {
                    name: "Collaboration",
                    desc: "Bridging diverse disciplines and cultures for collective impact.",
                    icon: FaHandsHelping,
                  },
                  {
                    name: "Integrity",
                    desc: "Grounded in robust scientific evidence and deep community respect.",
                    icon: FaBalanceScale,
                  },
                  {
                    name: "Equity",
                    desc: "Uplifting indigenous wisdom and empowering local leadership.",
                    icon: FaPeopleArrows,
                  },
                  {
                    name: "Creativity",
                    desc: "Driving change through storytelling, science, and co-created art.",
                    icon: FaPaintBrush,
                  },
                  {
                    name: "Resilience",
                    desc: "Fostering long-term glacier guardianships and adaptive strategies.",
                    icon: FaMountain,
                  },
                  {
                    name: "Transparency",
                    desc: "Operating with open governance and unwavering accountability.",
                    icon: FaEye,
                  },
                ];
                return coreValues.map((value, idx) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={idx}
                      className="p-6 bg-glacier-soft rounded-xl shadow-sm text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      viewport={{ once: true, amount: 0.4 }}
                    >
                      <Icon className="text-3xl text-glacier-primary mb-3 mx-auto" />
                      <h4 className="font-bold text-xl text-glacier-dark mb-2">
                        {value.name}
                      </h4>
                      <p className="text-sm text-glacier-dark/80">{value.desc}</p>
                    </motion.div>
                  );
                });
              })()}
            </div>
          </div>

        </div>
      </section>


      
     


      <StrategicGaps/>

     
     <EngineModel/>


     <DualForceModel/>

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
            Core Solution Pillars
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Open Data",
                description: "Ensuring glacier-related information is accessible, transparent, and openly shared.",
                icon: <FaDatabase className="w-6 h-6 text-glacier-light" />,
              },
              {
                title: "Glacier Literacy",
                description: "Educating the public and institutions about glaciers and their climate relevance.",
                icon: <FaBookOpen className="w-6 h-6 text-glacier-light" />,
              },
              {
                title: "Community Engagement",
                description: "Involving local communities in glacier conservation through grassroots participation.",
                icon: <FaUsers className="w-6 h-6 text-glacier-light" />,
              },
              {
                title: "Creative Comms",
                description: "Using storytelling, media, and design to spread glacier awareness widely.",
                icon: <FaMicrophoneAlt className="w-6 h-6 text-glacier-light" />,
              },
              {
                title: "Policy Advocacy",
                description: "Shaping policies by influencing institutions and decision-makers globally.",
                icon: <FaGavel className="w-6 h-6 text-glacier-light" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-xl p-6 bg-glacier-dark border border-glacier-soft/30 shadow-md text-left transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  {item.icon}
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

          <p className="text-sm md:text-base text-glacier-light/70 max-w-2xl mx-auto mt-12">
            These core pillars form the foundation of our approach to cryosphere justice — integrating knowledge, community power, data transparency, creative storytelling, and global policy change.
          </p>
        </div>
      </motion.section>

     <TheoryOfChange/>

      <Footer/>
    </div>
  );
}
