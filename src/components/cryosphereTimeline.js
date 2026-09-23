"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from "recharts";

// Data points, caption and references come from the WordPress
// "glacier-matters" Page (schema: pages/glacier-matters.json).
const CryosphereTimeline = ({ title, points = [], caption, references = [] }) => {
  const timelineData = points
    .filter((p) => p.year !== null && p.year !== "" && p.value !== null && p.value !== "")
    .map((p) => ({ year: Number(p.year), glaciers: Number(p.value) }));

  return (
    <section className="w-full bg-glacier-dark py-20">
      <div className="w-[95%] max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-glacier-light mb-10">
          {title}
        </h2>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A787C" />
            <XAxis dataKey="year" stroke="#D7E2E2">
              <Label value="Year" offset={-10} position="insideBottom" fill="#D7E2E2" />
            </XAxis>
            <YAxis stroke="#D7E2E2" domain={[50, 100]} tickFormatter={(val) => `${val}%`}>
              <Label
                value="Remaining Glacial Mass (%)"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
                fill="#D7E2E2"
              />
            </YAxis>
            <Tooltip
              contentStyle={{ backgroundColor: "#042A33", borderColor: "#2A787C" }}
              labelStyle={{ color: "#D7E2E2" }}
              itemStyle={{ color: "#D7E2E2" }}
            />
            <Line
              type="monotone"
              dataKey="glaciers"
              stroke="#8B0333"
              strokeWidth={3}
              dot={{ fill: "#D7E2E2", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {caption && (
          <p className="text-sm md:text-base text-glacier-light/80 mt-6 max-w-3xl mx-auto">
            {caption}
          </p>
        )}

        {/* References Section */}
        {references.length > 0 && (
          <div className="mt-8 text-left max-w-3xl mx-auto text-glacier-light/70 text-xs md:text-sm">
            <p className="font-semibold mb-2">References:</p>
            <ul className="list-disc pl-5 space-y-1">
              {references.map((ref, i) => (
                <li key={i}>
                  <a
                    href={ref.url || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-glacier-light underline"
                  >
                    {ref.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default CryosphereTimeline;
