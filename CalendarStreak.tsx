"use client"

import { useState, useCallback, useEffect } from "react"
import { ChevronLeft, ChevronRight, Info, CheckSquare, Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { type Quest, dailyQuests, generateDailyQuests } from '@/types/quests'

interface CalendarStreakProps {
  onClose?: () => void
  allDailyTasksCompleted: boolean
  completedQuestIds: string[]
  onQuestCompletion: (questId: string, completed: boolean) => void
  currentDayProp?: number  // Přejmenováno z currentDay
}

interface Event {
  title: string
  description: string
  time: string
  type: "quest" | "meeting" | "session"
}

interface DayEvents {
  [key: number]: {
    quests: Quest[]
    events: Event[]
  }
}

export function CalendarStreak({
  onClose,
  allDailyTasksCompleted,
  completedQuestIds,
  onQuestCompletion,
  currentDayProp = 26,
}: CalendarStreakProps) {
  const today = new Date() // Aktuální datum uživatele v jeho časovém pásmu
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const streakDays = [6, 7, 8]
  const currentDay = today.getDate() // Aktuální den v měsíci podle časového pásma uživatele

// Nastavení aktuálního roku a měsíce pro zobrazení
useEffect(() => {
  // Při inicializaci a změnách měsíce zachováme aktuální rok a měsíc
  const now = new Date()
  setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1))
}, [])

  // Výpočet dnů v měsíci
const daysInMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  0
).getDate()

const firstDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
).getDay()

// Generování dnů pro kalendář
const generateCalendarDays = () => {
  const days = []
  
  // Předchozí měsíc
  const prevMonthDays = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ).getDate()
  
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      isCurrentMonth: false
    })
  }
  
  // Aktuální měsíc
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true
    })
  }
  
  // Následující měsíc
  const remainingDays = 42 - days.length // Změna z 35 na 42 pro 6 řádků
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false
    })
  }
  
  return days
}

  const allDays = generateCalendarDays()

  // Calendar events
  const events: DayEvents = {
    ...Object.fromEntries(
      Array.from({ length: daysInMonth }, (_, i) => [
        i + 1,
        {
          quests: generateDailyQuests(i + 1),
          events: [],
        },
      ])
    ),
    15: {
      quests: generateDailyQuests(15),
      events: [
        {
          title: "Mindset Coach Session",
          description: "One-on-one coaching session",
          time: "2:00 PM",
          type: "session",
        },
      ],
    },
    26: {
      quests: dailyQuests,
      events: [
        {
          title: "Mindset Coach Session",
          description: "One-on-one coaching session",
          time: "10:00 AM",
          type: "session",
        },
      ],
    },
  }

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1))
  }, [])

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1))
  }, [])

  const handleDayClick = (day: number) => {
    setSelectedDay(day)
    if (events[day]) {
      setIsDialogOpen(true)
    }
  }

  const handleQuestCompletion = (questId: string) => {
    if (selectedDay === currentDay) {
      onQuestCompletion(questId, !completedQuestIds.includes(questId))
    }
  }

  const getDayStatus = useCallback(
    (day: number) => {
      if (day < currentDay - 5) return "far-past"
      if (day < currentDay) return "recent-past"
      if (day === currentDay) return "present"
      return "future"
    },
    [currentDay]
  )

  // Nový kód
