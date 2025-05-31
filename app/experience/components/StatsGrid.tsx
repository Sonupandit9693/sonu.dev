import { Briefcase, Building, Code2, Users } from "lucide-react";

const stats = [
  {
    icon: <Briefcase className="w-6 h-6" />,
    value: "2+",
    label: "Years Experience",
  },
  {
    icon: <Building className="w-6 h-6" />,
    value: "2",
    label: "Companies",
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    value: "50+",
    label: "Projects",
  },
  {
    icon: <Users className="w-6 h-6" />,
    value: "10+",
    label: "Team Members",
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
        >
          <div className="text-blue-400 mb-3 flex justify-center">
            {stat.icon}
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
          <div className="text-gray-400 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}