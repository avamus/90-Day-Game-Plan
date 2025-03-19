"use client"

import { motion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { quotes } from "@/lib/quotes"
import { getRandomFocusMessage } from "@/lib/focusMessages"

interface ActivityData {
  label: string
  value: number
  progress: number
  unit: string
}

interface Quote {
  text: string
  author: string
}

export function ActivityCircles() {
  const [activities, setActivities] = useState<ActivityData[]>([
    { label: "PAST 24 HOURS", value: 0, progress: 0, unit: "minutes" },
    { label: "PAST 7 DAYS", value: 0, progress: 0, unit: "minutes" },
    { label: "PAST 30 DAYS", value: 0, progress: 0, unit: "minutes" },
    { label: "PAST 365 DAYS", value: 0, progress: 0, unit: "minutes" },
  ])
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dailyQuote, setDailyQuote] = useState<Quote>({ text: "", author: "" })
  const [dailyInsight, setDailyInsight] = useState<string>("")

  // Function to fetch activity data
  const fetchActivityData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get memberId from URL query parameters
      const urlParams = new URLSearchParams(window.location.search)
      const memberId = urlParams.get('memberId')
      
      if (!memberId) {
        setError("Member ID is required")
        setIsLoading(false)
        return
      }
      
      const response = await fetch(`/api/newactivitycircles?memberId=${memberId}`)
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Calculate progress percentages (assuming 100% would be 120 minutes for day, 
      // 840 for week, 3600 for month, 43800 for year)
      const maxValues = [120, 840, 3600, 43800]
      
      // Update activities with fetched data
      setActivities([
        { 
          label: "PAST 24 HOURS", 
          value: data.day24h,
          progress: Math.min(100, (data.day24h / maxValues[0]) * 100), 
          unit: "minutes" 
        },
        { 
          label: "PAST 7 DAYS", 
          value: data.days7, 
          progress: Math.min(100, (data.days7 / maxValues[1]) * 100), 
          unit: "minutes" 
        },
        { 
          label: "PAST 30 DAYS", 
          value: data.days30, 
          progress: Math.min(100, (data.days30 / maxValues[2]) * 100), 
          unit: "minutes" 
        },
        { 
          label: "PAST 365 DAYS", 
          value: data.days365, 
          progress: Math.min(100, (data.days365 / maxValues[3]) * 100), 
          unit: "minutes" 
        },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch activity data")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    return quotes[randomIndex]
  }

  // Function to refresh quote
  const refreshQuote = () => {
    setDailyQuote(getRandomQuote())
    // Store in localStorage with timestamp
    const quoteData = {
      quote: dailyQuote,
      timestamp: new Date().getTime()
    }
    localStorage.setItem('dailyQuote', JSON.stringify(quoteData))
  }

  // Function to refresh insight
  const refreshInsight = () => {
    setDailyInsight(getRandomFocusMessage())
    // Store in localStorage with timestamp
    const insightData = {
      insight: dailyInsight,
      timestamp: new Date().getTime()
    }
    localStorage.setItem('dailyInsight', JSON.stringify(insightData))
  }

  // Fetch data on component mount and set up daily content
  useEffect(() => {
    fetchActivityData()
    
    // Initialize or get stored quote and insight
    const initializeDailyContent = () => {
      // Check if we need to refresh the content (new day or first load)
      const shouldRefreshContent = () => {
        const currentDate = new Date()
        // Set to 12:01 AM
        const refreshTime = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          0,
          1,
          0
        )
        
        return currentDate.getTime() >= refreshTime.getTime()
      }
      
      // Handle quote
      const storedQuoteData = localStorage.getItem('dailyQuote')
      if (storedQuoteData) {
        const { quote, timestamp } = JSON.parse(storedQuoteData)
        const lastQuoteDate = new Date(timestamp)
        const currentDate = new Date()
        
        // If it's a new day after 12:01 AM, refresh the quote
        if (
          currentDate.getDate() !== lastQuoteDate.getDate() ||
          currentDate.getMonth() !== lastQuoteDate.getMonth() ||
          currentDate.getFullYear() !== lastQuoteDate.getFullYear() ||
          shouldRefreshContent()
        ) {
          refreshQuote()
        } else {
          setDailyQuote(quote)
        }
      } else {
        refreshQuote()
      }
      
      // Handle insight
      const storedInsightData = localStorage.getItem('dailyInsight')
      if (storedInsightData) {
        const { insight, timestamp } = JSON.parse(storedInsightData)
        const lastInsightDate = new Date(timestamp)
        const currentDate = new Date()
        
        // If it's a new day after 12:01 AM, refresh the insight
        if (
          currentDate.getDate() !== lastInsightDate.getDate() ||
          currentDate.getMonth() !== lastInsightDate.getMonth() ||
          currentDate.getFullYear() !== lastInsightDate.getFullYear() ||
          shouldRefreshContent()
        ) {
          refreshInsight()
        } else {
          setDailyInsight(insight)
        }
      } else {
        refreshInsight()
      }
    }
    
    initializeDailyContent()
    
    // Set up interval to check time for auto-refresh at 12:01 AM
    const intervalId = setInterval(() => {
      const now = new Date()
      if (now.getHours() === 0 && now.getMinutes() === 1) {
        refreshQuote()
        refreshInsight()
      }
    }, 60000) // Check every minute
    
    return () => clearInterval(intervalId)
  }, [])
  
  // Function to log new activity
  const logActivity = async (minutes: number) => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const memberId = urlParams.get('memberId')
      const teamId = urlParams.get('teamId')
      
      if (!memberId) {
        setError("Member ID is required")
        return
      }
      
      const response = await fetch('/api/newactivitycircles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId,
          teamId: teamId || null,
          minutes
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      // Refresh data after logging
      fetchActivityData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log activity")
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-[21px] font-bold text-[#5b06be]">Training Time Tracker</h2>
      </div>
      <div className="bg-white rounded-xl p-2 sm:p-3 flex-grow flex flex-col">
        {error && (
          <div className="bg-red-50 text-red-700 p-2 mb-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
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
                    {isLoading ? (
                      <div className="h-5 w-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <span className="text-xl sm:text-2xl font-bold text-[#5b06be]">{activity.value}</span>
                        <span className="text-xs sm:text-sm text-gray-600 mt-0.5">{activity.unit}</span>
                      </>
                    )}
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
              <button 
                className="text-gray-400 hover:text-gray-600" 
                onClick={refreshQuote}
                aria-label="Refresh quote"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-white rounded-xl border border-[#ddd] p-2 sm:p-3 flex flex-col justify-between h-[calc(100%-2.5rem)]">
              <p className="text-center text-[15px] font-semibold">
                "{dailyQuote.text}"
              </p>
              <p className="text-right text-gray-600 mt-3 text-sm">{dailyQuote.author}</p>
            </div>
          </div>

          {/* Daily Insight */}
          <div className="border border-[#ddd] rounded-xl p-2 sm:p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[19px] font-black text-[#5b06be]">Daily Insight</h4>
              <button 
                className="text-gray-400 hover:text-gray-600" 
                onClick={refreshInsight}
                aria-label="Refresh insight"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-white rounded-xl border border-[#ddd] p-2 sm:p-3 flex items-center h-[calc(100%-2.5rem)]">
              <p className="text-[15px] font-semibold">
                {dailyInsight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
