"use client"

import { motion } from "framer-motion"
import { RotateCcw } from "lucide-react"

interface ActivityData {
  label: string
  value: number
  progress: number
  unit: string
}

export function ActivityCircles() {
  const activities: ActivityData[] = [
    { label: "TODAY", value: 0, progress: 0, unit: "minutes" },
    { label: "THIS WEEK", value: 1, progress: 15, unit: "minutes" },
    { label: "THIS MONTH", value: 6, progress: 20, unit: "minutes" },
    { label: "THIS YEAR", value: 6, progress: 10, unit: "minutes" },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-[21px] font-bold text-[#5b06be]">Training Time Tracker</h2>
      </div>
      <div className="bg-white rounded-xl p-2 sm:p-3 flex-grow flex flex-col">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              className="relative group perspective"
              initial={{ opacity: 0, rotateY: -15, translateZ: -100 }}
              animate={{ opacity: 1, rotateY: 0, translateZ: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, type: "spring" }}
            >
              <div className="relative w-full aspect-square bg-white rounded-xl border border-[#ddd] flex flex-col items-center justify-center p-1 sm:p-2 transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-3">
                <div className="relative w-full aspect-square max-w-[100px] sm:max-w-[120px]">
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
                    <span className="text-xl sm:text-2xl font-bold text-[#5b06be]">{activity.value}</span>
                    <span className="text-xs sm:text-sm text-gray-600 mt-0.5">{activity.unit}</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wider mt-2">
                  {activity.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {/* Quote of the Day */}
          <div className="border border-[#ddd] rounded-xl p-2 sm:p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[19px] font-black text-[#5b06be]">Quote of the Day</h4>
              <button className="text-gray-400 hover:text-gray-600">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-white rounded-xl border border-[#ddd] p-2 sm:p-3 flex flex-col justify-between h-[calc(100%-2.5rem)]">
              <p className="text-center text-[15px] font-semibold">
                "Don't wish it were easier, wish you were better."
              </p>
              <p className="text-right text-gray-600 mt-3 text-sm">Jim Rohn</p>
            </div>
          </div>

          {/* Daily Insight */}
          <div className="border border-[#ddd] rounded-xl p-2 sm:p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[19px] font-black text-[#5b06be]">Daily Insight</h4>
              <button className="text-gray-400 hover:text-gray-600">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-white rounded-xl border border-[#ddd] p-2 sm:p-3 flex items-center h-[calc(100%-2.5rem)]">
              <p className="text-[15px] font-semibold">
                Worth remembering: sharing tenant screening through situation examples rather than rules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
