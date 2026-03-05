"use client";

import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

/* =========================================================
   BLOCK RENDERER
========================================================= */

function RenderBlock({ block }) {
  switch (block.type) {
    /* ---------------- HERO ---------------- */
    case "hero":
      return (
        <div className="relative text-white text-center px-6 py-24 overflow-hidden bg-gradient-to-br from-[#0d2636] via-[#1a4060] to-[#2d6080]">
          {block.eyebrow && (
            <p className="font-sans text-[0.72rem] tracking-[0.2em] uppercase text-[#8fc8e8] mb-6">
              {block.eyebrow}
            </p>
          )}

          <h1 className="font-serif font-bold text-[clamp(1.9rem,5vw,3.1rem)] leading-[1.2] max-w-4xl mx-auto mb-5">
            {block.title}
          </h1>

          {block.subtitle && (
            <p className="italic text-[#b8d8ee] text-[1.05rem] max-w-2xl mx-auto mb-8 leading-[1.55]">
              {block.subtitle}
            </p>
          )}

          {block.meta && (
            <div className="font-sans text-[0.8rem] text-[#7aaec8] tracking-wide flex flex-wrap justify-center">
              {block.meta.map((item, i) => (
                <span key={i}>
                  {typeof item === "string"
                    ? item
                    : `${item.label}: ${item.value}`}
                  {i !== block.meta.length - 1 && " · "}
                </span>
              ))}
            </div>
          )}
        </div>
      );

    /* ---------------- PUBLICATION HEADER ---------------- */
    case "publicationHeader":
      return (
        <div className="border-b border-[#ddd5c8] py-5 text-center bg-white">
          <p className="font-sans text-[0.78rem] tracking-[0.18em] uppercase text-[#4a7fa5]">
            {block.text}
          </p>
        </div>
      );

    /* ---------------- LEAD ---------------- */
    case "lead":
      return (
        <div className="max-w-[720px] mx-auto px-6 mt-12">
          <p className="text-[1.1rem] leading-[1.7] border-l-4 border-[#4a7fa5] pl-6 text-[#1a1614]">
            {block.text}
          </p>
        </div>
      );

    /* ---------------- SECTION ---------------- */
    case "section":
      return (
        <div className="max-w-[720px] mx-auto px-6 py-12">
          {block.label && (
            <p className="font-sans text-[0.7rem] tracking-[0.22em] uppercase text-[#4a7fa5] mb-3">
              {block.label}
            </p>
          )}

          {block.title && (
            <h2 className="font-serif text-[1.65rem] font-bold leading-[1.25] mb-5">
              {block.title}
            </h2>
          )}

          {block.content?.map((item, i) => (
            <RenderBlock key={i} block={item} />
          ))}
        </div>
      );

    /* ---------------- PARAGRAPH ---------------- */
    case "paragraph":
      return (
        <p className="mb-5 text-[1rem] leading-[1.75] text-[#1a1614]">
          {block.text}
        </p>
      );

    /* ---------------- SUBHEADING ---------------- */
    case "subheading":
      return (
        <h3 className="font-serif text-[1.2rem] font-semibold mt-10 mb-4">
          {block.text}
        </h3>
      );

    /* ---------------- PULLQUOTE ---------------- */
    case "pullquote":
      return (
        <div className="relative my-10 p-8 bg-gradient-to-br from-[#0d2636] to-[#1a4060] rounded-md text-white">
          <span className="absolute text-[5rem] opacity-10 top-2 left-4 font-serif">
            “
          </span>

          <p className="relative z-10 font-serif italic text-[1.2rem] leading-[1.6] text-[#e8f4fc]">
            {block.quote}
          </p>

          {block.cite && (
            <cite className="block mt-4 font-sans text-[0.75rem] tracking-[0.1em] text-[#8fc8e8]">
              — {block.cite}
            </cite>
          )}
        </div>
      );

    /* ---------------- DIVIDER ---------------- */
    case "divider":
      return (
        <div className="max-w-[720px] mx-auto px-6">
          <hr className="border-t border-[#ddd5c8] my-12" />
        </div>
      );

    /* ---------------- DATA BOX ---------------- */
    case "dataBox":
      return (
        <div className="max-w-[720px] mx-auto px-6 my-10">
          <div className="bg-[#f2ebe4] p-6 rounded-lg">
            {block.title && (
              <h4 className="font-serif font-semibold mb-4">
                {block.title}
              </h4>
            )}
            <ul className="space-y-3 text-sm">
              {block.rows.map((row, i) => (
                <li key={i} className="flex justify-between border-b border-[#ddd5c8] pb-2">
                  <span>{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    /* ---------------- TWO PHASE ---------------- */
    case "twoPhase":
      return (
        <div className="max-w-[720px] mx-auto px-6 my-12 grid md:grid-cols-2 gap-8">
          {block.phases.map((phase, i) => (
            <div key={i} className="bg-[#f2ebe4] p-6 rounded-lg">
              <p className="font-sans text-[0.7rem] uppercase tracking-[0.14em] text-[#4a7fa5] mb-2">
                {phase.label}
              </p>
              <h4 className="font-serif font-semibold mb-3">
                {phase.title}
              </h4>
              <p className="text-sm leading-relaxed">
                {phase.description}
              </p>
            </div>
          ))}
        </div>
      );

    /* ---------------- FORMULA BOX ---------------- */
    case "formulaBox":
      return (
        <div className="max-w-[720px] mx-auto px-6 my-12">
          <div className="bg-gradient-to-br from-[#0d2636] to-[#1e5070] text-white p-10 rounded-xl text-center">
            <p className="text-lg font-mono mb-4">
              {block.formula}
            </p>
            {block.note && (
              <p className="text-xs text-[#b8d8ee]">
                {block.note}
              </p>
            )}
          </div>
        </div>
      );

    /* ---------------- LIST ---------------- */
    case "list":
      return (
        <ul className="list-disc ml-6 space-y-2 my-6">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    /* ---------------- CASCADE ---------------- */
    case "cascade":
      return (
        <div className="max-w-[720px] mx-auto px-6 my-8 space-y-3">
          {block.items.map((item, i) => (
            <div key={i} className="bg-[#f2ebe4] p-4 rounded-md">
              {item}
            </div>
          ))}
        </div>
      );

    /* ---------------- TENSION GRID ---------------- */
    case "tensionGrid":
      return (
        <div className="max-w-[720px] mx-auto px-6 my-10">
          <div className="grid md:grid-cols-2 border border-[#ddd5c8] rounded-lg overflow-hidden">
            <div className="bg-[#1a1614] text-white font-sans text-[0.72rem] tracking-[0.14em] uppercase px-4 py-3">
              The Tension
            </div>
            <div className="bg-[#1a1614] text-white font-sans text-[0.72rem] tracking-[0.14em] uppercase px-4 py-3">
              What It Looks Like
            </div>

            {block.rows.map((row, i) => (
              <>
                <div key={`l-${i}`} className="bg-[#f2ebe4] font-medium px-4 py-3 border-t border-[#ddd5c8]">
                  {row[0]}
                </div>
                <div key={`r-${i}`} className="px-4 py-3 border-t border-[#ddd5c8] text-[#4a4240]">
                  {row[1]}
                </div>
              </>
            ))}
          </div>
        </div>
      );

    /* ---------------- CLOSING ---------------- */
    case "closing":
      return (
        <div className="max-w-[720px] mx-auto px-6 my-16">
          <div className="bg-gradient-to-br from-[#0d2636] to-[#1e5070] text-white rounded-xl p-12 text-center">
            {block.title && (
              <h2 className="font-serif text-[1.5rem] font-bold mb-4">
                {block.title}
              </h2>
            )}

            {block.paragraphs?.map((para, i) => (
              <p key={i} className="text-[#b8d8ee] text-[0.98rem] mb-6 max-w-xl mx-auto">
                {para}
              </p>
            ))}

            {block.cta && (
              <p className="font-sans text-[0.82rem] tracking-[0.08em] text-[#8fc8e8]">
                {block.cta}
              </p>
            )}
          </div>
        </div>
      );

    /* ---------------- FOOTER ---------------- */
    case "footer":
      return (
        <footer className="max-w-[720px] mx-auto px-6 border-t border-[#ddd5c8] mt-16 pt-10 text-center text-sm text-[#6d645f]">
          {block.copyright && <p>{block.copyright}</p>}
          {block.series && <p className="mt-2">{block.series}</p>}
        </footer>
      );

    default:
      return null;
  }
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GlacierDialogueSessionTwo({ content }) {
  const router = useRouter();

  return (
    <div className="bg-[#faf7f2] text-[#1a1614] font-serif relative min-h-screen">
      
      {/* Back Button */}


      {/* Render Blocks */}
      <div>
        {content?.blocks?.map((block, index) => (
          <RenderBlock key={index} block={block} />
        ))}
      </div>

    </div>
  );
}