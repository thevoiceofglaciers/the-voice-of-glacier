"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

// Terms come from the "Glossary Terms" collection in WordPress (built-in
// defaults: wordpress/mu-plugins/tvgf-core/schemas/collections/glossary_term.json).
export default function GlacierGlossary({ title = "Glacier Glossary", terms = [] }) {
  const glossaryData = terms.map((t) => ({
    term: t.title,
    scientificDefinition: t.scientificDefinition,
    simpleDefinition: t.simpleDefinition,
  })).sort((a, b) => a.term.localeCompare(b.term));
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("");
  const [expandedTerms, setExpandedTerms] = useState({});

  // Filter based on search and first letter
  const filtered = glossaryData.filter((item) => {
    const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase());
    const matchesLetter = activeLetter ? item.term.toUpperCase().startsWith(activeLetter) : true;
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
        {title}
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