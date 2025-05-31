// app/experience/components/ExperienceHeader.tsx
import { Eye } from "lucide-react";

interface ExperienceHeaderProps {
  views: number;
}

export default function ExperienceHeader({ views }: ExperienceHeaderProps) {
  return (
    <div className="max-w-2xl mx-auto lg:mx-0">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
        Experience
      </h2>
      <p className="mt-4 text-zinc-400">
        A journey through my career milestones and the impact I've made at each
        step.
      </p>
      <div className="mt-2 flex items-center space-x-2 text-gray-400 text-sm">
        <Eye className="w-4 h-4" />
        <span>{views.toLocaleString()} views</span>
      </div>
    </div>
  );
}