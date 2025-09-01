"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DushanbeConferenceSection from "@/components/DushanbeConferenceSection";
import SDGGrid from "@/components/SDG";
import { HiArrowDown } from "react-icons/hi";


const effortsData = [
  {
    id: "decade-of-ocean-science",
    title:
      "United Nations Decade of Ocean Science for Sustainable Development (2021-2030)",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/efforts/unitedNationsDecade.webp",
    alt: "UN Decade of Ocean Science",
    content: [
      "The United Nations has proclaimed the years 2021 to 2030 as the Decade of Ocean Science for Sustainable Development, a groundbreaking global initiative aimed at transforming ocean science and policy to support a healthier, more resilient, and sustainable ocean. This initiative recognizes the urgent need to reverse the decline in ocean health and mobilize science and innovation in service of sustainable development.",
      'Under the slogan &quot;The Science We Need for the Ocean We Want&quot;, the Decade brings together governments, academia, industry, NGOs, Indigenous knowledge holders, and youth to co-design and co-deliver ocean science solutions. The Decade focuses on seven societal outcomes, including a clean ocean, a healthy and resilient ocean, a predicted ocean, a safe ocean, a sustainably harvested ocean, a transparent ocean, and an inspiring and engaging ocean.',
      "This initiative is critical to addressing challenges such as climate change, biodiversity loss, sea-level rise, marine pollution, and ocean acidification. By promoting partnerships and enhancing international cooperation, the Decade seeks to fill knowledge gaps and develop tools that empower communities and policymakers. It is a call to all stakeholders to unite in a common framework to deliver the science we need to safeguard the ocean for future generations.",
    ],
    imageOnLeft: false,
  },
  {
    id: "year-of-glacier",
    title: "2025: International Year of Glaciers' Preservation",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/efforts/YearOfGlacier.webp",
    alt: "International Year of Glaciers' Preservation",
    content: [
      "In recognition of the urgent need to protect our planet&rsquo;s ice reserves, the United Nations has declared 2025 as the International Year of Glaciers&rsquo; Preservation. Glaciers are rapidly disappearing due to rising global temperatures, threatening freshwater sources, sea level stability, and entire ecosystems. This year-long global campaign seeks to raise awareness, mobilize action, and inspire scientific and community-led efforts toward glacier preservation.",
      "The initiative will feature educational programs, research collaborations, cultural events, and youth engagement around the world. It also aims to amplify the voices of indigenous and mountain communities who rely directly on glacier-fed rivers and are most affected by glacial retreat. Through international summits, public campaigns, and policy dialogues, the year will serve as a catalyst to accelerate glacier monitoring, early-warning systems, and sustainable adaptation measures.",
      "The International Year of Glaciers&rsquo; Preservation is not only a scientific milestone&mdash;it is a moral call to humanity to act before it&rsquo;s too late. It bridges science and storytelling, data and emotion, reminding us that protecting glaciers means safeguarding our shared future. Let 2025 be a year of unity, urgency, and unwavering commitment to our cryosphere.",
    ],
    imageOnLeft: false,
  },
  {
    id: "decade-of-cryosphere",
    title: "UN Decade of Action for Cryospheric Sciences (2025-2034)",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/efforts/UNdecade.webp",
    alt: "UN Decade of Action for Cryospheric Sciences",
    content: [
      "The United Nations has designated 2025 to 2034 as the Decade of Action for Cryospheric Sciences&mdash;a pivotal global initiative to accelerate scientific understanding of Earth&rsquo;s frozen realms. This decade highlights the critical role glaciers, snow, permafrost, and polar ice play in regulating global climate, freshwater availability, sea-level rise, and biodiversity.",
      "Through the Decade, scientists, Indigenous communities, policy leaders, and youth will work collaboratively to expand cryospheric data collection, deploy cutting-edge technologies, and amplify public awareness of cryosphere-driven change. The initiative underscores the fact that the cryosphere is no longer a distant, icy domain&mdash;its melting is a visible and urgent global challenge that threatens ecosystems, economies, and human lives.",
      "The Decade of Action will support inclusive and interdisciplinary research, ensure open data access, and foster education and training across nations. It aims to turn knowledge into action, empowering communities in vulnerable glacier and permafrost regions to build resilience and inform global climate policy. As the cryosphere thaws, the time to act is now. This UN Decade stands as a beacon of hope, science, and solidarity for a rapidly changing planet.",
    ],
    imageOnLeft: true,
  },
  {
    id: "international-polar-year",
    title: "The International Polar Year: A Global Cryosphere Initiative",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/efforts/InternationalPolarYear.webp",
    alt: "International Polar Year",
    content: [
      "The International Polar Year (IPY) represents a historic, collaborative scientific effort to study Earth&rsquo;s polar regions&mdash;the Arctic and Antarctic&mdash;and their vital role in the planet&rsquo;s climate system. Organized in multiple editions, the most recent IPY spanned from 2007 to 2009 and brought together over 60 nations, thousands of researchers, and indigenous communities to observe, document, and understand the profound transformations occurring at the poles.",
      "The IPY emphasized multidisciplinary research, combining atmospheric sciences, glaciology, oceanography, ecology, and social studies. It significantly enhanced the world&rsquo;s ability to monitor polar environments through satellite technologies, long-term observational networks, and data-sharing platforms. From shrinking sea ice to permafrost thaw and glacial retreat, the findings underscored the sensitivity of polar regions to climate change and their ripple effects across the globe.",
      "Beyond research, the IPY fostered public awareness, policy discourse, and educational outreach. It inspired a new generation of polar scientists and embedded the cryosphere into international climate agendas. Today, the legacy of the International Polar Year lives on, reminding us that understanding the poles is essential for preparing the planet for an uncertain future. The poles are not remote frontiers&mdash;they are the heartbeat of our climate.",
    ],
    imageOnLeft: true,
  },
];

