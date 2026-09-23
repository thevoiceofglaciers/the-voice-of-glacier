"use client"

import { motion } from "framer-motion"
import { FaExternalLinkAlt } from "react-icons/fa"
import { Html } from "@/lib/content"
import { Icon } from "@/lib/icons"

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

// Rendered by page.js with `content` from WordPress (schema:
// wordpress/mu-plugins/tvgf-core/schemas/pages/collaborate.json).
export default function CollaboratePage({ content }) {
  return (
    <div className="bg-glacier-background text-glacier-foreground min-h-screen">

      {/* Hero Banner */}
      <div className="relative w-full h-[600px] md:h-[420px] overflow-hidden">
        {content.heroImage && (
        <img
          src={content.heroImage}
          alt={content.heroImageAlt}
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          sizes="100vw"
          decoding="async"
        />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-glacier-dark/70 to-glacier-primary/50 flex items-center">
          <div className="px-6 md:px-16 max-w-7xl w-full mx-auto md:pt-10">
            <motion.h1
              className="text-2xl lg:text-5xl font-bold text-white drop-shadow-lg text-pretty"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {content.heroTitle}
            </motion.h1>
            <motion.p
              className="mt-3 text-base md:text-xl text-white/90 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {content.heroText}
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
            <SectionHeader title={content.whyTitle} />
            <div className="grid md:grid-cols-3 gap-6 md:gap-10">
              {content.whyCards.map((item, idx) => (
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
                  <Icon name={item.icon} className="text-3xl text-glacier-primary mb-4" aria-hidden="true" />
                  <h4 className="text-xl font-bold text-glacier-primary mb-2">{item.title}</h4>
                  <p className="text-glacier-foreground">{item.description}</p>
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
            <SectionHeader title={content.waysTitle} />
            <div className="grid gap-10 md:grid-cols-2 items-start">
              <div>
                <Html
                  html={content.waysList}
                  className="text-lg text-glacier-foreground [&_ul]:space-y-6 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:text-glacier-dark [&_a]:underline"
                />
              </div>
              {content.waysImage && (
              <figure className="rounded-2xl overflow-hidden shadow-md border border-glacier-border aspect-[16/9] md:aspect-[4/3]">
                <img
                  src={content.waysImage}
                  alt={content.waysImageAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  sizes="(min-width: 768px) 38rem, 100vw"
                  decoding="async"
                />
                {content.waysCaption && (
                <figcaption className="text-sm text-glacier-foreground px-4 py-3 bg-glacier-background">
                  {content.waysCaption}
                </figcaption>
                )}
              </figure>
              )}
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
              title={content.pathwaysTitle}
              description={content.pathwaysIntro}
            />
            <div className="grid md:grid-cols-2 gap-6 md:gap-10">
              {content.pathways.map((path, idx) => (
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
                    <Icon name={path.icon} className="text-2xl text-glacier-primary" aria-hidden="true" />
                    <h4 id={`pathway-${idx}`} className="text-xl font-bold text-glacier-primary">
                      {path.title}
                    </h4>
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-glacier-foreground">
                    {(path.points || []).map((p, i) => (
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
              {content.ctaTitle}
            </motion.h2>
            <motion.div
              className="text-lg text-glacier-foreground mb-10 leading-relaxed [&_strong]:text-glacier-dark [&_a]:underline"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Html html={content.ctaText} />
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">


              {content.ctaButtonLabel && content.ctaButtonUrl && (
              <motion.a
                href={content.ctaButtonUrl}
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
                {content.ctaButtonLabel}
              </motion.a>
              )}
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}
