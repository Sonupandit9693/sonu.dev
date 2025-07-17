import { Users, Code, Award, Zap } from "lucide-react"

const stats = [
  {
    name: "Enterprise Users Served",
    value: "4,000+",
    icon: Users,
    description: "Government PSU clients",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "LeetCode Problems",
    value: "340+",
    icon: Code,
    description: "Data Structures & Algorithms",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Years Experience",
    value: "1.5+",
    icon: Award,
    description: "Enterprise development",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Core Technologies",
    value: "15+",
    icon: Zap,
    description: "AI, Backend, Frontend",
    color: "from-orange-500 to-red-500",
  },
]

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.name}
          className="group relative overflow-hidden rounded-2xl bg-slate-800/50 p-6 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
        >
          {/* Animated background */}
          <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          {/* Content */}
          <div className="relative">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-300 mb-1">{stat.name}</div>
            <div className="text-xs text-gray-400">{stat.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}