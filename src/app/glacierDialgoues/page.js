"use client";

import Link from "next/link";
import { Calendar, PlayCircle } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { podcasts } from "@/data/podcasts";

export default function PodcastPage() {
  const upcoming = podcasts.filter((p) => p.status === "upcoming");
  const old = podcasts.filter((p) => p.status === "old");

  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-20 bg-glacier-light dark:bg-glacier-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-glacier-dark dark:text-glacier-light">
              Our Dialogues 
            </h1>
            <p className="text-sm mt-2 text-glacier-primary dark:text-glacier-soft">
              When glaciers speak, the world must listen.
            </p>
          </div>

           <div className="my-6">
              <a
                href="https://forms.gle/2zSuf4cgMzZ2QawPA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 rounded-lg bg-glacier-primary text-white text-sm font-semibold hover:bg-glacier-dark transition"
              >
                Register for Upcoming Dialogue
              </a>
            </div>

          <Section title="Upcoming" data={upcoming} />
        </div>
      </div>

      <Footer />
    </>
  );
}

/* ================= SECTION ================= */

function Section({ title, data }) {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((podcast) => (
          <PodcastCard key={podcast.id} podcast={podcast} />
        ))}
      </div>
    </section>
  );
}

function PodcastCard({ podcast }) {
  return (
    <Link href={`/glacierDialgoues/${podcast.slug}`}>
      <div className="bg-white dark:bg-glacier-primary/10 rounded-xl overflow-hidden cursor-pointer border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

        {/* Image */}
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={podcast.image}
            alt={podcast.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Play icon hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition">
            <PlayCircle size={36} className="text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center text-xs mb-1 text-glacier-primary dark:text-glacier-soft">
            <Calendar size={14} className="mr-1" />
            {podcast.date}
          </div>

          <h3 className="text-sm font-semibold text-glacier-dark dark:text-glacier-light">
            {podcast.title}
          </h3>

          <p className="text-xs mt-1 text-glacier-primary/80 dark:text-glacier-soft/80">
            {podcast.speaker}
          </p>
        </div>

      </div>
    </Link>
  );
}