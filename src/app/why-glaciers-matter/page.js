import CryosphereTimeline from "@/components/cryosphereTimeline";
import { getPageContent } from "@/lib/wp";
import glacierMattersSchema from "@schemas/pages/glacier-matters.json";

export const revalidate = 3600;

// Content from WordPress (schema: wordpress/mu-plugins/tvgf-core/schemas/pages/glacier-matters.json).
export default async function WhyGlaciersPage() {
  const content = await getPageContent(glacierMattersSchema);
  const hkhParagraphs = (content.hkhText || "").split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="bg-white text-glacier-dark">

      {/* HERO */}
<section className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">

  {/* Background Video */}
  {content.heroVideo && (
  <video
    key={content.heroVideo}
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source
      src={content.heroVideo}
      type="video/mp4"
    />
  </video>
  )}

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-glacier-dark/70 to-glacier-primary/50" />

  {/* Content */}
  <div className="relative z-10 max-w-4xl px-6 text-white">
    <h1 className="text-4xl md:text-6xl font-nohemi leading-tight">
      {content.heroTitle}
    </h1>
    {content.heroSubtitle && (
    <p className="mt-6 text-xl md:text-2xl text-glacier-light">
      {content.heroSubtitle}
    </p>
    )}
  </div>
</section>

      {/* 1. THE CRYOSPHERE CRISIS */}
<section id="cryosphere-crisis" className="py-24 bg-glacier-dark text-white">
  <div className="max-w-7xl mx-auto px-6">

    <div className="grid md:grid-cols-2 gap-16 items-start">

      {/* LEFT SIDE CONTENT */}
      <div>
        <h2 className="text-4xl font-nohemi mb-6">
          {content.crisisTitle}
        </h2>

        {content.crisisIntro && (
        <p className="text-lg max-w-2xl text-glacier-light/90 mb-10">
          {content.crisisIntro}
        </p>
        )}

        <div className="space-y-6">
          {(content.cryosphereTitle || content.cryosphereText) && (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">
              {content.cryosphereTitle}
            </h3>
            <p className="text-glacier-light/80">
              {content.cryosphereText}
            </p>
          </div>
          )}

          {content.impacts.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">
              {content.impactsTitle}
            </h3>
            <ul className="list-disc list-inside space-y-2 text-glacier-light/80">
              {content.impacts.map((impact, i) => (
                <li key={i}>{impact}</li>
              ))}
            </ul>
          </div>
          )}
        </div>
        {content.crisisImage && (
        <div className="rounded-xl overflow-hidden mt-10 shadow-2xl">
            <img
              src={content.crisisImage}
              className="w-full h-full object-cover"
              alt="Himalayan glacier"
            />
          </div>
        )}
      </div>

      {/* RIGHT SIDE TIMELINE */}
        <CryosphereTimeline
          title={content.timelineTitle}
          points={content.timelinePoints}
          caption={content.timelineCaption}
          references={content.timelineReferences}
        />


    </div>
  </div>
</section>
{/* 2. WHY HKH MATTERS */}
<section id="Kush-Himalaya" className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* LEFT CONTENT */}
    <div>
      <h2 className="text-4xl font-nohemi text-glacier-primary mb-6">
        {content.hkhTitle}
      </h2>

      {hkhParagraphs.map((paragraph, i) => (
        <p
          key={i}
          className={i === 0 ? "text-lg text-glacier-dark/90 leading-relaxed" : "mt-6 text-lg text-glacier-dark/80"}
        >
          {paragraph}
        </p>
      ))}
    </div>

    {/* RIGHT IMAGE GRID */}
    <div className="grid grid-cols-2 gap-4">
      {content.hkhImages.map((item, i, all) => {
        // An odd image out at the end spans the full row as a wide banner.
        const isWide = all.length % 2 === 1 && i === all.length - 1;
        return (
          <div key={i} className={`rounded-xl overflow-hidden shadow-xl ${isWide ? "col-span-2" : ""}`}>
            <img
              src={item.image}
              alt={item.alt || ""}
              className={isWide ? "w-full h-64 object-cover" : "w-full h-full object-cover"}
            />
          </div>
        );
      })}
    </div>

  </div>
</section>

    {/* 3. WHAT HAPPENS WHEN GLACIERS DISAPPEAR */}
    <section id="Disappear" className="py-24 bg-glacier-light">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div>
        <h2 className="text-4xl md:text-5xl font-nohemi text-glacier-primary mb-8">
            {content.disappearTitle}
        </h2>

        {content.disappearText && (
        <p className="text-xl leading-relaxed text-glacier-dark/90">
            {content.disappearText}
        </p>
        )}

        {content.disappearNote && (
        <p className="mt-8 text-lg text-glacier-dark/70">
            {content.disappearNote}
        </p>
        )}
        </div>

        {/* RIGHT VIDEO */}
        {content.disappearVideo && (
        <div
  className="relative shadow-2xl overflow-hidden"
  style={{
    clipPath: "polygon(0 16%, 100% 16%, 100% 50%, 81% 88%, 0 88%, 0% 50%)"
  }}
>
  <video
    key={content.disappearVideo}
    autoPlay
    muted
    loop
    playsInline
    className="w-full h-full object-cover"
  >
    <source src={content.disappearVideo} type="video/mp4" />
  </video>

  <div className="absolute inset-0 bg-gradient-to-t from-glacier-dark/40 to-transparent" />
</div>
        )}

    </div>
    </section>

      {/* 4. WATER, RISK & LIVELIHOODS */}
      <section className="py-24 bg-glacier-dark text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-nohemi mb-12">
            {content.livelihoodsTitle}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {content.livelihoodsCards.map((card, i) => (
              <div key={i} className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-glacier-light/80">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STORIES FROM THE MOUNTAINS */}
      <section className="relative py-28 text-white text-center overflow-hidden">
        {content.storiesImage && (
        <img
          src={content.storiesImage}
          className="absolute inset-0 w-full h-full object-cover"
          alt="Mountain Story"
        />
        )}
        <div className="absolute inset-0 bg-glacier-dark/70" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-nohemi mb-6">
            {content.storiesTitle}
          </h2>
          {content.storiesText && (
          <p className="text-xl leading-relaxed">
            {content.storiesText}
          </p>
          )}
        </div>
      </section>

    </div>
  );
}
