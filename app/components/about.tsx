import Image from "next/image"
import { Linkedin, Twitter, Github, Mail, Code, Award, Users, Zap } from "lucide-react"

export default function About() {
  const socialLinks = [
    { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/in/sonukumarpandit/", label: "LinkedIn" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://x.com/SonuKum29372459", label: "Twitter" },
    { icon: <Mail className="w-5 h-5" />, href: "mailto:sonukumarcode@gmail.com", label: "Email" },
    { icon: <Github className="w-5 h-5" />, href: "https://github.com/Sonupandit9693", label: "GitHub" },
  ]

  const achievements = [
    {
      icon: <Code className="w-4 h-4" />,
      text: "Software Engineer with 2+ years of experience in enterprise-scale AI systems"
    },
    {
      icon: <Zap className="w-4 h-4" />,
      text: "Led development of RAG-based enterprise knowledge platform using LangChain and Qdrant"
    },
    {
      icon: <Users className="w-4 h-4" />,
      text: "Delivered ERP solutions for 4,000+ users at government PSU clients"
    },
    {
      icon: <Award className="w-4 h-4" />,
      text: "Bachelor of Vocation in Software Development from Maharshi Dayanand University (GPA: 8.6/10)"
    }
  ]

  const techStack = [
    { category: "Languages", skills: ["Python", "JavaScript", "SQL"] },
    { category: "Frameworks", skills: ["FastAPI", "Flask", "React.js", "LangChain"] },
    { category: "AI/LLM", skills: ["LLM APIs", "RAG Systems", "OpenCV", "Multi-agent Workflows"] },
    { category: "Databases", skills: ["MariaDB", "PostgreSQL", "Qdrant", "Redis"] }
  ]

  const highlights = [
    { number: "340+", label: "LeetCode Problems Solved" },
    { number: "4,000+", label: "Users Served" },
    { number: "1.5+", label: "Years Experience" },
    { number: "RAG", label: "Systems Architect" }
  ]

  return (
    <section className="min-h-screen bg-gradient-to-tl from-black via-zinc-600/20 to-black w-full overflow-hidden py-12 px-4 flex items-center justify-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About Me</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Software Engineer specializing in enterprise-scale AI systems and ERP solutions for government PSU clients
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Image Section */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative group mt-12 ml-7">
                {/* Animated border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

                {/* Image container */}
                <div className="relative bg-slate-800 rounded-xl p-2">
                  <Image
                    src="/profile.jpeg"
                    alt="Sonu Kumar - Software Engineer"
                    width={400}
                    height={400}
                    className="rounded-lg object-cover w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="text-white space-y-6">
              {/* Name and Title */}
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Sonu Kumar
                </h2>
                <p className="text-base text-slate-300 font-medium leading-snug">
                  Software Engineer @ Cyfuture India Pvt Ltd
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Specialized in RAG-based knowledge platforms, FastAPI microservices, and ERP system integration
                </p>
              </div>

              {/* Key Achievements */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-white">Key Achievements</h3>
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-blue-400 mt-1 flex-shrink-0">{achievement.icon}</div>
                    <p className="text-sm text-slate-300 leading-relaxed">{achievement.text}</p>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-2">
                <h3 className="text-base font-semibold text-white mb-3">Connect with me</h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="group relative p-2.5 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 hover:scale-110"
                    >
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative text-slate-300 group-hover:text-white transition-colors duration-300">
                        {social.icon}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Technical Expertise</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {techStack.map((stack, index) => (
                <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">{stack.category}</h4>
                  <div className="space-y-1">
                    {stack.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="text-xs text-slate-300">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights Section */}
          {/* <div className="mt-8 pt-6 border-t border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Key Highlights</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <div className="text-lg md:text-xl font-bold text-white mb-1">{highlight.number}</div>
                  <div className="text-xs text-slate-400">{highlight.label}</div>
                </div>
              ))}
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </section>
  )
}