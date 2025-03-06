"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "./ProgressBar"
import { TaskCard } from "./TaskCard"
import { CalendarStreak } from "./CalendarStreak"
import { ActivityCircles } from "./ActivityCircles"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { dailyQuests } from "../types/quests"
import { motion, AnimatePresence } from "framer-motion"

interface GamePlanDashboardProps {
  username?: string
}

const GamePlanDashboard: React.FC<GamePlanDashboardProps> = ({ username = "Lucas" }) => {
  const [progress, setProgress] = useState(30)
  const [activeTab, setActiveTab] = useState<"calendar" | "activity">("calendar")
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([])
  const [currentDay, setCurrentDay] = useState(26) // January 26, 2025
  const [currentIndex, setCurrentIndex] = useState(0)

  // Add some pre-completed quests for past days
  useEffect(() => {
    const preCompletedQuests = ["quest-15-1", "quest-15-2", "quest-20-1", "quest-20-3", "quest-22-2"]

    setCompletedQuestIds((prev) => {
      const savedQuests = localStorage.getItem("completedQuestIds")
      const existingQuests = savedQuests ? JSON.parse(savedQuests) : []
      const newState = [...new Set([...existingQuests, ...preCompletedQuests])]
      localStorage.setItem("completedQuestIds", JSON.stringify(newState))
      return newState
    })
  }, [])

  useEffect(() => {
    const preCompletedQuests = ["quest-20-1", "quest-20-2", "quest-22-1", "quest-23-3", "quest-24-2"]

    setCompletedQuestIds((prev) => {
      const savedQuests = localStorage.getItem("completedQuestIds")
      const existingQuests = savedQuests ? JSON.parse(savedQuests) : []
      const newState = [...new Set([...existingQuests, ...preCompletedQuests])]
      localStorage.setItem("completedQuestIds", JSON.stringify(newState))
      return newState
    })
  }, [])

  useEffect(() => {
    const savedQuests = localStorage.getItem("completedQuestIds")
    if (savedQuests) {
      setCompletedQuestIds(JSON.parse(savedQuests))
    }
  }, [])

  const handleQuestCompletion = (questId: string, completed: boolean) => {
    setCompletedQuestIds((prev) => {
      const newState = completed ? [...prev, questId] : prev.filter((id) => id !== questId)
      localStorage.setItem("completedQuestIds", JSON.stringify(newState))
      return newState
    })
  }

  const allTasksCompleted = dailyQuests.every((quest) => completedQuestIds.includes(quest.id))

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
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [challenges.length])

  return (
    <div className="w-full bg-white rounded-2xl border border-[#ddd] overflow-hidden p-2 sm:p-3" style={{height: "700px"}}>
      {/* Header Section and Overall Progress */}
      <Card className="mb-2">
        <CardContent className="p-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 mb-2">
            <div className="lg:col-span-1">
              <h2 className="text-[21px] font-bold text-[#5b06be]">Welcome back {username}!</h2>
            </div>
            <div className="lg:col-span-2 flex justify-start lg:justify-end">
            <div style={{width: "280px", display: "block"}} className="relative bg-gradient-to-r from-[#5b06be] to-[#4a05a8] p-1 rounded-xl shadow-[0_0_15px_rgba(91,6,190,0.4)] mt-2 sm:mt-0">
  <div className="bg-white bg-opacity-10 px-2 py-2 rounded-lg flex items-center justify-center">
    <h2 className="text-[21px] font-bold text-white whitespace-nowrap">
      Your 90 Day Game Plan
    </h2>
  </div>
</div>
            </div>
          </div>
          <ProgressBar progress={progress} />
          <div className="flex flex-col sm:flex-row justify-between items-baseline mt-2 text-xs text-gray-600 italic">
            <p className="mr-2">&quot;When you hit that halfway point and your mind&apos;s begging you to quit - that&apos;s when the real growth begins. Most people quit at 50%, be the one who pushes through.&quot;</p>
            <span className="font-semibold shrink-0 mt-1 sm:mt-0">- David Goggins</span>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2" style={{height: "580px"}}>
        {/* Left Column - Tasks and Mindset Coach */}
        <div className="flex flex-col gap-2" style={{height: "580px"}}>
  {/* Daily Tasks Container - FIXED HEIGHT */}
  <div className="relative bg-gradient-to-r from-[#fbb350]/5 to-[#fbb350]/5 p-0.5 rounded-xl border-2 border-[#fbb350]" style={{height: "300px"}}>
    <Card className="h-full bg-white rounded-xl">
      <CardContent className="p-2 h-full overflow-y-auto">
                <div className="mb-2 flex items-center gap-2">
                  <Image
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1737454406/Daily_quests_icon_duha_hh7svb.png"
                    alt="Daily Quests icon"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <h3 className="text-[21px] font-bold text-[#5b06be]">Daily Quests</h3>
                </div>
                <p className="text-[15px] font-semibold text-gray-600 mb-2">Complete all to complete today's challenge</p>
                <div className="h-[calc(100%-40px)] overflow-auto">
                  {dailyQuests.map((quest, index) => (
                    <TaskCard
                      key={quest.id}
                      index={index}
                      task={quest.title}
                      isCompleted={completedQuestIds.includes(quest.id)}
                      onCompletion={(index, completed) => handleQuestCompletion(quest.id, completed)}
                      isStartButton={index === 0}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mindset Coach Card */}
          <Card className="bg-white shadow-sm rounded-xl overflow-hidden border border-[#ddd]" style={{height: "260px", marginTop: "10px"}}>
          <CardContent className="p-2 h-full overflow-y-auto">
              <div className="flex justify-center items-center gap-2 sm:gap-3 mb-2">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                  <Image
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-welcoming-psychologis_jTEXFrX9RbWYuR_RT-j4cw_pJ49vj_zRoWtsmdXImwTyw_rp9p7y.png"
                    alt="Mindset Coach portrait 1"
                    width={80}
                    height={80}
                    className="rounded-xl object-cover border-2 border-[#fbb350]"
                  />
                </div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                  <Image
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-compassionate-psychol_FZgjDzHhSayBd1WXqfn0Yg_JQHL4O8cQJusiVDlrhz11A_xcwa5j.png"
                    alt="Mindset Coach portrait 2"
                    width={80}
                    height={80}
                    className="rounded-xl object-cover border-2 border-[#fbb350]"
                  />
                </div>
              </div>
              <h3 className="text-[19px] font-black mb-1 sm:mb-2">Are you struggling with...</h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-6 mb-1 sm:mb-2" // Fixed height to prevent layout shift
                >
                  <p className="text-[15px] font-semibold text-[#5b06be]">{challenges[currentIndex]}</p>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center mt-2 sm:mt-3">
                <Button
                  className="bg-black hover:bg-black/90 text-white font-medium rounded-full px-4 py-1 sm:px-6 sm:py-2 text-xs sm:text-sm transition-all duration-300 flex items-center gap-1 shadow-[0_0_10px_rgba(91,6,190,0.3)] hover:shadow-[0_0_20px_rgba(91,6,190,0.5)]"
                  onClick={() => (window.location.href = "/mindset-coach")}
                >
                  Find Solutions <span className="text-sm sm:text-base">→</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2" style={{height: "580px", position: "relative"}}>
  <div className="absolute inset-0">
    <Card className="h-full bg-white border border-[#ddd] rounded-xl">
      <CardContent className="p-2 h-full">
        {/* Progress Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-1">
          <Button
            variant="ghost"
            className={cn(
              "bg-white text-black rounded-full w-full text-[10px] xs:text-xs sm:text-sm py-1 sm:py-2 border border-[#ddd] flex items-center justify-center gap-1 sm:gap-2",
              activeTab === "calendar" && "bg-gray-90",
              activeTab !== "calendar" && "bg-white"
            )}
            onClick={() => setActiveTab("calendar")}
          >
            <Image
              src="https://res.cloudinary.com/drkudvyog/image/upload/v1733943686/Calendar_Streak_icon_duha_kwl5pf.png"
              alt="Calendar Streak icon"
              width={12}
              height={12}
              className="text-[#5b06be]"
            />
            <span>Calendar & Challenge</span>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "bg-white text-black rounded-full w-full text-[10px] xs:text-xs sm:text-sm py-1 sm:py-2 border border-[#ddd] flex items-center justify-center gap-1 sm:gap-2",
              activeTab === "activity" && "bg-gray-90",
              activeTab !== "activity" && "bg-white"
            )}
            onClick={() => setActiveTab("activity")}
          >
            <Image
              src="https://res.cloudinary.com/drkudvyog/image/upload/v1733749804/Target_icon_ghep9p.png"
              alt="Target icon"
              width={12}
              height={12}
              className="text-[#5b06be]"
            />
            <span>Activity</span>
          </Button>
        </div>

        {/* Fixed height container for tab content */}
        <div style={{height: "500px", position: "relative", marginTop: "10px"}}>
          {/* Calendar content */}
          <div style={{
            position: "absolute", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            opacity: activeTab === "calendar" ? 1 : 0,
            visibility: activeTab === "calendar" ? "visible" : "hidden",
            transition: "opacity 0.3s ease"
          }}>
            <CalendarStreak
              allDailyTasksCompleted={allTasksCompleted}
              completedQuestIds={completedQuestIds}
              onQuestCompletion={handleQuestCompletion}
              currentDayProp={currentDay}
            />
          </div>
          
          {/* Activity content */}
          <div style={{
            position: "absolute", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            opacity: activeTab === "activity" ? 1 : 0,
            visibility: activeTab === "activity" ? "visible" : "hidden",
            transition: "opacity 0.3s ease"
          }}>
            <ActivityCircles />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
</div>
    </div>
  )
}

export default GamePlanDashboard
