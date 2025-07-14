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
  Brain,
  MessageSquare,
  Settings,
  Lock,
  Container,
  Activity,
  FileText,
  Layers,
  Search,
  Workflow,
  Users,
} from "lucide-react";
// import { Navigation } from "../components/nav";
import { useState } from "react";
import { Navigation } from "../components/nav";

const skills = [
  // Programming Languages
  {
    name: "Python",
    category: "Languages",
    level: 95,
    icon: <Cpu className="w-6 h-6" />,
    description: "Primary language for backend & AI development",
    gradient: "from-yellow-400 via-orange-500 to-red-500",
  },
  {
    name: "JavaScript",
    category: "Languages",
    level: 88,
    icon: <Code2 className="w-6 h-6" />,
    description: "Frontend and full-stack development",
    gradient: "from-yellow-300 via-orange-400 to-red-400",
  },
  {
    name: "TypeScript",
    category: "Languages",
    level: 85,
    icon: <Code2 className="w-6 h-6" />,
    description: "Type-safe JavaScript development",
    gradient: "from-blue-600 via-blue-400 to-cyan-400",
  },
  {
    name: "SQL",
    category: "Languages",
    level: 90,
    icon: <Database className="w-6 h-6" />,
    description: "Database queries and optimization",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
  },

  // Backend Frameworks
  {
    name: "FastAPI",
    category: "Backend",
    level: 92,
    icon: <Server className="w-6 h-6" />,
    description: "High-performance async Python framework",
    gradient: "from-teal-400 via-green-500 to-emerald-600",
  },
  {
    name: "Flask",
    category: "Backend",
    level: 88,
    icon: <Server className="w-6 h-6" />,
    description: "Lightweight Python web framework",
    gradient: "from-pink-300 via-orange-400 to-red-400",
  },
  {
    name: "Django",
    category: "Backend",
    level: 85,
    icon: <Server className="w-6 h-6" />,
    description: "Full-featured Python web framework",
    gradient: "from-green-600 via-emerald-500 to-teal-500",
  },
  {
    name: "Celery",
    category: "Backend",
    level: 80,
    icon: <Activity className="w-6 h-6" />,
    description: "Distributed task queue for Python",
    gradient: "from-green-400 via-lime-500 to-emerald-500",
  },
  {
    name: "SQLAlchemy",
    category: "Backend",
    level: 85,
    icon: <Database className="w-6 h-6" />,
    description: "Python SQL toolkit and ORM",
    gradient: "from-blue-400 via-indigo-500 to-purple-500",
  },
  {
    name: "Alembic",
    category: "Backend",
    level: 78,
    icon: <Database className="w-6 h-6" />,
    description: "Database migration tool for SQLAlchemy",
    gradient: "from-purple-400 via-pink-500 to-red-500",
  },

  // Databases
  {
    name: "PostgreSQL",
    category: "Database",
    level: 90,
    icon: <Database className="w-6 h-6" />,
    description: "Advanced open-source relational database",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
  },
  {
    name: "MySQL",
    category: "Database",
    level: 85,
    icon: <Database className="w-6 h-6" />,
    description: "Popular open-source relational database",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
  },
  {
    name: "MongoDB",
    category: "Database",
    level: 82,
    icon: <Database className="w-6 h-6" />,
    description: "NoSQL document database",
    gradient: "from-green-500 via-lime-500 to-emerald-500",
  },
  {
    name: "Redis",
    category: "Database",
    level: 88,
    icon: <Database className="w-6 h-6" />,
    description: "In-memory data structure store",
    gradient: "from-red-500 via-pink-500 to-orange-400",
  },
  {
    name: "MariaDB",
    category: "Database",
    level: 80,
    icon: <Database className="w-6 h-6" />,
    description: "Community-developed MySQL fork",
    gradient: "from-blue-300 via-teal-400 to-green-400",
  },
  {
    name: "Qdrant",
    category: "Database",
    level: 85,
    icon: <Search className="w-6 h-6" />,
    description: "Vector database for AI applications",
    gradient: "from-purple-500 via-pink-500 to-red-500",
  },

  // Backend & APIs
  {
    name: "REST APIs",
    category: "APIs",
    level: 92,
    icon: <Zap className="w-6 h-6" />,
    description: "RESTful web service architecture",
    gradient: "from-blue-400 via-purple-500 to-pink-500",
  },
  {
    name: "GraphQL",
    category: "APIs",
    level: 75,
    icon: <Zap className="w-6 h-6" />,
    description: "Query language for APIs",
    gradient: "from-pink-400 via-purple-500 to-indigo-500",
  },
  {
    name: "gRPC",
    category: "APIs",
    level: 78,
    icon: <Zap className="w-6 h-6" />,
    description: "High-performance RPC framework",
    gradient: "from-cyan-400 via-blue-500 to-indigo-500",
  },
  {
    name: "Microservices",
    category: "APIs",
    level: 85,
    icon: <Layers className="w-6 h-6" />,
    description: "Distributed system architecture",
    gradient: "from-green-400 via-teal-500 to-cyan-500",
  },
  {
    name: "JWT Auth",
    category: "APIs",
    level: 88,
    icon: <Lock className="w-6 h-6" />,
    description: "JSON Web Token authentication",
    gradient: "from-orange-400 via-red-500 to-pink-500",
  },
  {
    name: "WebHooks",
    category: "APIs",
    level: 82,
    icon: <MessageSquare className="w-6 h-6" />,
    description: "HTTP callbacks for real-time updates",
    gradient: "from-purple-400 via-pink-500 to-red-500",
  },

  // DevOps & Cloud
  {
    name: "Docker",
    category: "DevOps",
    level: 88,
    icon: <Container className="w-6 h-6" />,
    description: "Containerization platform",
    gradient: "from-blue-400 via-cyan-500 to-teal-500",
  },
  {
    name: "AWS",
    category: "Cloud",
    level: 85,
    icon: <Cloud className="w-6 h-6" />,
    description: "EC2, S3, Lambda cloud services",
    gradient: "from-orange-400 via-red-500 to-pink-500",
  },
  {
    name: "Kubernetes",
    category: "DevOps",
    level: 80,
    icon: <Shield className="w-6 h-6" />,
    description: "Container orchestration platform",
    gradient: "from-indigo-500 via-blue-500 to-cyan-500",
  },
  {
    name: "Terraform",
    category: "DevOps",
    level: 75,
    icon: <Settings className="w-6 h-6" />,
    description: "Infrastructure as code tool",
    gradient: "from-purple-500 via-indigo-500 to-blue-500",
  },
  {
    name: "Jenkins",
    category: "DevOps",
    level: 78,
    icon: <Settings className="w-6 h-6" />,
    description: "Continuous integration server",
    gradient: "from-blue-400 via-indigo-500 to-purple-500",
  },
  {
    name: "CI/CD",
    category: "DevOps",
    level: 85,
    icon: <GitBranch className="w-6 h-6" />,
    description: "Continuous integration & deployment",
    gradient: "from-green-400 via-teal-500 to-cyan-500",
  },
  {
    name: "Git",
    category: "DevOps",
    level: 95,
    icon: <GitBranch className="w-6 h-6" />,
    description: "Version control system",
    gradient: "from-red-400 via-pink-500 to-purple-500",
  },

  // AI & LLM Tools
  {
    name: "GPT-4",
    category: "AI/ML",
    level: 90,
    icon: <Brain className="w-6 h-6" />,
    description: "OpenAI's large language model",
    gradient: "from-green-400 via-blue-500 to-purple-600",
  },
  {
    name: "LangChain",
    category: "AI/ML",
    level: 88,
    icon: <Brain className="w-6 h-6" />,
    description: "Framework for LLM applications",
    gradient: "from-yellow-400 via-orange-500 to-red-500",
  },
  {
    name: "AutoGen",
    category: "AI/ML",
    level: 82,
    icon: <Workflow className="w-6 h-6" />,
    description: "Multi-agent conversation framework",
    gradient: "from-purple-400 via-pink-500 to-red-500",
  },
  {
    name: "Whisper API",
    category: "AI/ML",
    level: 85,
    icon: <MessageSquare className="w-6 h-6" />,
    description: "Speech-to-text API by OpenAI",
    gradient: "from-blue-400 via-indigo-500 to-purple-500",
  },
  {
    name: "n8n",
    category: "AI/ML",
    level: 80,
    icon: <Workflow className="w-6 h-6" />,
    description: "Workflow automation platform",
    gradient: "from-pink-400 via-purple-500 to-indigo-500",
  },
  {
    name: "RAG",
    category: "AI/ML",
    level: 88,
    icon: <Search className="w-6 h-6" />,
    description: "Retrieval-Augmented Generation",
    gradient: "from-cyan-400 via-blue-500 to-indigo-500",
  },

  // Frontend
  {
    name: "React.js",
    category: "Frontend",
    level: 88,
    icon: <Code2 className="w-6 h-6" />,
    description: "JavaScript library for building UIs",
    gradient: "from-blue-400 via-purple-500 to-pink-500",
  },
  {
    name: "Next.js",
    category: "Frontend",
    level: 85,
    icon: <Globe className="w-6 h-6" />,
    description: "React framework for production",
    gradient: "from-gray-900 via-gray-600 to-gray-400",
  },
  {
    name: "Vue.js",
    category: "Frontend",
    level: 78,
    icon: <Code2 className="w-6 h-6" />,
    description: "Progressive JavaScript framework",
    gradient: "from-green-400 via-teal-500 to-cyan-500",
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    level: 90,
    icon: <Palette className="w-6 h-6" />,
    description: "Utility-first CSS framework",
    gradient: "from-cyan-400 via-teal-500 to-blue-500",
  },

  // Tools
  {
    name: "Swagger",
    category: "Tools",
    level: 85,
    icon: <FileText className="w-6 h-6" />,
    description: "API documentation tool",
    gradient: "from-green-400 via-teal-500 to-cyan-500",
  },
  {
    name: "Postman",
    category: "Tools",
    level: 90,
    icon: <Zap className="w-6 h-6" />,
    description: "API testing and development tool",
    gradient: "from-orange-400 via-red-500 to-pink-500",
  },
  {
    name: "Docker Compose",
    category: "Tools",
    level: 88,
    icon: <Container className="w-6 h-6" />,
    description: "Multi-container Docker applications",
    gradient: "from-blue-400 via-cyan-500 to-teal-500",
  },
  {
    name: "Superset",
    category: "Tools",
    level: 82,
    icon: <Monitor className="w-6 h-6" />,
    description: "Modern data visualization platform",
    gradient: "from-purple-400 via-pink-500 to-red-500",
  },
  {
    name: "RabbitMQ",
    category: "Tools",
    level: 80,
    icon: <MessageSquare className="w-6 h-6" />,
    description: "Message broker for microservices",
    gradient: "from-orange-400 via-yellow-500 to-red-500",
  },
  {
    name: "VS Code",
    category: "Tools",
    level: 95,
    icon: <Code2 className="w-6 h-6" />,
    description: "Primary development environment",
    gradient: "from-blue-400 via-indigo-500 to-purple-500",
  },
];

const categories = [
  "All",
  "Languages",
  "Backend",
  "Database",
  "APIs",
  "DevOps",
  "Cloud",
  "AI/ML",
  "Frontend",
  "Tools",
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
            2+ years of experience in AI-integrated enterprise systems, backend development, and modern web technologies
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 text-sm ${
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
                  style={{ animationDelay: `${index * 50}ms` }}
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
              label: "Technologies",
              value: "40+",
              icon: <Zap className="w-6 h-6" />,
            },
            {
              label: "LeetCode Problems",
              value: "340+",
              icon: <Code2 className="w-6 h-6" />,
            },
            {
              label: "Users Served",
              value: "5000+",
              icon: <Users className="w-6 h-6" />,
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
      `}</style>
    </div>
  );
}