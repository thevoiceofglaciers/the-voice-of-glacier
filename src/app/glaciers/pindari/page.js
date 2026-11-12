"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaBook,
  FaFlask,
  FaCamera,
  FaExternalLinkAlt,
  FaTimes,
  FaClock,
  FaPlayCircle,
} from "react-icons/fa";

// Navbar and Footer are rendered globally by the root layout; this page only
// supplies its own content.

// Google Form link is a placeholder until the real link is supplied.
const CONTRIBUTE_FORM_PLACEHOLDER = "#";

// Flip these on once there's real content to show.
const SHOW_SCIENTIFIC_PAPERS = false;
const SHOW_2026_PHOTOS = false;

const historicalImages = [
  {
    src: "/glaciers/pindari/historical/pindari-general-view.jpg",
    year: "1886",
    title: "General View, Back of Nanda Kot",
    caption:
      "A 19th-century expedition photograph looking back toward Nanda Kot from the Pindari Glacier, dated 8th October 1886.",
  },
  {
    src: "/glaciers/pindari/historical/pindari-valley.jpg",
    year: "c. 1911–1924",
    title: "The Pindar Valley",
    caption:
      "A plate from one of the early Kumaon travel guides, looking up the Pindar valley toward the glacier.",
  },
  {
    src: "/glaciers/pindari/historical/phurkiya-campsite.jpg",
    year: "c. early 1900s",
    title: "A Rest-House Along the Trail",
    caption:
      "Pilgrims and porters gathered outside a stone rest-house on the Pindari route, from Dr. K. Boeck's Himalaya Album.",
  },
  {
    src: "/glaciers/pindari/historical/shepherds-phurkiya.jpg",
    year: "c. early 1900s",
    title: "Local Guides",
    caption:
      "A portrait of local guides in traditional dress, photographed along the Kumaon trail, from Dr. K. Boeck's Himalaya Album.",
  },
  {
    src: "/glaciers/pindari/historical/pindari-colorized.jpg",
    year: "19th century",
    title: "Pindar-Gletscher, Hand-Coloured Sketch",
    caption:
      "A hand-coloured expedition sketch of the glacier and its valley, annotated in a surveyor's hand.",
  },
  {
    src: "/glaciers/pindari/historical/pindari-anup-sah.jpg",
    year: "Sept 1964",
    title: "Pindari Glacier",
    caption: "Photographed by Anup Sah in September 1964, a mid-century bridge between the archive and the present.",
  },
];

const maps = [
  {
    src: "/glaciers/pindari/maps/pindari-map.jpg",
    title: "Pindari Glacier Survey Sketch",
    caption: "A hand-drawn survey marking the snout, lateral moraines, Traill's Pass, and the surrounding peaks.",
  },
  {
    src: "/glaciers/pindari/maps/himalayan-garhwal-east-1992.jpg",
    title: "Garhwal-Himalaya-Ost, 1:150,000",
    caption:
      "A topographic survey map published by the Swiss Foundation for Alpine Research, based on Survey of India data.",
  },
  {
    src: "/glaciers/pindari/maps/nanda-devi-glaciers.jpg",
    title: "Glaciers of the Nanda Devi Region",
    caption: "A labelled relief map placing the Pindar Glacier among its neighbouring ice fields.",
  },
  {
    src: "/glaciers/pindari/maps/uk-glacier-river.jpg",
    title: "Uttarakhand Glaciers &amp; River Basins",
    caption: "A regional relief map showing how glacier-fed rivers thread through the state.",
  },
];

const contemporaryImages = [
  {
    src: "/glaciers/pindari/contemporary/drone-still-1.jpg",
    title: "The Glacier Valley, From the Air",
    caption: "Drone still looking down the Pindari valley toward the snout.",
  },
  {
    src: "/glaciers/pindari/contemporary/drone-still-2.jpg",
    title: "Clouds Over the Upper Valley",
    caption: "Monsoon cloud rolling through the upper reaches of the valley.",
  },
  {
    src: "/glaciers/pindari/contemporary/drone-still-3.jpg",
    title: "Phurkiya Meadow",
    caption: "The Phurkiya campsite meadow, with the glacier visible in the distance.",
  },
];

