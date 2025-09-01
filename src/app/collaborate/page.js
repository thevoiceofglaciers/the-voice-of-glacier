"use client"

import { motion } from "framer-motion"
import {
  FaHandsHelping,
  FaGlobe,
  FaPeopleCarry,
  FaMicroscope,
  FaLightbulb,
  FaUsers,
  FaBullhorn,
  FaPenFancy,
  FaCogs,
  FaExternalLinkAlt,
} from "react-icons/fa"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Reusable Section Header
const SectionHeader = ({ title, description, Icon }) => (
  <div className="text-center mb-12">
    <div className="flex justify-center items-center gap-3 mb-4">
      {Icon && <Icon className="text-4xl text-glacier-primary" />}
      <h2 className="text-4xl md:text-5xl font-extrabold text-glacier-primary text-balance">{title}</h2>
    </div>
    {description && (
      <p className="text-lg md:text-xl text-glacier-foreground max-w-3xl mx-auto leading-relaxed">{description}</p>
    )}
  </div>
)

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

export default function CollaboratePage() {
  return (
    <div className="bg-glacier-background text-glacier-foreground min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative w-full h-[600px] md:h-[420px] overflow-hidden">
        <img
          src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/sun-glacier.webp"
          alt="Sunrise over a glacier landscape"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          sizes="100vw"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-glacier-dark/70 to-glacier-primary/50 flex items-center">
          <div className="px-6 md:px-16 max-w-7xl w-full mx-auto md:pt-10">
            <motion.h1
              className="text-2xl lg:text-5xl font-bold text-white drop-shadow-lg text-pretty"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Be The Voice Of Glaciers Foundation
            </motion.h1>
            <motion.p
              className="mt-3 text-base md:text-xl text-white/90 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Join the multidisciplinary community of Glacier Guardians, as researchers, glaciologists, climate scientists, storytellers, artists, climbers, mountaineers, filmmakers, photographers, policymakers, journalists, media representatives, innovators, entrepreneurs, indigenous communities, and young leaders working to protect glaciers and the people who depend on them.
            </motion.p>
          </div>
        </div>
      </div>

      <main id="main-content" className="flex flex-col">
        {/* Section: Introduction */}



        {/* Section: Why Collaborate */}
        <motion.section
          className="w-full bg-glacier-light py-16 md:py-20 px-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Why Collaborate with TVGF?" />
            <div className="grid md:grid-cols-3 gap-6 md:gap-10">
              {[
                {
                  title: "Global Network",
                  desc: "Connect with scientists, explorers, communities, and leaders across 60+ countries.",
                  icon: FaGlobe,
                },
                {
                  title: "Lived Experience",
                  desc: "Rooted in a survival story from the Himalayas, our movement blends human resilience with environmental urgency.",
                  icon: FaPeopleCarry,
                },
                {
                  title: "Collective Action",
                  desc: "Together we bridge science, storytelling, and indigenous wisdom to give glaciers—and the communities they sustain—a voice.",
                  icon: FaHandsHelping,
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  role="article"
                  tabIndex={0}
                  className="group bg-glacier-background p-6 md:p-8 rounded-2xl shadow-md border border-glacier-border hover:shadow-xl hover:-translate-y-1 focus-visible:-translate-y-1 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-glacier-primary/40"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  aria-label={item.title}
                >
                  <item.icon className="text-3xl text-glacier-primary mb-4" aria-hidden="true" />
                  <h4 className="text-xl font-bold text-glacier-primary mb-2">{item.title}</h4>
                  <p className="text-glacier-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Section: Ways to Collaborate */}
        <motion.section
          className="w-full py-16 md:py-20 px-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Ways to Collaborate" />
            <div className="grid gap-10 md:grid-cols-2 items-start">
              <div>
                <ul className="space-y-6 text-lg text-glacier-foreground list-disc pl-5">
                  <li>
                    <b className="text-glacier-dark">Partner With Us:</b> Corporates, nonprofits, academic institutions,
                    and agencies—co-create programs that drive awareness, resilience, and policy change.
                  </li>
                  <li>
                    <b className="text-glacier-dark">Support Our Projects:</b> From climate education to community
                    resilience, your support helps us scale impact in glacier regions and beyond.
                  </li>
                  <li>
                    <b className="text-glacier-dark">Volunteer & Internships:</b> Bring your skills in research, media,
                    design, or grassroots mobilization.
                  </li>
                  <li>
                    <b className="text-glacier-dark">Join Our Climate & Glacier Network:</b> Become a Glacier
                    Guardian—explorers, youth leaders, artists, and scientists uniting to protect frozen frontiers.
                  </li>
                  <li>
                    <b className="text-glacier-dark">Collaborate on Storytelling:</b> Help us bring glacier stories alive
                    through art, film, journalism, podcasts, and cultural projects.
                  </li>
                </ul>
              </div>
              <figure className="rounded-2xl overflow-hidden shadow-md border border-glacier-border aspect-[16/9] md:aspect-[4/3]">
                <img
                  src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/speaker.webp"
                  alt="A field team collaborating during a glacier expedition"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  sizes="(min-width: 768px) 38rem, 100vw"
                  decoding="async"
                />
                <figcaption className="text-sm text-glacier-foreground px-4 py-3 bg-glacier-background">
                  Field collaboration accelerates science, storytelling, and community impact.
                </figcaption>
              </figure>
            </div>
          </div>
        </motion.section>

        {/* Section: Collaboration Pathways */}
        <motion.section
          className="w-full bg-glacier-light py-16 md:py-20 px-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Collaboration Pathways"
              description="Select the pathway that best describes how you want to collaborate. You can choose more than one."
            />
            <div className="grid md:grid-cols-2 gap-6 md:gap-10">
              {[
                {
                  title: "Knowledge Partner",
                  points: [
                    "Share research, data, and expertise on glaciers, climate change, and ecosystems.",
                    "Co-create reports, whitepapers, and academic exchanges.",
                    "Support evidence-based storytelling and policy briefs.",
                  ],
                  icon: FaMicroscope,
                },
                {
                  title: "Funding & Resource Partner",
                  points: [
                    "Provide philanthropic support, CSR funding, or grants.",
                    "Contribute in-kind resources such as equipment, technology, or space.",
                    "Enable scaling of local and global programs.",
                  ],
                  icon: FaHandsHelping,
                },
                {
                  title: "Community Partner",
                  points: [
                    "Work directly with glacier-adjacent communities.",
                    "Co-design resilience programs, education, and awareness campaigns.",
                    "Bridge indigenous knowledge with global platforms.",
                  ],
                  icon: FaUsers,
                },
                {
                  title: "Policy & Advocacy Partner",
                  points: [
                    "Collaborate on climate diplomacy and policy reforms.",
                    "Influence decision-making at national and international levels.",
                    "Organize roundtables, briefings, and advocacy campaigns.",
                  ],
                  icon: FaBullhorn,
                },
                {
                  title: "Storytelling & Media Partner",
                  points: [
                    "Collaborate on films, podcasts, art projects, and exhibitions.",
                    "Amplify voices of local communities and Glacier Guardians.",
                    "Shape global narratives around glaciers and climate justice.",
                  ],
                  icon: FaPenFancy,
                },
                {
                  title: "Innovation & Technology Partner",
                  points: [
                    "Provide technological solutions for glacier monitoring, climate adaptation, or data visualization.",
                    "Collaborate on hackathons, innovation labs, and pilots.",
                    "Support open-source tools for global use.",
                  ],
                  icon: FaCogs,
                },
                {
                  title: "Volunteer & Talent Partner",
                  points: [
                    "Offer skilled volunteers, interns, or fellows.",
                    "Provide mentorship and leadership development.",
                    "Support training and capacity building within TVGF.",
                  ],
                  icon: FaUsers,
                },
              ].map((path, idx) => (
                <motion.div
                  key={idx}
                  className="bg-glacier-background p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-glacier-primary outline-none focus-visible:ring-2 focus-visible:ring-glacier-primary/40"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  role="region"
                  aria-labelledby={`pathway-${idx}`}
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <path.icon className="text-2xl text-glacier-primary" aria-hidden="true" />
                    <h4 id={`pathway-${idx}`} className="text-xl font-bold text-glacier-primary">
                      {path.title}
                    </h4>
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-glacier-foreground">
                    {path.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <section className="py-16 md:py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-extrabold text-glacier-primary mb-6 text-balance"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Let&#39;s Climb Together
            </motion.h2>
            <motion.p
              className="text-lg text-glacier-foreground mb-10 leading-relaxed"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              If you or your organization want to partner, co-create, or contribute, we’d love to hear from you. Write
              to us at <b className="text-glacier-dark">thevoiceofglaciers@gmail.com</b> or use the form below.
            </motion.p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">


              <motion.a
                href="https://docs.google.com/forms/d/e/1FAIpQLScxbQubbwUS2rdI3KRD9ZGbppWN5B6ZITGw7SmDHMG34c2CXw/viewform?usp=preview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-glacier-primary text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-glacier-dark transition-colors duration-300"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                aria-label="Open collaboration form in a new tab"
              >
                <FaExternalLinkAlt aria-hidden="true" />
                Collaboration form
              </motion.a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
