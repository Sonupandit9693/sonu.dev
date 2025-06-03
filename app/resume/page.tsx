"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Star,
  Award,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Navigation } from "../components/nav";
import { Card } from "../components/card"; // Adjust path as needed

export default function ResumeComponent() {
  const resumeStats = [
    {
      icon: <Briefcase className="w-5 h-5" />,
      label: "Years Experience",
      value: "2+",
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      label: "Education",
      value: "Bachelor's in Software Development",
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: "Certifications",
      value: "2+",
    },
    { icon: <Star className="w-5 h-5" />, label: "Projects", value: "20+" },
  ];

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "sonu_kumar.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resumePdfUrl = "/sonu_kumar.pdf";

  const handleOpenInNewTab = () => {
    window.open(resumePdfUrl, "_blank");
  };

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            My Resume
          </h2>
          <p className="mt-4 text-zinc-400">
            Download or preview my complete professional resume with detailed experience, skills, and achievements.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        {/* Resume Preview Card using animated Card */}
        <div className="relative group max-w-4xl mx-auto">
          <Card>
            <div className="relative p-8">
              {/* Resume Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-12 h-12 text-white" />
              </div>

              {/* Resume Info */}
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Professional Resume
              </h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto text-center">
                Comprehensive overview of my professional journey, technical
                skills, and key achievements in software development.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {resumeStats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-slate-700/50 rounded-xl"
                  >
                    <div className="text-blue-400 mb-2 flex justify-center">
                      {stat.icon}
                    </div>
                    <div className="text-lg font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleOpenInNewTab}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  <span>Preview Resume</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 border border-slate-600"
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="w-full h-10 flex items-center justify-center text-sm text-zinc-500 mt-10">
        <p className="text-center">
          © {new Date().getFullYear()} Sonu Kumar. All rights reserved.
        </p>
      </div>
    </div>
  );
}
