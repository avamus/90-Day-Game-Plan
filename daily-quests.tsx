"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { TaskCard } from "./TaskCard"
import Image from "next/image"

export function DailyQuests() {
  const [tasks, setTasks] = useState([
    {
      id: "1",
      task: "Make 50 cold calls",
      isCompleted: false,
      isStartButton: true,
    },
    {
      id: "2",
      task: "Follow up with 20 leads",
      isCompleted: false,
      isStartButton: false,
    },
    {
      id: "3",
      task: "Schedule 5 meetings",
      isCompleted: false,
      isStartButton: false,
    },
  ])

  const handleCompletion = (index: number, completed: boolean) => {
    setTasks(tasks.map((task, i) => 
      i === index ? { ...task, isCompleted: completed } : task
    ))
  }

  return (
    <Card className="bg-white rounded-[32px] border-2 border-[#fbb350] shadow-[0_4px_20px_rgba(251,179,80,0.3)]">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center">
            <Image 
              src="https://res.cloudinary.com/drkudvyog/image/upload/v1737454406/Daily_quests_icon_duha_hh7svb.png"
              alt="Daily Quests"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <h2 className="text-[#5b06be] text-2xl font-bold">Daily Quests</h2>
        </div>
        <p className="text-gray-600 text-lg">Complete all to complete today's challenge</p>
      </div>
      <div className="px-8 pb-8 space-y-4">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            index={index}
            task={task.task}
            isCompleted={task.isCompleted}
            onCompletion={handleCompletion}
            isStartButton={task.isStartButton}
          />
        ))}
      </div>
    </Card>
  )
}
