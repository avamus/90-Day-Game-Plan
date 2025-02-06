'use client'

import React, { useState, useEffect } from 'react'
import { CalendarStreak } from '@/components/ui/CalendarStreak'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { TaskCard } from '@/components/ui/TaskCard'
import Image from 'next/image'
import { DailyQuests } from "@/components/ui/daily-quests"
import { ActivityCircles } from "@/components/ui/ActivityCircles"

export default function DashboardPage() {
  const [completedQuests, setCompletedQuests] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'calendar' | 'activity'>('calendar')

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
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % challenges.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [challenges.length])

  const handleQuestCompletion = (questId: string, completed: boolean) => {
    if (completed) {
      setCompletedQuests(prev => [...prev, questId])
    } else {
      setCompletedQuests(prev => prev.filter(id => id !== questId))
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-8">
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[#5b06be] text-2xl font-bold">Welcome back Lucas!</h1>
          <h2 className="text-[#5b06be] text-xl">Your 90 Day Game Plan to hit $10,000 per month.</h2>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Overall Progress</span>
            <span className="text-gray-700 font-medium">30%</span>
          </div>
          <ProgressBar progress={30} />
        </div>
        <p className="text-gray-600 italic">
          "When you hit that halfway point and your mind's begging you to quit - that's when the real growth begins. 
          Most people quit at 50%, be the one who pushes through."
        </p>
        <p className="text-right text-gray-600">- David Goggins</p>
      </div>
  
      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-8">
{/* Left Column */}
<div className="col-span-1 space-y-8 h-full flex flex-col">
          <DailyQuests />
          
{/* Mindset Coach Card */}
<div className="bg-white rounded-3xl p-8 shadow-sm flex-1">
            <div className="flex justify-center -space-x-6 mb-8">
              <div className="relative w-28 h-28 rounded-full border-[3px] border-[#fbb350] z-10 transform transition-transform hover:scale-105">
                <Image
                  src="https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-welcoming-psychologis_jTEXFrX9RbWYuR_RT-j4cw_pJ49vj_zRoWtsmdXImwTyw_rp9p7y.png"
                  alt="Mindset Coach portrait 1"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="relative w-28 h-28 rounded-full border-[3px] border-[#fbb350] transform transition-transform hover:scale-105">
                <Image
                  src="https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-compassionate-psychol_FZgjDzHhSayBd1WXqfn0Yg_JQHL4O8cQJusiVDlrhz11A_xcwa5j.png"
                  alt="Mindset Coach portrait 2"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-3">Are you struggling with...</h3>
              <p className="text-[#5b06be] text-xl mb-8 h-8">{challenges[currentIndex]}</p>
              <button className="bg-black hover:bg-black/90 text-white px-8 py-3 rounded-full text-lg 
                               transition-all duration-300 flex items-center justify-center gap-2 mx-auto
                               shadow-[0_4px_20px_rgba(251,179,80,0.3)] hover:shadow-[0_4px_25px_rgba(91,6,190,0.4)]
                               font-medium">
                Find Solutions 
                <span className="text-2xl ml-1">→</span>
              </button>
            </div>
          </div>
        </div>
  
{/* Right Column - Calendar & Activity */}
<div className="col-span-2 bg-white rounded-[32px] shadow-sm h-full flex flex-col">
          {/* Header with tabs */}
          <div className="bg-white rounded-t-[32px] p-6">
            <div className="flex w-full">
              <div 
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full cursor-pointer transition-all ${
                  activeTab === 'calendar' ? 'bg-gray-50 shadow-sm' : ''
                }`} 
                onClick={() => setActiveTab('calendar')}
              >
                <div className="bg-purple-100/50 p-2 rounded-xl">
                  <Image
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1733943686/Calendar_Streak_icon_duha_kwl5pf.png"
                    alt="Calendar icon"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="font-semibold">Calendar & Challenge</span>
              </div>
  
              <div 
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full cursor-pointer transition-all ${
                  activeTab === 'activity' ? 'bg-gray-50 shadow-sm' : ''
                }`} 
                onClick={() => setActiveTab('activity')}
              >
                <div className="bg-purple-100/50 p-2 rounded-xl">
                  <Image
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1733749804/Target_icon_ghep9p.png"
                    alt="Activity icon"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="font-semibold">Activity</span>
              </div>
            </div>
          </div>
  
{/* Stats Cards */}
<div className="grid grid-cols-3 gap-6 p-8">
            <div className="bg-[#5b06be] rounded-2xl p-6 text-white text-center flex flex-col items-center">
              <div className="text-white/80 text-sm">Challenge</div>
              <div className="text-3xl font-bold">0/90</div>
            </div>
            <div className="bg-[#fbb350] rounded-2xl p-6 text-white text-center flex flex-col items-center">
              <div className="text-white/80 text-sm">Consistency</div>
              <div className="text-3xl font-bold">20%</div>
            </div>
            <div className="bg-[#4ade80] rounded-2xl p-6 text-white text-center flex flex-col items-center">
              <div className="text-white/80 text-sm">Upcoming Event</div>
              <div className="text-xl font-bold">Team Meeting</div>
              <div className="text-white/80 text-sm">Tomorrow, 2PM</div>
            </div>
          </div>
  
{/* Content */}
<div className="flex-1 flex p-4">
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
