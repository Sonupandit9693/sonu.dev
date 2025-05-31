"use client";

import ExperienceHeader from "./ExperienceHeader";
import StatsGrid from "./StatsGrid";
import ExperienceTimeline from "./ExperienceTimeline";
import CallToAction from "./CallToAction";
import { Navigation } from "@/app/components/nav";

interface ExperienceClientProps {
  views: number;
}

export default function ExperienceClient({ views }: ExperienceClientProps) {
  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <ExperienceHeader views={views} />
        <div className="w-full h-px bg-zinc-800" />
        <StatsGrid />
        <ExperienceTimeline />
        <CallToAction />
      </div>
    </div>
  );
}