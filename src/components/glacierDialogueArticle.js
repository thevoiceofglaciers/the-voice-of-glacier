"use client";

import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

export default function GlacierDialogueSessionTwo({ content }) {
  const router = useRouter();

  return (
    <div className=" text-glacier-dark font-cabin relative">
      {/* Hero */}
      <div className="bg-gradient-to-br from-glacier-dark via-glacier-primary to-glacier-primary text-white text-center px-6 py-24">
        {content?.hero?.eyebrow && (
          <p className="uppercase tracking-[0.2em] text-xs text-glacier-soft mb-4">
            {content.hero.eyebrow}
          </p>
        )}

        <h1 className="font-nohemi text-3xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight mb-6">
          {content?.hero?.title}
        </h1>

        {content?.hero?.subtitle && (
          <p className="max-w-2xl mx-auto text-glacier-light/90 mb-6">
            {content.hero.subtitle}
          </p>
        )}

        {content?.hero?.meta && (
          <div className="flex flex-wrap justify-center gap-3 text-xs text-glacier-light/80">
            {content.hero.meta.map((item, i) => (
              <span key={i} className="flex items-center">
                {item}
                {i !== content.hero.meta.length - 1 && (
                  <span className="mx-2">·</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-glacier-primary hover:opacity-70 transition"
        >
          <IoArrowBack />
          Back
        </button>
      </div>

      {/* Content Container */}
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* INTRO */}
        {content?.intro && (
          <div className="mb-12">
            {content.intro.lede && (
              <p className="text-lg border-l-4 border-glacier-primary pl-6 mb-6 text-glacier-primary">
                {content.intro.lede}
              </p>
            )}

            {content.intro.paragraphs?.map((para, i) => (
              <p key={i} className="mb-4 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        )}

        <div className="border-t border-glacier-soft/40 my-16"></div>

        {/* SECTIONS */}
        {content?.sections?.map((section, index) => (
          <div key={index} className="mb-16">

            {section.label && (
              <p className="uppercase tracking-[0.2em] text-xs text-glacier-primary mb-2">
                {section.label}
              </p>
            )}

            {section.title && (
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 font-nohemi">
                {section.title}
              </h2>
            )}

            {section.paragraphs?.map((para, i) => (
              <p key={i} className="mb-4 leading-relaxed">
                {para}
              </p>
            ))}

            {section.pullquote && (
              <div className="bg-gradient-to-br from-glacier-dark to-glacier-primary text-glacier-light p-8 rounded-xl mt-10">
                <p className="italic text-lg mb-4">
                  {section.pullquote.quote}
                </p>
                {section.pullquote.cite && (
                  <cite className="text-xs tracking-wider opacity-80 block">
                    — {section.pullquote.cite}
                  </cite>
                )}
              </div>
            )}

          </div>
        ))}

        {/* CLOSING */}
        {content?.closing && (
          <div className="bg-gradient-to-br from-glacier-dark to-glacier-primary text-white rounded-2xl p-10 text-center mt-20">
            {content.closing.title && (
              <h2 className="text-2xl md:text-3xl font-bold mb-6 font-nohemi">
                {content.closing.title}
              </h2>
            )}

            {content.closing.paragraphs?.map((para, i) => (
              <p key={i} className="mb-4 text-glacier-light/90">
                {para}
              </p>
            ))}

            {content.closing.linksText && (
              <p className="mt-6 text-sm tracking-wide text-glacier-soft">
                {content.closing.linksText}
              </p>
            )}
          </div>
        )}

        {/* FOOTER */}
        {content?.footer && (
          <footer className="border-t border-glacier-soft/40 mt-16 pt-10 text-center text-sm text-glacier-soft">
            {content.footer.copyright && (
              <p>{content.footer.copyright}</p>
            )}
            {content.footer.series && (
              <p className="mt-2">{content.footer.series}</p>
            )}
          </footer>
        )}

      </div>
    </div>
  );
}