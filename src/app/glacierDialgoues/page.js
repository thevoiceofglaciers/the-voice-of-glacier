"use client";

import Link from "next/link";
import { Calendar, PlayCircle, ArrowRight, Mic2 } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { podcasts } from "@/data/podcasts";

export default function PodcastPage() {
  const upcoming = podcasts.filter((p) => p.status === "upcoming");

  return (
    <div className="min-h-screen flex flex-col font-cabin bg-glacier-light dark:bg-glacier-dark transition-colors duration-300">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          
          {/* HEADER SECTION */}
          <header className="text-center mb-16 space-y-6">
            <div className="space-y-2">
              <h1 className="font-nohemi text-4xl md:text-6xl text-glacier-dark dark:text-glacier-light tracking-tight">
                Glacier Dialogues
              </h1>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-glacier-primary dark:text-glacier-soft opacity-80">
                When glaciers speak, the world must listen.
              </p>
            </div>

            {/* STYLIZED MISSION STATEMENT */}
            <div className="relative max-w-3xl mx-auto mt-8 p-8 rounded-2xl bg-white/40 dark:bg-glacier-primary/5 backdrop-blur-sm border-l-4 border-glacier-primary shadow-sm">
              <p className="text-lg md:text-xl leading-relaxed text-glacier-dark/90 dark:text-glacier-light/90 italic font-medium">
                “TVGF Glacier Dialogues is a monthly interdisciplinary conversation
                series convened by The Voice of Glaciers Foundation, bringing
                together glacier scientists, policymakers, practitioners, and
                mountain communities to examine how rapidly changing cryospheric
                systems are reshaping lives, landscapes, and glacial futures across
                the Hindu Kush Himalaya.”
              </p>
            </div>

            {/* CALL TO ACTION */}
            <div className="mt-10">
              <a
                href="https://forms.gle/2zSuf4cgMzZ2QawPA"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-glacier-primary text-white font-bold hover:bg-glacier-dark hover:shadow-xl hover:shadow-glacier-primary/20 transition-all active:scale-95"
              >
                Register for Upcoming Dialogues
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </header>

          {/* SECTION DIVIDER */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-[1px] flex-grow bg-glacier-primary/20"></div>
          </div>

          <Section data={upcoming} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ================= SECTION ================= */

function Section({ data }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-20 bg-white/20 dark:bg-white/5 rounded-3xl border border-dashed border-glacier-primary/30">
        <Mic2 className="mx-auto mb-4 text-glacier-primary opacity-40" size={48} />
        <p className="font-nohemi text-xl text-glacier-dark/50 dark:text-glacier-light/50">New dialogues arriving soon...</p>
      </div>
    );
  }

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((podcast) => (
          <PodcastCard key={podcast.id} podcast={podcast} />
        ))}
      </div>
    </section>
  );
}

/* ================= CARD ================= */

function PodcastCard({ podcast }) {
  return (
    <Link href={`/glacierDialgoues/${podcast.slug}`} className="group">
      <div className="h-full bg-white dark:bg-glacier-primary/10 rounded-2xl overflow-hidden border border-glacier-primary/10 hover:border-glacier-primary/40 hover:shadow-2xl hover:shadow-glacier-primary/5 transition-all duration-500 flex flex-col">
        
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={podcast.image}
            alt={podcast.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-glacier-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/40">
              <PlayCircle size={32} className="text-white fill-white/20" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-xs font-bold text-glacier-primary dark:text-glacier-soft mb-3 uppercase tracking-wider">
            <Calendar size={14} />
            {podcast.date}
          </div>

          <h3 className="font-nohemi text-lg text-glacier-dark dark:text-glacier-light leading-snug group-hover:text-glacier-primary transition-colors duration-300">
            {podcast.title}
          </h3>

          <div className="mt-auto pt-6 flex items-center gap-3">
             <div className="h-8 w-[2px] bg-glacier-primary/30" />
             <p className="text-sm font-medium text-glacier-dark/70 dark:text-glacier-soft/70">
               {podcast.speaker}
             </p>
          </div>
        </div>
      </div>
    </Link>
  );
}