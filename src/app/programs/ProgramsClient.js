"use client";

import { motion } from "framer-motion";
import DushanbeConferenceSection from "@/components/DushanbeConferenceSection";
import SDGGrid from "@/components/SDG";
import { HiArrowDown } from "react-icons/hi";
import { Html } from "@/lib/content";


// Rendered by page.js with `content` from WordPress (schema:
// wordpress/mu-plugins/tvgf-core/schemas/pages/programs.json).
export default function FlagshipPrograms({ content }) {
    const handleScrollToConference = () => {
    const section = document.getElementById("dushanbe-conference");
    section?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <div className="bg-glacier-light text-glacier-dark min-h-screen">

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
          src={content.heroVideo || undefined}
        />
        <div className="absolute inset-0 bg-glacier-dark/50 flex flex-col items-center justify-center text-center p-4 text-white">
          <h1 className="text-lg md:text-6xl font-cabin mb-4">
            {content.heroTitle}
          </h1>
          {content.heroQuote && (
            <p className="text-xs md:text-2xl max-w-2xl font-nohemi">
              {content.heroQuote}
            </p>
          )}
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
      {content.effortsTitle}
    </h2>

    <div
      className="
        flex flex-col space-y-6
        md:flex-row md:flex-wrap md:space-y-0 md:space-x-0 md:gap-8
        items-stretch justify-center
      "
    >
      {content.effortTiles.map(({ image, alt, label, target }, idx) => (
        <div
          key={idx}
          onClick={() => {
            const section = document.getElementById((target || "").replace(/^#/, ""));
            section?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          className="flex flex-col bg-glacier-light rounded-xl shadow-md overflow-hidden w-full md:w-48 cursor-pointer"
        >
          <div className="h-64 w-full flex items-center justify-center bg-white">
            <img
              src={image}
              alt={alt || label}
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
              {content.programsTitle}
            </h2>
            {content.programsIntro && (
              <p className="text-xs md:text-lg text-glacier-dark mb-8">
                {content.programsIntro}
              </p>
            )}
            <ul className="space-y-5">
              {content.programsList.map((program, index) => (
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

          {content.programsImage && (
            <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-lg">
              <img
                src={content.programsImage}
                alt="Flagship Programs"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <section id="sdg-section" className="bg-white">
        <SDGGrid title={content.sdgTitle} intro={content.sdgIntro} goals={content.sdgGoals} />
      </section>

{/* Mapped Efforts Sections */}
{content.efforts.map((effort, index) => (
  <section
    key={effort.anchor || index}
    id={effort.anchor || undefined}
    className={`py-20 px-6 md:px-10 text-glacier-dark ${
      index % 2 === 0 ? "bg-glacier-light" : "bg-white"
    }`}
  >
    <div
      className={`max-w-7xl mx-auto flex flex-col items-center gap-12 ${
        effort.imagePosition === "right" ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Image (first on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: effort.imagePosition === "right" ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full md:w-[40%] rounded-xl overflow-hidden"
      >
        <img
          src={effort.image}
          alt={effort.imageAlt || effort.title}
          className="w-full h-auto object-contain"
        />
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, x: effort.imagePosition === "right" ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full md:w-[60%]"
      >
        <h2 className="text-lg md:text-4xl font-nohemi text-glacier-primary mb-6">
          {effort.title}
        </h2>
        <Html
          html={effort.body}
          className="[&_p]:text-xs md:[&_p]:text-lg [&_p]:font-cabin [&_p]:leading-relaxed [&_p+p]:mt-4 [&_a]:underline"
        />
      </motion.div>
    </div>
  </section>
))}
      <section id="dushanbe-conference">
        <DushanbeConferenceSection
          title={content.dushanbeTitle}
          body={content.dushanbeBody}
          pdfTitle={content.dushanbePdfTitle}
          pdfUrl={content.dushanbePdf}
        />
      </section>
      {content.dushanbeButtonLabel && (
      <button
        onClick={handleScrollToConference}
        className="fixed bottom-6 right-6 z-50 bg-glacier-primary hover:bg-glacier-dark text-white p-4 rounded-full shadow-lg transition-all flex gap-5 duration-300 text-sm md:text-base"
      >
        <span>{content.dushanbeButtonLabel}</span>
        <HiArrowDown className="bg-glacier-dark rounded-full  text-lg md:text-xl" />
      </button>
      )}
    </div>
  );
}
