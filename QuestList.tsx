"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { TaskCard } from "./TaskCard"
import { useSearchParams } from "next/navigation"

interface Quest {
  task_1: string;
  task_2: string;
  task_3: string;
  task_1_completed: boolean;
  task_2_completed: boolean;
  task_3_completed: boolean;
  date: string;
}

interface QuestListProps {
  selectedDate?: string;
  onTasksCompletionChange?: (date: string, allCompleted: boolean) => void;
}

export function QuestList({ selectedDate, onTasksCompletionChange }: QuestListProps) {
  const [quests, setQuests] = useState<Quest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]  // Always use today's date
  )
  
  // Add a ref to track previous completion state to prevent loops
  const allTasksCompletedRef = useRef<boolean | null>(null)
  
  const searchParams = useSearchParams()
  const memberId = searchParams.get('memberId') || localStorage.getItem('memberId') || 'anonymous'
  const teamId = searchParams.get('teamId') || localStorage.getItem('teamId') || 'default'

  // Important: We ignore selectedDate prop and always show today's tasks
  // This ensures we only display and allow completion of today's tasks

  // Save IDs to localStorage for persistence
  useEffect(() => {
    if (memberId !== 'anonymous') localStorage.setItem('memberId', memberId)
    if (teamId !== 'default') localStorage.setItem('teamId', teamId)
  }, [memberId, teamId])

  // Check if all tasks are completed and notify parent component
  useEffect(() => {
    if (quests && onTasksCompletionChange) {
      const allCompleted = quests.task_1_completed && quests.task_2_completed && quests.task_3_completed;
      
      // Only notify parent if the completion status has actually changed
      if (allTasksCompletedRef.current !== allCompleted) {
        allTasksCompletedRef.current = allCompleted;
        onTasksCompletionChange(currentDate, allCompleted);
      }
    }
  }, [quests, currentDate, onTasksCompletionChange]);

  // Function to fetch quests
  const fetchQuests = async () => {
    try {
      setLoading(true)
      // Always fetch today's quests
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/daily-tasks?memberId=${memberId}&date=${today}`)
      
      if (response.status === 404) {
        setQuests(null)
        setError('No quests found for today. Please check back later.')
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch quests')
      }
      
      const data = await response.json()
      setQuests(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching quests:', err)
      setError('Failed to load daily quests')
    } finally {
      setLoading(false)
    }
  }

  // Fetch quests from API
  useEffect(() => {
    fetchQuests();
    
    // Set up polling to periodically refresh tasks
    const intervalId = setInterval(fetchQuests, 30000); // every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [memberId]);

  // Update quest completion status
  const handleQuestCompletion = async (questId: number, completed: boolean) => {
    try {
      // Optimistically update UI
      setQuests(prev => {
        if (!prev) return prev
        
        const updated = { ...prev }
        const key = `task_${questId + 1}_completed` as keyof Quest
        updated[key] = completed
        
        return updated
      })
      
      // Send update to API
      const response = await fetch('/api/daily-tasks/completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          memberId, 
          teamId, 
          taskId: questId + 1, 
          completed,
          date: currentDate
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update quest status')
      }
    } catch (err) {
      console.error('Error updating quest status:', err)
      // Revert optimistic update on error
      setError('Failed to update quest status. Please try again.')
      // Refresh quests to get current state
      fetchQuests()
    }
  }

  if (loading) {
    return (
      <div className="flex-1 relative bg-gradient-to-r from-[#fbb350]/5 to-[#fbb350]/5 p-0.5 rounded-xl border-2 border-[#fbb350]">
        <Card className="h-full bg-white rounded-xl">
          <CardContent className="p-6 flex items-center justify-center h-full">
            <p>Loading quests...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !quests) {
    return (
      <div className="flex-1 relative bg-gradient-to-r from-[#fbb350]/5 to-[#fbb350]/5 p-0.5 rounded-xl border-2 border-[#fbb350]">
        <Card className="h-full bg-white rounded-xl">
          <CardContent className="p-6 flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quests) {
    return (
      <div className="flex-1 relative bg-gradient-to-r from-[#fbb350]/5 to-[#fbb350]/5 p-0.5 rounded-xl border-2 border-[#fbb350]">
        <Card className="h-full bg-white rounded-xl">
          <CardContent className="p-6 flex items-center justify-center h-full">
            <p>No quests available for today.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Format quests for today
  const today = new Date();
  const todayDay = today.getDate();
  
  const questArray = [
    { id: "task-1", title: `Day ${todayDay} Quest 1`, description: quests.task_1, completed: quests.task_1_completed },
    { id: "task-2", title: `Day ${todayDay} Quest 2`, description: quests.task_2, completed: quests.task_2_completed },
    { id: "task-3", title: `Day ${todayDay} Quest 3`, description: quests.task_3, completed: quests.task_3_completed }
  ]

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
            {questArray.map((quest, index) => (
              <TaskCard
                key={quest.id}
                index={index}
                task={quest.title}
                isCompleted={quest.completed}
                onCompletion={(index, completed) => handleQuestCompletion(index, completed)}
                isStartButton={index === 0 && !quest.completed}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
