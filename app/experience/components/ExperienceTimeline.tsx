"use client";

import { useState } from "react";
import ExperienceCard from "./ExperienceCard";
import { experiences } from "../data/experiences";

export default function ExperienceTimeline() {
  const [activeExperience, setActiveExperience] = useState(0);

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>

      {/* Experience Cards */}
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className={`relative flex flex-col md:flex-row items-start md:items-center ${
              index % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
            onMouseEnter={() => setActiveExperience(index)}
          >
            {/* Timeline Dot */}
            <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-slate-900 z-10 flex items-center justify-center">
              {exp.current && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </div>

            <ExperienceCard exp={exp} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}