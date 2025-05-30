"use client"

import { useState } from "react"
import { Calendar, MapPin, Code2, Briefcase, Award, TrendingUp, Users, Zap, Building } from "lucide-react"
import { Navigation } from "../components/nav"

const experiences = [
  {
    id: 1,
    title: "Software Developement Engineer",
    company: "Cyfuture India Pvt Ltd",
    location: "Noida, India",
    duration: "Jul 2024 - Present",
    type: "Full-time",
    description:
      "Leading a team of 5 developers in building scalable web applications using React, Node.js, and AWS. Implemented microservices architecture that improved system performance by 40%.",
    achievements: [
      "Reduced application load time by 60% through optimization",
      "Led migration to cloud infrastructure saving $50k annually",
      "Mentored 3 junior developers and established coding standards",
    ],
    technologies: ["Java", "Spring", "Python Scripting", "Javascript", "TypeScript", "AWS", "Docker", "MySQL", "Kubernetes"],
    companyLogo: "",
    color: "from-blue-500 to-cyan-500",
    current: true,
  },
  {
    id: 2,
    title: "Software Developer",
    company: "Extension Technologies",
    location: "Delhi, India",
    duration: "Dec 2023 - June 2024",
    type: "Full-time",
    description:
      "Developed and maintained multiple client projects using modern web technologies. Built responsive web applications and RESTful APIs serving 10k+ daily active users.",
    achievements: [
      "Built 5 production applications from scratch",
      "Implemented real-time features using WebSocket",
      "Improved code coverage from 40% to 85%",
    ],
    technologies: ["Next.js", "Express.js", "MongoDB", "Redis", "Stripe API"],
    companyLogo: "",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Software Developer Intern",
    company: "Extension Technologies",
    location: "Delhi, India",
    duration: "Jul 2023 - Nov 2023",
    type: "Full-time",
    description:
      "Specialized in creating pixel-perfect, responsive user interfaces for various client projects. Collaborated with designers and backend developers to deliver high-quality web solutions.",
    achievements: [
      "Delivered 15+ client projects on time",
      "Increased client satisfaction score to 95%",
      "Reduced development time by 30% with reusable components",
    ],
    technologies: ["React", "Vue.js", "Sass", "Figma", "Git"],
    companyLogo: "",
    color: "from-green-500 to-emerald-500",
  }
]

export default function Experience() {
  const [activeExperience, setActiveExperience] = useState(0)

  return (
    <section className="min-h-screen py-20 px-4 bg-gradient-to-tl from-black via-zinc-600/20 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Navigation/>
        {/* Header */}
        <div className="max-w-2xl mx-auto lg:mx-0 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                Professional Experience
            </h2>
            <p className="mt-4 text-zinc-400">
                A journey through my career milestones and the impact I've made at each step.
            </p>
        </div>
        <div className="w-full h-px bg-zinc-800 mb-10" />

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: <Briefcase className="w-6 h-6" />, value: "2+", label: "Years Experience" },
            { icon: <Building className="w-6 h-6" />, value: "2", label: "Companies" },
            { icon: <Code2 className="w-6 h-6" />, value: "50+", label: "Projects" },
            { icon: <Users className="w-6 h-6" />, value: "10+", label: "Team Members" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-blue-400 mb-3 flex justify-center">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Experience Timeline */}
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
                  {exp.current && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                </div>

                {/* Experience Card */}
                <div
                  className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}
                >
                  <div className="group relative">
                    {/* Animated Border */}
                    <div
                      className={`absolute -inset-0.5 bg-gradient-to-r ${exp.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000`}
                    ></div>

                    {/* Card Content */}
                    <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                      {/* Company Logo & Current Badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-4xl">{exp.companyLogo}</div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                            <p className="text-blue-400 font-semibold">{exp.company}</p>
                          </div>
                        </div>
                        {exp.current && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Duration & Location */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">{exp.type}</span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 mb-6 leading-relaxed">{exp.description}</p>

                      {/* Achievements */}
                      <div className="mb-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center">
                          <Award className="w-4 h-4 mr-2 text-yellow-400" />
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start space-x-2 text-gray-300 text-sm">
                              <TrendingUp className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-purple-400" />
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-xs border border-white/20 hover:bg-white/20 transition-colors duration-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to work together?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new opportunities and exciting projects. Let's create something amazing
            together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg">
              Download Resume
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              View Projects
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  )
}
