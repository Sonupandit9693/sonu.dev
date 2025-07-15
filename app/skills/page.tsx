"use client"

import { useState } from "react"
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
  Star,
  Brain,
  MessageSquare,
  Lock,
  Container,
  Activity,
  Layers,
  Search,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
} from "lucide-react"
import { Navigation } from "../components/nav"
import { Card } from "../components/card"

const skills = [
  // Programming Languages
  {
    name: "Python",
    category: "Languages",
    level: 95,
    icon: <Cpu className="w-5 h-5" />,
    description: "Primary language for backend & AI development",
    gradient: "from-yellow-400 to-orange-500",
    experience: "2+ years",
    projects: 8,
    isCore: true,
  },
  {
    name: "JavaScript",
    category: "Languages",
    level: 88,
    icon: <Code2 className="w-5 h-5" />,
    description: "Frontend and full-stack development",
    gradient: "from-yellow-300 to-orange-400",
    experience: "2+ years",
    projects: 6,
    isCore: true,
  },
  {
    name: "TypeScript",
    category: "Languages",
    level: 85,
    icon: <Code2 className="w-5 h-5" />,
    description: "Type-safe JavaScript development",
    gradient: "from-blue-600 to-cyan-400",
    experience: "1.5+ years",
    projects: 4,
    isCore: true,
  },
  {
    name: "SQL",
    category: "Languages",
    level: 90,
    icon: <Database className="w-5 h-5" />,
    description: "Database queries and optimization",
    gradient: "from-blue-500 to-purple-500",
    experience: "2+ years",
    projects: 7,
    isCore: true,
  },
  // Backend Frameworks
  {
    name: "FastAPI",
    category: "Backend",
    level: 92,
    icon: <Server className="w-5 h-5" />,
    description: "High-performance async Python framework",
    gradient: "from-teal-400 to-emerald-600",
    experience: "2+ years",
    projects: 5,
    isCore: true,
  },
  {
    name: "Flask",
    category: "Backend",
    level: 88,
    icon: <Server className="w-5 h-5" />,
    description: "Lightweight Python web framework",
    gradient: "from-pink-300 to-red-400",
    experience: "2+ years",
    projects: 4,
    isCore: true,
  },
  {
    name: "Django",
    category: "Backend",
    level: 85,
    icon: <Server className="w-5 h-5" />,
    description: "Full-featured Python web framework",
    gradient: "from-green-600 to-teal-500",
    experience: "1.5+ years",
    projects: 3,
  },
  {
    name: "Celery",
    category: "Backend",
    level: 80,
    icon: <Activity className="w-5 h-5" />,
    description: "Distributed task queue for Python",
    gradient: "from-green-400 to-emerald-500",
    experience: "1+ years",
    projects: 2,
  },
  {
    name: "SQLAlchemy",
    category: "Backend",
    level: 85,
    icon: <Database className="w-5 h-5" />,
    description: "Python SQL toolkit and ORM",
    gradient: "from-blue-400 to-purple-500",
    experience: "2+ years",
    projects: 5,
  },
  // Databases
  {
    name: "PostgreSQL",
    category: "Database",
    level: 90,
    icon: <Database className="w-5 h-5" />,
    description: "Advanced open-source relational database",
    gradient: "from-blue-500 to-purple-500",
    experience: "2+ years",
    projects: 6,
    isCore: true,
  },
  {
    name: "MySQL",
    category: "Database",
    level: 85,
    icon: <Database className="w-5 h-5" />,
    description: "Popular open-source relational database",
    gradient: "from-blue-500 to-teal-500",
    experience: "2+ years",
    projects: 4,
  },
  {
    name: "MongoDB",
    category: "Database",
    level: 82,
    icon: <Database className="w-5 h-5" />,
    description: "NoSQL document database",
    gradient: "from-green-500 to-emerald-500",
    experience: "1+ years",
    projects: 3,
  },
  {
    name: "Redis",
    category: "Database",
    level: 88,
    icon: <Database className="w-5 h-5" />,
    description: "In-memory data structure store",
    gradient: "from-red-500 to-orange-400",
    experience: "2+ years",
    projects: 4,
  },
  {
    name: "Qdrant",
    category: "Database",
    level: 85,
    icon: <Search className="w-5 h-5" />,
    description: "Vector database for AI applications",
    gradient: "from-purple-500 to-red-500",
    experience: "1+ years",
    projects: 2,
  },
  // APIs
  {
    name: "REST APIs",
    category: "APIs",
    level: 92,
    icon: <Zap className="w-5 h-5" />,
    description: "RESTful web service architecture",
    gradient: "from-blue-400 to-pink-500",
    experience: "2+ years",
    projects: 8,
    isCore: true,
  },
  {
    name: "GraphQL",
    category: "APIs",
    level: 75,
    icon: <Zap className="w-5 h-5" />,
    description: "Query language for APIs",
    gradient: "from-pink-400 to-indigo-500",
    experience: "1+ years",
    projects: 2,
  },
  {
    name: "Microservices",
    category: "APIs",
    level: 85,
    icon: <Layers className="w-5 h-5" />,
    description: "Distributed system architecture",
    gradient: "from-green-400 to-cyan-500",
    experience: "2+ years",
    projects: 4,
  },
  {
    name: "JWT Auth",
    category: "APIs",
    level: 88,
    icon: <Lock className="w-5 h-5" />,
    description: "JSON Web Token authentication",
    gradient: "from-orange-400 to-pink-500",
    experience: "2+ years",
    projects: 6,
  },
  // DevOps & Cloud
  {
    name: "Docker",
    category: "DevOps",
    level: 88,
    icon: <Container className="w-5 h-5" />,
    description: "Containerization platform",
    gradient: "from-blue-400 to-teal-500",
    experience: "2+ years",
    projects: 5,
    isCore: true,
  },
  {
    name: "AWS",
    category: "Cloud",
    level: 85,
    icon: <Cloud className="w-5 h-5" />,
    description: "EC2, S3, Lambda cloud services",
    gradient: "from-orange-400 to-pink-500",
    experience: "2+ years",
    projects: 4,
    isCore: true,
  },
  {
    name: "Kubernetes",
    category: "DevOps",
    level: 80,
    icon: <Shield className="w-5 h-5" />,
    description: "Container orchestration platform",
    gradient: "from-indigo-500 to-cyan-500",
    experience: "1+ years",
    projects: 2,
  },
  {
    name: "CI/CD",
    category: "DevOps",
    level: 85,
    icon: <GitBranch className="w-5 h-5" />,
    description: "Continuous integration & deployment",
    gradient: "from-green-400 to-cyan-500",
    experience: "2+ years",
    projects: 5,
  },
  {
    name: "Git",
    category: "DevOps",
    level: 95,
    icon: <GitBranch className="w-5 h-5" />,
    description: "Version control system",
    gradient: "from-red-400 to-purple-500",
    experience: "2+ years",
    projects: 10,
  },
  // AI & ML
  {
    name: "GPT-4",
    category: "AI/ML",
    level: 90,
    icon: <Brain className="w-5 h-5" />,
    description: "OpenAI's large language model",
    gradient: "from-green-400 to-purple-600",
    experience: "1+ years",
    projects: 4,
    isCore: true,
  },
  {
    name: "LangChain",
    category: "AI/ML",
    level: 88,
    icon: <Brain className="w-5 h-5" />,
    description: "Framework for LLM applications",
    gradient: "from-yellow-400 to-red-500",
    experience: "1+ years",
    projects: 3,
    isCore: true,
  },
  {
    name: "RAG",
    category: "AI/ML",
    level: 88,
    icon: <Search className="w-5 h-5" />,
    description: "Retrieval-Augmented Generation",
    gradient: "from-cyan-400 to-indigo-500",
    experience: "1+ years",
    projects: 2,
    isCore: true,
  },
  {
    name: "Whisper API",
    category: "AI/ML",
    level: 85,
    icon: <MessageSquare className="w-5 h-5" />,
    description: "Speech-to-text API by OpenAI",
    gradient: "from-blue-400 to-purple-500",
    experience: "6 months",
    projects: 1,
  },
  // Frontend
  {
    name: "React.js",
    category: "Frontend",
    level: 88,
    icon: <Code2 className="w-5 h-5" />,
    description: "JavaScript library for building UIs",
    gradient: "from-blue-400 to-pink-500",
    experience: "2+ years",
    projects: 5,
  },
  {
    name: "Next.js",
    category: "Frontend",
    level: 85,
    icon: <Globe className="w-5 h-5" />,
    description: "React framework for production",
    gradient: "from-gray-600 to-gray-800",
    experience: "1.5+ years",
    projects: 3,
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    level: 90,
    icon: <Palette className="w-5 h-5" />,
    description: "Utility-first CSS framework",
    gradient: "from-cyan-400 to-blue-500",
    experience: "2+ years",
    projects: 6,
  },
]