const droneFootage = [
  {
    title: "Glacier Close-Up",
    description: "Low aerial pass over the glacier surface and crevasse fields.",
    image: "/glaciers/pindari/drone-thumbs/glacier-close-up.jpg",
    driveUrl: "https://drive.google.com/file/d/1TdFBtdy0XUSxxxS_SgJ4SRv1AqofOqpD/view?usp=drive_link",
  },
  {
    title: "Glacier, Up Close",
    description: "An updated close-up pass over the glacier surface.",
    image: "/glaciers/pindari/drone-thumbs/glacier-up-close.jpg",
    driveUrl: "https://drive.google.com/file/d/1wjMgfzR1mzkpegq1pVP4JYroAu6ohgPb/view?usp=drive_link",
  },
  {
    title: "Glacier From a Distance",
    description: "A wide establishing shot of the glacier within its valley.",
    image: "/glaciers/pindari/drone-thumbs/glacier-from-distance.jpg",
    driveUrl: "https://drive.google.com/file/d/1p4-0jy4NTt8dP-NplqcI1YYmhKmC530T/view?usp=drive_link",
  },
  {
    title: "Khati: The Last Village",
    description: "The last inhabited village before the trail climbs toward Pindari.",
    image: "/glaciers/pindari/drone-thumbs/khati-last-village.jpg",
    driveUrl: "https://drive.google.com/file/d/18gNOZ6GUxUBj8hA6DAx8v4qCOEhCvJJh/view?usp=drive_link",
  },
  {
    title: "Surroundings of Pindari Glacier",
    description: "The ridgelines and moraine fields that frame the glacier.",
    image: "/glaciers/pindari/drone-thumbs/surroundings-of-pindari.jpg",
    driveUrl: "https://drive.google.com/file/d/1p7xvCLI0AR67NP2Hr1-HVHYrfT8rYvZu/view?usp=drive_link",
  },
];

const books = [
  {
    title: "A Four Weeks' Tramp Through the Himalayas",
    subtitle: "Guide to the Pindari Glacier",
    author: "Forrester",
    year: "1911",
    cover: "/glaciers/pindari/book-covers/forrester-1911.jpg",
    driveUrl: "https://drive.google.com/file/d/1nTAZw1mESfAijhJ4ofmLmuddKkF7uF5_/view?usp=drive_link",
  },
  {
    title: "To the Pindari Glacier",
    subtitle: "A Sketch Book and Guide",
    author: "Anderson",
    year: "1921",
    cover: "/glaciers/pindari/book-covers/anderson-1921.jpg",
    driveUrl: "https://drive.google.com/file/d/1ACY3dH1CU6Q8FSeN1kVJoJxtOXINlBg8/view?usp=drive_link",
  },
  {
    title: "All About Naini Tal to the Pindari Glacier Through Kumaon",
    subtitle: null,
    author: "O'Leary",
    year: "1924",
    cover: "/glaciers/pindari/book-covers/oleary-1924.jpg",
    driveUrl: "https://drive.google.com/file/d/1DipxFxb43GQ9SP8ClkfIk9vN5zNrcUMd/view?usp=drive_link",
  },
  {
    title: "Indische Gletscherfahrten",
    subtitle: "Reisen und Erlebnisse im Himalaja",
    author: "Boeck",
    year: null,
    cover: "/glaciers/pindari/book-covers/boeck.jpg",
    driveUrl: "https://drive.google.com/file/d/1yT0ghw45us-lzYOfMyva59BI_TUZlxzd/view?usp=drive_link",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center items-center gap-3 mb-4">
        {Icon && <Icon className="text-4xl text-glacier-primary" aria-hidden="true" />}
        <h2 className="text-4xl md:text-5xl font-extrabold text-glacier-primary text-balance">{title}</h2>
      </div>
      {description && (
        <p className="text-lg md:text-xl text-glacier-foreground max-w-3xl mx-auto leading-relaxed">{description}</p>
      )}
    </div>
  );
}

