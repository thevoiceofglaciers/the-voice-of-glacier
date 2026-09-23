'use client';

import { motion } from 'framer-motion';
import { Html } from '@/lib/content';

export default function DushanbeConferenceSection({ title, body, pdfTitle, pdfUrl }) {
  return (
    <section
      id="dushanbe-conference"
      className="py-20 px-6 md:px-16 bg-glacier-light text-glacier-dark"
    >
      <div className="max-w-6xl mx-auto md:text-md text-xs">
        <Html as="h2" html={title} className="text-lg md:text-4xl font-nohemi mb-6 text-glacier-primary" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6 text-lg leading-relaxed font-cabin"
        >
          <Html html={body} className="space-y-6 [&_a]:underline" />

          {pdfUrl && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-glacier-dark">
              {pdfTitle}
            </h3>
            <div className="w-full h-[600px] border-2 border-glacier-primary rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="Dushanbe Declaration PDF"
              />
            </div>
          </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