const programs = [
  {
    id: "glacierx-gatherings",
    title: "GlacierX Gatherings",
    date: "",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img1.webp",
  },
  {
    id: "glacierx-residencies-fellowships",
    title: "GlacierX Residencies & Fellowships",
    date: "",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img2.webp",
  },
  {
    id: "education-toolkits",
    title: "Education & Toolkits",
    date: "",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img3.webp",
  },
  {
    id: "cultural-campaigns",
    title: "Cultural Campaigns & Public Rituals",
    date: "",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img1.webp",
  },
  {
    id: "glacier-guardians",
    title: "Glacier Guardians Network",
    date: "",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img2.webp",
  },
  {
    id: "policy-dialogues",
    title: "Policy Dialogues & Global Forums",
    date: "",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img3.webp",
  },
  {
    id: "digital-tools",
    title: "Digital Tools & Technology Platforms",
    date: "",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img2.webp",
  },
  {
    id: "storytelling",
    title: "Storytelling & Digital Strategy",
    date: "",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img2.webp",
  },
];

export default function FlagshipPrograms() {
    const handleScrollToConference = () => {
    const section = document.getElementById("dushanbe-conference");
    section?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <div className="bg-glacier-light text-glacier-dark min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section
        className="relative h-screen w-full overflow-hidden"
        id="programs-hero"
      >
        <video
          id="hero-video"
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover"
          src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacier-hero.mp4"
        />
        <div className="absolute inset-0 bg-glacier-dark/50 flex flex-col items-center justify-center text-center p-4 text-white">
          <h1 className="text-lg md:text-6xl font-cabin mb-4">
            Flagship Programs And Efforts
          </h1>
          <p className="text-xs md:text-2xl max-w-2xl font-nohemi">
            &quot;Where glaciers speak, communities rise, and the world listens.&quot;
          </p>
          <div className="mt-6 flex gap-4"></div>
        </div>
      </section>

      {/* International Efforts Section */}
      <section
  className="py-20 px-6 md:px-10 bg-white text-glacier-primary"
  id="international"
>
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-lg md:text-4xl font-nohemi mb-12 leading-snug">
      International efforts to advance cryospheric science.
    </h2>

    <div
      className="
        flex flex-col space-y-6
        md:flex-row md:flex-wrap md:space-y-0 md:space-x-0 md:gap-8
        items-stretch justify-center
      "
    >
      {[
        {
          src: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/efforts/susDevelopmentGoals.webp",
          alt: "SDG decade of action. 2021-2030",
          label: "SDG decade of action. 2021-2030",
          targetId: "sdg-section", // 🔹 new
        },
        {
          src: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/efforts/unitedNationsDecade.webp",
          alt: "Decade of Ocean Science",
          label: "Decade of Ocean Science",
          targetId: "decade-of-ocean-science",
        },
        {
          src: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/efforts/YearOfGlacier.webp",
          alt: "International Year of Glaciers' Preservation",
          label: "International Year of Glaciers Preservation",
          targetId: "year-of-glacier",
        },
        {
          src: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/efforts/UNdecade.webp",
          alt: "Decade of Action for Cryospheric Sciences",
          label: "Decade of Action for Cryospheric Sciences",
          targetId: "decade-of-cryosphere",
        },
        {
          src: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/efforts/InternationalPolarYear.webp",
          alt: "International Polar Year",
          label: "International Polar Year",
          targetId: "international-polar-year",
        }
      ].map(({ src, alt, label, targetId }, idx) => (
        <div
          key={idx}
          onClick={() => {
            const section = document.getElementById(targetId);
            section?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          className="flex flex-col bg-glacier-light rounded-xl shadow-md overflow-hidden w-full md:w-48 cursor-pointer"
        >
          <div className="h-64 w-full flex items-center justify-center bg-white">
            <img
              src={src}
              alt={alt}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="text-center font-medium py-4 min-h-[64px] text-xs md:text-base">
            {label}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Summary Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-8" id="ourPrograms">
        <div className="grid md:grid-cols-2 gap-12 items-center font-cabin">
          <div>
            <h2 className="text-lg md:text-4xl font-nohemi text-glacier-primary mb-6">
              Our Flagship Programs Overview
            </h2>
            <p className="text-xs md:text-lg text-glacier-dark mb-8">
              A concise look at the key programs driving our mission forward:
            </p>
            <ul className="space-y-5">
              {programs.map((program, index) => (
                <li
                  key={index}
                  className="border-l-4 border-glacier-primary pl-4"
                >
                  <h4 className="text-sm md:text-xl font-semibold text-glacier-dark">
                    {program.title}
                  </h4>
                  <span className="text-xs text-glacier-dark/70">
                    {program.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img1.webp"
              alt="Flagship Programs"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="sdg-section" className="bg-white">
        <SDGGrid />
      </section>

{/* Mapped Efforts Sections */}
{effortsData.map((effort, index) => (
  <section
    key={effort.id}
    id={effort.id}
    className={`py-20 px-6 md:px-10 text-glacier-dark ${
      index % 2 === 0 ? "bg-glacier-light" : "bg-white"
    }`}
  >
    <div
      className={`max-w-7xl mx-auto flex flex-col items-center gap-12 ${
        effort.imageOnLeft ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Image (first on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: effort.imageOnLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full md:w-[40%] rounded-xl overflow-hidden"
      >
        <img
          src={effort.image}
          alt={effort.alt}
          className="w-full h-auto object-contain"
        />
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, x: effort.imageOnLeft ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full md:w-[60%]"
      >
        <h2 className="text-lg md:text-4xl font-nohemi text-glacier-primary mb-6">
          {effort.title}
        </h2>
        {effort.content.map((para, i) => (
          <p
            key={i}
            className={`text-xs md:text-lg font-cabin leading-relaxed ${
              i > 0 ? "mt-4" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: para }}
          />
        ))}
      </motion.div>
    </div>
  </section>
))}
      <section id="dushanbe-conference">
        <DushanbeConferenceSection />
      </section>
      <button
        onClick={handleScrollToConference}
        className="fixed bottom-6 right-6 z-50 bg-glacier-primary hover:bg-glacier-dark text-white p-4 rounded-full shadow-lg transition-all flex gap-5 duration-300 text-sm md:text-base"
      >
        <span>Read the Dushanbe Declaration</span>
        <HiArrowDown className="bg-glacier-dark rounded-full  text-lg md:text-xl" />
      </button>
      <Footer />
    </div>
  );
}
