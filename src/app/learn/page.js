import GlacierGlossary from "@/components/glossary";
import GlacierCard from "@/components/GlacierCard";
import QuizSection from "@/components/quizSection";
import { getCollection, getPageContent } from "@/lib/wp";
import { Html } from "@/lib/content";
import learnSchema from "@schemas/pages/learn.json";
import glacierProfileSchema from "@schemas/collections/glacier_profile.json";
import quizQuestionSchema from "@schemas/collections/quiz_question.json";
import glossaryTermSchema from "@schemas/collections/glossary_term.json";

export const revalidate = 3600;

export default async function LearnPage() {
  // All four fall back to the built-in content in the schemas on any
  // WordPress error, so the page always renders.
  const [content, glaciers, questions, terms] = await Promise.all([
    getPageContent(learnSchema),
    getCollection(glacierProfileSchema),
    getCollection(quizQuestionSchema),
    getCollection(glossaryTermSchema),
  ]);

  return (
    <main className="w-full text-glacier-dark overflow-x-hidden scroll-smooth">

      {/* Hero Section with Quick Links */}
      <section className="relative h-screen w-full overflow-hidden" id="hero">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
          src={content.heroVideo || undefined}
        />
        <div className="absolute inset-0 bg-glacier-dark bg-opacity-60 flex flex-col items-center justify-center text-white text-center p-6">
          <h1 className="text-4xl sm:text-5xl font-nohemi mb-4">
            {content.heroTitle}
          </h1>
          {content.heroSubtitle && (
            <p className="text-lg sm:text-xl max-w-2xl font-cabin mb-8">
              {content.heroSubtitle}
            </p>
          )}

          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { label: "Introduction", id: "introduction" },
              { label: "Explore", id: "explore" },
              { label: "Glacier Data", id: "glacier-data" },
              { label: "Glossary", id: "glossary" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="bg-white text-glacier-primary px-4 py-2 rounded font-semibold font-cabin hover:bg-glacier-light transition"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1: Introduction */}
      <section
        className="py-20 px-6 md:px-20 bg-glacier-light text-glacier-dark font-cabin"
        id="introduction"
      >
        <h2 className=" md:text-4xl text-3xl font-nohemi mb-8 text-glacier-primary">
          {content.introTitle}
        </h2>

        {content.introQuote && (
          <blockquote className="md:text-xl text-md italic mb-8 text-center text-glacier-dark whitespace-pre-line">
            {content.introQuote}
          </blockquote>
        )}

        <Html
          html={content.introBody}
          className="[&_p]:mb-6 [&_p]:text-sm md:[&_p]:text-lg [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-8 [&_ul]:space-y-3 [&_ul]:text-glacier-dark [&_ul]:text-sm md:[&_ul]:text-lg [&_a]:underline"
        />
      </section>

      {/* Section 2: Explore */}
      <section
        className="py-16 px-4 sm:px-6 md:px-20 bg-glacier-soft font-cabin"
        id="explore"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 font-nohemi text-glacier-primary">
          {content.exploreTitle}
        </h2>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory custom-scrollbar">
          {content.exploreLinks.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group rounded-lg overflow-hidden min-w-[250px] sm:min-w-[300px] md:min-w-[350px] max-w-sm flex-shrink-0 h-60 sm:h-64 md:h-72 shadow-lg snap-start"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center px-4 text-center">
                <h4 className="text-white text-sm sm:text-base md:text-lg font-bold">
                  {item.title}
                </h4>
              </div>
            </a>
          ))}
        </div>
      </section>


      {/* Section 3: Glacier Data Comparison */}
      <section
        className="py-20 px-6 md:px-20 bg-glacier-light font-cabin"
        id="glacier-data"
      >
        <h2 className="text-4xl font-nohemi mb-8 text-glacier-primary">
          {content.glacierDataTitle}
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {glaciers.map((glacier) => (
            <GlacierCard
              key={glacier.id}
              title={glacier.title}
              location={glacier.location}
              retreat={glacier.retreat}
              concern={glacier.concern}
              beforeImage={glacier.beforeImage}
              afterImage={glacier.afterImage}
              beforeLabel={glacier.beforeLabel}
              afterLabel={glacier.afterLabel}
            />
          ))}
        </div>
      </section>

      {/* Quiz */}
      <QuizSection title={content.quizTitle} questions={questions} />

      {/* Section 4: Glossary */}
      <section className="py-20 px-6 md:px-20 bg-glacier-soft" id="glossary">
        <GlacierGlossary title={content.glossaryTitle} terms={terms} />
      </section>

    </main>
  );
}
