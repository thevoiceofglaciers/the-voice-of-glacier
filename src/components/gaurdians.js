"use client";

import React from "react";
import TeamCard from "./TeamCard";
import { Button } from "./ui/button";
import Link from "next/link";

const teamMembers = [
  { name: "Medha Bhaskar", role: "Yoga Leader & Practitioner", image: "/team/team.png" },
  { name: "Deepthi Rao", role: "Enviro. Studies (UPenn), Yoga", image: "/team/team.png" },
  { name: "Anurag Nallavelli", role: "Mountaineer, Athlete, Yoga", image: "/team/team.png" },
  { name: "Kalindi Manek", role: "Storyteller, Finance Professional", image: "/team/team.png" },
  { name: "Soham Punde", role: "Visual Artist, Filmmaker, HP", image: "/team/team.png" },
];

export default function GlacierTeam() {
  return (
    <section className="w-full bg-glacier-light py-16 px-4">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-black text-glacier-primary mb-2 tracking-widest uppercase italic">
            Board of Directors
          </h2>
          <div className="h-px w-8 bg-slate-800 mx-auto mb-2" />
          <p className="text-slate-500 text-[9px] tracking-[0.3em] uppercase font-bold">
            Glacier Preservation Unit
          </p>
        </header>

        {/* Team Cards */}
        <div className="flex flex-wrap justify-center gap-4">
          {teamMembers.map((member, index) => (
            <TeamCard key={index} {...member} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 flex justify-center">
          <Link href="/team">
            <Button className="bg-glacier-primary text-white font-semibold px-8 py-3 hover:bg-glacier-dark transition duration-300">
              Meet the Team
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}