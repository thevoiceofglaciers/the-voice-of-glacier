"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const glossaryData= [
  { term: "Ablation", scientificDefinition: "Loss of ice or snow from a glacier due to melting, sublimation, or calving.", simpleDefinition: "The glacier is shrinking as ice melts or breaks off." },
  { term: "Accumulation", scientificDefinition: "The addition of snow and ice to a glacier, primarily through snowfall.", simpleDefinition: "New snow builds up on the glacier, making it grow." },
  { term: "Alpine Glacier", scientificDefinition: "A glacier formed in mountainous regions, typically flowing down valleys.", simpleDefinition: "A mountain glacier moving like a slow river." },
  { term: "Arete", scientificDefinition: "A sharp ridge formed between two glaciers eroding parallel valleys.", simpleDefinition: "A narrow mountain ridge shaped by glaciers on both both sides." },
  { term: "Avalanche", scientificDefinition: "A rapid flow of snow down a slope, often involving ice and debris.", simpleDefinition: "A big rush of snow sliding down a mountain." },
  { term: "Ablation Zone", scientificDefinition: "The lower part of a glacier where melting and ice loss exceed accumulation.", simpleDefinition: "The part of the glacier that loses more ice than it gains." },
  { term: "Active Layer", scientificDefinition: "The surface layer of soil above permafrost that thaws and refreezes annually.", simpleDefinition: "The top soil that melts in summer and freezes again in winter." },
  { term: "Arctic Amplification", scientificDefinition: "The phenomenon where the Arctic warms faster than the global average due to feedback mechanisms.", simpleDefinition: "The Arctic is heating up faster than the rest of the world." },
  { term: "Bergschrund", scientificDefinition: "A deep crevasse separating moving glacier ice from the stagnant ice or rock at the head of a glacier.", simpleDefinition: "A big crack near the top of a glacier." },
  { term: "Basal Sliding", scientificDefinition: "The movement of glacier ice over the bedrock, lubricated by meltwater.", simpleDefinition: "The glacier slips over wet ground underneath." },
  { term: "Blue Ice", scientificDefinition: "Densely packed glacier ice that appears blue due to the absorption of red light.", simpleDefinition: "Very old, dense glacier ice that looks blue." },
  { term: "Brittle Zone", scientificDefinition: "The upper glacier layer where ice breaks under stress, forming crevasses.", simpleDefinition: "The top part of the glacier where cracks easily form." },
  { term: "Bedrock", scientificDefinition: "The solid rock beneath glacier ice or soil.", simpleDefinition: "The hard rock under the glacier." },
  { term: "Basal Melt", scientificDefinition: "Melting of glacier ice at its base due to geothermal heat or friction.", simpleDefinition: "Ice melting at the bottom of the glacier." },
  { term: "Basal Till", scientificDefinition: "Sediment deposited directly under a glacier as it moves.", simpleDefinition: "Mud and rocks left behind by a moving glacier." },
  { term: "Black Carbon", scientificDefinition: "Soot particles that settle on glaciers, reducing albedo and accelerating melt.", simpleDefinition: "Dark dust on ice that makes glaciers melt faster." },
  { term: "Crevasse", scientificDefinition: "A deep crack or fracture in the glacier surface caused by stress.", simpleDefinition: "A big crack on top of a glacier." },
  { term: "Cirque", scientificDefinition: "A bowl-shaped depression carved by a glacier at the head of a valley.", simpleDefinition: "A big scoop in the mountain where a glacier started." },
  { term: "Continental Glacier", scientificDefinition: "Massive ice sheets covering large land areas like Antarctica or Greenland.", simpleDefinition: "A huge glacier covering a whole continent." },
  { term: "Calving", scientificDefinition: "The breaking off of ice chunks from the edge of a glacier, often forming icebergs.", simpleDefinition: "When pieces of glacier fall into the ocean." },
  { term: "Cryosphere", scientificDefinition: "All frozen water parts on Earth, including glaciers, ice caps, and permafrost.", simpleDefinition: "All the icy places on Earth." },
  { term: "Cold-based Glacier", scientificDefinition: "A glacier frozen to its bed, with little or no movement at the base.", simpleDefinition: "A glacier stuck to the ground with no sliding." },
  { term: "Cryoconite", scientificDefinition: "Dark dust on glacier surfaces that absorbs heat and speeds up melting.", simpleDefinition: "Dirty spots on a glacier that make it melt faster." },
  { term: "Climate Change", scientificDefinition: "Long-term change in global temperatures and weather patterns affecting glacier dynamics.", simpleDefinition: "The Earth is getting warmer, which melts glaciers." },
  { term: "Core Sampling", scientificDefinition: "A method of extracting ice cylinders to study past climate.", simpleDefinition: "Taking deep ice samples to learn about Earth’s history." },
  { term: "Carbon Sink", scientificDefinition: "A natural system that absorbs more carbon than it releases. Glaciers may indirectly act as carbon sinks through ecosystems.", simpleDefinition: "Nature storing away harmful gases." },
  { term: "Debris-covered Glacier", scientificDefinition: "A glacier whose surface is partially or fully covered with rock debris.", simpleDefinition: "A glacier hidden under a layer of rocks." },
  { term: "Drumlin", scientificDefinition: "A streamlined hill formed beneath a glacier, shaped by ice movement and till.", simpleDefinition: "A smooth, long hill made by a glacier." },
  { term: "Delta", scientificDefinition: "A landform at the mouth of a river where sediment is deposited as the water flow slows.", simpleDefinition: "A fan-shaped area where a glacier-fed river ends." },
  { term: "Deflation", scientificDefinition: "Wind-driven removal of fine sediment from a glacier's surface.", simpleDefinition: "Wind blowing away dust from a glacier." },
  { term: "Erratic", scientificDefinition: "A large rock transported by a glacier far from its origin.", simpleDefinition: "A big boulder left behind by a glacier in a strange place." },
  { term: "Esker", scientificDefinition: "A winding ridge formed from sediments deposited by meltwater streams beneath a glacier.", simpleDefinition: "A long, twisty hill made by water under a glacier." },
  { term: "Englacial", scientificDefinition: "Located within the glacier ice.", simpleDefinition: "Something stuck inside a glacier." },
  { term: "Equilibrium Line", scientificDefinition: "The dividing line on a glacier between the accumulation and ablation zones.", simpleDefinition: "Where the glacier neither grows nor shrinks." },
  { term: "Firn", scientificDefinition: "Granular snow that has survived one melt season but has not yet turned into ice.", simpleDefinition: "Snow that’s a bit like ice but not quite." },
  { term: "Fjord", scientificDefinition: "A deep, glacially carved valley flooded by seawater.", simpleDefinition: "A deep sea inlet made by glaciers." },
  { term: "Flow Line", scientificDefinition: "Path followed by particles within a glacier as it moves.", simpleDefinition: "The glacier’s trail as it slowly flows downhill." },
  { term: "Freeze-Thaw Weathering", scientificDefinition: "The breaking of rock due to water freezing and expanding in cracks.", simpleDefinition: "When water freezes in cracks and breaks rocks." },
  { term: "Glacier", scientificDefinition: "A large, persistent body of ice that forms on land and moves under its own weight.", simpleDefinition: "A big, slow-moving river of ice." },
  { term: "Glacial Retreat", scientificDefinition: "The process of a glacier shrinking back due to melting and reduced snowfall.", simpleDefinition: "When a glacier melts and gets smaller." },
  { term: "Glacial Advance", scientificDefinition: "When a glacier grows and moves forward.", simpleDefinition: "The glacier is growing and sliding ahead." },
  { term: "Glacial Erratic", scientificDefinition: "A large rock carried and deposited by a glacier far from its source.", simpleDefinition: "A big rock out of place thanks to a glacier." },
  { term: "Horn", scientificDefinition: "A sharp mountain peak formed by glacial erosion from multiple sides.", simpleDefinition: "A pointed mountain carved by glaciers." },
  { term: "Hanging Valley", scientificDefinition: "A smaller valley left above the main valley, often with waterfalls, after glacial erosion.", simpleDefinition: "A side valley that hangs above a bigger one." },
  { term: "Hydrofracture", scientificDefinition: "Cracking of ice due to water pressure.", simpleDefinition: "Water breaking through glacier ice." },
  { term: "Hydrology", scientificDefinition: "The study of water flow and storage in glacier systems.", simpleDefinition: "How water moves in and around glaciers." },
  { term: "Ice Cap", scientificDefinition: "A dome-shaped glacier covering less than 50,000 square kilometers.", simpleDefinition: "A smaller ice sheet over land." },
  { term: "Ice Sheet", scientificDefinition: "A massive glacier covering more than 50,000 square kilometers.", simpleDefinition: "A giant slab of ice over a large area." },
  { term: "Iceberg", scientificDefinition: "A large chunk of ice that broke off from a glacier and floats in the ocean.", simpleDefinition: "A piece of glacier floating in water." },
  { term: "Icefall", scientificDefinition: "A steep section of a glacier with rapid ice flow and crevasses.", simpleDefinition: "A frozen waterfall made of glacier ice." },
  { term: "Jokulhlaup", scientificDefinition: "A sudden, glacial outburst flood.", simpleDefinition: "A surprise flood from a glacier." },
  { term: "Kettle Lake", scientificDefinition: "A lake formed when a buried chunk of glacier ice melts.", simpleDefinition: "A small lake left behind by melting glacier ice." },
  { term: "Kame", scientificDefinition: "A hill made of sand and gravel deposited by meltwater.", simpleDefinition: "A mound formed by water from a melting glacier." },
  { term: "Lateral Moraine", scientificDefinition: "A ridge of debris deposited along the sides of a glacier.", simpleDefinition: "A rocky edge next to a glacier." },
  { term: "Loess", scientificDefinition: "Fine, wind-blown sediment from glacial outwash plains.", simpleDefinition: "Dusty soil blown from glacier areas." },
  { term: "Lag Deposit", scientificDefinition: "Coarse material left behind after finer sediments are blown or washed away.", simpleDefinition: "The heavier stuff left behind when the light stuff is blown off." },
  { term: "Moraine", scientificDefinition: "An accumulation of debris deposited by a glacier.", simpleDefinition: "A pile of rocks and dirt from a glacier." },
  { term: "Medial Moraine", scientificDefinition: "A stripe of debris formed where two glaciers meet.", simpleDefinition: "A line of rocks in the middle of a glacier." },
  { term: "Mass Balance", scientificDefinition: "The difference between accumulation and ablation on a glacier.", simpleDefinition: "Whether a glacier is growing or shrinking overall." },
  { term: "Meltwater", scientificDefinition: "Water from melting glacier ice.", simpleDefinition: "Melted ice from the glacier." },
  { term: "Neve", scientificDefinition: "Compacted snow that is in the process of becoming glacier ice.", simpleDefinition: "Snow that’s turning into glacier ice." },
  { term: "Nunatak", scientificDefinition: "A mountain peak or rocky ridge that sticks out above a glacier.", simpleDefinition: "A rocky island sticking up out of the ice." },
  { term: "Outwash Plain", scientificDefinition: "Flat area formed by sediment deposited by meltwater from a glacier.", simpleDefinition: "A flat land made from melted glacier water and dirt." },
  { term: "Overdeepening", scientificDefinition: "When glaciers erode bedrock to form deep basins below sea level.", simpleDefinition: "A deep hole carved under the glacier." },
  { term: "Permafrost", scientificDefinition: "Ground that stays frozen for at least two years.", simpleDefinition: "Soil that’s always frozen." },
  { term: "Plucking", scientificDefinition: "A glacier pulling rocks away from the ground as it moves.", simpleDefinition: "The glacier yanks rocks from the ground." },
  { term: "Piedmont Glacier", scientificDefinition: "A glacier that spreads out at the base of a mountain range.", simpleDefinition: "A glacier that flattens out when it hits a plain." },
  { term: "Quaternary Glaciation", scientificDefinition: "The most recent period of ice ages spanning the last 2.6 million years.", simpleDefinition: "The time of Earth’s recent ice ages." },
  { term: "Roche Moutonnée", scientificDefinition: "A rock formation smoothed by glacier ice on one side and steep on the other.", simpleDefinition: "A rock shaped by glaciers, smooth on one side, rough on the other." },
  { term: "Rift", scientificDefinition: "A crack or gap formed by ice pulling apart.", simpleDefinition: "A split in the glacier." },
  { term: "Snowline", scientificDefinition: "The lowest elevation where snow remains year-round.", simpleDefinition: "The height on a mountain where snow doesn’t melt." },
  { term: "Surge", scientificDefinition: "A short, rapid advance of a glacier.", simpleDefinition: "When the glacier suddenly moves fast." },
  { term: "Sublimation", scientificDefinition: "Ice turning straight into vapor without melting first.", simpleDefinition: "Ice disappearing into air without becoming water." },
  { term: "Terminus", scientificDefinition: "The end or snout of a glacier.", simpleDefinition: "The bottom or end of a glacier." },
  { term: "Tarn", scientificDefinition: "A lake formed in a cirque after a glacier melts.", simpleDefinition: "A small lake left in a mountain bowl." },
  { term: "Till", scientificDefinition: "Unsorted sediment deposited directly by a glacier.", simpleDefinition: "A mix of rocks and dirt dropped by a glacier." },
  { term: "U-shaped Valley", scientificDefinition: "A valley with a rounded bottom carved by glacier movement.", simpleDefinition: "A valley shaped like a big “U.”" },
  { term: "Valley Glacier", scientificDefinition: "A glacier that flows down a mountain valley.", simpleDefinition: "A glacier squeezed into a mountain path." },
  { term: "Vegetation Feedback", scientificDefinition: "How plants growing on glacial land can affect melting and climate.", simpleDefinition: "Plants growing on glaciers can speed up melting." },
  { term: "White Ice", scientificDefinition: "Newly fallen or less compressed glacier ice that appears white.", simpleDefinition: "Fresh or fluffy-looking glacier ice." },
  { term: "Watershed", scientificDefinition: "A land area where all the water drains to one place, influenced by glaciers.", simpleDefinition: "Where melted glacier water flows into rivers." },
  { term: "Xerothermic Period", scientificDefinition: "A hot and dry climatic phase often used in paleoclimatic studies.", simpleDefinition: "A very warm, dry time in Earth’s history." },
  { term: "Yenisei Glacier Influence", scientificDefinition: "Refers to glacial impact on the Yenisei River system in Siberia.", simpleDefinition: "How glaciers shaped the rivers in Siberia." },
  { term: "Younger Dryas", scientificDefinition: "A sudden return to glacial conditions about 12,800 years ago.", simpleDefinition: "A short, cold period during the end of the last ice age." },
  { term: "Zone of Ablation", scientificDefinition: "The area of a glacier where ice loss exceeds gain.", simpleDefinition: "Where the glacier melts more than it grows." },
  { term: "Zone of Accumulation", scientificDefinition: "The region where snowfall adds to the glacier.", simpleDefinition: "Where snow keeps adding ice to the glacier." }
];

