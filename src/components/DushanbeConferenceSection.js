'use client';

import { motion } from 'framer-motion';

export default function DushanbeConferenceSection() {
  return (
    <section
      id="dushanbe-conference"
      className="py-20 px-6 md:px-16 bg-glacier-light text-glacier-dark"
    >
      <div className="max-w-6xl mx-auto md:text-md text-xs">
        <h2 className="text-lg md:text-4xl font-nohemi mb-6 text-glacier-primary">
          The High-Level International Conference on Glaciers&#39; Preservation concluded May 31<sup>st</sup> after a successful three days of international cooperation in Dushanbe, Republic of Tajikistan.
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6 text-lg leading-relaxed font-cabin"
        >
          <p>
            The conference, held in support of the <strong>International Year of Glaciers&#39; Preservation (IYGP) 2025</strong> and the <strong>Decade of Action for Cryosphere Sciences (2025-2034)</strong>, brought together over 2,500 participants from 80 countries and emphasized the crucial connection between glaciers and sustainable socio-economic development.
          </p>

          <p>
            The conference culminated in the adoption of the <strong>Dushanbe Declaration</strong>, a collective commitment to coordinated international action to safeguard glaciers. The document outlines urgent concerns and calls for immediate measures including reductions in greenhouse gas emissions, shifts to environmentally sustainable production, and the implementation of advanced monitoring systems.
          </p>

          <p>
            An international coalition was also announced, comprising states, scientific institutions, civil society organizations, and environmental movements. This coalition will oversee the declaration&#39;s implementation, facilitate knowledge exchange, attract investment, and foster climate technology innovation.
          </p>

          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-glacier-dark">
              Read the Dushanbe Declaration (PDF)
            </h3>
            <div className="w-full h-[600px] border-2 border-glacier-primary rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="/Dushanbe-Glaciers-Declaration-High-Level-International-Conference.pdf"
                className="w-full h-full"
                title="Dushanbe Declaration PDF"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
