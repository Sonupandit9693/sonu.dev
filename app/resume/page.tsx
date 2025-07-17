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
  Users,
  Zap,
  TrendingUp,
  Code,
  Building,
  Bot,
  Database,
  Cloud,
  Target,
} from "lucide-react";
import { Navigation } from "../components/nav";
import { Card } from "../components/card"; // Adjust path as needed

export default function ResumeComponent() {
  const resumeStats = [
    {
      icon: <Briefcase className="w-5 h-5" />,
      label: "Years Experience",
      value: "2+",
      description: "Production-grade systems"
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Users Served",
      value: "4000+",
      description: "Enterprise applications"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "System Uptime",
      value: "99.9%",
      description: "High availability"
    },
    {
      icon: <Code className="w-5 h-5" />,
      label: "LeetCode Solved",
      value: "340+",
      description: "Algorithm problems"
    },
  ];

  const keyHighlights = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI-Integrated Systems",
      description: "Led development of RAG-based enterprise knowledge platform with 80-90% improved relevance using LangChain, LLMS Models, and Vector Database",
      tech: ["LLM Models", "LangChain", "Vector Database", "FastAPI"]
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Enterprise ERP Solutions",
      description: "Delivered comprehensive ERP modules for PSU clients serving 5000+ users with 40% reduction in processing time",
      tech: ["Python", "Frappe", "MariaDB", "GST Compliance"]
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Scalable Backend Systems",
      description: "Engineered Flask REST APIs handling 10,000+ concurrent users with multithreading and rate-limiting",
      tech: ["Flask", "FastAPI", "PostgreSQL", "Redis"]
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud-Native Architecture",
      description: "Designed distributed microservices with Docker, Kubernetes, and AWS for enterprise automation",
      tech: ["Docker", "Kubernetes", "AWS", "Terraform"]
    }
  ];

  const currentProjects = [
    {
      name: "GenAI Meeting Assistant",
      status: "In Development",
      description: "AI-powered meeting platform with transcription, summarization, and automated task generation",
      tech: ["Next.js 15", "FastAPI", "Whisper API", "GPT-4"]
    },
    {
      name: "Enterprise RAG Search Platform",
      status: "Deployed",
      description: "Internal semantic search engine enabling contextual answers from enterprise knowledge bases",
      tech: ["LangChain", "LLM Models", "Vector Database", "Superset"]
    }
  ];

  const achievements = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Ministry Approval",
      description: "ERP system approved by Ministry of Jal Shakti, validated through central-level audits"
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "GeeksforGeeks Rank 2",
      description: "Achieved top ranking demonstrating exceptional problem-solving skills"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Process Automation",
      description: "Reduced manual data entry by 70% through intelligent automation systems"
    }
  ];

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "sonu_kumar_resume.pdf";
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
            Professional Resume
          </h2>
          <p className="mt-4 text-zinc-400">
            Senior Software Engineer specializing in AI-integrated enterprise systems, with proven expertise in scalable backend development and cloud-native solutions.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resumeStats.map((stat, index) => (
            <Card key={index}>
              <div className="p-6 text-center">
                <div className="text-blue-400 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300 font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Key Highlights */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Key Expertise & Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyHighlights.map((highlight, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-blue-400 mt-1">
                      {highlight.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {highlight.title}
                      </h4>
                      <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                        {highlight.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {highlight.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Projects */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Current Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentProjects.map((project, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white">
                      {project.name}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'In Development' 
                        ? 'bg-yellow-500/20 text-yellow-300' 
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Notable Achievements */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Notable Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index}>
                <div className="p-6 text-center">
                  <div className="text-green-400 mb-3 flex justify-center">
                    {achievement.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {achievement.title}
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {achievement.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Resume Download Section */}
        <div className="relative group max-w-4xl mx-auto">
          <Card>
            <div className="relative p-8">
              {/* Resume Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-12 h-12 text-white" />
              </div>

              {/* Resume Info */}
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Complete Resume Document
              </h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto text-center">
                Download the complete PDF resume with detailed work experience, technical skills, project descriptions, and professional accomplishments.
              </p>

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