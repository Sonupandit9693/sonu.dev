"use client";
import {
  Code2,
  Database,
  Globe,
  Server,
  GitBranch,
  Palette,
  Zap,
  Cloud,
  Shield,
  Cpu,
  Monitor,
  Star,
} from "lucide-react";
import { Navigation } from "../components/nav";
import { useState } from "react";

const skills = [
  // --- Existing Skills ---
  {
    name: "Python",
    category: "Backend",
    level: 82,
    icon: <Cpu className="w-6 h-6" />,
    description: "Versatile programming language",
    gradient: "from-yellow-400 via-orange-500 to-red-500",
  },
  {
    name: "Flask",
    category: "Backend",
    level: 74,
    icon: <Server className="w-6 h-6" />,
    description: "Python web micro-framework",
    gradient: "from-pink-300 via-orange-400 to-red-400",
  },
  {
    name: "Java",
    category: "Backend",
    level: 85,
    icon: <Code2 className="w-6 h-6" />,
    description: "Object-oriented programming language",
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
  {
    name: "Spring",
    category: "Backend",
    level: 82,
    icon: <Server className="w-6 h-6" />,
    description: "Java-based enterprise framework",
    gradient: "from-green-600 via-emerald-400 to-lime-400",
  },
  {
    name: "Redis",
    category: "Database",
    level: 80,
    icon: <Database className="w-6 h-6" />,
    description: "In-memory key-value store",
    gradient: "from-red-500 via-pink-500 to-orange-400",
  },
  {
    name: "MariaDB",
    category: "Database",
    level: 78,
    icon: <Database className="w-6 h-6" />,
    description: "Community-developed MySQL fork",
    gradient: "from-blue-300 via-teal-400 to-green-400",
  },
  {
    name: "MySQL",
    category: "Database",
    level: 84,
    icon: <Database className="w-6 h-6" />,
    description: "Popular open-source relational database",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
  },
  {
    name: "Kubernetes",
    category: "DevOps",
    level: 76,
    icon: <Shield className="w-6 h-6" />,
    description: "Container orchestration platform",
    gradient: "from-indigo-500 via-blue-500 to-cyan-500",
  },
  {
    name: "Linux",
    category: "DevOps",
    level: 85,
    icon: <Cpu className="w-6 h-6" />,
    description: "Open-source OS for servers and systems",
    gradient: "from-gray-600 via-gray-800 to-black",
  },
  {
    name: "RabbitMQ",
    category: "Backend",
    level: 77,
    icon: <Zap className="w-6 h-6" />,
    description: "Message broker for async communication",
    gradient: "from-orange-400 via-yellow-500 to-red-500",
  },

  {
    name: "Minikube",
    category: "DevOps",
    level: 72,
    icon: <Shield className="w-6 h-6" />,
    description: "Kubernetes local cluster setup",
    gradient: "from-blue-400 via-indigo-500 to-purple-500",
  },
  {
    name: "Frappe",
    category: "Framework",
    level: 90,
    icon: <Code2 className="w-6 h-6" />,
    description: "Python web framework for ERP",
    gradient: "from-cyan-400 via-teal-500 to-blue-600",
  },
  {
    name: "AWS",
    category: "Cloud",
    level: 78,
    icon: <Cloud className="w-6 h-6" />,
    description: "Cloud computing platform",
    gradient: "from-orange-400 via-red-500 to-pink-500",
  },
  {
    name: "Docker",
    category: "DevOps",
    level: 75,
    icon: <Shield className="w-6 h-6" />,
    description: "Containerization platform",
    gradient: "from-blue-400 via-cyan-500 to-teal-500",
  },
  {
    name: "Git",
    category: "DevOps",
    level: 92,
    icon: <GitBranch className="w-6 h-6" />,
    description: "Version control system",
    gradient: "from-red-400 via-pink-500 to-purple-500",
  },
  {
    name: "PostgreSQL",
    category: "Database",
    level: 88,
    icon: <Database className="w-6 h-6" />,
    description: "Advanced relational database",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
  },
  {
    name: "React",
    category: "Frontend",
    level: 95,
    icon: <Code2 className="w-6 h-6" />,
    description: "Building dynamic user interfaces",
    gradient: "from-blue-400 via-purple-500 to-pink-500",
  },
  {
    name: "Next.js",
    category: "Frontend",
    level: 92,
    icon: <Globe className="w-6 h-6" />,
    description: "Full-stack React framework",
    gradient: "from-gray-900 via-gray-600 to-gray-400",
  },
  {
    name: "TypeScript",
    category: "Frontend",
    level: 88,
    icon: <Code2 className="w-6 h-6" />,
    description: "Type-safe JavaScript development",
    gradient: "from-blue-600 via-blue-400 to-cyan-400",
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    level: 94,
    icon: <Palette className="w-6 h-6" />,
    description: "Utility-first CSS framework",
    gradient: "from-cyan-400 via-teal-500 to-blue-500",
  },
  {
    name: "Node.js",
    category: "Backend",
    level: 85,
    icon: <Server className="w-6 h-6" />,
    description: "Server-side JavaScript runtime",
    gradient: "from-green-400 via-emerald-500 to-teal-500",
  },
  {
    name: "MongoDB",
    category: "Database",
    level: 85,
    icon: <Database className="w-6 h-6" />,
    description: "NoSQL document database",
    gradient: "from-green-500 via-lime-500 to-emerald-500",
  },

  {
    name: "GraphQL",
    category: "Backend",
    level: 80,
    icon: <Zap className="w-6 h-6" />,
    description: "Query language for APIs",
    gradient: "from-pink-400 via-purple-500 to-indigo-500",
  },
  {
    name: "ERPNext",
    category: "Framework",
    level: 92,
    icon: <Code2 className="w-6 h-6" />,
    description: "Open-source ERP built on Frappe",
    gradient: "from-purple-400 via-pink-500 to-red-500",
  },
];

const categories = [
  "All",
  "Frontend",
  "Backend",
  "Database",
  "Cloud",
  "DevOps",
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);
  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-6 max-w-7xl lg:px-8 md:space-y-12 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Technical Expertise
          </h2>
          <p className="mt-4 text-zinc-400">
            Crafting digital experiences with cutting-edge technologies and
            modern development practices
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                activeCategory === category
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSkills.length === 0 ? (
              <p className="text-center text-zinc-400 col-span-full">
                No skills found in this category.
              </p>
            ) : (
             <>
               {filteredSkills.map((skill, index) => (
                <div
                  key={index}
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Animated Border */}
                  <div
                    className="absolute -inset-0.5 bg-gradient-to-r opacity-75 rounded-2xl blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"
                    style={{
                      background: `linear-gradient(45deg, ${skill.gradient
                        .split(" ")
                        .map((color) =>
                          color
                            .replace("from-", "")
                            .replace("via-", "")
                            .replace("to-", "")
                        )
                        .join(", ")})`,
                      backgroundSize: "400% 400%",
                    }}
                  ></div>
    
                  {/* Card Content */}
                  <div className="relative bg-zinc-800/70 backdrop-blur-md rounded-2xl p-6 h-full border border-zinc-700/50 shadow-xl group-hover:bg-zinc-700/80 transition-all duration-300 cursor-pointer">
                    {/* Skill Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${skill.gradient} text-white shadow-lg`}
                      >
                        {skill.icon}
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        <span className="text-sm font-semibold">
                          {skill.level}%
                        </span>
                      </div>
                    </div>
    
                    {/* Skill Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {skill.name}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {skill.description}
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                        {skill.category}
                      </span>
                    </div>
    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Proficiency</span>
                        <span className="text-white font-semibold">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${skill.gradient} rounded-full transition-all duration-1000 ease-out group-hover:scale-105 relative overflow-hidden`}
                          style={{ width: `${skill.level}%` }}
                        >
                          {/* Shimmer Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              ))}
             </>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              label: "Years Experience",
              value: "2+",
              icon: <Monitor className="w-6 h-6" />,
            },
            {
              label: "Projects Completed",
              value: "50+",
              icon: <Code2 className="w-6 h-6" />,
            },
            {
              label: "Technologies",
              value: "20+",
              icon: <Zap className="w-6 h-6" />,
            },
            {
              label: "Certifications",
              value: "8+",
              icon: <Star className="w-6 h-6" />,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-purple-400 mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex items-center pt-10 mb-0 justify-center text-sm text-zinc-500">
        <p className="text-center">
          © {new Date().getFullYear()} Sonu Kumar. All rights reserved.
        </p>
      </div>
      <style jsx>{`
        @keyframes gradient-xy {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-gradient-xy {
          animation: gradient-xy 3s ease infinite;
          background-size: 400% 400%;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