const renderCalendarDay = (day: number, isCurrentMonth: boolean, index: number) => {
  // Zjistit, zda je tento den aktuální den v aktuálním měsíci
  const isToday = isCurrentMonth && day === currentDay && 
                 currentDate.getMonth() === today.getMonth() &&
                 currentDate.getFullYear() === today.getFullYear();
  
  return (
    <div className="flex items-center justify-center">
      <button
        key={`${day}-${index}`}
        onClick={() => handleDayClick(day)}
        className={cn(
          "h-6 w-6 xs:h-7 xs:w-7 sm:h-9 sm:w-9 md:h-11 md:w-11 flex flex-col items-center justify-center gap-0.5 relative",
          !isCurrentMonth && "text-gray-300",
          isCurrentMonth && !streakDays.includes(day) && !isToday && "text-gray-900",
          isCurrentMonth && streakDays.includes(day) && "bg-[#4ade80] text-white rounded-lg", 
          isToday && "ring-2 ring-[#5b06be] bg-[#4ade80] text-white rounded-lg", // Explicitně bílý text pro dnešek
          isCurrentMonth && events[day]?.events.length > 0 && "bg-[#fbb350] text-white rounded-lg"
        )}
      >
        <span className="text-xs sm:text-sm font-medium">{day}</span>
        {(events[day]?.events.length > 0 || events[day]?.quests.length > 0) && (
          <div className="bg-white rounded-full inline-flex items-center h-3 px-1">
            {events[day]?.quests.length > 0 && (
              <CheckSquare className="w-2 h-2 text-[#fbb350] stroke-[2.5]" />
            )}
            {events[day]?.events.length > 0 && (
              <Info className="w-2 h-2 text-[#5b06be] stroke-[2.5] ml-0.5" />
            )}
          </div>
        )}
      </button>
    </div>
  );
};

  return (
    <div className="w-full flex-1 bg-white rounded-2xl border border-[#ddd] overflow-hidden flex flex-col">
      <div className="px-2 sm:px-4 pt-2 sm:pt-4 pb-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <button 
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors" 
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
          </button>
          <h3 className="text-[19px] font-black">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </h3>
          <button 
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors" 
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
    <div key={day} className="flex items-center justify-center text-[10px] xs:text-xs text-gray-500">
      {day}
    </div>
  ))}
</div>
            
<div className="grid grid-cols-7 gap-1 sm:gap-2">
  {allDays.map((dayInfo, index) => 
    renderCalendarDay(dayInfo.day, dayInfo.isCurrentMonth, index)
  )}
</div>
        </div>
      </div>

      {/* Day details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[350px] md:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[19px] font-black text-[#5b06be]">
              Events for {currentDate.toLocaleString("default", { month: "long" })} {selectedDay}
            </DialogTitle>
          </DialogHeader>

          {selectedDay && events[selectedDay]?.events.map((event, index) => (
            <div
              key={index}
              className="bg-[#fbb350] p-3 rounded-xl text-white mb-3"
            >
              <div className="flex justify-between items-start mb-1.5">
                <h3 className="text-[15px] font-semibold pr-3">
                  {event.title}
                </h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-[#5b06be] rounded-full">
                  {event.time}
                </span>
              </div>
              <p className="text-white/90 text-xs sm:text-sm">{event.description}</p>
            </div>
          ))}

          {selectedDay && events[selectedDay]?.quests.length > 0 && (
            <>
              <Separator className="my-3" />
              <div className="space-y-3">
                <h3 className="text-[15px] font-semibold text-[#5b06be] flex items-center">
                  Daily Quests
                </h3>
                {events[selectedDay].quests.map((quest) => {
                  const dayStatus = getDayStatus(selectedDay)
                  const isCompleted = completedQuestIds.includes(quest.id)
                  const isDisabled = dayStatus !== "present"

                  return (
                    <div
                      key={quest.id}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-xl",
                        isDisabled && "opacity-50"
                      )}
                    >
                      <div className="flex-1">
                        <h4 className={cn(
                          "font-semibold text-[15px]",
                          isCompleted && "text-gray-400 line-through",
                          !isCompleted && (dayStatus === "recent-past" || dayStatus === "far-past") 
                            ? "text-gray-400" 
                            : "text-[#5b06be]"
                        )}>
                          {quest.title}
                        </h4>
                        <p className={cn(
                          "text-xs",
                          isCompleted || dayStatus === "recent-past" || dayStatus === "far-past"
                            ? "text-gray-400"
                            : "text-gray-600"
                        )}>
                          {quest.description}
                        </p>
                      </div>
                      {dayStatus === "present" ? (
                        <button
                          onClick={() => handleQuestCompletion(quest.id)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium text-white transition-all",
                            isCompleted
                              ? "bg-gray-300 hover:bg-gray-400"
                              : "bg-[#f8b922] hover:bg-[#e5a91f] shadow-[0_0_10px_rgba(248,185,34,0.3)] hover:shadow-[0_0_15px_rgba(248,185,34,0.5)]"
                          )}
                        >
                          {isCompleted ? "Completed" : "Complete"}
                        </button>
                      ) : (
                        isCompleted ? (
                          <Check className="text-[#5b06be] w-4 h-4" />
                        ) : (
                          dayStatus === "recent-past" || dayStatus === "far-past" ? (
                            <span className="text-gray-400 text-xs">Missed</span>
                          ) : (
                            <Lock className="text-gray-400 w-3 h-3" />
                          )
                        )
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
