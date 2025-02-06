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

  const solutions = [
    "Stress Management",
    "Confidence Building",
    "Goal Setting",
    "Work-Life Balance",
    "Time Management",
    "Communication Skills",
    "Performance Anxiety",
    "Rejection Management",
    "Decision Making Skills",
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % challenges.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-lg border border-gray-200">
      {/* Header Section and Overall Progress */}
      <Card className="mb-6 border border-gray-200">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4">
            <div className="lg:col-span-1">
              <h2 className="text-lg sm:text-xl font-semibold text-[#5b06be]">Welcome back {username}!</h2>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-lg sm:text-xl font-semibold text-[#5b06be] text-right">
                Your 90 Day Game Plan to hit $10,000 per month.
              </h2>
            </div>
          </div>
          <ProgressBar value={progress} label="Overall Progress" />
          <div className="mt-4 text-sm text-gray-600 italic">
            <p>
              &quot;When you hit that halfway point and your mind&apos;s begging you to quit - that&apos;s when the real
              growth begins. Most people quit at 50%, be the one who pushes through.&quot;
            </p>
            <p className="text-right font-semibold mt-1">- David Goggins</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Tasks and Mindset Coach */}
        <div className="space-y-4">
          {/* Daily Tasks Container */}
          <Card className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <Image
                  src="https://res.cloudinary.com/drkudvyog/image/upload/v1737454406/Daily_quests_icon_duha_hh7svb.png"
                  alt="Daily Quests icon"
                  width={24}
                  height={24}
                />
                <h3 className="text-lg font-semibold text-[#5b06be]">Daily Quests</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Complete all to complete today's challenge</p>
              <div className="space-y-2">
                {dailyQuests.map((quest, index) => (
                  <TaskCard
                    key={quest.id}
                    index={index}
                    task={quest.title}
                    isCompleted={completedQuestIds.includes(quest.id)}
                    onCompletion={(index, completed) => handleQuestCompletion(quest.id, completed)}
                    isStartButton={index === 0} // Make the first task a "Start" button
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mindset Coach Card */}
          <Card className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="flex justify-center items-center gap-4 mb-4 sm:mb-5">
                <div className="rounded-full p-1 bg-yellow-400">
                  <Image
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-welcoming-psychologis_jTEXFrX9RbWYuR_RT-j4cw_pJ49vj_zRoWtsmdXImwTyw_rp9p7y.png"
                    alt="Mindset Coach portrait 1"
                    width={96}
                    height={96}
                    className="rounded-full"
                  />
                </div>
                <div className="rounded-full p-1 bg-yellow-400">
                  <Image
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-compassionate-psychol_FZgjDzHhSayBd1WXqfn0Yg_JQHL4O8cQJusiVDlrhz11A_xcwa5j.png"
                    alt="Mindset Coach portrait 2"
                    width={96}
                    height={96}
                    className="rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-black text-lg sm:text-xl font-bold mb-2 sm:mb-3">Are you struggling with...</h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-8 mb-2" // Fixed height to prevent layout shift
                >
                  <p className="text-[#5b06be] font-semibold">{challenges[currentIndex]}</p>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center mt-4">
                <Button
                  className="bg-black hover:bg-black/90 text-white font-medium rounded-full px-8 py-3 text-lg transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(91,6,190,0.5)] hover:shadow-[0_0_30px_rgba(91,6,190,0.7)]"
                  onClick={() => (window.location.href = "/mindset-coach")}
                >
                  Find Solutions <span className="text-xl">→</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Progress and Stats */}
        <div className="lg:col-span-2 flex justify-center">
          <Card className="bg-white shadow-md w-full rounded-xl border border-gray-200">
            <CardContent className="p-2 sm:p-4 h-[500px] sm:h-[600px] flex flex-col">
              {/* Progress Indicators */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-2">
                <Button
                  className={cn(
                    "bg-white text-black rounded-full w-full text-xs sm:text-sm py-3 sm:py-4 shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2",
                    activeTab === "calendar" && "bg-gray-50",
                  )}
                  onClick={() => setActiveTab("calendar")}
                >
                  <Image
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1733943686/Calendar_Streak_icon_duha_kwl5pf.png"
                    alt="Calendar Streak icon"
                    width={16}
                    height={16}
                    className="text-[#5b06be]"
                  />
                  <span>Calendar & Challenge</span>
                </Button>
                <Button
                  className={cn(
                    "bg-white text-black rounded-full w-full text-xs sm:text-sm py-3 sm:py-4 shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2",
                    activeTab === "activity" && "bg-gray-50",
                  )}
                  onClick={() => setActiveTab("activity")}
                >
                  <Image
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1733749804/Target_icon_ghep9p.png"
                    alt="Target icon"
                    width={16}
                    height={16}
                    className="text-[#5b06be]"
                  />
                  <span>Activity</span>
                </Button>
              </div>

              {/* Content Area */}
              <div className="flex-grow overflow-auto">
                {activeTab === "calendar" && (
                  <CalendarStreak
                    allDailyTasksCompleted={allTasksCompleted}
                    completedQuestIds={completedQuestIds}
                    onQuestCompletion={handleQuestCompletion}
                    currentDay={currentDay}
                  />
                )}
                {activeTab === "activity" && <ActivityCircles />}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default GamePlanDashboard
