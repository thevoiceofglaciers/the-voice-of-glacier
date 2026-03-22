"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CryosphereTimeline from "@/components/cryosphereTimeline";

export default function WhyGlaciersPage() {
  return (
    <div className="bg-white text-glacier-dark">
      <Navbar />

      {/* HERO */}
<section className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">
  
  {/* Background Video */}
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source
      src="/video/meltingGlacier.mp4"   // replace with your video path
      type="video/mp4"
    />
  </video>

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-glacier-dark/70 to-glacier-primary/50" />

  {/* Content */}
  <div className="relative z-10 max-w-4xl px-6 text-white">
    <h1 className="text-4xl md:text-6xl font-nohemi leading-tight">
      Why Glaciers Matter
    </h1>
    <p className="mt-6 text-xl md:text-2xl text-glacier-light">
      They store freshwater for billions — and regulate the Earth’s climate.
    </p>
  </div>
</section>

      {/* 1. THE CRYOSPHERE CRISIS */}
<section id="cryosphere-crisis" className="py-24 bg-glacier-dark text-white">
  <div className="max-w-7xl mx-auto px-6">
    
    <div className="grid md:grid-cols-2 gap-16 items-start">
      
      {/* LEFT SIDE CONTENT */}
      <div>
        <h2 className="text-4xl font-nohemi mb-6">
          The Cryosphere Crisis
        </h2>

        <p className="text-lg max-w-2xl text-glacier-light/90 mb-10">
          The cryosphere is warming at three times the global average.
          Glaciers are disappearing. Ecosystems are destabilizing.
          Entire cultures face displacement.
        </p>

        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">
              What is the Cryosphere?
            </h3>
            <p className="text-glacier-light/80">
              The frozen parts of Earth — glaciers, snow, permafrost.
              When this system collapses, climate feedback loops accelerate.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">
              Key Impacts
            </h3>
            <ul className="list-disc list-inside space-y-2 text-glacier-light/80">
              <li>Glaciers melting at 3x global rate</li>
              <li>50% may disappear by 2100</li>
              <li>Glacial lake floods increasing</li>
              <li>2 billion people affected</li>
            </ul>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden mt-10 shadow-2xl">
            <img
              src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/img3.webp"
              className="w-full h-full object-cover"
              alt="Himalayan glacier"
            />
          </div>
      </div>

      {/* RIGHT SIDE TIMELINE */}
        <CryosphereTimeline />
      

    </div>
  </div>
</section>
{/* 2. WHY HKH MATTERS */}
<section id="Kush-Himalaya" className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
    
    {/* LEFT CONTENT */}
    <div>
      <h2 className="text-4xl font-nohemi text-glacier-primary mb-6">
        Why the Hindu Kush Himalaya Matters
      </h2>

      <p className="text-lg text-glacier-dark/90 leading-relaxed">
        The Hindu Kush Himalaya is the world’s “Third Pole” —
        storing the largest volume of ice outside the Arctic and Antarctic.
        It feeds 10 major river systems across Asia.
      </p>

      <p className="mt-6 text-lg text-glacier-dark/80">
        When Himalayan glaciers retreat, water security across South Asia
        is destabilized — affecting agriculture, cities, biodiversity,
        and regional stability.
      </p>
    </div>

    {/* RIGHT IMAGE GRID */}
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-xl overflow-hidden shadow-xl">
        <img
          src="https://th.bing.com/th/id/OIP.vk9Qspk3dLjSL1-Qa1QpkwHaE8?w=255&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3"
          alt="Himalayan glacier valley"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="rounded-xl overflow-hidden shadow-xl">
        <img
          src="https://cdn.britannica.com/27/173827-050-DC76A2F3/Portion-Himalayas-Jammu-and-Kashmir-India-state.jpg"
          alt="Snow-covered Himalayan peaks"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="rounded-xl overflow-hidden shadow-xl col-span-2">
        <img
          src="https://th.bing.com/th/id/R.8b9001e2d39021e7c701428ecea306ea?rik=H4ybye5xH2H7iQ&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2f6%2ff%2f6%2f741149-gorgerous-himalayas-wallpaper-1920x1080-desktop.jpg&ehk=1YRI72kYm0hEpk4reweuYnxlnEarE4xc%2bjzto1jGfvg%3d&risl=&pid=ImgRaw&r=0"
          alt="Glacier in the Hindu Kush Himalaya"
          className="w-full h-64 object-cover"
        />
      </div>
    </div>

  </div>
</section>

    {/* 3. WHAT HAPPENS WHEN GLACIERS DISAPPEAR */}
    <section id="Disappear" className="py-24 bg-glacier-light">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div>
        <h2 className="text-4xl md:text-5xl font-nohemi text-glacier-primary mb-8">
            What Happens When Glaciers Disappear?
        </h2>

        <p className="text-xl leading-relaxed text-glacier-dark/90">
            Rivers shrink. Agriculture fails. Migration increases.
            Glacial lake floods destroy villages.
            Cultural memory tied to ice vanishes.
        </p>

        <p className="mt-8 text-lg text-glacier-dark/70">
            This is not a distant crisis.  
            It is unfolding now.
        </p>
        </div>

        {/* RIGHT VIDEO */}
        <div
  className="relative shadow-2xl overflow-hidden"
  style={{
    clipPath: "polygon(0 16%, 100% 16%, 100% 50%, 81% 88%, 0 88%, 0% 50%)"
  }}
>
  <video
    autoPlay
    muted
    loop
    playsInline
    className="w-full h-full object-cover"
  >
    <source src="/video/disappear.mp4" type="video/mp4" />
  </video>

  <div className="absolute inset-0 bg-gradient-to-t from-glacier-dark/40 to-transparent" />
</div>

    </div>
    </section>

      {/* 4. WATER, RISK & LIVELIHOODS */}
      <section className="py-24 bg-glacier-dark text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-nohemi mb-12">
            Water, Risk, and Livelihoods
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
              <h3 className="text-xl font-semibold mb-2">Water Security</h3>
              <p className="text-glacier-light/80">
                Billions rely on glacier-fed rivers for drinking water and farming.
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
              <h3 className="text-xl font-semibold mb-2">Disaster Risk</h3>
              <p className="text-glacier-light/80">
                Rising glacial lake outburst floods threaten mountain communities.
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
              <h3 className="text-xl font-semibold mb-2">Livelihoods</h3>
              <p className="text-glacier-light/80">
                Tourism, farming, and local economies depend on stable ice systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STORIES FROM THE MOUNTAINS */}
      <section className="relative py-28 text-white text-center overflow-hidden">
        <img
          src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/story/anurag-snow.png"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Mountain Story"
        />
        <div className="absolute inset-0 bg-glacier-dark/70" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-nohemi mb-6">
            Stories from the Mountains
          </h2>
          <p className="text-xl leading-relaxed">
            Behind every glacier is a community.
            Behind every melt curve is a human story.
            From mountaineers to shepherds,
            these are voices of a changing cryosphere.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}