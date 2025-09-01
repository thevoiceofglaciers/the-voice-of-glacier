"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    text: "For me, mountaineering has never just been about the thrill of summiting peaks. It's been a journey with a deeper mission - to spread awareness about the United Nations' Sustainable Development Goals (SDGs). That's what led me to launch the 'Climbing4SDGs' initiative, where I use mountaineering as a platform to engage with communities, encourage action, and advocate for global change.",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/story/anuraag-maloo1.jpg",
  },
  {
    text: "Annapurna is infamous for its danger, with a high fatality rate of 33% due to avalanches and technical difficulty. Despite knowing the risks, I was determined to climb it to amplify my cause. On April 17, 2023, after 16-18 hours of climbing and reaching nearly 7,900 meters, I decided to turn back just 150 meters from the summit due to worsening weather and delayed time to reach the summit.",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/story/anuraag-maloo2.jpg",
  },
  {
    text: "While descending the most dangerous avalanche prone section of Annapurna between Camp 3 to Camp 2, I accidentally clipped onto the broken wrong rope and fell on the icy surface and then entered into a deep crevasse nearly 25 floors under the Earth. I lay trapped in the ice for three days and nights, recording messages on my GoPro, hoping someone would find me. On the third night, an avalanche buried me deeper, and I lost consciousness completely.",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/story/image.png",
  },
  {
    text: "Meanwhile, rescue efforts were underway. The first two attempts failed, but finally, a third team—including Polish climbers Adam Bielecki and Mariusz Hatala, Nepali Sherpas, and helicopter Sobit Gauchan—set out, expecting to retrieve a body. But on April 20th, they found me alive, buried in the fetal position nearly 70 meters deep at 6,000 meters altitude.",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/story/anurag-snow.png",
  },
  {
    text: "Since then, I've spent over 7 months in hospitals in Nepal and India, relearned everything—walking, writing, eating, even moving my fingers. I feel like a 34-year-old with the motor skills of a baby. While my physical strength is still limited, I continue to undergo therapy and focus on healing.",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/story/group.jpg",
  },
  {
    text: "This journey has been nothing short of a miracle, made possible by relentless efforts from my rescuers, doctors, therapists, family, and friends. Above all, I owe my life to the mountains and glaciers. Annapurna may have nearly taken my life, but it also gave it back. I'm alive to share this story, and I will always climb for a purpose.",
    image: "https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/story/anurag-last.jpg",
  }
];

export default function AnuraagStoryPage() {
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    if (index < slides.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  return (
    <main className="w-full bg-glacier-light text-glacier-dark min-h-screen">
      <Navbar />

      {/* 📽️ Story Section with Background Video */}
      <section
        className="relative w-full h-screen flex items-center justify-center overflow-hidden cursor-pointer px-4 sm:px-8"
        onClick={nextSlide}
      >
        {/* 🔹 Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/AnuragMaloo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 🔹 Overlay Color Filter */}
        <div className="absolute top-0 left-0 w-full h-full bg-glacier-soft/70 z-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className={`relative z-20 flex flex-col md:flex-row items-center justify-between gap-10 w-full max-w-6xl ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            <div className="flex-1 w-full md:w-1/2 text-lg md:text-xl leading-relaxed">
              {index === 0 && (
                <h1 className="text-3xl md:text-4xl font-bold text-glacier-primary mb-4 text-center md:text-left">
                  Anurag Maloo: A Story of Survival
                </h1>
              )}
              <p className="text-glacier-dark md:text-2xl text-xs">{slides[index].text}</p>
            </div>

            <div className="flex-1 w-full md:w-1/2 flex justify-center">
              <div className="w-full max-w-md sm:max-w-lg aspect-video">
                <img
                  src={slides[index].image}
                  alt="Anurag Maloo"
                  className="w-full h-full object-cover rounded-xl shadow-xl"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 🔸 Slide Counter Prompt */}
        <div className="absolute bottom-10 w-full flex justify-center z-30">
          <p className="text-white font-semibold px-4 py-2 rounded-md bg-black/70 animate-pulse text-sm md:text-base">
            Click anywhere to continue ({index + 1}/{slides.length})
          </p>
        </div>
      </section>

      {/* 📺 YouTube Section */}
      <section className="w-full bg-glacier-light py-16 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-glacier-dark mb-6 text-center">
          Watch the Full Story
        </h2>
        <div className="w-full max-w-sm aspect-[9/16] shadow-xl rounded-lg overflow-hidden">
          <video
            src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main//story/amStory.mp4"
            controls
            className="w-full h-full object-cover"
            playsInline
          ></video>
        </div>
      </section>


      <Footer />
    </main>
  );
}