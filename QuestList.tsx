"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { TaskCard } from "./TaskCard"
import { dailyQuests } from "@/types/quests"

export function QuestList() {
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([])

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

  return (
    <div className="flex-1 relative bg-gradient-to-r from-[#fbb350]/5 to-[#fbb350]/5 p-0.5 rounded-xl border-2 border-[#fbb350]">
  <Card className="h-full bg-white rounded-xl">
    <CardContent className="p-2 h-full">
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
  )
}