function CompareSlider({ beforeSrc, afterSrc, beforeLabel, afterLabel }) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative w-full aspect-[16/9] select-none overflow-hidden rounded-2xl">
      <img src={afterSrc} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={beforeSrc} alt={beforeLabel} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      </div>

      <span className="absolute top-4 left-4 bg-glacier-dark/80 text-white text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full pointer-events-none">
        {beforeLabel}
      </span>
      <span className="absolute top-4 right-4 bg-glacier-primary/90 text-white text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full pointer-events-none">
        {afterLabel}
      </span>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center">
          <span className="text-glacier-dark text-xs font-bold">⟷</span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Slide to compare 2000 and 2025 satellite imagery"
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
      />
    </div>
  );
}

function PendingBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-glacier-primary bg-glacier-primary/10 px-3 py-1.5 rounded-full">
      <FaClock aria-hidden="true" />
      {children}
    </span>
  );
}

function DriveLinkOrPending({ url, label }) {
  if (!url) {
    return <PendingBadge>Drive link coming soon</PendingBadge>;
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white bg-glacier-primary hover:bg-glacier-dark transition-colors px-3 py-1.5 rounded-full"
    >
      <FaExternalLinkAlt aria-hidden="true" />
      {label}
    </a>
  );
}

function GalleryGrid({ items, onSelect, columns = "md:grid-cols-3" }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns} gap-6 md:gap-8`}>
      {items.map((item, idx) => (
        <motion.button
          type="button"
          key={item.src}
          onClick={() => onSelect(item)}
          className="group text-left bg-glacier-background rounded-2xl overflow-hidden shadow-md border border-glacier-border hover:shadow-xl hover:-translate-y-1 focus-visible:-translate-y-1 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-glacier-primary/40"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5, delay: idx * 0.07 }}
          viewport={{ once: true }}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-glacier-dark/10">
            <img
              src={item.src}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {item.year && (
              <span className="absolute top-3 left-3 bg-glacier-dark/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {item.year}
              </span>
            )}
          </div>
          <div className="p-4">
            <h4 className="font-bold text-glacier-dark">{item.title}</h4>
            <p className="text-sm text-glacier-foreground mt-1 line-clamp-2">{item.caption}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

export default function PindariGlacierPage() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="bg-glacier-background text-glacier-foreground min-h-screen">
      {/* Hero Banner */}
      <div className="relative w-full h-[640px] md:h-[520px] overflow-hidden">
        <img
          src="/glaciers/pindari/contemporary/drone-still-1.jpg"
          alt="Aerial view of the Pindari Glacier valley"
          className="w-full h-full object-cover object-top"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-glacier-dark/90 via-glacier-dark/50 to-glacier-primary/40 flex items-end">
          <div className="px-6 md:px-16 max-w-7xl w-full mx-auto pb-12 md:pb-16">
            <motion.div
              className="flex items-center gap-2 text-white/90 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FaMapMarkerAlt aria-hidden="true" />
              <span className="text-sm md:text-base font-medium tracking-wide">
                Kumaon Himalaya, Uttarakhand, India
              </span>
            </motion.div>
            <motion.h1
              className="text-3xl lg:text-6xl font-bold text-white drop-shadow-lg text-pretty"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Pindari Glacier
            </motion.h1>
            <motion.p
              className="mt-4 text-base md:text-xl text-white/90 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              An open archive of one glacier&rsquo;s story, from an 1886 expedition photograph to today&rsquo;s
              drone surveys, built to hold the evidence of what has changed and what is still to come.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-7"
            >
              <a
                href="#contribute"
                className="inline-flex items-center gap-2 bg-white text-glacier-dark font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-glacier-light transition-colors duration-300"
              >
                Help Complete This Archive
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <main id="main-content" className="flex flex-col">
        {/* Intent / mission */}
        <motion.section
          className="w-full py-16 md:py-20 px-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-glacier-primary mb-6 text-balance">
              About Pindari Glacier
            </h2>
            <p className="text-lg md:text-xl text-glacier-foreground leading-relaxed">
              Pindari is one of the most documented glaciers in the Kumaon Himalaya, photographed by
              surveyors in 1886, sketched and written about by travellers through the early 1900s, revisited by
              photographers through the 20th century, and now mapped from above by satellite and drone. Bringing
              that record together, side by side, makes the retreat impossible to miss. This page is a living
              archive of that evidence: historical photographs, field maps, drone and satellite imagery, and the
              books that first guided travellers here, with scientific papers and a fresh 2026 photo survey
              still to be added.
            </p>
          </div>
        </motion.section>

        {/* Then & Now satellite comparison */}
        <motion.section
          className="w-full bg-glacier-dark py-16 md:py-20 px-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance mb-4">36 Years, One Glacier</h2>
              <p className="text-lg md:text-xl text-glacier-soft max-w-3xl mx-auto leading-relaxed">
                Drag the slider to compare the same view of the Pindari snout in 1990 and 2026. The bare rock and
                moraine visible today is ice that once filled this valley.
              </p>
            </div>
            <div className="shadow-2xl border border-white/10 rounded-2xl">
              <CompareSlider
                beforeSrc="/glaciers/pindari/comparison/pindari-1990.jpg"
                afterSrc="/glaciers/pindari/comparison/pindari-2026.jpg"
                beforeLabel="1990"
                afterLabel="2026"
              />
            </div>
            <p className="text-center text-glacier-soft text-sm mt-4">Photographs by N Sharma / Dvd Fotos.</p>
          </div>
        </motion.section>

        {/* Historical timeline */}
        <motion.section
          className="w-full py-16 md:py-20 px-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Historical Images"
              description="From an 1886 expedition plate to a 1964 photograph, the earliest visual record of the glacier."
            />
            <GalleryGrid items={historicalImages} onSelect={setLightbox} />
          </div>
        </motion.section>

        {/* Maps */}
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
              title="Field Maps"
              description="Survey sketches and topographic maps charting the glacier and the ridgelines around it."
            />
            <GalleryGrid items={maps} onSelect={setLightbox} columns="md:grid-cols-4" />
          </div>
        </motion.section>

        {/* Contemporary / drone stills */}
        <motion.section
          className="w-full py-16 md:py-20 px-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Pindari Today"
              description="Contemporary aerial photographs of the glacier and its valley."
            />
            <GalleryGrid items={contemporaryImages} onSelect={setLightbox} />
          </div>
        </motion.section>

        {/* Drone footage */}
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
              title="Drone Footage"
              description="Full-resolution aerial clips of the glacier, hosted on Google Drive."
            />
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              {droneFootage.map((clip, idx) => {
                const CardTag = clip.driveUrl ? motion.a : motion.div;
                const linkProps = clip.driveUrl
                  ? { href: clip.driveUrl, target: "_blank", rel: "noopener noreferrer" }
                  : {};
                return (
                  <CardTag
                    key={clip.title}
                    {...linkProps}
                    className="group w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1.334rem)] bg-glacier-background rounded-2xl overflow-hidden shadow-md border border-glacier-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <div className="relative aspect-video overflow-hidden bg-glacier-dark/10">
                      <img
                        src={clip.image}
                        alt={clip.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-glacier-dark/20 group-hover:bg-glacier-dark/40 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md p-3.5 rounded-full border border-white/40 group-hover:scale-110 transition-transform duration-300">
                          <FaPlayCircle className="text-white text-2xl" aria-hidden="true" />
                        </div>
                      </div>
                      {!clip.driveUrl && (
                        <span className="absolute top-3 right-3">
                          <PendingBadge>Coming soon</PendingBadge>
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-glacier-dark">{clip.title}</h4>
                      <p className="text-sm text-glacier-foreground mt-1">{clip.description}</p>
                    </div>
                  </CardTag>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Books */}
        <motion.section
          className="w-full py-16 md:py-20 px-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Field Guides &amp; Rare Books"
              description="Early travel guides and accounts that first led visitors to Pindari, scanned and archived."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {books.map((book, idx) => (
                <motion.div
                  key={book.title}
                  className="bg-glacier-light rounded-2xl p-6 shadow-md border-l-4 border-glacier-primary"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start gap-4">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={`Cover of ${book.title}`}
                        loading="lazy"
                        className="shrink-0 w-20 aspect-[2/3] object-cover rounded-md shadow-md border border-glacier-border"
                      />
                    ) : (
                      <div className="shrink-0 w-12 h-12 rounded-full bg-glacier-primary/10 flex items-center justify-center">
                        <FaBook className="text-glacier-primary text-lg" aria-hidden="true" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-glacier-dark leading-snug">{book.title}</h4>
                      {book.subtitle && <p className="text-sm text-glacier-foreground italic">{book.subtitle}</p>}
                      <p className="text-sm text-glacier-foreground mt-1">
                        {book.author}
                        {book.year ? ` · ${book.year}` : ""}
                      </p>
                      <div className="mt-3">
                        <DriveLinkOrPending url={book.driveUrl} label="Read" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Scientific papers */}
        {SHOW_SCIENTIFIC_PAPERS && (
          <motion.section
            className="w-full bg-glacier-light py-16 md:py-20 px-6"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center items-center gap-3 mb-4">
                <FaFlask className="text-4xl text-glacier-primary" aria-hidden="true" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-glacier-primary mb-4 text-balance">
                Scientific Papers
              </h2>
              <p className="text-lg text-glacier-foreground leading-relaxed mb-6">
                Peer-reviewed research on the mass balance, retreat rate, and hydrology of the Pindari Glacier will be
                collected and linked here.
              </p>
              <PendingBadge>Coming soon</PendingBadge>
            </div>
          </motion.section>
        )}

        {/* 2026 photos */}
        {SHOW_2026_PHOTOS && (
          <motion.section
            className="w-full py-16 md:py-20 px-6"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center items-center gap-3 mb-4">
                <FaCamera className="text-4xl text-glacier-primary" aria-hidden="true" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-glacier-primary mb-4 text-balance">
                2026 Field Photographs
              </h2>
              <p className="text-lg text-glacier-foreground leading-relaxed mb-6">
                A fresh photo survey of the glacier is planned for the 2026 season, the next data point in this
                archive&rsquo;s timeline.
              </p>
              <PendingBadge>Coming soon</PendingBadge>
            </div>
          </motion.section>
        )}

        {/* Contribute CTA */}
        <section id="contribute" className="py-16 md:py-20 px-6 bg-glacier-primary">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-6 text-balance"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Help Complete This Archive
            </motion.h2>
            <motion.p
              className="text-lg text-white/90 mb-10 leading-relaxed"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Have an old photograph, map, document, or story about the Pindari Glacier? We&rsquo;re building this
              page as a shared record, and we&rsquo;d love to include yours.
            </motion.p>
            <motion.a
              href={CONTRIBUTE_FORM_PLACEHOLDER}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-glacier-primary font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-glacier-dark hover:text-white transition-colors duration-300"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              aria-label="Open the contribution form"
            >
              <FaExternalLinkAlt aria-hidden="true" />
              Submit a Contribution
            </motion.a>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] bg-glacier-dark/95 flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="max-w-4xl w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={lightbox.src}
                  alt={lightbox.title}
                  className="w-full max-h-[75vh] object-contain rounded-xl bg-black"
                />
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  className="absolute -top-4 -right-4 bg-white text-glacier-dark rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-glacier-light transition-colors"
                  aria-label="Close"
                >
                  <FaTimes aria-hidden="true" />
                </button>
              </div>
              <div className="mt-4 text-center">
                {lightbox.year && (
                  <span className="inline-block bg-glacier-primary text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                    {lightbox.year}
                  </span>
                )}
                <h3 className="text-white text-xl font-bold">{lightbox.title}</h3>
                <p className="text-glacier-soft mt-1 max-w-2xl mx-auto">{lightbox.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
