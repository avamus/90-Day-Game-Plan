"use client"
import { motion } from "framer-motion"
import { RotateCcw } from "lucide-react"

interface ActivityData {
  label: string
  value: number
  progress: number
}

export function ActivityCircles() {
  const activities: ActivityData[] = [
    { label: "TODAY", value: 0, progress: 0 },
    { label: "THIS WEEK", value: 1, progress: 15 },
    { label: "THIS MONTH", value: 6, progress: 20 },
    { label: "THIS YEAR", value: 6, progress: 10 },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold text-[#5b06be]">Training Time Tracker</h2>
      </div>
      <div className="bg-white rounded-xl p-4 flex-grow mb-2">
      <div className="grid grid-cols-4 gap-6 mb-8">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              className="relative group perspective"
              initial={{ opacity: 0, rotateY: -15, translateZ: -100 }}
              animate={{ opacity: 1, rotateY: 0, translateZ: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, type: "spring" }}
            >
              <div className="relative w-full aspect-square bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-2 sm:p-4 transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-3">
                <div className="relative w-full aspect-square max-w-[150px]">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${activity.progress * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        from="0 283"
                        to={`${activity.progress * 2.83} 283`}
                        dur="1.5s"
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.4 0 0.2 1"
                      />
                    </circle>
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#5b06be" />
                        <stop offset="100%" stopColor="#4a05a8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-[#5b06be]">{activity.value}</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wider mt-4">
                  {activity.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

   {/* Bottom Cards */}
   <div className="grid grid-cols-2 gap-6 mt-8">
  {/* Quote of the Day */}
  <div>
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-[#5b06be] text-xl font-bold">Quote of the Day</h4>
      <button className="text-gray-400 hover:text-gray-600">
        <RotateCcw className="h-5 w-5" />
      </button>
    </div>
    <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col justify-between">
      <p className="text-center text-lg font-medium">
        "Don't wish it were easier, wish you were better."
      </p>
      <p className="text-right text-gray-600 mt-4">Jim Rohn</p>
    </div>
  </div>

  {/* Daily Insight */}
  <div>
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-[#5b06be] text-xl font-bold">Daily Insight</h4>
      <button className="text-gray-400 hover:text-gray-600">
        <RotateCcw className="h-5 w-5" />
      </button>
    </div>
    <div className="bg-white rounded-xl shadow-sm p-6 h-full flex items-center">
      <p className="text-lg">
        Worth remembering: sharing tenant screening through situation examples rather than rules.
      </p>
    </div>
  </div>
</div>
    </div>
  )
}
