'use client'

import React, { useState, useEffect } from 'react'
import { CalendarStreak } from '@/components/ui/CalendarStreak'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { TaskCard } from '@/components/ui/TaskCard'
import Image from 'next/image'
import { QuestList } from "@/components/ui/QuestList"
import { ActivityCircles } from "@/components/ui/ActivityCircles"

export default function DashboardPage() {
  const [completedQuests, setCompletedQuests] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'calendar' | 'activity'>('calendar')
  const [messageOpacity, setMessageOpacity] = useState(1)
  
  const messages = [
    "Unstoppable! 🚀",
    "You're Crushing It! 🔥",
    "Stay Focused! 🎯",
    "Making Progress! 📈",
    "Getting Stronger! 💫",
    "Almost There! 🌟",
    "Keep The Streak! ⚡",
    "Level Up! ⬆️",
    "Leading The Way! 🏆"
  ]

  const challenges = [
    "managing daily stress?",
    "building self-confidence?",
    "setting clear goals?",
    "finding work-life balance?",
    "managing your time effectively?",
    "improving communication?",
    "dealing with performance anxiety?",
    "handling rejection?",
    "making important decisions?",
  ]

  useEffect(() => {
    let currentIndex = 0
    
    const updateMessage = () => {
      setMessageOpacity(0) // Fade out
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length)
        setMessageOpacity(1) // Fade in
      }, 500)
    }
  
    const interval = setInterval(updateMessage, 4000)
    return () => clearInterval(interval)
  }, [messages.length])

  const handleQuestCompletion = (questId: string, completed: boolean) => {
    if (completed) {
      setCompletedQuests(prev => [...prev, questId])
    } else {
      setCompletedQuests(prev => prev.filter(id => id !== questId))
    }
  }

  return (
    <div className="min-h-screen bg-white p-2 sm:p-4">
      {/* Header Section */}
      <div className="bg-white rounded-xl sm:rounded-3xl p-2 sm:p-4 mb-3 border border-[#ddd]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
          <h1 className="text-[#5b06be] text-[21px] font-bold flex items-center gap-2">
            <span>Welcome back Lucas! </span>
            <span
              style={{ 
                opacity: messageOpacity,
                transition: 'opacity 0.5s ease-in-out',
              }}
            >
              {messages[currentIndex]}
            </span>
          </h1>
          <div className="lg:col-span-2 flex justify-end">
  <button className="bg-[#5b06be] text-[21px] font-bold text-white rounded-xl px-6 py-2 shadow-[0_0_15px_rgba(91,6,190,0.4)]" style={{width: "280px"}}>
    Your 90 Day Game Plan
  </button>
</div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[15px] font-semibold text-gray-700">Overall Progress</span>
            <span className="text-[15px] font-semibold text-gray-700">30%</span>
          </div>
          <ProgressBar progress={30} />
        </div>

        <div>
          <p className="text-xs sm:text-sm text-gray-600 italic">
            "When you hit that halfway point and your mind's begging you to quit - that's when the real growth begins. Most people quit at 50%, be the one who pushes through." <span className="text-gray-600">- David Goggins</span>
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2" style={{height: "calc(100vh - 220px)"}}>
        {/* Left Column */}
        <div className="col-span-1 space-y-3 h-full flex flex-col">
          <QuestList />
          
          {/* Mindset Coach Card */}
          <div className="bg-white rounded-xl sm:rounded-3xl p-2 sm:p-4 border border-[#ddd]">
            <div className="flex justify-center space-x-3 mb-3">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 transform transition-transform hover:scale-105">
                <Image
                  src="https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-welcoming-psychologis_jTEXFrX9RbWYuR_RT-j4cw_pJ49vj_zRoWtsmdXImwTyw_rp9p7y.png"
                  alt="Mindset Coach portrait 1"
                  width={80}
                  height={80}
                  className="rounded-xl object-cover border-2 border-[#fbb350]"
                />
              </div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 transform transition-transform hover:scale-105">
                <Image
                  src="https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-compassionate-psychol_FZgjDzHhSayBd1WXqfn0Yg_JQHL4O8cQJusiVDlrhz11A_xcwa5j.png"
                  alt="Mindset Coach portrait 2"
                  width={80}
                  height={80}
                  className="rounded-xl object-cover border-2 border-[#fbb350]"
                />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-[19px] font-black mb-1">Are you struggling with...</h3>
              <p className="text-[#5b06be] text-[15px] font-semibold mb-3 h-6">{challenges[currentIndex]}</p>
              <button className="bg-black hover:bg-black/90 text-white px-4 py-2 rounded-full text-sm
                         transition-all duration-300 flex items-center justify-center gap-1 mx-auto
                         shadow-[0_4px_15px_rgba(251,179,80,0.2)] hover:shadow-[0_4px_20px_rgba(91,6,190,0.3)]
                         font-medium">
                Find Solutions 
                <span className="text-lg ml-1">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Calendar & Activity */}
        <div className="col-span-2 bg-white rounded-xl sm:rounded-2xl border border-[#ddd] h-full flex flex-col">
          {/* Header with tabs */}
          <div className="bg-white rounded-t-xl sm:rounded-t-2xl p-2 sm:p-3">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div 
                className={`w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg cursor-pointer transition-all border border-[#ddd] ${
                  activeTab === 'calendar' ? 'bg-gray-100' : 'bg-gray-50'
                }`}
                onClick={() => setActiveTab('calendar')}
              >
                <div className="bg-purple-100/50 p-1 rounded-lg">
                  <Image
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1733943686/Calendar_Streak_icon_duha_kwl5pf.png"
                    alt="Calendar icon"
                    width={12}
                    height={12}
                  />
                </div>
                <span className="font-semibold text-center text-xs sm:text-sm">Calendar & Challenge</span>
              </div>

              <div 
                className={`w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg cursor-pointer transition-all border border-[#ddd] ${
                  activeTab === 'activity' ? 'bg-gray-100' : 'bg-gray-50'
                }`} 
                onClick={() => setActiveTab('activity')}
              >
                <div className="bg-purple-100/50 p-1 rounded-lg">
                  <Image
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1733749804/Target_icon_ghep9p.png"
                    alt="Activity icon"
                    width={12}
                    height={12}
                  />
                </div>
                <span className="font-semibold text-center text-xs sm:text-sm">Time & Insights</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
              <div className="bg-[#4ade80] rounded-xl py-1 sm:py-2 px-3 sm:px-4 text-white text-center flex flex-col justify-center min-h-[40px] sm:min-h-[60px]">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-white/80 text-[10px] xs:text-xs">Completed Challenge</div>
                    <div className="text-sm sm:text-lg font-bold leading-tight">0/90</div>
                  </div>
                  <div className="border-l border-white/20">
                    <div className="text-white/80 text-[10px] xs:text-xs">Consistency</div>
                    <div className="text-sm sm:text-lg font-bold leading-tight">50%</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#fbb350] rounded-xl py-1 sm:py-2 px-3 sm:px-4 text-white text-center flex flex-col justify-center min-h-[40px] sm:min-h-[60px]">
                <div className="text-white/80 text-[10px] xs:text-xs mb-0.5">Upcoming Event</div>
                <div className="text-sm sm:text-base leading-tight">Mindset Coach Session</div>
                <div className="text-[10px] xs:text-xs font-bold mt-0.5">Tomorrow, 2PM</div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 flex p-2"> 
            {activeTab === 'calendar' ? (
              <CalendarStreak 
                allDailyTasksCompleted={false}
                completedQuestIds={completedQuests}
                onQuestCompletion={handleQuestCompletion}
              />
            ) : (
              <ActivityCircles />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