const categories = ["All", "Languages", "Backend", "Database", "APIs", "DevOps", "Cloud", "AI/ML", "Frontend"]

const achievements = [
  {
    title: "Enterprise Impact",
    value: "5000+ Users",
    description: "ERP system serving enterprise clients",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Problem Solving",
    value: "340+ Problems",
    description: "LeetCode algorithmic challenges solved",
    icon: <Code2 className="w-5 h-5" />,
  },
  {
    title: "Production Systems",
    value: "99.9% Uptime",
    description: "Reliable, scalable applications deployed",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    title: "Technical Breadth",
    value: "30+ Technologies",
    description: "Full-stack development expertise",
    icon: <Award className="w-5 h-5" />,
  },
]

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredSkills = activeCategory === "All" ? skills : skills.filter((skill) => skill.category === activeCategory)

  const coreSkills = skills.filter((skill) => skill.isCore)

  return (
    <div className="relative pb-16">
      <Navigation />

      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        {/* Professional Header */}
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">Technical Skills</h2>
          <p className="mt-4 text-zinc-400">
            Full-Stack Developer specializing in Python, AI/ML, and Enterprise Systems with 2+ years of production
            experience
          </p>
          <div className="flex items-center gap-6 mt-6 text-sm text-zinc-500">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              2+ Years Experience
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              Enterprise Ready
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              Production Proven
            </span>
          </div>
        </div>

        <div className="w-full h-px bg-zinc-800" />

        {/* Key Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <Card key={index}>
              <div className="p-6 text-center">
                <div className="text-blue-400 mb-3 flex justify-center">{achievement.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{achievement.value}</div>
                <div className="text-sm text-gray-300 font-medium mb-1">{achievement.title}</div>
                <div className="text-xs text-gray-500">{achievement.description}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Core Skills Summary */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Core Expertise</h3>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Most Proficient</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreSkills.map((skill, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${skill.gradient} flex items-center justify-center`}
                    >
                      {skill.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-white">{skill.name}</h4>
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">{skill.level}%</span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{skill.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{skill.experience}</span>
                        <span>•</span>
                        <span>{skill.projects} projects</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${skill.gradient} transition-all duration-500`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeCategory === category
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 border border-zinc-700"
              }`}
            >
              {category}
              {category !== "All" && (
                <span className="ml-2 text-xs opacity-60">
                  ({skills.filter((s) => s.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* All Skills */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">All Technologies</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkills.map((skill, index) => (
              <Card key={index}>
                <div className="p-5 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${skill.gradient} flex items-center justify-center`}
                    >
                      {skill.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{skill.level}%</div>
                      {skill.isCore && <Star className="w-4 h-4 text-blue-400 ml-auto" />}
                    </div>
                  </div>

                  <h4 className="font-semibold text-white mb-2">{skill.name}</h4>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{skill.description}</p>

                  <div className="space-y-2">
                    <div className="w-full bg-zinc-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${skill.gradient} transition-all duration-500`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="px-2 py-1 bg-zinc-700/50 rounded text-gray-400">{skill.category}</span>
                      <span>{skill.experience}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Professional Summary */}
        <Card>
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready for Your Next Project</h3>
            <p className="text-gray-300 max-w-3xl mx-auto mb-6">
              Experienced full-stack developer with a proven track record of building scalable, enterprise-grade
              applications. Specialized in AI integration, backend systems, and modern web technologies.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm">Enterprise Systems</span>
              <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm">AI/ML Integration</span>
              <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm">
                Scalable Architecture
              </span>
              <span className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm">
                Team Collaboration
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="w-full h-10 flex items-center justify-center text-sm text-zinc-500 mt-10">
        <p className="text-center">© {new Date().getFullYear()} Sonu Kumar. All rights reserved.</p>
      </div>
    </div>
  )
}