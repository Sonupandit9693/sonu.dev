import Image from "next/image"
import { Linkedin, Twitter, Youtube, Instagram, Send, MessageCircle, Mail, icons, Github } from "lucide-react"

export default function About() {
  const socialLinks = [
    { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/in/sonukumarpandit/", label: "LinkedIn" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://x.com/SonuKum29372459", label: "Twitter" },
    { icon: <Mail className="w-5 h-5" />, href: "mailto:sonukumarcode@gmail.com", label: "Email" },
    { icon: <Github className="w-5 h-5" />, href: "https://github.com/Sonupandit9693", label: "GitHub" },
  ]

  const achievements = [
    "Previously worked at (Extension Technologies).",
    "Experience in developing scalable solutions for CRM, Finance, Banking, and Payment service platforms.",
    "Bachelor in (Computer Science) from Maharishi Dayanand University, Rohtak.",
  ]

  return (
    <section className="min-h-screen bg-gradient-to-tl from-black via-zinc-600/20 to-black w-full overflow-hidden py-12 px-4 flex items-center justify-center">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About Me</h1>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image Section */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative group">
                {/* Animated border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

                {/* Image container */}
                <div className="relative bg-slate-800 rounded-xl p-2">
                  <Image
                    src="/profile.jpeg"
                    alt="Sonu Kumar - Software Developer Engineer"
                    width={300}
                    height={380}
                    className="rounded-lg object-cover w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="text-white space-y-5">
              {/* Name and Title */}
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Sonu Kumar
                </h2>
                <p className="text-base text-slate-300 font-medium leading-snug">Software Development Engineer @ Cyfuture India Pvt Ltd</p>
              </div>

              {/* Achievements */}
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-300 leading-relaxed">{achievement}</p>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-4">
                <h3 className="text-base font-semibold text-white mb-3">Connect with me</h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
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
        </div>
      </div>
    </section>
  )
}

{/* Additional Stats Section */}
    {/* <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
        { number: "100k+", label: "Followers", icon: "👥" },
        { number: "5+", label: "Years Experience", icon: "💼" },
        { number: "50+", label: "Projects", icon: "🚀" },
        { number: "10+", label: "Companies", icon: "🏢" },
        ].map((stat, index) => (
        <div
            key={index}
            className="text-center p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 hover:bg-slate-700/30 transition-all duration-300 hover:scale-105"
        >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
        </div>
        ))}
    </div> */}