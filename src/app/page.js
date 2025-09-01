"use client";

import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/footer";
import {
  FaHandsHelping,
  FaBalanceScale,
  FaPeopleArrows,
  FaPaintBrush,
  FaMountain,
  FaTemperatureHigh,
  FaWater,
  FaPeopleCarry,
  FaTractor,
  FaExclamationTriangle,
  FaGlobeAmericas,
  FaSeedling,
  FaUsers,
  FaGlobe,
  FaEye, FaBullseye , FaTint, FaBookOpen, FaMagic , FaLeaf
} from "react-icons/fa";
import Link from "next/link";
import { Landmark, Users } from "lucide-react";
import HeroSection from "@/components/HeroSection";

export default function HomePage() {

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
  const [isScrolled, setIsScrolled] = useState(false);

  const stats = [
  {
    icon: <FaTemperatureHigh className="text-2xl text-glacier-primary" />,
    label: "3x Faster Warming",
    desc: "The Cryosphere is warming three times faster than the global average, signaling an urgent climate crisis.",
  },
  {
    icon: <FaWater className="text-2xl text-glacier-primary" />,
    label: "50% Melt by 2100",
    desc: "Half of the world's glaciers could disappear by 2100, threatening ecosystems, water supplies, and sea levels.",
  },
  {
    icon: <FaMountain className="text-2xl text-glacier-primary" />,
    label: "Himalayan Ice Loss",
    desc: "Himalayan glaciers have lost over 40% of their ice volume since 2000, destabilizing regional water systems.",
  },
  {
    icon: <FaPeopleCarry className="text-2xl text-glacier-primary" />,
    label: "2 Billion Lives at Risk",
    desc: "Over 2 billion people rely on glacier-fed rivers like the Ganges, Indus, Brahmaputra, and Yangtze for water and food.",
  },
  {
    icon: <FaTractor className="text-2xl text-glacier-primary" />,
    label: "Disrupted Livelihoods",
    desc: "Glacier retreat disrupts agriculture, hydropower generation, and water security, especially in vulnerable regions.",
  },
  {
    icon: <FaExclamationTriangle className="text-2xl text-glacier-primary" />,
    label: "Glacial Flood Threat",
    desc: "Glacial lake outburst floods (GLOFs) are increasing in frequency, putting lives, infrastructure, and economies at risk.",
  },
  {
    icon: <FaGlobeAmericas className="text-2xl text-glacier-primary" />,
    label: "Albedo Loss",
    desc: "Melting glaciers reduce Earth's reflectivity (albedo), causing the planet to absorb more heat and warm even faster.",
  },
  {
    icon: <FaLeaf className="text-2xl text-glacier-primary" />,
    label: "Ecological & Cultural Loss",
    desc: "Fragile mountain ecosystems are collapsing, and Indigenous cultures rooted in the cryosphere are eroding rapidly.",
  },
];



useEffect(() => {
  const onScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };
  window.addEventListener("scroll", onScroll);

  const video = document.getElementById("hero-video");
  if (video) {
    video.playbackRate = 0.7;
  }

  // ✅ Auto scroll to hash on page load
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300); // small delay for layout readiness
    }
  }

  return () => window.removeEventListener("scroll", onScroll);
}, []);

  const Button = ({ children, variant = "solid", className = "" }) => {
    const base = "px-8 py-3 rounded-full font-semibold transition duration-300 transform hover:scale-105"; // More prominent buttons
    const styles = {
      solid: "bg-glacier-primary text-white hover:bg-glacier-dark shadow-lg",
      outline:
        "border-2 border-glacier-primary text-glacier-primary hover:bg-glacier-primary hover:text-white shadow-md",
    };
    return (
      <button className={`${base} ${styles[variant]} ${className}`}>
        {children}
      </button>
    );
  };

  const SectionHeader = ({ title, description, isLightBackground = true }) => (
    <div className="text-center mb-16">
      <h2 className={`text-xl md:text-5xl font-nohemi mb-4 ${isLightBackground ? 'text-glacier-primary' : 'text-white'}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg md:text-xl max-w-3xl mx-auto ${isLightBackground ? 'text-glacier-dark' : 'text-glacier-light'}`}>
          {description}
        </p>
      )}
    </div>
  );

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


  return (
    <div className="bg-glacier-light text-glacier-dark">
      <Navbar />

      {/* Hero Banner */}
      <HeroSection/>

      


      {/* Parallax Section 1: Cryosphere Background */}
      <section
        id="crisis"
        className="py-24 px-6 md:px-16 bg-glacier-light text-glacier-dark"
      >
        <div className="max-w-6xl mx-auto text-center">
          <SectionHeader
            title="The Crisis: A Universal Cry from the Ice"
            description="Glaciers are vanishing fast, threatening water, ecosystems, and life. We must act now to raise awareness and protect them urgently."
            isLightBackground={true}
          />

          <div className="grid md:grid-cols-2 md:text-lg text-xs gap-8 text-left mt-10">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                className="group flex items-start gap-4 p-6 bg-white/60 rounded-xl border border-white/30 shadow-lg cursor-pointer transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <div className="min-w-[2rem] text-glacier-dark">{stat.icon}</div>
                <div>
                  <h3 className="md:text-lg text-xs font-semibold mb-1">{stat.label}</h3>
                  <p className="text-sm max-h-0 overflow-hidden group-hover:max-h-40 group-hover:mt-1 transition-all duration-300 ease-in-out">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="text-xs md:text-lg mt-12 max-w-3xl mx-auto text-center flex flex-wrap justify-center gap-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            Without glaciers, we lose
            <span className="inline-flex items-center mx-1">
              <FaTint className="text-glacier-primary mr-1" />
              water,
            </span>
            <span className="inline-flex items-center mx-1">
              <FaBookOpen className="text-glacier-primary mr-1" />
              wisdom,
            </span>
            and
            <span className="inline-flex items-center mx-1">
              <FaMagic className="text-glacier-primary mr-1" />
              wonder.
            </span>
            Yet, glaciers remain underrepresented and invisible in policy, education, and public imagination.
          </motion.p>

          <motion.p
            className="mt-12 max-w-4xl mx-auto text-sm md:text-lg font-cabin text-glacier-dark leading-relaxed text-justify"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="text-4xl">&ldquo;</span>Everyone knows climate change is real and dangerous. But what most people don&rsquo;t realize is this: if glaciers disappear, so does life as we know it. Glaciers store the world&rsquo;s freshwater, cool the planet, feed our rivers, and keep ecosystems alive &mdash; yet they&rsquo;re melting faster than ever before, almost silently. This isn&rsquo;t just a climate crisis; it&rsquo;s a life crisis. And still, glaciers remain invisible in most climate action, policy, and public awareness. If we don&rsquo;t act now, our children may grow up in a world without ice, without water, and without the ancient wisdom that glaciers hold. The Voice of Glaciers Foundation exists to change that &mdash; by blending art, science, culture, community, and local stories to wake people up, inspire action, and protect what&rsquo;s left before it&rsquo;s too late.<span className="text-4xl">&rdquo;</span>
          </motion.p>
        </div>
      </section>


 {/* The Gaps We&#39;re Addressing */}
      <ParallaxBackground imageUrl="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img1.webp">
        <div id="the-gaps" className="max-w-6xl mx-auto">
          <SectionHeader
            title="The Gaps We&#39;re Addressing"
            description="The Voice of Glaciers Foundation was born from a simple truth:
 Glaciers are dying. Quietly. Quickly. Irreversibly."
            isLightBackground={false}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Public Imagination",
                missing: "Glaciers are seen as distant and abstract, not personal and relatable.",
              },
              {
                title: "Cultural Voice",
                missing: "Indigenous wisdom, mountain community stories, and sacred rituals are often ignored.",
              },
              {
                title: "Interdisciplinary Collaboration",
                missing: "Science, art, and spirituality operate in isolated silos.",
              },
              {
                title: "Policy Integration",
                missing:
                  "Glaciers and the broader Cryosphere are frequently excluded from national and international climate plans.",
              },
              {
                title: "Open Data Access",
                missing: "Glacier data, especially from the Global South, is limited, fragmented, or inaccessible.",
              },
              {
                title: "Glacier Pedagogy",
                missing: "No integrated, cryosphere-specific educational curriculum framework exists across schools and universities.",
              },
            ].map((gap, idx) => (
              <motion.div
                key={idx}
                className="p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-md border border-white/20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <h3 className="text-xl font-nohemi text-white mb-2">{gap.title}</h3>
                <p className="text-base font-cabin text-white/90">{gap.missing}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxBackground>

      {/* Why TVGF? */}
      <section className="py-20 px-6 md:px-16 bg-white text-glacier-dark">
        <div id="why-tvgf" className="max-w-6xl mx-auto">
          <SectionHeader
            title="Our Approach"
            description="The Voice of Glaciers Foundation is more than an organization; it&#39;s a global gratitude movement born from lived survival, uniting diverse voices for glacier stewardship."
            isLightBackground={true}
          />
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              className="space-y-6 text-lg leading-relaxed"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="md:text-2xl text-lg font-bold text-glacier-primary mb-4">Because we exist at the intersection of science, spirit, and storytelling.</h3>
              <ul className="list-disc md:text-lg text-sm  list-inside space-y-3">
                <li>Founded from <b>lived experience</b> inside a glacier, not just theory.</li>
                <li>We blend <b>policy, poetry, and people</b>; <b>data and devotion</b>; <b>science and spirit</b>; <b>memory and movement</b>.</li>
                <li>TVGF acts as a crucial <b>bridge between ice and identity</b>, connecting global communities to the cryosphere.</li>
                <li>It is the first-of-its-kind global platform centering glaciers as <b>sentient, sacred, and strategic</b> beings.</li>
              </ul>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 gap-6 cursor-pointer"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Unique Blend */}
              <div className="p-6 bg-glacier-light rounded-xl shadow-md group transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <FaSeedling className="text-glacier-primary md:text-xl text-sm" />
                  <h4 className="font-bold md:text-xl text-sm  text-glacier-primary">Unique Blend</h4>
                </div>
                <p className=" text-glacier-dark opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden mt-2 md:text-xl text-sm">
                  Blending science, storytelling, and spirituality for a holistic approach to glacier preservation.
                </p>
              </div>

              {/* Community-Driven */}
              <div className="p-6 bg-glacier-light rounded-xl shadow-md group transition-all duration-300">
                <div className="flex items-center gap-3 mb-2 md:text-xl text-sm">
                  <FaUsers className="text-glacier-primary" />
                  <h4 className="font-bold text-glacier-primary">Community-Driven</h4>
                </div>
                <p className=" text-glacier-dark opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden mt-2">
                  Empowering mountain communities and uplifting indigenous wisdom.
                </p>
              </div>

              {/* Global Impact */}
              <div className="p-6 bg-glacier-light rounded-xl md:text-xl text-sm shadow-md group transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <FaGlobe className="text-glacier-primary" />
                  <h4 className="font-bold text-glacier-primary">Global Impact</h4>
                </div>
                <p className=" text-glacier-dark opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden mt-2">
                  Influencing global policy and fostering intergenerational resilience.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Parallax Section 2: Vision & Mission Background */}
      <ParallaxBackground imageUrl="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img2.webp">
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
      <section id="north-star" className="py-20 px-6 md:px-16 bg-white text-glacier-dark">

  {/* Main content on top of snow */}
  <div className="relative z-10 max-w-6xl mx-auto">
    <SectionHeader
      title="TVGF's North Star: Goals by 2035"
      description="By 2035, we envision a world fundamentally transformed in its relationship with glaciers."
      isLightBackground={true}
    />

    <div className="relative duration-1000">
  {/* Snow SVGs on the right */}
  <div className=" md:block absolute right-0 top-0 h-full w-[200px] flex flex-col items-end gap-6 pointer-events-none z-0">
    {[...Array(6)].map((_, i) => (
      <img
        key={i}
        src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/snow.svg"
        alt="Snowflake"
        className={`w-10 h-10 opacity-20 animate-float-slow-${i % 3}`}
        style={{
          marginTop: `${i * 20}px`,
          transform: `translateX(${i % 2 === 0 ? "0" : "20px"})`,
        }}
      />
    ))}
  </div>

  {/* Main content */}
  <ul className="space-y-10 mt-12 relative z-10 md:text-xl text-sm">
    {goals.map((goal, index) => (
      <li
        key={index}
        className="group relative border-l-4 border-glacier-primary pl-6 cursor-pointer"
      >
        <div className=" font-semibold text-glacier-primary">
          • {goal.title}
        </div>
        <motion.div
          className="mt-2 opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-[500px] transition-all duration-500 ease-in-out"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-glacier-dark/90">
            {goal.desc}
          </div>
        </motion.div>
      </li>
    ))}
  </ul>
</div>


          {/* Core Values Grid (unchanged) */}
          <div className="mt-20" id="core-values">
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


      {/* Origin Story: A Movement Born in Ice */}
     <section className="py-20 px-6 md:px-16 bg-white text-glacier-dark">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="A Movement Born in Ice"
          description="The ice is speaking — will we listen?"
          isLightBackground={true}
        />

        <motion.div
          className="grid md:grid-cols-3 gap-12 items-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >

          {/* LEFT IMAGE */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-glacier-primary shadow-xl transition-transform duration-300 mb-4">
              <img
                src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/hero-image.webp"
                alt="Anurag Maloo"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-glacier-dark text-xl font-semibold mb-1">Anurag Maloo</p>
            <p className="text-glacier-soft text-sm italic mb-4">Founder</p>
            <Link href="/story" passHref>
              <Button className="mt-2 hover:bg-glacier-primary hover:text-white transition duration-300">
                Watch Anurag&apos;s Story
              </Button>
            </Link>
          </div>

          {/* CENTER QUOTE */}
          <div className="space-y-6 text-center md:text-left">
            <p className="text-lg md:text-xl font-semibold leading-relaxed italic text-glacier-dark">
              &quot;I was held, not buried, by a Himalayan glacier on Annapurna. For 72 hours, it cradled me like a womb — cold, silent, alive.<br /><br />
              That ice didn&apos;t just trap me. It protected me. That glacier gave me a second chance. <br /><br />
              I survived. But glaciers won&apos;t. <br /><br />
              I owe my life to these glaciers. This work is my return offering.&quot;
            </p>
            <p className="text-lg font-medium text-glacier-primary">
              — Anurag Maloo, Founder
            </p>
          </div>

          {/* RIGHT IMAGE (Larger with rounded-lg) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-64 h-64 md:w-full md:h-full rounded-xl overflow-hidden border-4 border-glacier-light shadow-xl transition-transform duration-300 mb-4">
              <img
                src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/story/anurag-snow.png"
                alt="Anurag in Snow"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </motion.div>
      </div>
    </section>
     


      {/* Join the Movement CTA */}
      <section className="py-24 px-6 md:px-16 bg-gradient-to-r from-glacier-primary to-glacier-dark text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow ">Join the Movement</h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Join researchers, storytellers, communities, and leaders working to protect glaciers and the people who depend on them.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Button className="bg-white text-glacier-dark font-semibold hover:!bg-glacier-soft">
            <Link className="text-glacier-dark" href="/collaborate">
              Collaborate with us
            </Link>
          </Button>
        </div>
      </section>
      <Footer/>
    </div>
  );
}