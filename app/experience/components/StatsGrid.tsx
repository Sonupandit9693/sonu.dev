import { Briefcase, Users, TrendingUp, Code, Award, Zap } from "lucide-react"
import { Card } from "@/app/components/card"

const stats = [
  {
    icon: <Briefcase className="w-5 h-5" />,
    label: "Years Experience",
    value: "2+",
    description: "Production-grade systems",
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: "Users Served",
    value: "15,000+",
    description: "Enterprise applications",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    label: "System Uptime",
    value: "99.9%",
    description: "High availability",
  },
  {
    icon: <Code className="w-5 h-5" />,
    label: "Projects Delivered",
    value: "15+",
    description: "Enterprise solutions",
  },
  {
    icon: <Award className="w-5 h-5" />,
    label: "Performance Boost",
    value: "80%",
    description: "Search relevance improvement",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "Process Automation",
    value: "70%",
    description: "Manual work reduction",
  },
]

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <div className="p-6 text-center">
            <div className="text-blue-400 mb-3 flex justify-center">{stat.icon}</div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-300 font-medium mb-1">{stat.label}</div>
            <div className="text-xs text-gray-500">{stat.description}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
