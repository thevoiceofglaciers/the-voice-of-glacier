"use client";

import CompareSlider from "@/components/CompareSlider";

export default function GlacierCard({
  title,
  location,
  retreat,
  concern,
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-glacier-primary space-y-4">
      <div>
        <h3 className="text-xl font-bold mb-1">🧊 {title}</h3>
        {location && <p><strong>Location:</strong> {location}</p>}
        {retreat && <p><strong>Retreat:</strong> {retreat}</p>}
        {concern && <p><strong>Concern:</strong> {concern}</p>}
      </div>

      <CompareSlider
        heading={title}
        beforeImage={beforeImage}
        afterImage={afterImage}
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
      />
    </div>
  );
}
