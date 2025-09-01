"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GlacierGlossary from "@/components/glossary";
import GlacierCard from "@/components/GlacierCard";
import QuizSection from "@/components/quizSection";

const glacierDetails = [
  {
    title: "Gangotri Glacier (Uttarakhand)",
    location: "Garhwal Himalayas, source of the Ganga River",
    retreat: "~1 km in the last 70 years (~15-20 meters/year)",
    concern: "Significant mass & length loss; freshwater source for millions.",
    beforeImage: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacierData/gangotri-new.webp",
    afterImage: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacierData/gangotri-old.webp",
    beforeLabel: "1984",
    afterLabel: "2023",
  },
  {
    title: "Siachen Glacier (Ladakh)",
    location: "Eastern Karakoram Range",
    retreat: "~1,000 meters over 30 years",
    concern: "Military activity accelerates melt; climate sensitive.",
    beforeImage: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacierData/siachen-old.webp",
    afterImage: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacierData/siachen-new.webp",
    beforeLabel: "1984",
    afterLabel: "2020",
  },
  {
    title: "Pindari Glacier (Uttarakhand)",
    location: "Kumaon region",
    retreat: "~135 meters from 1958 to 2020 (~2 meters/year recently)",
    concern: "Moraine shift observed; high scientific attention.",
    beforeImage: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacierData/Pindari-old.webp",
    afterImage: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacierData/Pindari-new.webp",
    beforeLabel: "1984",
    afterLabel: "2020",
  },
  {
    title: "Zemu Glacier (Sikkim)",
    location: "Near Kanchenjunga, Eastern Himalayas",
    retreat: "~27% area loss in recent decades",
    concern: "Vital for Teesta River; rapid satellite-observed retreat.",
    beforeImage: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacierData/Zemu-old.webp",
    afterImage: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacierData/Zemu-new.webp",
    beforeLabel: "1984",
    afterLabel: "2020",
  },
  {
    title: "Dokriani Glacier (Uttarakhand)",
    location: "Bhagirathi Valley",
    retreat: "~20 meters/year",
    concern: "Volume loss confirmed by Wadia Institute studies.",
    beforeImage: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacierData/DokrainGlacier-old.webp",
    afterImage: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacierData/DokrianiGlacier-new.webp",
    beforeLabel: "1984",
    afterLabel: "2020",
  },
  {
    title: "Chhota Shigri Glacier (Himachal Pradesh)",
    location: "Lahaul-Spiti region",
    retreat: "~15-20 meters/year",
    concern: "One of India's benchmark glaciers with detailed data.",
    beforeImage: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacierData/chotta-old.webp",
    afterImage: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/glacierData/chotta-new.webp",
    beforeLabel: "1984",
    afterLabel: "2020",
  },
];

export default function LearnPage() {
  return (
    <main className="w-full text-glacier-dark overflow-x-hidden scroll-smooth">
      <Navbar />

      {/* Hero Section with Quick Links */}
      <section className="relative h-screen w-full overflow-hidden" id="hero">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
          src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/AnuragMaloo.mp4"
        />
        <div className="absolute inset-0 bg-glacier-dark bg-opacity-60 flex flex-col items-center justify-center text-white text-center p-6">
          <h1 className="text-4xl sm:text-5xl font-nohemi mb-4">
            Learn about Glaciers
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl font-cabin mb-8">
            One of the most valuable components of nature
          </p>

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
          Introduction
        </h2>

        <blockquote className="md:text-xl text-md italic mb-8 text-center text-glacier-dark">
          &#8220;When the ice melts, it&#39;s not just water that disappears&mdash;it&#39;s
          memory, balance, and the future.&#8221;
        </blockquote>

        <p className="mb-6 md:text-lg text-sm leading-relaxed">
          The <strong>cryosphere</strong> includes all components of the Earth
          System that are frozen&mdash;such as snow cover, glaciers, ice sheets,
          ice shelves, icebergs, sea ice, lake ice, river ice, permafrost, and
          seasonally frozen ground. It plays a critical role in regulating
          Earth&#39;s climate, supporting ecosystems, and providing water to
          billions of people.
        </p>

        <p className="mb-6 md:text-lg text-md leading-relaxed">
          According to the <strong>IPCC Special Report</strong>, the cryosphere
          is undergoing rapid and alarming changes:
        </p>

        <ul className="list-disc list-inside mb-8 space-y-3 text-glacier-dark md:text-lg text-sm">
          <li>🌐 <strong>70%</strong> of Earth&#39;s freshwater is locked in snow and ice</li>
          <li>🧊 <strong>10%</strong> of Earth&#39;s land area is covered by glaciers or ice sheets</li>
          <li>🌊 Sea level rise (2006-2015) was <strong>2.5x faster</strong> than 1901-1990</li>
          <li>🌨 Arctic snow cover in June dropped <strong>13.4%</strong> per decade since 1967</li>
          <li>🏔 Ice sheets are up to <strong>4 km</strong> thick in East Antarctica</li>
          <li>🧱 Antarctica holds ice that could raise sea levels by <strong>58 meters</strong></li>
        </ul>
      </section>

      {/* Section 2: Explore */}
      <section
        className="py-16 px-4 sm:px-6 md:px-20 bg-glacier-soft font-cabin"
        id="explore"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 font-nohemi text-glacier-primary">
          Explore
        </h2>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory custom-scrollbar">
          {[
            {
              title: "NASA Climate Change",
              link: "https://climate.nasa.gov/",
              image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/explore/nasa.webp",
            },
            {
              title: "Learn about Cryosphere",
              link: "https://wmo.int/topics/cryosphere",
              image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/explore/cryosphere.webp",
            },
            {
              title: "International Year of Glaciers' Preservation 2025",
              link: "https://wmo.int/resources/campaigns/launch-of-website-international-year-of-glaciers-preservation-2025",
              image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/explore/YearOfGlacier.webp",
            },
            {
              title: "National Snow and Ice Data Center",
              link: "https://nsidc.org/learn/parts-cryosphere/glaciers",
              image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/explore/NationalSnowIceDomain.webp",
            },
            {
              title: "List of Glaciers in India",
              link: "https://en.wikipedia.org/wiki/List_of_glaciers_in_India",
              image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/explore/ListOfGlacier.webp",
            },
          ].map((item, i) => (
            <a
              key={i}
              href={item.link}
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
          Glacier Changes Over Time
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {glacierDetails.map((glacier, index) => (
            <GlacierCard
              key={index}
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
      <QuizSection />

      {/* Section 4: Glossary */}
      <section className="py-20 px-6 md:px-20 bg-glacier-soft" id="glossary">
        <GlacierGlossary />
      </section>

      <Footer />
    </main>
  );
}