export default function GlacierGlossary() {
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("");
  const [expandedTerms, setExpandedTerms] = useState({});

  // Filter based on search and first letter
  const filtered = glossaryData.filter((item) => {
    const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase());
    const matchesLetter = activeLetter ? item.term.startsWith(activeLetter) : true;
    return matchesSearch && matchesLetter;
  });

  // Group by first letter
  const grouped = filtered.reduce((acc, item) => {
    const letter = item.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(item);
    return acc;
  }, {});

  const toggleExpand = (term) => {
    setExpandedTerms((prev) => ({
      ...prev,
      [term]: !prev[term],
    }));
  };

  return (
    <section
      id="glossary"
      className="py-20 px-4 md:px-20 bg-glacier-soft min-h-screen font-cabin"
    >
      <h2 className="text-4xl font-semibold mb-6 text-glacier-dark font-nohemi">
        Glacier Glossary
      </h2>

      {/* Search */}
      <div className="mb-6 max-w-xl">
        <Input
          placeholder="Search glossary term..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-glacier-primary"
        />
      </div>

      {/* A-Z Letter Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
          <Button
            key={letter}
            variant={activeLetter === letter ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setActiveLetter(letter === activeLetter ? "" : letter)
            }
            className="w-9 h-9 p-0 text-base font-semibold"
          >
            {letter}
          </Button>
        ))}
      </div>

      {/* Glossary List */}
      {Object.keys(grouped)
        .sort()
        .map((letter) => (
          <div key={letter} className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-glacier-primary">
              Letter: {letter}
            </h3>
            <div className="space-y-4">
              {grouped[letter].map(
                ({ term, scientificDefinition, simpleDefinition }) => (
                  <div
                    key={term}
                    className="bg-glacier-light rounded-xl shadow-md p-4 flex flex-col transition-all duration-300 border border-glacier-light"
                  >
                    <button
                      className="flex justify-between items-center text-left text-sm md:text-xl text-glacier-dark focus:outline-none"
                      onClick={() => toggleExpand(term)}
                    >
                      {term}
                      {expandedTerms[term] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>

                    {expandedTerms[term] && (
                      <div className="mt-3 space-y-3">
                        <p className="text-xs md:text-base text-glacier-dark leading-relaxed">
                          <b>Scientific Definition:</b> {scientificDefinition}
                        </p>
                        <p className="text-xs md:text-base text-gray-700 leading-relaxed">
                          <b>Simple Definition:</b> {simpleDefinition}
                        </p>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        ))}

      {/* No Results */}
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No terms found.</p>
      )}
    </section>
  );
}