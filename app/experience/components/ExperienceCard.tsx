"use client";
import { Calendar, MapPin, Award, TrendingUp, Zap } from "lucide-react";
import { Experience } from "../data/experiences";

interface ExperienceCardProps {
  exp: Experience;
  index: number;
}

export default function ExperienceCard({ exp, index }: ExperienceCardProps) {
  return (
    <div
      className={`ml-20 md:ml-0 md:w-5/12 ${
        index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
      }`}
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
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
              {exp.type}
            </span>
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
                <li
                  key={i}
                  className="flex items-start space-x-2 text-gray-300 text-sm"
                >
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
  );
}